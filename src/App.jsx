import { useEffect, useState } from 'react'
import {
  cloneCategories,
  cloneIssues,
  cloneVerifications,
  DEMO_ACCOUNTS,
  INITIAL_ISSUES,
} from './data/adminPrototypeData.js'
import { AdminShell } from './components/AdminShell.jsx'
import { CategoryModal, ResolveDisputeModal, Toast } from './components/Modals.jsx'
import { LoginScreen } from './components/LoginScreen.jsx'
import {
  clearWorkspaceSnapshot,
  loadWorkspaceSnapshot,
  saveWorkspaceSnapshot,
} from './lib/workspaceStorage.js'
import './App.css'

const DASHBOARD_TABS = new Set(['verification', 'reports', 'analytics', 'categories'])
const ISSUE_IDS = new Set(INITIAL_ISSUES.map((issue) => issue.id))
const REPORT_STATUS_FILTERS = new Set(['all', 'pending', 'reviewing', 'resolved'])
const CATEGORY_SORT_OPTIONS = new Set(['jobs-desc', 'jobs-asc', 'name-asc'])
const DEFAULT_REPORT_STATUS_FILTER = 'all'
const DEFAULT_CATEGORY_SORT = 'jobs-desc'

function readUrlViewState() {
  if (typeof window === 'undefined') {
    return {}
  }

  const url = new URL(window.location.href)
  const hash = url.hash.replace('#', '')
  const reportStatusFilter = url.searchParams.get('reportStatus')
  const categorySortBy = url.searchParams.get('categorySort')

  return {
    activeTab: DASHBOARD_TABS.has(hash) ? hash : null,
    issueId: url.searchParams.get('issue'),
    reportQuery: url.searchParams.has('reportQuery')
      ? url.searchParams.get('reportQuery') ?? ''
      : null,
    reportStatusFilter: REPORT_STATUS_FILTERS.has(reportStatusFilter)
      ? reportStatusFilter
      : null,
    categoryQuery: url.searchParams.has('categoryQuery')
      ? url.searchParams.get('categoryQuery') ?? ''
      : null,
    categorySortBy: CATEGORY_SORT_OPTIONS.has(categorySortBy) ? categorySortBy : null,
  }
}

function getInitialDashboardTab(snapshot, urlState) {
  if (urlState?.activeTab) return urlState.activeTab
  if (snapshot?.activeTab && DASHBOARD_TABS.has(snapshot.activeTab)) {
    return snapshot.activeTab
  }

  return 'verification'
}

function getInitialIssueId(snapshot, activeTab, urlState) {
  if (activeTab === 'reports' && urlState?.issueId && ISSUE_IDS.has(urlState.issueId)) {
    return urlState.issueId
  }

  if (snapshot?.selectedIssueId && ISSUE_IDS.has(snapshot.selectedIssueId)) {
    return snapshot.selectedIssueId
  }

  return INITIAL_ISSUES[0].id
}

function getInitialReportFilters(snapshot, activeTab, urlState) {
  const reportQuery =
    activeTab === 'reports' && urlState && urlState.reportQuery !== null
      ? urlState.reportQuery
      : snapshot?.reportQuery ?? ''

  const reportStatusFilter =
    activeTab === 'reports' && urlState?.reportStatusFilter
      ? urlState.reportStatusFilter
      : REPORT_STATUS_FILTERS.has(snapshot?.reportStatusFilter)
        ? snapshot.reportStatusFilter
        : DEFAULT_REPORT_STATUS_FILTER

  return { query: reportQuery, statusFilter: reportStatusFilter }
}

function getInitialCategoryFilters(snapshot, activeTab, urlState) {
  const query =
    activeTab === 'categories' && urlState && urlState.categoryQuery !== null
      ? urlState.categoryQuery
      : snapshot?.categoryQuery ?? ''

  const sortBy =
    activeTab === 'categories' && urlState?.categorySortBy
      ? urlState.categorySortBy
      : CATEGORY_SORT_OPTIONS.has(snapshot?.categorySortBy)
        ? snapshot.categorySortBy
        : DEFAULT_CATEGORY_SORT

  return { query, sortBy }
}

function cloneWorkspaceValue(value) {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }

  return JSON.parse(JSON.stringify(value))
}

function App() {
  const [persistedWorkspace] = useState(() => loadWorkspaceSnapshot())
  const [initialUrlState] = useState(() => readUrlViewState())
  const initialActiveTab = getInitialDashboardTab(persistedWorkspace, initialUrlState)
  const initialReportFilters = getInitialReportFilters(
    persistedWorkspace,
    initialActiveTab,
    initialUrlState,
  )
  const initialCategoryFilters = getInitialCategoryFilters(
    persistedWorkspace,
    initialActiveTab,
    initialUrlState,
  )
  const [screen, setScreen] = useState(() => persistedWorkspace?.screen ?? 'login')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState(() => initialActiveTab)
  const [verifications, setVerifications] = useState(() =>
    persistedWorkspace?.verifications ?? cloneVerifications(),
  )
  const [issues, setIssues] = useState(() =>
    persistedWorkspace?.issues ?? cloneIssues(),
  )
  const [categories, setCategories] = useState(() =>
    persistedWorkspace?.categories ?? cloneCategories(),
  )
  const [selectedIssueId, setSelectedIssueId] = useState(() =>
    getInitialIssueId(persistedWorkspace, initialActiveTab, initialUrlState),
  )
  const [reportQuery, setReportQuery] = useState(() => initialReportFilters.query)
  const [reportStatusFilter, setReportStatusFilter] = useState(
    () => initialReportFilters.statusFilter,
  )
  const [categoryQuery, setCategoryQuery] = useState(() => initialCategoryFilters.query)
  const [categorySortBy, setCategorySortBy] = useState(
    () => initialCategoryFilters.sortBy,
  )
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [user, setUser] = useState(
    () => persistedWorkspace?.user ?? { displayName: 'Admin', email: '' },
  )

  const selectedIssue =
    issues.find((issue) => issue.id === selectedIssueId) ?? issues[0]
  const reportCount = issues.filter((issue) => issue.status !== 'resolved').length

  useEffect(() => {
    if (!toast) return undefined

    const timeout = window.setTimeout(() => {
      setToast(null)
    }, 2600)

    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    if (!modal && !profileMenuOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModal(null)
        setProfileMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal, profileMenuOpen])

  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [modal])

  useEffect(() => {
    if (screen === 'admin') {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.hash = activeTab

        if (activeTab === 'reports') {
          url.searchParams.set('issue', selectedIssueId)
          url.searchParams.set('reportQuery', reportQuery)
          url.searchParams.set('reportStatus', reportStatusFilter)
        } else {
          url.searchParams.delete('issue')
          url.searchParams.delete('reportQuery')
          url.searchParams.delete('reportStatus')
        }

        if (activeTab === 'categories') {
          url.searchParams.set('categoryQuery', categoryQuery)
          url.searchParams.set('categorySort', categorySortBy)
        } else {
          url.searchParams.delete('categoryQuery')
          url.searchParams.delete('categorySort')
        }

        const nextUrl = `${url.pathname}${url.search}${url.hash}`
        if (window.location.href !== `${window.location.origin}${nextUrl}`) {
          window.history.replaceState(null, '', nextUrl)
        }
      }

      saveWorkspaceSnapshot({
        screen,
        activeTab,
        verifications,
        issues,
        categories,
        selectedIssueId,
        reportQuery,
        reportStatusFilter,
        categoryQuery,
        categorySortBy,
        user,
      })
      return
    }

    clearWorkspaceSnapshot()
  }, [
    screen,
    activeTab,
    verifications,
    issues,
    categories,
    selectedIssueId,
    reportQuery,
    reportStatusFilter,
    categoryQuery,
    categorySortBy,
    user,
  ])

  function notify(title, message = '', options = {}) {
    setToast({ title, message, ...options })
  }

  function captureWorkspaceState() {
    return cloneWorkspaceValue({
      verifications,
      issues,
      categories,
      selectedIssueId,
      reportQuery,
      reportStatusFilter,
      categoryQuery,
      categorySortBy,
    })
  }

  function restoreWorkspaceState(snapshot) {
    setVerifications(snapshot.verifications)
    setIssues(snapshot.issues)
    setCategories(snapshot.categories)
    setSelectedIssueId(snapshot.selectedIssueId)
    setReportQuery(snapshot.reportQuery ?? '')
    setReportStatusFilter(
      REPORT_STATUS_FILTERS.has(snapshot.reportStatusFilter)
        ? snapshot.reportStatusFilter
        : DEFAULT_REPORT_STATUS_FILTER,
    )
    setCategoryQuery(snapshot.categoryQuery ?? '')
    setCategorySortBy(
      CATEGORY_SORT_OPTIONS.has(snapshot.categorySortBy)
        ? snapshot.categorySortBy
        : DEFAULT_CATEGORY_SORT,
    )
  }

  function notifyWithUndo(snapshot, title, message, undoTitle, undoMessage) {
    notify(title, message, {
      actionLabel: 'Undo',
      onAction: () => {
        restoreWorkspaceState(snapshot)
        notify(undoTitle, undoMessage)
      },
    })
  }

  function resetWorkspace(nextTab = 'verification', nextIssueId = INITIAL_ISSUES[0].id) {
    setVerifications(cloneVerifications())
    setIssues(cloneIssues())
    setCategories(cloneCategories())
    setReportQuery('')
    setReportStatusFilter(DEFAULT_REPORT_STATUS_FILTER)
    setCategoryQuery('')
    setCategorySortBy(DEFAULT_CATEGORY_SORT)
    setActiveTab(nextTab)
    setSelectedIssueId(nextIssueId)
  }

  function handleLogin(credentials) {
    const email = credentials.email.trim().toLowerCase()
    const password = credentials.password.trim()
    const match = DEMO_ACCOUNTS.find(
      (account) => account.email === email && account.password === password,
    )

    if (!match) {
      setAuthError('Use one of the demo accounts from the example box.')
      notify('Sign-in failed', 'The demo credentials did not match.')
      return
    }

    setAuthError('')
    setUser({ displayName: 'Admin', email: match.email })
    setScreen('admin')
    setProfileMenuOpen(false)
    notify('Welcome back', 'The admin workspace is ready.')
  }

  function handleLogout() {
    setScreen('login')
    setProfileMenuOpen(false)
    setModal(null)
    setToast(null)
    setUser({ displayName: 'Admin', email: '' })
    setAuthError('')
    resetWorkspace('verification')
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.hash = ''
      url.searchParams.delete('issue')
      url.searchParams.delete('reportQuery')
      url.searchParams.delete('reportStatus')
      url.searchParams.delete('categoryQuery')
      url.searchParams.delete('categorySort')
      window.history.replaceState(null, '', `${url.pathname}${url.search}`)
    }
    clearWorkspaceSnapshot()
  }

  function handleVerificationAction(id, nextStatus) {
    const snapshot = captureWorkspaceState()

    setVerifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    )

    notifyWithUndo(
      snapshot,
      nextStatus === 'approved' ? 'User approved' : 'User rejected',
      'The verification card was updated.',
      'Verification restored',
      'The previous verification state was restored.',
    )
  }

  function handleResolveIssue(notes) {
    const issueId = modal?.issueId ?? selectedIssue.id
    const resolution = notes.trim() || 'Case resolved and closed.'
    const snapshot = captureWorkspaceState()

    setIssues((items) =>
      items.map((item) =>
        item.id === issueId
          ? { ...item, status: 'resolved', resolutionNote: resolution }
          : item,
      ),
    )
    setModal(null)
    notifyWithUndo(
      snapshot,
      'Dispute resolved',
      'The selected case has been closed.',
      'Dispute restored',
      'The previous dispute state was restored.',
    )
  }

  function handleCategorySave(categoryPayload) {
    if (!modal || modal.type !== 'category') return

    const safeName = categoryPayload.name.trim()
    const snapshot = captureWorkspaceState()

    if (!safeName) {
      notify('Category needs a name', 'Please enter a category title.')
      return
    }

    if (modal.mode === 'edit' && modal.category) {
      setCategories((items) =>
        items.map((item) =>
          item.id === modal.category.id
            ? { ...item, name: safeName, jobs: categoryPayload.jobs }
            : item,
        ),
      )
      notifyWithUndo(
        snapshot,
        'Category updated',
        `${safeName} has been saved.`,
        'Category restored',
        'The previous category state was restored.',
      )
    } else {
      const id = safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      setCategories((items) => [
        { id: `${id}-${Date.now()}`, name: safeName, jobs: categoryPayload.jobs },
        ...items,
      ])
      notifyWithUndo(
        snapshot,
        'Category created',
        `${safeName} was added to the list.`,
        'Category restored',
        'The previous category list was restored.',
      )
    }

    setModal(null)
  }

  function handleGlobalAction(title, message) {
    notify(title, message)
    setProfileMenuOpen(false)
  }

  function openCategoryModal(mode, category = null) {
    setModal({ type: 'category', mode, category })
    setProfileMenuOpen(false)
  }

  function openResolveModal() {
    setModal({ type: 'resolve', issueId: selectedIssue.id })
    setProfileMenuOpen(false)
  }

  function handleSignUp() {
    notify('Sign up preview', 'Registration is not part of this prototype.')
  }

  async function handleCopyViewLink() {
    if (typeof window === 'undefined') return

    try {
      await window.navigator.clipboard.writeText(window.location.href)
      notify('Link copied', 'Current dashboard view copied to clipboard.')
    } catch {
      window.prompt('Copy this dashboard link', window.location.href)
      notify('Link ready', 'Clipboard access was unavailable.')
    }
  }

  return (
    <>
      {screen === 'login' ? (
        <LoginScreen
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          error={authError}
        />
      ) : (
        <AdminShell
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedIssue={selectedIssue}
          issues={issues}
          reportCount={reportCount}
          verifications={verifications}
          categories={categories}
          selectedIssueId={selectedIssueId}
          onSelectIssue={setSelectedIssueId}
          reportQuery={reportQuery}
          onReportQueryChange={setReportQuery}
          reportStatusFilter={reportStatusFilter}
          onReportStatusFilterChange={setReportStatusFilter}
          categoryQuery={categoryQuery}
          onCategoryQueryChange={setCategoryQuery}
          categorySortBy={categorySortBy}
          onCategorySortByChange={setCategorySortBy}
          onVerificationAction={handleVerificationAction}
          onResolveIssue={openResolveModal}
          onCategoryAdd={() => openCategoryModal('add')}
          onCategoryEdit={(category) => openCategoryModal('edit', category)}
          onCategoryView={(category) =>
            handleGlobalAction(
              'Category preview',
              `${category.name} has ${category.jobs} jobs in the prototype.`,
            )
          }
          onEvidenceView={(fileName) =>
            handleGlobalAction('Attachment preview', `${fileName} opened in preview mode.`)
          }
          onIssueContact={() =>
            handleGlobalAction(
              'Contact workflow',
              'Party contact details are available in the full product.',
            )
          }
          onIssueDetails={() =>
            handleGlobalAction(
              'Job details',
              'Job detail preview opened from the dispute panel.',
            )
          }
          onNavAction={(label) =>
            handleGlobalAction(
              label,
              'This top navigation item is a prototype action.',
            )
          }
          onFooterAction={(label) =>
            handleGlobalAction(label, 'Footer links are interactive placeholders.')
          }
          onFooterSocial={(label) =>
            handleGlobalAction(label, 'External social link placeholder.')
          }
          onShareLink={handleCopyViewLink}
          profileMenuOpen={profileMenuOpen}
          setProfileMenuOpen={setProfileMenuOpen}
          onResetDemo={() => {
            const snapshot = captureWorkspaceState()
            resetWorkspace(
              activeTab,
              activeTab === 'reports' ? selectedIssueId : INITIAL_ISSUES[0].id,
            )
            setModal(null)
            setProfileMenuOpen(false)
            notifyWithUndo(
              snapshot,
              'Demo reset',
              'All lists were restored to their starting state.',
              'Demo restored',
              'The previous workspace state was restored.',
            )
          }}
          onLogout={handleLogout}
        />
      )}

      {modal?.type === 'resolve' ? (
        <ResolveDisputeModal
          issue={selectedIssue}
          onClose={() => setModal(null)}
          onResolve={handleResolveIssue}
        />
      ) : null}

      {modal?.type === 'category' ? (
        <CategoryModal
          mode={modal.mode}
          category={modal.category}
          onClose={() => setModal(null)}
          onSave={handleCategorySave}
        />
      ) : null}

      {toast ? <Toast toast={toast} onDismiss={() => setToast(null)} /> : null}
    </>
  )
}

export default App

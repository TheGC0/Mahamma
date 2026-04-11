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

function getInitialDashboardTab(snapshot) {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    if (DASHBOARD_TABS.has(hash)) {
      return hash
    }
  }

  if (snapshot?.activeTab && DASHBOARD_TABS.has(snapshot.activeTab)) {
    return snapshot.activeTab
  }

  return 'verification'
}

function App() {
  const [persistedWorkspace] = useState(() => loadWorkspaceSnapshot())
  const [screen, setScreen] = useState(() => persistedWorkspace?.screen ?? 'login')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState(() =>
    getInitialDashboardTab(persistedWorkspace),
  )
  const [verifications, setVerifications] = useState(() =>
    persistedWorkspace?.verifications ?? cloneVerifications(),
  )
  const [issues, setIssues] = useState(() =>
    persistedWorkspace?.issues ?? cloneIssues(),
  )
  const [categories, setCategories] = useState(() =>
    persistedWorkspace?.categories ?? cloneCategories(),
  )
  const [selectedIssueId, setSelectedIssueId] = useState(
    () => persistedWorkspace?.selectedIssueId ?? INITIAL_ISSUES[0].id,
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
        const nextUrl = `${window.location.pathname}${window.location.search}#${activeTab}`
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
        user,
      })
      return
    }

    clearWorkspaceSnapshot()
  }, [screen, activeTab, verifications, issues, categories, selectedIssueId, user])

  function notify(title, message = '') {
    setToast({ title, message })
  }

  function resetWorkspace(nextTab = 'verification') {
    setVerifications(cloneVerifications())
    setIssues(cloneIssues())
    setCategories(cloneCategories())
    setActiveTab(nextTab)
    setSelectedIssueId(INITIAL_ISSUES[0].id)
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
    resetWorkspace(activeTab)
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
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    clearWorkspaceSnapshot()
  }

  function handleVerificationAction(id, nextStatus) {
    setVerifications((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    )

    notify(
      nextStatus === 'approved' ? 'User approved' : 'User rejected',
      'The verification card was updated.',
    )
  }

  function handleResolveIssue(notes) {
    const issueId = modal?.issueId ?? selectedIssue.id
    const resolution = notes.trim() || 'Case resolved and closed.'

    setIssues((items) =>
      items.map((item) =>
        item.id === issueId
          ? { ...item, status: 'resolved', resolutionNote: resolution }
          : item,
      ),
    )
    setModal(null)
    notify('Dispute resolved', 'The selected case has been closed.')
  }

  function handleCategorySave(categoryPayload) {
    if (!modal || modal.type !== 'category') return

    const safeName = categoryPayload.name.trim()

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
      notify('Category updated', `${safeName} has been saved.`)
    } else {
      const id = safeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      setCategories((items) => [
        { id: `${id}-${Date.now()}`, name: safeName, jobs: categoryPayload.jobs },
        ...items,
      ])
      notify('Category created', `${safeName} was added to the list.`)
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
            resetWorkspace(activeTab)
            setModal(null)
            setProfileMenuOpen(false)
            notify('Demo reset', 'All lists were restored to their starting state.')
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

      {toast ? <Toast toast={toast} /> : null}
    </>
  )
}

export default App

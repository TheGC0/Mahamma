import { useRef } from 'react'
import {
  Bell,
  ChevronDown,
  LogOut,
  MessageSquare,
  Link2,
  User,
} from 'lucide-react'
import { NAV_LINKS, SUMMARY_METRICS, TAB_ITEMS } from '../data/adminPrototypeData.js'
import {
  AnalyticsPanel,
  CategoriesPanel,
  Footer,
  MetricCard,
  ReportsPanel,
  TabButton,
  VerificationPanel,
} from './DashboardSections.jsx'
import { BrandMark } from './BrandMark.jsx'

export function AdminShell({
  user,
  activeTab,
  setActiveTab,
  selectedIssue,
  issues,
  reportCount,
  verifications,
  categories,
  selectedIssueId,
  onSelectIssue,
  onVerificationAction,
  onResolveIssue,
  onCategoryAdd,
  onCategoryEdit,
  onCategoryView,
  onEvidenceView,
  onIssueContact,
  onIssueDetails,
  onNavAction,
  onFooterAction,
  onFooterSocial,
  onShareLink,
  profileMenuOpen,
  setProfileMenuOpen,
  onResetDemo,
  onLogout,
}) {
  const tablistRef = useRef(null)

  function selectTab(tabId) {
    setActiveTab(tabId)
    setProfileMenuOpen(false)
  }

  function handleTabKeyDown(event, tabId) {
    const tabButtons = Array.from(tablistRef.current?.querySelectorAll('[role="tab"]') ?? [])
    if (!tabButtons.length) return

    const currentIndex = tabButtons.findIndex((button) => button.dataset.tabId === tabId)
    if (currentIndex === -1) return

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % tabButtons.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabButtons.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextTab = tabButtons[nextIndex]
    nextTab?.focus()
    nextTab?.click()
  }

  return (
    <div className="admin-viewport">
      <div className="admin-canvas">
        <header className="topbar">
          <button
            type="button"
            className="brand-link"
            onClick={() =>
              onNavAction('Mahamma', 'Brand navigation is disabled in this prototype.')
            }
          >
            <BrandMark small />
            <span className="brand-copy">
              <span className="brand-name">Mahamma</span>
              <span className="brand-caption">KFUPM freelancer platform</span>
            </span>
          </button>

          <nav className="topnav" aria-label="Primary">
            {NAV_LINKS.map((label) => (
              <button
                key={label}
                type="button"
                className="topnav-link"
                onClick={() => onNavAction(label, `${label} opened in prototype mode.`)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Notifications"
              onClick={() => onNavAction('Notifications', 'You have 3 notifications.')}
            >
              <Bell size={16} />
              <span className="badge">3</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Messages"
              onClick={() => onNavAction('Messages', 'You have 3 unread messages.')}
            >
              <MessageSquare size={16} />
              <span className="badge">3</span>
            </button>
            <button
              type="button"
              className="icon-btn"
              aria-label="Copy current view link"
              onClick={onShareLink}
            >
              <Link2 size={16} />
            </button>

            <div className="profile-shell">
              <button
                type="button"
                className="profile-trigger"
                onClick={() => setProfileMenuOpen((current) => !current)}
                aria-expanded={profileMenuOpen}
              >
                <span className="profile-avatar">
                  <User size={14} />
                </span>
                <span className="profile-name">{user.displayName}</span>
                <ChevronDown size={14} />
              </button>

              {profileMenuOpen ? (
                <div className="profile-menu" role="menu" aria-label="Profile menu">
                  <p className="profile-menu__label">Signed in as</p>
                  <p className="profile-menu__email">{user.email || 'admin@mahamma.local'}</p>
                  <button
                    type="button"
                    className="profile-menu__item"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      onResetDemo()
                    }}
                  >
                    Reset demo
                  </button>
                  <button
                    type="button"
                    className="profile-menu__item profile-menu__item--danger"
                    onClick={onLogout}
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="dashboard">
          <div className="dashboard__inner">
            <section className="page-head">
              <h2 className="page-title">Admin Dashboard</h2>
              <p className="page-subtitle">
                Manage users, moderate content, and monitor platform health
              </p>
            </section>

            <section className="metric-grid" aria-label="Platform stats">
              {SUMMARY_METRICS.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </section>

            <section
              className="tab-strip"
              aria-label="Dashboard sections"
              role="tablist"
              ref={tablistRef}
            >
              {TAB_ITEMS.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab.id === 'reports' ? { ...tab, count: reportCount } : tab}
                  active={tab.id === activeTab}
                  onClick={() => selectTab(tab.id)}
                  onKeyDown={(event) => handleTabKeyDown(event, tab.id)}
                />
              ))}
            </section>

            {activeTab === 'verification' ? (
              <VerificationPanel
                verifications={verifications}
                onAction={onVerificationAction}
              />
            ) : null}

            {activeTab === 'reports' ? (
              <ReportsPanel
                issues={issues}
                selectedIssue={selectedIssue}
                selectedIssueId={selectedIssueId}
                onSelectIssue={onSelectIssue}
                onResolveIssue={onResolveIssue}
                onContact={onIssueContact}
                onViewDetails={onIssueDetails}
                onViewEvidence={onEvidenceView}
              />
            ) : null}

            {activeTab === 'analytics' ? <AnalyticsPanel /> : null}

            {activeTab === 'categories' ? (
              <CategoriesPanel
                categories={categories}
                onAdd={onCategoryAdd}
                onEdit={onCategoryEdit}
                onView={onCategoryView}
              />
            ) : null}
          </div>

          <Footer onAction={onFooterAction} onSocial={onFooterSocial} />
        </main>
      </div>
    </div>
  )
}

import {
  Bell,
  ChevronDown,
  LogOut,
  MessageSquare,
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
  profileMenuOpen,
  setProfileMenuOpen,
  onResetDemo,
  onLogout,
}) {
  function selectTab(tabId) {
    setActiveTab(tabId)
    setProfileMenuOpen(false)
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

            <section className="tab-strip" aria-label="Dashboard sections">
              {TAB_ITEMS.map((tab) => (
                <TabButton
                  key={tab.id}
                  tab={tab.id === 'reports' ? { ...tab, count: reportCount } : tab}
                  active={tab.id === activeTab}
                  onClick={() => selectTab(tab.id)}
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

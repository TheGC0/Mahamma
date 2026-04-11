import { useState } from 'react'
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Eye,
  Facebook,
  FileText,
  Instagram,
  Linkedin,
  MessageSquare,
  Paperclip,
  PencilLine,
  Plus,
  Search,
  Twitter,
  X,
  XCircle,
} from 'lucide-react'
import {
  RESOLUTION_BREAKDOWN,
  WEEKLY_ACTIVITY,
  initials,
  pillClass,
} from '../data/adminPrototypeData.js'
import { BrandMark } from './BrandMark.jsx'

export function MetricCard({ metric }) {
  const Icon = metric.icon

  return (
    <article className={`metric-card metric-card--${metric.tone}`}>
      <div>
        <p className="metric-label">{metric.label}</p>
        <p className="metric-value">{metric.value}</p>
      </div>
      <div className="metric-icon" aria-hidden="true">
        <Icon size={18} />
      </div>
    </article>
  )
}

export function TabButton({ tab, active, onClick, onKeyDown }) {
  const Icon = tab.icon

  return (
    <button
      type="button"
      className={`tab-button${active ? ' tab-button--active' : ''}`}
      id={`tab-${tab.id}`}
      data-tab-id={tab.id}
      role="tab"
      aria-selected={active}
      aria-controls={`panel-${tab.id}`}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <Icon size={14} />
      <span>
        {tab.label}
        {tab.count ? ` (${tab.count})` : ''}
      </span>
    </button>
  )
}

export function VerificationPanel({ verifications, onAction }) {
  return (
    <section
      className="panel"
      role="tabpanel"
      id="panel-verification"
      aria-labelledby="tab-verification"
    >
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Pending Verifications</h3>
          <p className="panel-subtitle">
            Review and approve new user registrations from KFUPM students
          </p>
        </div>
      </div>

      <div className="verification-list">
        {verifications.map((item) => (
          <article key={item.id} className="verification-card">
            <div className="verification-card__head">
              <div className="person">
                <span className="avatar">{initials(item.name)}</span>
                <div>
                  <p className="person-name">{item.name}</p>
                  <div className="person-meta">
                    <span className="role-chip">{item.role}</span>
                    <span className={`status-chip status-chip--${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="verification-actions">
                <button
                  type="button"
                  className="btn btn--success btn--compact"
                  onClick={() => onAction(item.id, 'approved')}
                >
                  <CheckCircle2 size={14} />
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn--danger btn--compact"
                  onClick={() => onAction(item.id, 'rejected')}
                >
                  <XCircle size={14} />
                  Reject
                </button>
              </div>
            </div>

            <div className="verification-card__grid">
              <div className="verification-card__field">
                <p className="field-label">Email</p>
                <p className="field-value">{item.email}</p>
              </div>
              <div className="verification-card__field">
                <p className="field-label">Student ID</p>
                <p className="field-value">{item.studentId}</p>
              </div>
              <div className="verification-card__field">
                <p className="field-label">Phone</p>
                <p className="field-value">{item.phone}</p>
              </div>
              <div className="verification-card__field">
                <p className="field-label">Registration Date</p>
                <p className="field-value">{item.date}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ReportsPanel({
  issues,
  selectedIssue,
  selectedIssueId,
  onSelectIssue,
  onResolveIssue,
  onContact,
  onViewDetails,
  onViewEvidence,
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const normalizedQuery = query.trim().toLowerCase()
  const statusOptions = [
    { id: 'all', label: 'All', count: issues.length },
    {
      id: 'pending',
      label: 'Pending',
      count: issues.filter((issue) => issue.status === 'pending').length,
    },
    {
      id: 'reviewing',
      label: 'Reviewing',
      count: issues.filter((issue) => issue.status === 'reviewing').length,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: issues.filter((issue) => issue.status === 'resolved').length,
    },
  ]
  const visibleIssues = normalizedQuery
    ? issues.filter((issue) =>
        [
          issue.title,
          issue.tag,
          issue.priority,
          issue.status,
          issue.reporter.name,
          issue.respondent.name,
          issue.reported,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : issues

  const filteredIssues =
    statusFilter === 'all'
      ? visibleIssues
      : visibleIssues.filter((issue) => issue.status === statusFilter)

  const detailIssue = filteredIssues.length
    ? filteredIssues.find((issue) => issue.id === selectedIssueId) ??
      filteredIssues[0] ??
      selectedIssue ??
      null
    : null

  return (
    <section
      className="reports-grid"
      role="tabpanel"
      id="panel-reports"
      aria-labelledby="tab-reports"
    >
      <aside className="panel issue-list-panel">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Reported Issues</h3>
            <p className="panel-subtitle">Click to view details</p>
          </div>

          <div className="panel-toolbar">
            <label className="search-field" aria-label="Search reported issues">
              <Search size={14} className="search-field__icon" aria-hidden="true" />
              <input
                className="input search-input"
                type="search"
                value={query}
                placeholder="Search issues"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear issue search"
                  onClick={() => setQuery('')}
                >
                  <X size={12} />
                </button>
              ) : null}
            </label>
            <span className="panel-count">
              {filteredIssues.length} of {issues.length}
            </span>
          </div>
        </div>

        <div className="filter-strip" aria-label="Issue status filters">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`filter-chip${statusFilter === option.id ? ' filter-chip--active' : ''}`}
              onClick={() => setStatusFilter(option.id)}
            >
              <span>{option.label}</span>
              <span className="filter-chip__count">{option.count}</span>
            </button>
          ))}
        </div>

        <div className="issue-list">
          {filteredIssues.length ? (
            filteredIssues.map((issue) => (
              <button
                key={issue.id}
                type="button"
                className={`issue-card${
                  issue.id === detailIssue?.id ? ' issue-card--active' : ''
                }`}
                onClick={() => onSelectIssue(issue.id)}
              >
                <div className="issue-card__head">
                  <span className={`pill ${pillClass(issue.tag)}`}>{issue.tag}</span>
                  <span className={`pill ${pillClass(issue.status)}`}>{issue.status}</span>
                </div>
                <p className="issue-title">{issue.title}</p>
                <p className="issue-meta">Reported by {issue.reporter.name}</p>
                <p className="issue-meta">{issue.reported}</p>
              </button>
            ))
          ) : (
            <div className="no-results">
              <Search size={28} />
              <p>No issues match "{query.trim()}"</p>
            </div>
          )}
        </div>
      </aside>

      <article className="panel detail-panel">
        {detailIssue ? (
          <>
            <div className="detail-header">
              <div>
                <h3 className="detail-title">{detailIssue.title}</h3>
                <div className="detail-chip-row">
                  <span className={`pill ${pillClass(detailIssue.tag)}`}>
                    {detailIssue.tag}
                  </span>
                  <span className={`pill ${pillClass(detailIssue.priority)}`}>
                    {detailIssue.priority}
                  </span>
                  <span className={`pill ${pillClass(detailIssue.status)}`}>
                    {detailIssue.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="meta-grid">
              <div className="meta-card">
                <p className="meta-label">Reporter</p>
                <p className="meta-value">{detailIssue.reporter.name}</p>
                <span className={`pill ${pillClass(detailIssue.reporter.role)}`}>
                  {detailIssue.reporter.role}
                </span>
              </div>
              <div className="meta-card">
                <p className="meta-label">Respondent</p>
                <p className="meta-value">{detailIssue.respondent.name}</p>
                <span className={`pill ${pillClass(detailIssue.respondent.role)}`}>
                  {detailIssue.respondent.role}
                </span>
              </div>
            </div>

            <div className="section-block">
              <h4 className="section-title">
                <FileText size={14} />
                Issue Description
              </h4>
              <div className="field-card">
                <p className="field-copy">{detailIssue.description}</p>
              </div>
            </div>

            <div className="section-block">
              <h4 className="section-title">
                <Paperclip size={14} />
                Evidence Submitted
              </h4>
              <div className="evidence-list">
                {detailIssue.evidence.map((file) => (
                  <div key={file.name} className="evidence-row">
                    <span className="evidence-name">
                      <FileText size={16} />
                      {file.name}
                    </span>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => onViewEvidence(file.name)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-block">
              <h4 className="section-title">Job Information</h4>
              <div className="job-card">
                <p className="job-card__title">Job ID: {detailIssue.jobId}</p>
                <div className="job-card__grid">
                  <span>Reported: {detailIssue.reported}</span>
                  <span>Status: {detailIssue.status}</span>
                </div>
              </div>
            </div>

            {detailIssue.resolutionNote ? (
              <div className="success-box">
                <strong>Resolution note</strong>
                <p>{detailIssue.resolutionNote}</p>
              </div>
            ) : null}

            <div className="section-block">
              <h4 className="section-title">Admin Actions</h4>
              <div className="action-row">
                <button type="button" className="btn btn--success" onClick={onResolveIssue}>
                  <CheckCircle2 size={14} />
                  Resolve Dispute
                </button>
                <button type="button" className="btn btn--outline" onClick={onContact}>
                  <MessageSquare size={14} />
                  Contact Parties
                </button>
                <button type="button" className="btn btn--outline" onClick={onViewDetails}>
                  <Eye size={14} />
                  View Job Details
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="no-results">
            <AlertTriangle size={32} />
            <p>
              {query.trim() || statusFilter !== 'all'
                ? `No issue matches ${[
                    query.trim() ? `"${query.trim()}"` : null,
                    statusFilter !== 'all' ? `status ${statusFilter}` : null,
                  ]
                    .filter(Boolean)
                    .join(' and ')}.`
                : 'Select an issue to view details'}
            </p>
          </div>
        )}
      </article>
    </section>
  )
}

export function AnalyticsPanel() {
  return (
    <section
      className="analytics-grid"
      role="tabpanel"
      id="panel-analytics"
      aria-labelledby="tab-analytics"
    >
      <article className="panel chart-card">
        <div className="panel-head">
          <div>
            <h3 className="panel-title">Platform Activity</h3>
            <p className="panel-subtitle">
              Weekly request volume and response trend
            </p>
          </div>
          <span className="pill pill--soft">Last 7 days</span>
        </div>

        <div className="chart-bars" aria-label="Weekly activity chart">
          {WEEKLY_ACTIVITY.map((item) => (
            <div key={item.day} className="chart-bar">
              <div className="chart-bar__track">
                <div
                  className="chart-bar__fill"
                  style={{ height: `${item.value}%` }}
                />
              </div>
              <span className="chart-bar__value">{item.value}</span>
              <span className="chart-bar__label">{item.day}</span>
            </div>
          ))}
        </div>

        <div className="mini-badges">
          <span className="pill pill--resolved">94% completion</span>
          <span className="pill pill--pending">12 approvals waiting</span>
        </div>
      </article>

      <article className="panel">
        <h3 className="panel-title">Resolution Breakdown</h3>
        <p className="panel-subtitle">
          How disputes are moving through the review process
        </p>

        <div className="progress-list">
          {RESOLUTION_BREAKDOWN.map((item) => (
            <div key={item.label}>
              <div className="progress-row">
                <span>{item.label}</span>
                <strong>{item.value}%</strong>
              </div>
              <div className="progress-line">
                <div
                  className={`progress-line__fill progress-line__fill--${item.tone}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  )
}

export function CategoriesPanel({ categories, onAdd, onEdit, onView }) {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('jobs-desc')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleCategories = normalizedQuery
    ? categories.filter((category) =>
        [category.name, String(category.jobs)].join(' ').toLowerCase().includes(normalizedQuery),
      )
    : categories
  const orderedCategories = [...visibleCategories].sort((left, right) => {
    if (sortBy === 'name-asc') {
      return left.name.localeCompare(right.name)
    }

    if (sortBy === 'jobs-asc') {
      return left.jobs - right.jobs
    }

    return right.jobs - left.jobs
  })

  return (
    <section
      className="panel"
      role="tabpanel"
      id="panel-categories"
      aria-labelledby="tab-categories"
    >
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Category Management</h3>
          <p className="panel-subtitle">Manage service and task categories</p>
        </div>

        <div className="panel-toolbar">
          <label className="search-field" aria-label="Search categories">
            <Search size={14} className="search-field__icon" aria-hidden="true" />
            <input
              className="input search-input"
              type="search"
              value={query}
              placeholder="Search categories"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear category search"
                onClick={() => setQuery('')}
              >
                <X size={12} />
              </button>
              ) : null}
          </label>
          <span className="panel-count">
            {orderedCategories.length} of {categories.length}
          </span>
          <label className="sort-field">
            <ArrowUpDown size={14} className="sort-field__icon" aria-hidden="true" />
            <select
              className="panel-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort categories"
            >
              <option value="jobs-desc">Most jobs</option>
              <option value="jobs-asc">Fewest jobs</option>
              <option value="name-asc">Name A-Z</option>
            </select>
          </label>
        </div>
      </div>

      <div className="category-list">
        {orderedCategories.length ? (
          orderedCategories.map((category) => (
            <div key={category.id} className="category-row">
              <div>
                <p className="category-row__title">{category.name}</p>
                <p className="category-row__meta">{category.jobs} jobs in the category</p>
              </div>
              <div className="category-row__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => onEdit(category)}
                >
                  <PencilLine size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => onView(category)}
                >
                  <Eye size={14} />
                  View All
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <Search size={28} />
            <p>No categories match "{query.trim()}"</p>
          </div>
        )}
      </div>

      <button type="button" className="btn btn--primary btn--full btn--spaced" onClick={onAdd}>
        <Plus size={14} />
        Add New Category
      </button>
    </section>
  )
}

export function Footer({ onAction, onSocial }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand-block">
            <div className="footer__brand">
              <BrandMark small />
              <div>
                <p className="footer__brand-name">Mahamma</p>
                <p className="footer__brand-copy">KFUPM&apos;s trusted student freelance platform</p>
              </div>
            </div>
          </div>

          <div>
            <p className="footer__col-title">For Clients</p>
            <div className="footer__link-list">
              {['Browse Services', 'Post a Task', 'My Dashboard'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="footer__link"
                  onClick={() => onAction(label, `${label} opened in prototype mode.`)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__col-title">For Providers</p>
            <div className="footer__link-list">
              {['Find Tasks', 'Create Service', 'My Dashboard'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="footer__link"
                  onClick={() => onAction(label, `${label} opened in prototype mode.`)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="footer__col-title">Support</p>
            <div className="footer__link-list">
              {['Help Center', 'Safety Guidelines', 'Contact Us'].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="footer__link"
                  onClick={() => onAction(label, `${label} opened in prototype mode.`)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 Mahamma. All rights reserved.</p>
          <div className="socials">
            <button type="button" aria-label="Facebook" onClick={() => onSocial('Facebook')}>
              <Facebook size={14} />
            </button>
            <button type="button" aria-label="Twitter" onClick={() => onSocial('Twitter')}>
              <Twitter size={14} />
            </button>
            <button type="button" aria-label="Instagram" onClick={() => onSocial('Instagram')}>
              <Instagram size={14} />
            </button>
            <button type="button" aria-label="LinkedIn" onClick={() => onSocial('LinkedIn')}>
              <Linkedin size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

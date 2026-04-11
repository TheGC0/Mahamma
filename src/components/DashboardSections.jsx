import {
  AlertTriangle,
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
  Twitter,
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

export function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon

  return (
    <button
      type="button"
      className={`tab-button${active ? ' tab-button--active' : ''}`}
      onClick={onClick}
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
    <section className="panel">
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
  return (
    <section className="reports-grid">
      <aside className="panel issue-list-panel">
        <h3 className="panel-title">Reported Issues</h3>
        <p className="panel-subtitle">Click to view details</p>

        <div className="issue-list">
          {issues.map((issue) => (
            <button
              key={issue.id}
              type="button"
              className={`issue-card${
                issue.id === selectedIssueId ? ' issue-card--active' : ''
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
          ))}
        </div>
      </aside>

      <article className="panel detail-panel">
        {selectedIssue ? (
          <>
            <div className="detail-header">
              <div>
                <h3 className="detail-title">{selectedIssue.title}</h3>
                <div className="detail-chip-row">
                  <span className={`pill ${pillClass(selectedIssue.tag)}`}>
                    {selectedIssue.tag}
                  </span>
                  <span className={`pill ${pillClass(selectedIssue.priority)}`}>
                    {selectedIssue.priority}
                  </span>
                  <span className={`pill ${pillClass(selectedIssue.status)}`}>
                    {selectedIssue.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="meta-grid">
              <div className="meta-card">
                <p className="meta-label">Reporter</p>
                <p className="meta-value">{selectedIssue.reporter.name}</p>
                <span className={`pill ${pillClass(selectedIssue.reporter.role)}`}>
                  {selectedIssue.reporter.role}
                </span>
              </div>
              <div className="meta-card">
                <p className="meta-label">Respondent</p>
                <p className="meta-value">{selectedIssue.respondent.name}</p>
                <span className={`pill ${pillClass(selectedIssue.respondent.role)}`}>
                  {selectedIssue.respondent.role}
                </span>
              </div>
            </div>

            <div className="section-block">
              <h4 className="section-title">
                <FileText size={14} />
                Issue Description
              </h4>
              <div className="field-card">
                <p className="field-copy">{selectedIssue.description}</p>
              </div>
            </div>

            <div className="section-block">
              <h4 className="section-title">
                <Paperclip size={14} />
                Evidence Submitted
              </h4>
              <div className="evidence-list">
                {selectedIssue.evidence.map((file) => (
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
                <p className="job-card__title">Job ID: {selectedIssue.jobId}</p>
                <div className="job-card__grid">
                  <span>Reported: {selectedIssue.reported}</span>
                  <span>Status: {selectedIssue.status}</span>
                </div>
              </div>
            </div>

            {selectedIssue.resolutionNote ? (
              <div className="success-box">
                <strong>Resolution note</strong>
                <p>{selectedIssue.resolutionNote}</p>
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
            <p>Select an issue to view details</p>
          </div>
        )}
      </article>
    </section>
  )
}

export function AnalyticsPanel() {
  return (
    <section className="analytics-grid">
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
  return (
    <section className="panel">
      <h3 className="panel-title">Category Management</h3>
      <p className="panel-subtitle">Manage service and task categories</p>

      <div className="category-list">
        {categories.map((category) => (
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
        ))}
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

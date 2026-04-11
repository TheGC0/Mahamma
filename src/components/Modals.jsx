import { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileText, Link2, Paperclip, X } from 'lucide-react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function ModalShell({ title, subtitle, wide = false, onClose, children }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    previousFocusRef.current = document.activeElement

    const dialog = dialogRef.current
    const autofocusTarget = dialog?.querySelector('[data-autofocus]')
    const focusTarget = autofocusTarget ?? dialog?.querySelector(FOCUSABLE_SELECTOR) ?? dialog

    focusTarget?.focus?.()

    return () => {
      const previousFocus = previousFocusRef.current
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus()
      }
    }
  }, [])

  function handleKeyDown(event) {
    if (event.key !== 'Tab') return

    const dialog = dialogRef.current
    if (!dialog) return

    const focusableElements = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
      (element) => element instanceof HTMLElement && !element.hasAttribute('disabled'),
    )

    if (!focusableElements.length) {
      event.preventDefault()
      dialog.focus()
      return
    }

    const firstFocusableElement = focusableElements[0]
    const lastFocusableElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        event.preventDefault()
        lastFocusableElement.focus()
      }
      return
    }

    if (document.activeElement === lastFocusableElement) {
      event.preventDefault()
      firstFocusableElement.focus()
    }
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        className={`modal${wide ? ' modal--wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descriptionId : undefined}
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
      >
        <div className="modal__head">
          <div>
            <h3 className="modal__title" id={titleId}>
              {title}
            </h3>
            {subtitle ? (
              <p className="modal__subtitle" id={descriptionId}>
                {subtitle}
              </p>
            ) : null}
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="modal__body">{children}</div>
      </section>
    </div>
  )
}

export function ResolveDisputeModal({ issue, onClose, onResolve }) {
  const [notes, setNotes] = useState(issue?.resolutionNote ?? '')
  const [error, setError] = useState('')

  useEffect(() => {
    setNotes(issue?.resolutionNote ?? '')
    setError('')
  }, [issue])

  function handleSubmit(event) {
    event.preventDefault()

    if (!notes.trim()) {
      setError('Add a short resolution note before closing the dispute.')
      return
    }

    onResolve(notes)
  }

  return (
    <ModalShell
      title="Resolve Dispute"
      subtitle="Write a final decision and notes"
      wide
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Resolution Notes *</span>
          <textarea
            className="textarea"
            value={notes}
            placeholder="Explain your decision and any action taken..."
            data-autofocus
            onChange={(event) => {
              setNotes(event.target.value)
              if (error) setError('')
            }}
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="warning-box">
          <AlertTriangle size={14} />
          <span>Both parties will be notified of your decision.</span>
        </div>

        <div className="modal__footer">
          <button type="submit" className="btn btn--success">
            <CheckCircle2 size={14} />
            Resolve &amp; Close
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

export function CategoryModal({ mode, category, onClose, onSave }) {
  const [name, setName] = useState(category?.name ?? '')
  const [jobs, setJobs] = useState(String(category?.jobs ?? 0))
  const [error, setError] = useState('')

  useEffect(() => {
    setName(category?.name ?? '')
    setJobs(String(category?.jobs ?? 0))
    setError('')
  }, [category, mode])

  function handleSubmit(event) {
    event.preventDefault()

    const parsedJobs = Number.parseInt(jobs, 10)

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    onSave({
      name,
      jobs: Number.isNaN(parsedJobs) ? 0 : parsedJobs,
    })
  }

  return (
    <ModalShell
      title={mode === 'edit' ? 'Edit Category' : 'Add New Category'}
      subtitle="Manage service and task categories"
      onClose={onClose}
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Category name</span>
          <input
            className="input"
            type="text"
            value={name}
            placeholder="Category name"
            data-autofocus
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
          />
        </label>

        <label className="field">
          <span className="field-label">Job count</span>
          <input
            className="input"
            type="number"
            min="0"
            value={jobs}
            onChange={(event) => setJobs(event.target.value)}
          />
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <div className="helper-box">
          The category list updates instantly after you save.
        </div>

        <div className="modal__footer">
          <button type="submit" className="btn btn--primary">
            {mode === 'edit' ? 'Save Changes' : 'Add Category'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </ModalShell>
  )
}

export function JobDetailsModal({ issue, onClose }) {
  async function handleCopyJobId() {
    if (typeof window === 'undefined') return

    try {
      await window.navigator.clipboard.writeText(issue.jobId)
    } catch {
      window.prompt('Copy the job ID', issue.jobId)
    }
  }

  return (
    <ModalShell
      title="Job Details"
      subtitle="Review the dispute summary before taking further action"
      wide
      onClose={onClose}
    >
      <div className="meta-grid">
        <div className="meta-card">
          <p className="meta-label">Job ID</p>
          <p className="meta-value">{issue.jobId}</p>
          <span className={`pill ${issue.status === 'resolved' ? 'pill--resolved' : 'pill--pending'}`}>
            {issue.status}
          </span>
        </div>
        <div className="meta-card">
          <p className="meta-label">Reported</p>
          <p className="meta-value">{issue.reported}</p>
          <span className={`pill ${issue.priority.includes('high') ? 'pill--high' : 'pill--soft'}`}>
            {issue.priority}
          </span>
        </div>
      </div>

      <div className="meta-grid">
        <div className="meta-card">
          <p className="meta-label">Reporter</p>
          <p className="meta-value">{issue.reporter.name}</p>
          <span className={`pill ${issue.reporter.role === 'Client' ? 'pill--client' : 'pill--provider'}`}>
            {issue.reporter.role}
          </span>
        </div>
        <div className="meta-card">
          <p className="meta-label">Respondent</p>
          <p className="meta-value">{issue.respondent.name}</p>
          <span className={`pill ${issue.respondent.role === 'Client' ? 'pill--client' : 'pill--provider'}`}>
            {issue.respondent.role}
          </span>
        </div>
      </div>

      <div className="section-block">
        <h4 className="section-title">
          <FileText size={14} />
          Issue Description
        </h4>
        <div className="field-card">
          <p className="field-copy">{issue.description}</p>
        </div>
      </div>

      <div className="section-block">
        <h4 className="section-title">
          <Paperclip size={14} />
          Evidence Files
        </h4>
        <div className="evidence-list">
          {issue.evidence.map((file) => (
            <div key={file.name} className="evidence-row">
              <span className="evidence-name">
                <FileText size={16} />
                {file.name}
              </span>
              <button
                type="button"
                className="link-btn"
                onClick={() => window.prompt('Copy this filename', file.name)}
              >
                <Link2 size={14} />
                Copy name
              </button>
            </div>
          ))}
        </div>
      </div>

      {issue.resolutionNote ? (
        <div className="success-box">
          <strong>Resolution note</strong>
          <p>{issue.resolutionNote}</p>
        </div>
      ) : null}

      <div className="modal__footer">
        <button type="button" className="btn btn--outline" onClick={handleCopyJobId}>
          Copy Job ID
        </button>
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Close
        </button>
      </div>
    </ModalShell>
  )
}

export function Toast({ toast, onDismiss }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__dot" />
      <div className="toast__text">
        <strong>{toast.title}</strong>
        {toast.message ? <span>{toast.message}</span> : null}
      </div>
      {toast.actionLabel && typeof toast.onAction === 'function' ? (
        <button
          type="button"
          className="toast__action"
          onClick={() => {
            onDismiss?.()
            toast.onAction()
          }}
        >
          {toast.actionLabel}
        </button>
      ) : null}
    </div>
  )
}

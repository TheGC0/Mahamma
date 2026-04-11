import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

export function ModalShell({ title, subtitle, wide = false, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section className={`modal${wide ? ' modal--wide' : ''}`} role="dialog" aria-modal="true">
        <div className="modal__head">
          <div>
            <h3 className="modal__title">{title}</h3>
            {subtitle ? <p className="modal__subtitle">{subtitle}</p> : null}
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

export function Toast({ toast }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__dot" />
      <div className="toast__text">
        <strong>{toast.title}</strong>
        {toast.message ? <span>{toast.message}</span> : null}
      </div>
    </div>
  )
}

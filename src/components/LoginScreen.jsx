import { useState } from 'react'
import { BrandMark } from './BrandMark.jsx'

export function LoginScreen({ onLogin, onSignUp, error }) {
  const [form, setForm] = useState({
    email: 's202012345@kfupm.edu.sa',
    password: '',
  })

  function handleSubmit(event) {
    event.preventDefault()
    onLogin(form)
  }

  return (
    <main className="login-viewport">
      <section className="login-card" aria-labelledby="login-title">
        <BrandMark />
        <h1 id="login-title" className="login-title">
          Welcome Back
        </h1>
        <p className="login-subtitle">Login to your Mahamma account</p>

        <div className="example-box">
          <strong>Example Accounts:</strong>
          <ul className="example-list">
            <li>
              <span className="example-role">Client:</span>
              <span className="example-value">client@kfupm.edu.sa</span>
              <span className="example-separator">/</span>
              <span className="example-value">client123</span>
            </li>
            <li>
              <span className="example-role">Freelancer:</span>
              <span className="example-value">provider@kfupm.edu.sa</span>
              <span className="example-separator">/</span>
              <span className="example-value">provider123</span>
            </li>
          </ul>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">KFUPM Email</span>
            <input
              className="input"
              type="email"
              name="email"
              value={form.email}
              placeholder="s202012345@kfupm.edu.sa"
              autoComplete="username"
              autoFocus
              required
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              name="password"
              value={form.password}
              autoComplete="current-password"
              required
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
            />
          </label>

          {error ? (
            <p className="error-text" role="alert">
              {error}
            </p>
          ) : null}

          <button className="btn btn--primary btn--full" type="submit">
            Login
          </button>
        </form>

        <p className="signup-row">
          Don&apos;t have an account?
          <button type="button" className="link-button" onClick={onSignUp}>
            Sign up
          </button>
        </p>
      </section>
    </main>
  )
}

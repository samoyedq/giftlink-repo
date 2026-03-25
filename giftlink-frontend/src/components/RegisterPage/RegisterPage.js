import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../LoginPage/LoginPage.css"
import "./RegisterPage.css"

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Registration failed")
      }

      setSuccess(true)
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="auth-shell">
        <section className="auth-card">
          <p className="auth-kicker">GiftLink</p>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to start sharing gift ideas with friends.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={onChange}
              placeholder="Choose a username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="At least 6 characters"
              required
            />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm your password"
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </main>

      {success && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✓</div>
            <h2>Registration Successful!</h2>
            <p>Your account has been created. Redirecting to login...</p>
          </div>
        </div>
      )}
    </>
  )
}
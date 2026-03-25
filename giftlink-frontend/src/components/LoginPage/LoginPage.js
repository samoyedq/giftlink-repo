import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "" })
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
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Login failed")
      }

      localStorage.setItem("user", JSON.stringify(data))
      setSuccess(true)
      setTimeout(() => navigate("/"), 2000)
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue sharing gift ideas.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={onChange}
              placeholder="e.g. danie"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
            />

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </main>

      {success && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✓</div>
            <h2>Logged In Successfully!</h2>
            <p>Welcome back, {form.username}. Redirecting...</p>
          </div>
        </div>
      )}
    </>
  )
}
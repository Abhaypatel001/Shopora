import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      const { token, user } = response.data;

      localStorage.setItem("shopora_token", token);
      localStorage.setItem(
        "shopora_user",
        JSON.stringify(user)
      );

      onLogin(user);

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shopora-login">
      <div className="login-card">

        {/* BRAND */}

        <div className="login-brand">
          <div className="login-logo">
            S
          </div>

          <div>
            <span className="login-brand-name">
              Shopora
            </span>

            <span className="login-brand-tagline">
              Shop smarter. Live better.
            </span>
          </div>
        </div>

        {/* HEADING */}

        <div className="login-heading">
          <h1>
            Welcome back 👋
          </h1>

          <p>
            Sign in to continue your Shopora journey.
          </p>
        </div>

        {/* FORM */}

        <form
          onSubmit={submit}
          className="shopora-login-form"
        >

          {/* EMAIL */}

          <div className="login-field">
            <label htmlFor="login-email">
              Email address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="login-field">

            <div className="password-label">
              <label htmlFor="login-password">
                Password
              </label>

              <span>
                Forgot password?
              </span>
            </div>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="shopora-login-error">
              {error}
            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            className="shopora-login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in to Shopora"}
          </button>

        </form>

        {/* REGISTER */}

        <div className="login-divider">
          <span>
            New to Shopora?
          </span>
        </div>

        <button
          type="button"
          className="create-account-button"
          onClick={() => navigate("/register")}
        >
          Create a new account
        </button>

        {/* FOOTER */}

        <p className="login-footer-text">
          By continuing, you agree to Shopora's Terms &
          Privacy Policy.
        </p>

      </div>
    </div>
  );
}
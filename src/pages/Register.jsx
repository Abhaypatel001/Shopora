import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

export default function Register({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);

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
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shopora-register">
      <div className="register-shell">

        {/* LEFT PREMIUM PANEL */}

        <div className="register-showcase">

          <div className="register-showcase-content">

            <div className="register-brand">
              <div className="register-logo">
                S
              </div>

              <div>
                <div className="register-brand-name">
                  Shopora
                </div>

                <div className="register-brand-tagline">
                  Shop smarter. Live better.
                </div>
              </div>
            </div>

            <div className="register-hero">

              <span className="register-eyebrow">
                ✦ JOIN THE SHOPORA FAMILY
              </span>

              <h1>
                Everything you love,
                <br />
                <span>all in one place.</span>
              </h1>

              <p>
                Create your Shopora account and discover
                a smarter way to shop, save and manage
                your orders.
              </p>

            </div>

            <div className="register-benefits">

              <div className="register-benefit">
                <div className="benefit-icon">
                  🛍️
                </div>

                <div>
                  <strong>Personalized shopping</strong>
                  <span>
                    Discover products made for you.
                  </span>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">
                  🚚
                </div>

                <div>
                  <strong>Easy order tracking</strong>
                  <span>
                    Keep your purchases organized.
                  </span>
                </div>
              </div>

              <div className="register-benefit">
                <div className="benefit-icon">
                  🔒
                </div>

                <div>
                  <strong>Secure account</strong>
                  <span>
                    Your account stays protected.
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="register-decoration decoration-one" />
          <div className="register-decoration decoration-two" />
          <div className="register-decoration decoration-three" />

        </div>

        {/* RIGHT FORM */}

        <div className="register-form-area">

          <div className="register-form-card">

            <div className="register-mobile-brand">
              <div className="register-logo">
                S
              </div>

              <span>Shopora</span>
            </div>

            <div className="register-heading">

              <span className="register-small-label">
                CREATE ACCOUNT
              </span>

              <h2>
                Welcome to Shopora
              </h2>

              <p>
                Create your account and start shopping
                with us today.
              </p>

            </div>

            <form
              onSubmit={submit}
              className="shopora-register-form"
            >

              {/* NAME */}

              <div className="register-field">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    👤
                  </span>

                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    ✉
                  </span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div className="register-field">

                <div className="register-label-row">

                  <label htmlFor="password">
                    Password
                  </label>

                  <span>
                    Minimum 6 characters
                  </span>

                </div>

                <div className="register-input-wrap">

                  <span className="register-input-icon">
                    🔒
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>

              </div>

              {/* PASSWORD STRENGTH */}

              {form.password && (
                <div className="password-strength">

                  <div className="strength-bars">

                    <span
                      className={
                        form.password.length >= 1
                          ? "active"
                          : ""
                      }
                    />

                    <span
                      className={
                        form.password.length >= 4
                          ? "active"
                          : ""
                      }
                    />

                    <span
                      className={
                        form.password.length >= 6
                          ? "active"
                          : ""
                      }
                    />

                    <span
                      className={
                        form.password.length >= 8
                          ? "active"
                          : ""
                      }
                    />

                  </div>

                  <span>
                    {form.password.length < 4
                      ? "Weak password"
                      : form.password.length < 6
                      ? "Getting stronger"
                      : form.password.length < 8
                      ? "Good password"
                      : "Strong password"}
                  </span>

                </div>
              )}

              {/* ERROR */}

              {error && (
                <div className="register-error">
                  <span>!</span>
                  {error}
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="register-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="register-spinner" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create my account
                    <span>→</span>
                  </>
                )}
              </button>

            </form>

            <div className="register-security">
              <span>🔐</span>
              Your information is securely protected.
            </div>

            <div className="register-login-divider">
              <span>Already have an account?</span>
            </div>

            <button
              type="button"
              className="register-login-button"
              onClick={() => navigate("/login")}
            >
              Sign in to Shopora
            </button>

            <p className="register-terms">
              By creating an account, you agree to
              Shopora's Terms of Service and Privacy Policy.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
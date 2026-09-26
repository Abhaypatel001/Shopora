import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

export default function Account({
  user,
}) {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState(null);

  const [stats, setStats] = useState({
    orders: 0,
    addresses: 0,
    wishlist: 0,
  });

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [passwordSaving, setPasswordSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD ACCOUNT DATA
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "shopora_token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    const loadAccount = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          profileResponse,
          ordersResponse,
          addressResponse,
          wishlistResponse,
        ] = await Promise.all([
          api.get("/users/me", {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),

          api.get("/orders", {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),

          api.get("/users/addresses", {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),

          api.get("/users/wishlist", {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),
        ]);

        const currentUser =
          profileResponse.data.user;

        setProfile(currentUser);

        setName(
          currentUser?.name || ""
        );

        setEmail(
          currentUser?.email || ""
        );

        setStats({
          orders:
            ordersResponse.data.orders
              ?.length || 0,

          addresses:
            addressResponse.data.addresses
              ?.length || 0,

          wishlist:
            wishlistResponse.data.wishlist
              ?.length || 0,
        });
      } catch (err) {
        console.error(
          "Account error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load account."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [navigate]);

  // =====================================================
  // UPDATE PROFILE
  // =====================================================

  const handleProfileUpdate =
    async (e) => {
      e.preventDefault();

      try {
        setSaving(true);
        setError("");
        setMessage("");

        const token =
          localStorage.getItem(
            "shopora_token"
          );

        const response =
          await api.put(
            "/users/me",
            {
              name,
              email,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          const updatedUser =
            response.data.user;

          setProfile(updatedUser);

          setName(
            updatedUser.name || ""
          );

          setEmail(
            updatedUser.email || ""
          );

          // Update local storage
          const storedUser =
            JSON.parse(
              localStorage.getItem(
                "shopora_user"
              ) || "null"
            );

          if (storedUser) {
            localStorage.setItem(
              "shopora_user",
              JSON.stringify({
                ...storedUser,
                name:
                  updatedUser.name,
                email:
                  updatedUser.email,
              })
            );
          }

          // Navbar ko notify karo
          window.dispatchEvent(
            new Event(
              "shoporaUserUpdated"
            )
          );

          setMessage(
            "Profile updated successfully."
          );
        }
      } catch (err) {
        console.error(
          "Update profile error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to update profile."
        );
      } finally {
        setSaving(false);
      }
    };

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  const handlePasswordChange =
    async (e) => {
      e.preventDefault();

      try {
        setPasswordSaving(true);
        setError("");
        setMessage("");

        const token =
          localStorage.getItem(
            "shopora_token"
          );

        const response =
          await api.patch(
            "/users/me/password",
            {
              currentPassword,
              newPassword,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setCurrentPassword("");
          setNewPassword("");

          setMessage(
            "Password changed successfully."
          );
        }
      } catch (err) {
        console.error(
          "Password error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to change password."
        );
      } finally {
        setPasswordSaving(false);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-loading">
          Loading your account...
        </div>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="account-page">
      <div className="account-container">

        {/* HEADER */}

        <div className="account-header">

          <div>
            <span className="account-kicker">
              SHOPORA ACCOUNT
            </span>

            <h1>
              Hello,{" "}
              {profile?.name ||
                user?.name ||
                "Customer"}
            </h1>

            <p>
              Manage your profile,
              security and Shopora activity.
            </p>
          </div>

          <Link
            to="/"
            className="account-back-btn"
          >
            ← Continue Shopping
          </Link>

        </div>


        {/* MESSAGE */}

        {error && (
          <div className="account-message account-error">
            {error}
          </div>
        )}

        {message && (
          <div className="account-message account-success">
            {message}
          </div>
        )}


        {/* =================================================
            STATS
        ================================================= */}

        <section className="account-stats">

          <Link
            to="/orders"
            className="account-stat-card"
          >
            <span>ORDERS</span>

            <strong>
              {stats.orders}
            </strong>

            <small>
              View your orders →
            </small>
          </Link>


          <Link
            to="/addresses"
            className="account-stat-card"
          >
            <span>ADDRESSES</span>

            <strong>
              {stats.addresses}
            </strong>

            <small>
              Manage addresses →
            </small>
          </Link>


          <Link
            to="/wishlist"
            className="account-stat-card"
          >
            <span>WISHLIST</span>

            <strong>
              {stats.wishlist}
            </strong>

            <small>
              View saved products →
            </small>
          </Link>

        </section>


        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="account-grid">

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="account-card">

            <div className="account-card-title">

              <span>
                PROFILE
              </span>

              <h2>
                Personal Information
              </h2>

            </div>


            <form
              className="account-form"
              onSubmit={
                handleProfileUpdate
              }
            >

              {/* NAME */}

              <label>
                Full name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Enter your name"
                required
              />


              {/* EMAIL */}

              <label>
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                required
              />


              {/* ACCOUNT TYPE */}

            <label>
  Account type
</label>

<select
  value={profile?.role || "user"}
  disabled
>
  <option value="user">
    Customer
  </option>

  <option value="admin">
    Administrator
  </option>
</select>

              {/* SAVE */}

              <button
                type="submit"
                className="account-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>

          </section>


          {/* =================================================
              QUICK ACCESS
          ================================================= */}

          <section className="account-card">

            <div className="account-card-title">

              <span>
                QUICK ACCESS
              </span>

              <h2>
                Your Shopora
              </h2>

            </div>


            <div className="account-quick-links">

              <Link to="/orders">

                <strong>
                  Your Orders
                </strong>

                <span>
                  Track and manage purchases
                </span>

                <b>
                  →
                </b>

              </Link>


              <Link to="/addresses">

                <strong>
                  Saved Addresses
                </strong>

                <span>
                  Manage delivery addresses
                </span>

                <b>
                  →
                </b>

              </Link>


              <Link to="/wishlist">

                <strong>
                  Wishlist
                </strong>

                <span>
                  Products you saved
                </span>

                <b>
                  →
                </b>

              </Link>


              <Link to="/help">

                <strong>
                  Customer Service
                </strong>

                <span>
                  Get help with your account
                </span>

                <b>
                  →
                </b>

              </Link>

            </div>

          </section>


          {/* =================================================
              SECURITY
          ================================================= */}

          <section className="account-card">

            <div className="account-card-title">

              <span>
                SECURITY
              </span>

              <h2>
                Change Password
              </h2>

            </div>


            <form
              className="account-form"
              onSubmit={
                handlePasswordChange
              }
            >

              <label>
                Current password
              </label>

              <input
                type="password"
                value={
                  currentPassword
                }
                onChange={(e) =>
                  setCurrentPassword(
                    e.target.value
                  )
                }
                placeholder="Enter current password"
                required
              />


              <label>
                New password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                placeholder="Enter new password"
                minLength="6"
                required
              />


              <button
                type="submit"
                className="account-primary-btn"
                disabled={
                  passwordSaving
                }
              >
                {passwordSaving
                  ? "Updating..."
                  : "Change Password"}
              </button>

            </form>

          </section>


          {/* =================================================
              ACCOUNT DETAILS
          ================================================= */}

          <section className="account-card">

            <div className="account-card-title">

              <span>
                ACCOUNT
              </span>

              <h2>
                Account Details
              </h2>

            </div>


            <div className="account-info-row">

              <span>
                Email
              </span>

              <strong>
                {profile?.email}
              </strong>

            </div>


            <div className="account-info-row">

              <span>
                Account type
              </span>

              <strong>
                {profile?.role === "admin"
                  ? "Admin"
                  : "Customer"}
              </strong>

            </div>


            <div className="account-info-row">

              <span>
                Orders
              </span>

              <strong>
                {stats.orders}
              </strong>

            </div>


            <div className="account-info-row">

              <span>
                Wishlist
              </span>

              <strong>
                {stats.wishlist}
              </strong>

            </div>

          </section>

        </div>

      </div>
    </main>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("shopora_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get(
        "/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users || []);
      }
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem(
          "shopora_token"
        );
        localStorage.removeItem(
          "shopora_user"
        );

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (
    userId,
    role
  ) => {
    try {
      setUpdatingId(userId);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("shopora_token");

      const response = await api.patch(
        `/users/${userId}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? response.data.user
              : user
          )
        );

        setSuccess(
          "User role updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Update role error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalUsers = users.length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const normalUsers = users.filter(
    (user) => user.role === "user"
  ).length;

  return (
    <div className="admin-users-page">

      {/* HEADER */}
      <div className="admin-users-header">

        <div>
          <span className="admin-kicker">
            SHOPORA ADMIN
          </span>

          <h1>Manage Users</h1>

          <p>
            View registered users and manage
            their access roles.
          </p>
        </div>

        <button
          className="admin-home-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>

      </div>

      {/* MESSAGES */}
      {error && (
        <div className="admin-message admin-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-message admin-success">
          {success}
        </div>
      )}

      {/* STATS */}
      <div className="admin-stats">

        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>{totalUsers}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Admins</span>
          <strong>{adminCount}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Customers</span>
          <strong>{normalUsers}</strong>
        </div>

      </div>

      {/* USERS */}
      <div className="admin-users-card">

        <div className="admin-users-card-header">
          <div>
            <span>USER MANAGEMENT</span>

            <h2>
              Registered Users
            </h2>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchUsers}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading users...
          </div>
        ) : !users.length ? (
          <div className="admin-empty">
            No users found.
          </div>
        ) : (
          <div className="admin-users-table-wrap">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user._id}>

                    <td>
                      <div className="admin-user-name">
                        <div className="admin-user-avatar">
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <strong>
                          {user.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>

                      <span
                        className={`admin-role-badge ${
                          user.role === "admin"
                            ? "admin-role"
                            : "user-role"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>

                    <td>
                      {formatDate(
                        user.createdAt
                      )}
                    </td>

                    <td>

                      <select
                        value={user.role}
                        disabled={
                          updatingId === user._id
                        }
                        onChange={(e) =>
                          updateRole(
                            user._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="user">
                          User
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>

                      {updatingId ===
                        user._id && (
                        <small className="admin-updating">
                          Updating...
                        </small>
                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

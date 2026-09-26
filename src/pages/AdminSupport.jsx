import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const statuses = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

const priorities = [
  "Low",
  "Medium",
  "High",
];

export default function AdminSupport() {
  const navigate = useNavigate();

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [savingId, setSavingId] =
    useState(null);

  const [error, setError] =
    useState("");

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await api.get(
          "/support/admin/all",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setTickets(
          response.data.tickets || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch support tickets error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load support tickets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const updateLocalTicket = (
    id,
    field,
    value
  ) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket._id === id
          ? {
              ...ticket,
              [field]: value,
            }
          : ticket
      )
    );
  };

  const saveTicket = async (ticket) => {
    try {
      setSavingId(ticket._id);
      setError("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      const response =
        await api.patch(
          `/support/admin/${ticket._id}`,
          {
            status: ticket.status,
            priority: ticket.priority,
            adminReply:
              ticket.adminReply || "",
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setTickets((prev) =>
          prev.map((item) =>
            item._id === ticket._id
              ? response.data.ticket
              : item
          )
        );
      }
    } catch (error) {
      console.error(
        "Save support ticket error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update ticket."
      );
    } finally {
      setSavingId(null);
    }
  };

  const openCount = tickets.filter(
    (ticket) =>
      ticket.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    (ticket) =>
      ticket.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) =>
      ticket.status === "Resolved" ||
      ticket.status === "Closed"
  ).length;

  return (
    <div className="admin-support-page">

      <div className="admin-users-header">

        <div>
          <span className="admin-kicker">
            SHOPORA ADMIN
          </span>

          <h1>
            Customer Support
          </h1>

          <p>
            Manage customer support requests
            and replies.
          </p>
        </div>

        <button
          className="admin-home-btn"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Dashboard
        </button>

      </div>


      {error && (
        <div className="admin-message admin-error">
          {error}
        </div>
      )}


      <div className="admin-stats">

        <div className="admin-stat-card">
          <span>Open</span>
          <strong>
            {openCount}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>In Progress</span>
          <strong>
            {progressCount}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Resolved</span>
          <strong>
            {resolvedCount}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Tickets</span>
          <strong>
            {tickets.length}
          </strong>
        </div>

      </div>


      <div className="admin-support-list">

        {loading ? (
          <div className="admin-loading">
            Loading support tickets...
          </div>
        ) : tickets.length === 0 ? (
          <div className="admin-empty">
            No support tickets found.
          </div>
        ) : (
          tickets.map((ticket) => (

            <article
              className="admin-support-ticket"
              key={ticket._id}
            >

              <div className="admin-support-ticket-header">

                <div>
                  <span>
                    TICKET ID
                  </span>

                  <strong>
                    {ticket._id}
                  </strong>
                </div>

                <div>
                  <span>
                    CUSTOMER
                  </span>

                  <strong>
                    {ticket.name}
                  </strong>

                  <small>
                    {ticket.email}
                  </small>
                </div>

                <div>
                  <span>
                    CATEGORY
                  </span>

                  <strong>
                    {ticket.category}
                  </strong>
                </div>

              </div>


              <div className="admin-support-ticket-body">

                <h2>
                  {ticket.subject}
                </h2>

                <p>
                  {ticket.message}
                </p>

                {ticket.adminReply && (
                  <div className="admin-current-reply">
                    <b>
                      Existing Reply
                    </b>

                    <span>
                      {ticket.adminReply}
                    </span>
                  </div>
                )}

              </div>


              <div className="admin-support-controls">

                <div>
                  <label>
                    Status
                  </label>

                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      updateLocalTicket(
                        ticket._id,
                        "status",
                        e.target.value
                      )
                    }
                  >
                    {statuses.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>


                <div>
                  <label>
                    Priority
                  </label>

                  <select
                    value={ticket.priority}
                    onChange={(e) =>
                      updateLocalTicket(
                        ticket._id,
                        "priority",
                        e.target.value
                      )
                    }
                  >
                    {priorities.map(
                      (priority) => (
                        <option
                          key={priority}
                          value={priority}
                        >
                          {priority}
                        </option>
                      )
                    )}
                  </select>
                </div>


                <div className="admin-support-reply">
                  <label>
                    Reply
                  </label>

                  <textarea
                    value={
                      ticket.adminReply || ""
                    }
                    onChange={(e) =>
                      updateLocalTicket(
                        ticket._id,
                        "adminReply",
                        e.target.value
                      )
                    }
                    rows="3"
                    placeholder="Write a reply..."
                  />
                </div>


                <button
                  className="admin-save-btn"
                  onClick={() =>
                    saveTicket(ticket)
                  }
                  disabled={
                    savingId === ticket._id
                  }
                >
                  {savingId === ticket._id
                    ? "Saving..."
                    : "Save Response"}
                </button>

              </div>

            </article>

          ))
        )}

      </div>
    </div>
  );
}
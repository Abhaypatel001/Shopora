import {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const categories = [
  "Order Support",
  "Returns & Refunds",
  "Payments",
  "Account Help",
  "Product Issue",
  "Other",
];

const priorities = [
  "Low",
  "Medium",
  "High",
];

const statusClass = (status) =>
  status
    ?.toLowerCase()
    .replace(/\s+/g, "-");

export default function CustomerService({
  user = null,
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    category: "Order Support",
    subject: "",
    message: "",
    priority: "Medium",
  });

  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // LOAD MY TICKETS
  // ==========================================
  useEffect(() => {
    const loadTickets = async () => {
      try {
        const token =
          localStorage.getItem(
            "shopora_token"
          );

        if (!token) {
          setLoading(false);
          return;
        }

        const response =
          await api.get(
            "/support/my",
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
          "Load support tickets error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // ==========================================
  // FORM
  // ==========================================
  const updateField = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await api.post(
          "/support",
          form,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        const newTicket =
          response.data.ticket;

        setTickets((prev) => [
          newTicket,
          ...prev,
        ]);

        setSuccess(
          `Support ticket created successfully. Ticket ID: ${newTicket._id}`
        );

        setForm({
          name:
            user?.name || form.name,
          email:
            user?.email || form.email,
          category: "Order Support",
          subject: "",
          message: "",
          priority: "Medium",
        });
      }
    } catch (error) {
      console.error(
        "Create ticket error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to submit support request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="support-page">

      {/* =====================================
          HEADER
      ===================================== */}
      <div className="support-page-header">

        <div>
          <span className="simple-store-kicker">
            SHOPORA CUSTOMER SERVICE
          </span>

          <h1>
            How can we help?
          </h1>

          <p>
            Create a support request and track
            your conversation with Shopora.
          </p>
        </div>

        {!user && (
          <button
            className="support-login-btn"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>
        )}

      </div>


      {/* =====================================
          MAIN
      ===================================== */}
      <div className="support-main-grid">

        {/* FORM */}
        <section className="support-form-card">

          <div className="support-card-heading">

            <span>
              CREATE SUPPORT REQUEST
            </span>

            <h2>
              Contact Customer Service
            </h2>

          </div>

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

          <form
            className="support-ticket-form"
            onSubmit={handleSubmit}
          >

            <div className="support-form-row">

              <div>
                <label>
                  Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  required
                />
              </div>

            </div>


            <div className="support-form-row">

              <div>
                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
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
                  name="priority"
                  value={form.priority}
                  onChange={updateField}
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

            </div>


            <div>
              <label>
                Subject
              </label>

              <input
                name="subject"
                value={form.subject}
                onChange={updateField}
                placeholder="What do you need help with?"
                required
              />
            </div>


            <div>
              <label>
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                rows="6"
                placeholder="Describe your issue..."
                required
              />
            </div>


            <button
              type="submit"
              className="support-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Support Request"}
            </button>

          </form>

        </section>


        {/* INFO */}
        <aside className="support-info-card">

          <div className="support-info-icon">
            ?
          </div>

          <h2>
            Need help quickly?
          </h2>

          <p>
            Select the category that best matches
            your issue. This helps the Shopora
            support team handle your request.
          </p>

          <div className="support-info-list">

            <div>
              <strong>
                📦 Orders
              </strong>

              <span>
                Delivery, tracking and order issues
              </span>
            </div>

            <div>
              <strong>
                ↩️ Returns
              </strong>

              <span>
                Returns, refunds and cancellations
              </span>
            </div>

            <div>
              <strong>
                💳 Payments
              </strong>

              <span>
                Payment and checkout problems
              </span>
            </div>

            <div>
              <strong>
                👤 Account
              </strong>

              <span>
                Login and account related help
              </span>
            </div>

          </div>

        </aside>

      </div>


      {/* =====================================
          MY TICKETS
      ===================================== */}
      <section className="my-tickets-card">

        <div className="support-card-heading">

          <span>
            SUPPORT HISTORY
          </span>

          <h2>
            My Support Tickets
          </h2>

        </div>

        {loading ? (
          <div className="support-empty">
            Loading your tickets...
          </div>
        ) : !user ? (
          <div className="support-empty">
            <p>
              Sign in to view your support
              history.
            </p>

            <button
              onClick={() =>
                navigate("/login")
              }
            >
              Sign in
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="support-empty">
            <div>
              🎧
            </div>

            <h3>
              No support tickets yet
            </h3>

            <p>
              Your submitted support requests
              will appear here.
            </p>
          </div>
        ) : (
          <div className="support-ticket-list">

            {tickets.map(
              (ticket) => (
                <article
                  className="support-ticket-item"
                  key={ticket._id}
                >

                  <div className="support-ticket-id">
                    <span>
                      TICKET ID
                    </span>

                    <strong>
                      {ticket._id}
                    </strong>
                  </div>

                  <div className="support-ticket-main">

                    <strong>
                      {ticket.subject}
                    </strong>

                    <p>
                      {ticket.message}
                    </p>

                    <small>
                      {ticket.category} •{" "}
                      {ticket.priority}
                    </small>

                    {ticket.adminReply && (
                      <div className="support-admin-reply">
                        <b>
                          Shopora Support:
                        </b>

                        <span>
                          {ticket.adminReply}
                        </span>
                      </div>
                    )}

                  </div>

                  <div className="support-ticket-status">

                    <span
                      className={`support-status support-status-${statusClass(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}
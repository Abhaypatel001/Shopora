import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const STATUSES = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrders = async () => {
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
        "/orders/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders || []);
      }
    } catch (error) {
      console.error(
        "Fetch admin orders error:",
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
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("shopora_token");

      const response = await api.patch(
        `/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? response.data.order
              : order
          )
        );

        setSuccess(
          "Order status updated successfully."
        );
      }
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      !["Delivered", "Cancelled"].includes(
        order.status
      )
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const revenue = orders
    .filter(
      (order) => order.status !== "Cancelled"
    )
    .reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">
        <div>
          <span className="admin-kicker">
            SHOPORA ADMIN
          </span>

          <h1>Manage Orders</h1>

          <p>
            View and update customer orders.
          </p>
        </div>

        <button
          className="admin-home-btn"
          onClick={() => navigate("/admin")}
        >
          ← Dashboard
        </button>
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

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>In Progress</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered</span>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Order Value</span>
          <strong>{money(revenue)}</strong>
        </div>
      </div>

      <div className="admin-orders-card">

        <div className="admin-orders-card-header">
          <div>
            <span>ORDER MANAGEMENT</span>
            <h2>All Customer Orders</h2>
          </div>

          <button
            className="admin-refresh-btn"
            onClick={fetchOrders}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">
            Loading orders...
          </div>
        ) : !orders.length ? (
          <div className="admin-empty">
            No orders found.
          </div>
        ) : (
          <div className="admin-orders-list">

            {orders.map((order) => (
              <article
                className="admin-order-card"
                key={order._id}
              >

                <div className="admin-order-top">

                  <div>
                    <span>ORDER ID</span>

                    <strong>
                      {order._id}
                    </strong>
                  </div>

                  <div>
                    <span>PLACED</span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>CUSTOMER</span>

                    <strong>
                      {order.user?.name ||
                        "Customer"}
                    </strong>

                    <small>
                      {order.user?.email || ""}
                    </small>
                  </div>

                  <div>
                    <span>TOTAL</span>

                    <strong>
                      {money(order.total)}
                    </strong>
                  </div>

                </div>

                <div className="admin-order-middle">

                  <div className="admin-order-items">

                    {order.items.map(
                      (item, index) => (
                        <div
                          className="admin-order-item"
                          key={
                            item.productId ||
                            `${order._id}-${index}`
                          }
                        >
                          <div>
                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              Qty: {item.quantity}
                            </span>
                          </div>

                          <b>
                            {money(
                              Number(item.price) *
                                Number(
                                  item.quantity
                                )
                            )}
                          </b>
                        </div>
                      )
                    )}

                  </div>

                  <div className="admin-order-address">
                    <span>DELIVERY</span>

                    <strong>
                      {order.address?.name}
                    </strong>

                    <p>
                      {order.address?.address},{" "}
                      {order.address?.city},{" "}
                      {order.address?.state} -{" "}
                      {order.address?.pincode}
                    </p>
                  </div>

                </div>

                <div className="admin-order-bottom">

                  <div className="admin-payment">
                    <span>PAYMENT</span>

                    <strong>
                      {order.payment === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </strong>
                  </div>

                  <div className="admin-status-control">

                    <label>
                      ORDER STATUS
                    </label>

                    <select
                      value={order.status}
                      disabled={
                        updatingId === order._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                    >
                      {STATUSES.map(
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

                    {updatingId ===
                      order._id && (
                      <small>
                        Updating...
                      </small>
                    )}

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getStatusStep = (status) => {
  const steps = {
    Placed: 1,
    Confirmed: 2,
    Shipped: 3,
    "Out for Delivery": 4,
    Delivered: 5,
    Cancelled: 1,
  };

  return steps[status] || 1;
};

export default function Orders({
  onAddToCart = () => {},
}) {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("shopora_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setOrders(response.data.orders || []);
        }
      } catch (error) {
        console.error("Fetch orders error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("shopora_token");
          localStorage.removeItem("shopora_user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Loading
  if (loading) {
    return (
      <div className="orders-empty-page">
        <div className="orders-empty-card">
          <div className="orders-empty-icon">📦</div>

          <span className="orders-empty-kicker">
            SHOPORA ORDERS
          </span>

          <h1>Loading your orders...</h1>

          <p>
            Please wait while we fetch your orders
            from Shopora.
          </p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="orders-empty-page">
        <div className="orders-empty-card">
          <div className="orders-empty-icon">⚠️</div>

          <span className="orders-empty-kicker">
            SHOPORA ORDERS
          </span>

          <h1>Unable to load orders</h1>

          <p>{error}</p>

          <button
            className="orders-shop-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
            <span>↻</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty
  if (!orders.length) {
    return (
      <div className="orders-empty-page">
        <div className="orders-empty-card">
          <div className="orders-empty-icon">
            📦
          </div>

          <span className="orders-empty-kicker">
            SHOPORA ORDERS
          </span>

          <h1>Your orders will appear here</h1>

          <p>
            You haven't placed an order yet. Explore
            our products and find something you'll love.
          </p>

          <button
            className="orders-shop-btn"
            onClick={() => navigate("/")}
          >
            Start Shopping
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">

      {/* HEADER */}
      <div className="orders-header">

        <div>
          <div className="orders-breadcrumb">
            Home <span>›</span> Your Orders
          </div>

          <h1>My Orders</h1>

          <p>
            Track, manage and view all your Shopora
            purchases.
          </p>
        </div>

        <button
          className="orders-continue-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
          <span>→</span>
        </button>

      </div>

      {/* SUMMARY */}
      <div className="orders-summary">

        <div className="orders-summary-card">
          <div className="summary-icon">
            📦
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <div className="summary-icon delivered">
            ✓
          </div>

          <div>
            <span>Delivered</span>

            <strong>
              {
                orders.filter(
                  (o) => o.status === "Delivered"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <div className="summary-icon progress">
            🚚
          </div>

          <div>
            <span>In Progress</span>

            <strong>
              {
                orders.filter(
                  (o) =>
                    o.status !== "Delivered" &&
                    o.status !== "Cancelled"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="orders-summary-card">
          <div className="summary-icon money">
            ₹
          </div>

          <div>
            <span>Total Spent</span>

            <strong>
              {money(
                orders.reduce(
                  (sum, order) =>
                    sum +
                    Number(order.total || 0),
                  0
                )
              )}
            </strong>
          </div>
        </div>

      </div>

      {/* ORDERS */}
      <div className="orders-content">

        <div className="orders-content-heading">
          <div>
            <h2>Recent Orders</h2>

            <p>
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}{" "}
              found
            </p>
          </div>
        </div>

        <div className="orders-list">

          {orders.map((order) => {

            const step = getStatusStep(
              order.status
            );

            return (
              <article
                className="real-order-card"
                key={order._id}
              >

                {/* ORDER HEADER */}
                <div className="real-order-header">

                  <div className="order-number">

                    <span>ORDER PLACED</span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>

                  </div>

                  <div className="order-id">

                    <span>ORDER ID</span>

                    <strong>
                      {order._id}
                    </strong>

                  </div>

                  <div className="order-header-total">

                    <span>ORDER TOTAL</span>

                    <strong>
                      {money(order.total)}
                    </strong>

                  </div>

                  <div
                    className={`order-status-badge ${
                      order.status ===
                      "Delivered"
                        ? "status-delivered"
                        : ""
                    }`}
                  >
                    <span className="status-dot" />

                    {order.status ||
                      "Placed"}
                  </div>

                </div>

                {/* TRACKING */}
                <div className="order-tracking">

                  <div className="tracking-title">

                    <strong>
                      Order Status
                    </strong>

                    <span>
                      {order.status ||
                        "Order Placed"}
                    </span>

                  </div>

                  <div className="tracking-line">

                    <div
                      className={`tracking-progress progress-${step}`}
                    />

                    {[
                      {
                        icon: "✓",
                        label: "Placed",
                      },
                      {
                        icon: "✓",
                        label: "Confirmed",
                      },
                      {
                        icon: "🚚",
                        label: "Shipped",
                      },
                      {
                        icon: "📍",
                        label:
                          "Out for Delivery",
                      },
                      {
                        icon: "✓",
                        label: "Delivered",
                      },
                    ].map(
                      (item, index) => {

                        const active =
                          index < step;

                        return (
                          <div
                            className={`tracking-step ${
                              active
                                ? "active"
                                : ""
                            }`}
                            key={item.label}
                          >
                            <div className="tracking-circle">
                              {item.icon}
                            </div>

                            <span>
                              {item.label}
                            </span>
                          </div>
                        );
                      }
                    )}

                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="real-order-body">

                  <div className="ordered-products">

                    {order.items.map(
                      (item, index) => (

                        <div
                          className="ordered-product"
                          key={
                            item.productId ||
                            `${order._id}-${index}`
                          }
                        >

                          <div className="ordered-product-image">

                            {item.img ? (
                              <img
                                src={item.img}
                                alt={item.name}
                              />
                            ) : (
                              <span>
                                🛍️
                              </span>
                            )}

                          </div>

                          <div className="ordered-product-info">

                            <h3>
                              {item.name}
                            </h3>

                            <p>
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <strong>
                              {money(
                                item.price *
                                  item.quantity
                              )}
                            </strong>

                          </div>

                        </div>
                      )
                    )}

                  </div>

                  {/* DELIVERY */}
                  <div className="delivery-box">

                    <div className="delivery-icon">
                      📍
                    </div>

                    <div>

                      <span>
                        DELIVERING TO
                      </span>

                      <strong>
                        {order.address?.name}
                      </strong>

                      <p>
                        {
                          order.address
                            ?.address
                        }
                        ,{" "}
                        {
                          order.address?.city
                        }
                        ,{" "}
                        {
                          order.address?.state
                        }{" "}
                        -{" "}
                        {
                          order.address
                            ?.pincode
                        }
                      </p>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}
                <div className="real-order-footer">

                  <div className="payment-info">

                    <span>
                      PAYMENT
                    </span>

                    <strong>
                      {order.payment ===
                      "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </strong>

                  </div>

                  <div className="order-actions">

                    <button
                      className="order-action secondary"
                      onClick={() =>
                        navigate(
                          `/orders/${order._id}`
                        )
                      }
                    >
                      View Details
                    </button>

                    <button
                      className="order-action secondary"
                      onClick={() => {
                        order.items.forEach(
                          (item) =>
                            onAddToCart({
                              ...item,
                              id:
                                item.productId,
                            })
                        );
                      }}
                    >
                      Buy Again
                    </button>

                    <button
                      className="order-action primary"
                      onClick={() =>
                        alert(
                          "Order tracking will be available soon."
                        )
                      }
                    >
                      Track Order
                      <span>→</span>
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>

    </div>
  );
}
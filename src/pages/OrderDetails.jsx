import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const steps = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("shopora_token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
         console.log(
    "ORDER ID FROM API:",
    response.data.order._id
  );

  setOrder(response.data.order);
        }
      } catch (error) {
        console.error("Fetch order details error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("shopora_token");
          localStorage.removeItem("shopora_user");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="order-details-not-found">
        <div>
          <div className="not-found-icon">📦</div>

          <h1>Loading order...</h1>

          <p>
            Please wait while we fetch your order
            details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-not-found">
        <div>
          <div className="not-found-icon">
            {error ? "⚠️" : "📦"}
          </div>

          <h1>
            {error
              ? "Unable to load order"
              : "Order not found"}
          </h1>

          <p>
            {error ||
              "We couldn't find this order in your Shopora account."}
          </p>

          <button
            onClick={() => navigate("/orders")}
          >
            ← Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStep = Math.max(
    steps.indexOf(order.status),
    0
  );

  return (
    <div className="order-details-page">

      <div className="order-details-container">

        {/* TOP */}
        <div className="order-details-top">

          <button
            className="back-orders-btn"
            onClick={() => navigate("/orders")}
          >
            ← My Orders
          </button>

          <div>
            <span>ORDER DETAILS</span>

            <h1>{order._id}</h1>

            <p>
              Placed on{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

        </div>

        {/* STATUS */}
        <section className="details-card">

          <div className="details-card-heading">

            <div>
              <span className="details-label">
                ORDER STATUS
              </span>

              <h2>{order.status}</h2>
            </div>

            <div className="details-status-icon">
              ✓
            </div>

          </div>

          <div className="details-timeline">

            {steps.map((step, index) => {

              const active =
                index <= currentStep;

              return (
                <div
                  className={`details-step ${
                    active ? "active" : ""
                  }`}
                  key={step}
                >

                  <div className="details-step-circle">
                    {active
                      ? "✓"
                      : index + 1}
                  </div>

                  <span>{step}</span>

                  {index !==
                    steps.length - 1 && (
                    <div
                      className={`details-step-line ${
                        index < currentStep
                          ? "filled"
                          : ""
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

          <div className="tracking-message">

            <span>🚚</span>

            <div>

              <strong>
                {order.status ===
                "Delivered"
                  ? "Your order has been delivered."
                  : "Your order is on its way."}
              </strong>

              <p>
                We'll keep you updated about
                your delivery status.
              </p>

            </div>

          </div>

        </section>

        {/* MAIN GRID */}
        <div className="order-details-grid">

          {/* PRODUCTS */}
          <section className="details-card">

            <div className="details-section-title">

              <h2>Items in this order</h2>

              <span>
                {order.items.length}{" "}
                {order.items.length === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

            <div className="details-products">

              {order.items.map(
                (item, index) => (
                  <div
                    className="details-product"
                    key={
                      item.productId ||
                      `${order._id}-${index}`
                    }
                  >

                    <div className="details-product-image">

                      {item.img ? (
                        <img
                          src={item.img}
                          alt={item.name}
                        />
                      ) : (
                        <span>🛍️</span>
                      )}

                    </div>

                    <div className="details-product-info">

                      <h3>{item.name}</h3>

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

          </section>

          {/* DELIVERY */}
          <section className="details-card">

            <div className="details-section-title">
              <h2>Delivery address</h2>
            </div>

            <div className="details-address">

              <div className="address-icon">
                📍
              </div>

              <div>

                <strong>
                  {order.address?.name}
                </strong>

                <p>
                  {order.address?.address}
                </p>

                <p>
                  {order.address?.city},{" "}
                  {order.address?.state} -{" "}
                  {order.address?.pincode}
                </p>

                <p>
                  📞 {order.address?.phone}
                </p>

              </div>

            </div>

          </section>

          {/* PAYMENT */}
          <section className="details-card">

            <div className="details-section-title">
              <h2>Payment information</h2>
            </div>

            <div className="payment-detail">

              <div className="payment-detail-icon">
                {order.payment === "cod"
                  ? "💵"
                  : "💳"}
              </div>

              <div>

                <strong>
                  {order.payment === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </strong>

                <p>
                  Payment method used for
                  this order
                </p>

              </div>

            </div>

          </section>

          {/* PRICE */}
          <section className="details-card">

            <div className="details-section-title">
              <h2>Price details</h2>
            </div>

            <div className="price-details">

              <div>
                <span>Subtotal</span>

                <strong>
                  {money(order.subtotal)}
                </strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong>
                  {order.delivery === 0
                    ? "FREE"
                    : money(order.delivery)}
                </strong>
              </div>

              <div className="price-total">

                <span>Total Amount</span>

                <strong>
                  {money(order.total)}
                </strong>

              </div>

            </div>

          </section>

        </div>

        {/* HELP */}
        <section className="order-help">

          <div className="order-help-icon">
            ?
          </div>

          <div>

            <strong>
              Need help with this order?
            </strong>

            <p>
              Our customer support team is
              here to help you with your
              Shopora order.
            </p>

          </div>

          <button
            onClick={() => navigate("/help")}
          >
            Contact Support
          </button>

        </section>

      </div>
    </div>
  );
}
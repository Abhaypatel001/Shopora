import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Checkout({
  cart = [],
  user,
  onPlaceOrder = () => {},
}) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [payment, setPayment] =
    useState("cod");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // MOCK PAYMENT STATES
  // =====================================================

  const [showMockPayment, setShowMockPayment] =
    useState(false);

  const [mockMethod, setMockMethod] =
    useState("upi");

  const [mockPaying, setMockPaying] =
    useState(false);

  const [mockError, setMockError] =
    useState("");

  // =====================================================
  // TOTAL
  // =====================================================

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const delivery =
    subtotal >= 499 || subtotal === 0
      ? 0
      : 49;

  const total =
    subtotal + delivery;

  // =====================================================
  // UPDATE FIELD
  // =====================================================

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // CREATE SHOPORA ORDER
  // =====================================================

  const createShoporaOrder = async (
    token,
    paymentMethod,
    paymentDetails = {}
  ) => {
    const orderData = {
      items: cart.map((item) => ({
        productId: item.id,
        quantity: Number(
          item.quantity || 0
        ),
      })),

      address: form,

      payment: paymentMethod,

      // Demo payment information
      mockPayment:
        paymentDetails.mockPayment ||
        false,

      mockPaymentMethod:
        paymentDetails.mockPaymentMethod ||
        "",

      mockPaymentId:
        paymentDetails.mockPaymentId ||
        "",
    };

    const response =
      await api.post(
        "/orders",
        orderData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response;
  };

  // =====================================================
  // OPEN DEMO PAYMENT
  // =====================================================

  const openMockPayment = () => {
    setMockMethod("upi");
    setMockError("");
    setShowMockPayment(true);
  };

  // =====================================================
  // COMPLETE DEMO PAYMENT
  // =====================================================

  const completeMockPayment =
    async () => {
      try {
        setMockPaying(true);
        setMockError("");
        setError("");

        const token =
          localStorage.getItem(
            "shopora_token"
          );

        if (!token) {
          navigate("/login");
          return;
        }

        // Simulated payment processing
        await new Promise((resolve) =>
          setTimeout(resolve, 1500)
        );

        const response =
          await createShoporaOrder(
            token,
            "online",
            {
              mockPayment: true,

              mockPaymentMethod:
                mockMethod,

              mockPaymentId:
                `DEMO_${Date.now()}`,
            }
          );

        if (
          !response.data.success
        ) {
          throw new Error(
            response.data.message ||
              "Demo payment failed."
          );
        }

        setShowMockPayment(false);

        setMockError("");

        onPlaceOrder(
          response.data.order
        );

        navigate("/orders");
      } catch (error) {
        console.error(
          "Demo payment error:",
          error
        );

        setMockError(
          error.response?.data?.message ||
            error.message ||
            "Demo payment failed."
        );
      } finally {
        setMockPaying(false);
      }
    };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      navigate("/cart");
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      // ===============================================
      // ONLINE PAYMENT
      // ===============================================

      if (payment === "online") {
        setPlacingOrder(false);

        openMockPayment();

        return;
      }

      // ===============================================
      // CASH ON DELIVERY
      // ===============================================

      const response =
        await createShoporaOrder(
          token,
          "cod"
        );

      if (response.data.success) {
        onPlaceOrder(
          response.data.order
        );

        navigate("/orders");
      }
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =====================================================
  // EMPTY CART
  // =====================================================

  if (!cart.length) {
    return (
      <div className="checkout-empty">
        <h1>
          Your cart is empty
        </h1>

        <p>
          Add some products before checkout.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* BACK */}

        <button
          className="checkout-back"
          onClick={() =>
            navigate("/cart")
          }
        >
          ← Back to Cart
        </button>

        {/* HEADING */}

        <div className="checkout-heading">
          <span>
            SHOPORA CHECKOUT
          </span>

          <h1>
            Complete Your Order
          </h1>

          <p>
            Enter your delivery details and
            choose your payment method.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={placeOrder}
        >

          {/* =================================================
              MAIN
          ================================================= */}

          <div className="checkout-main">

            {/* DELIVERY ADDRESS */}

            <section className="checkout-box">

              <h2>
                Delivery Address
              </h2>

              <div className="checkout-grid">

                <div className="checkout-field">
                  <label>
                    Full Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    required
                    placeholder="Enter your name"
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    required
                    inputMode="numeric"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="checkout-field full">
                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={updateField}
                    required
                    rows="3"
                    placeholder="House no., street, area"
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    City
                  </label>

                  <input
                    name="city"
                    value={form.city}
                    onChange={updateField}
                    required
                    placeholder="City"
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    State
                  </label>

                  <input
                    name="state"
                    value={form.state}
                    onChange={updateField}
                    required
                    placeholder="State"
                  />
                </div>

                <div className="checkout-field">
                  <label>
                    PIN Code
                  </label>

                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={updateField}
                    required
                    inputMode="numeric"
                    maxLength="6"
                    pattern="[0-9]{6}"
                    placeholder="6-digit PIN"
                  />
                </div>

              </div>
            </section>

            {/* PAYMENT */}

            <section className="checkout-box">

              <div className="payment-heading">

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Choose how you want to pay.
                  </p>
                </div>

                <span className="payment-secure-badge">
                  🔒 Secure
                </span>

              </div>

              {/* COD */}

              <label
                className={`payment-option ${
                  payment === "cod"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={
                    payment === "cod"
                  }
                  onChange={(e) =>
                    setPayment(
                      e.target.value
                    )
                  }
                />

                <span className="payment-radio-ui">
                  <span />
                </span>

                <span className="payment-content">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <small>
                    Pay when your order arrives
                  </small>

                </span>

                <span className="payment-icon">
                  💵
                </span>

              </label>

              {/* ONLINE */}

              <label
                className={`payment-option ${
                  payment === "online"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={
                    payment === "online"
                  }
                  onChange={(e) =>
                    setPayment(
                      e.target.value
                    )
                  }
                />

                <span className="payment-radio-ui">
                  <span />
                </span>

                <span className="payment-content">

                  <strong>
                    Online Payment
                  </strong>

                  <small>
                    UPI, Cards, Net Banking &
                    Wallets
                  </small>

                  {payment ===
                    "online" && (
                    <em>
                      Demo Payment Mode
                    </em>
                  )}

                </span>

                <span className="payment-icon">
                  💳
                </span>

              </label>

            </section>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-items">

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <div>
                    <b>
                      {item.name}
                    </b>

                    <span>
                      Qty: {item.quantity}
                    </span>
                  </div>

                  <strong>
                    {money(
                      Number(
                        item.price || 0
                      ) *
                        Number(
                          item.quantity || 0
                        )
                    )}
                  </strong>

                </div>
              ))}

            </div>

            <div className="checkout-line">
              <span>
                Subtotal
              </span>

              <b>
                {money(subtotal)}
              </b>
            </div>

            <div className="checkout-line">
              <span>
                Delivery
              </span>

              <b>
                {delivery === 0
                  ? "FREE"
                  : money(delivery)}
              </b>
            </div>

            <div className="checkout-total">
              <span>
                Total
              </span>

              <strong>
                {money(total)}
              </strong>
            </div>

            <button
              type="submit"
              className={`place-order-btn ${
                payment === "online"
                  ? "online"
                  : ""
              }`}
              disabled={placingOrder}
            >
              {placingOrder
                ? "Processing..."
                : payment === "online"
                ? `Pay Securely · ${money(total)}`
                : `Place Order · ${money(total)}`}
            </button>

            <p className="checkout-secure">
              🔒 Secure checkout
            </p>

          </aside>

        </form>

        {/* =================================================
            DEMO PAYMENT MODAL
        ================================================= */}

        {showMockPayment && (
          <div className="mock-payment-overlay">

            <div className="mock-payment-modal">

              <button
                type="button"
                className="mock-payment-close"
                onClick={() =>
                  !mockPaying &&
                  setShowMockPayment(false)
                }
                disabled={mockPaying}
              >
                ×
              </button>

              <div className="mock-payment-brand">
                <span>
                  SHOPORA
                </span>

                <small>
                  Demo Payment
                </small>
              </div>

              <h2>
                Complete Demo Payment
              </h2>

              <p className="mock-payment-subtitle">
                This is a college/demo payment.
                No real money will be charged.
              </p>

              {/* TOTAL */}

              <div className="mock-payment-total">

                <span>
                  Order Total
                </span>

                <strong>
                  {money(total)}
                </strong>

              </div>

              {/* METHODS */}

              <div className="mock-methods">

                <button
                  type="button"
                  className={
                    mockMethod === "upi"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMockMethod("upi")
                  }
                  disabled={mockPaying}
                >
                  <span>
                    📱
                  </span>

                  <b>
                    UPI
                  </b>

                  <small>
                    Demo UPI
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    mockMethod === "card"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMockMethod("card")
                  }
                  disabled={mockPaying}
                >
                  <span>
                    💳
                  </span>

                  <b>
                    Card
                  </b>

                  <small>
                    Demo Card
                  </small>
                </button>

                <button
                  type="button"
                  className={
                    mockMethod ===
                    "netbanking"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setMockMethod(
                      "netbanking"
                    )
                  }
                  disabled={mockPaying}
                >
                  <span>
                    🏦
                  </span>

                  <b>
                    Net Banking
                  </b>

                  <small>
                    Demo Bank
                  </small>
                </button>

              </div>

              {/* DEMO CONTENT */}

              <div className="mock-payment-demo-box">

                {mockMethod === "upi" && (
                  <>
                    <span className="mock-demo-icon">
                      📱
                    </span>

                    <h3>
                      Demo UPI Payment
                    </h3>

                    <p>
                      Simulate a successful
                      UPI payment for your
                      college project.
                    </p>
                  </>
                )}

                {mockMethod === "card" && (
                  <>
                    <span className="mock-demo-icon">
                      💳
                    </span>

                    <h3>
                      Demo Card Payment
                    </h3>

                    <p>
                      No real card details are
                      required in demo mode.
                    </p>
                  </>
                )}

                {mockMethod ===
                  "netbanking" && (
                  <>
                    <span className="mock-demo-icon">
                      🏦
                    </span>

                    <h3>
                      Demo Net Banking
                    </h3>

                    <p>
                      Simulate a successful
                      bank payment.
                    </p>
                  </>
                )}

              </div>

              {/* ERROR */}

              {mockError && (
                <div className="mock-payment-error">
                  {mockError}
                </div>
              )}

              {/* PAY */}

              <button
                type="button"
                className="mock-pay-btn"
                onClick={
                  completeMockPayment
                }
                disabled={mockPaying}
              >
                {mockPaying
                  ? "Processing Demo Payment..."
                  : `Simulate Successful Payment · ${money(
                      total
                    )}`}
              </button>

              <p className="mock-payment-safe">
                🔒 Demo mode · No real payment is
                processed
              </p>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
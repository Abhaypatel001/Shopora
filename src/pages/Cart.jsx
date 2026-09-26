import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

function Cart({
  cart,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const navigate = useNavigate();

  // Latest stock from MongoDB
  const [stockMap, setStockMap] = useState({});
  const [stockLoading, setStockLoading] = useState(true);

  // ==========================================
  // FETCH LATEST PRODUCT STOCK
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setStockLoading(true);

        const response = await api.get("/products");

        if (response.data.success) {
          const map = {};

          (response.data.products || []).forEach(
            (product) => {
              map[product._id] = {
                stock: Number(product.stock || 0),
                price: Number(product.price || 0),
                name: product.name,
              };
            }
          );

          setStockMap(map);
        }
      } catch (error) {
        console.error(
          "Cart stock fetch error:",
          error
        );
      } finally {
        setStockLoading(false);
      }
    };

    if (cart.length > 0) {
      fetchProducts();
    } else {
      setStockLoading(false);
    }
  }, [cart.length]);

  // ==========================================
  // SUBTOTAL
  // ==========================================
  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [cart]);

  // ==========================================
  // DELIVERY
  // ==========================================
  const delivery =
    subtotal >= 499 || subtotal === 0
      ? 0
      : 49;

  const total = subtotal + delivery;

  // ==========================================
  // TOTAL ITEMS
  // ==========================================
  const totalItems = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ==========================================
  // EMPTY CART
  // ==========================================
  if (cart.length === 0) {
    return (
      <div className="cart-page cart-empty">
        <div className="cart-empty-icon">
          🛒
        </div>

        <h1>Your cart is empty</h1>

        <p>
          Looks like you haven't added anything
          to your cart yet.
        </p>

        <button
          className="cart-shop-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* ======================================
          HEADER
      ====================================== */}
      <div className="cart-header">
        <h1>Shopping Cart</h1>

        <span>
          {totalItems}{" "}
          {totalItems === 1
            ? "item"
            : "items"}
        </span>
      </div>

      <div className="cart-layout">

        {/* ====================================
            PRODUCTS
        ==================================== */}
        <div className="cart-items">

          {cart.map((item) => {
            const backendProduct =
              stockMap[item.id];

            const availableStock =
              backendProduct
                ? backendProduct.stock
                : null;

            const isOutOfStock =
              availableStock === 0;

            const maxReached =
              availableStock !== null &&
              item.quantity >=
                availableStock;

            return (
              <div
                className="cart-item"
                key={item.id}
              >

                {/* PRODUCT IMAGE */}
                <div
                  className="cart-item-image"
                  style={{
                    "--h": item.hue,
                  }}
                >
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.name}
                    />
                  ) : (
                    <span>🛍️</span>
                  )}
                </div>

                {/* PRODUCT INFO */}
                <div className="cart-item-info">

                  <h3>{item.name}</h3>

                  <p>
                    {item.category ||
                      item.kind}
                  </p>

                  <strong>
                    {money(item.price)}
                  </strong>

                  {/* STOCK INFO */}
                  {!stockLoading &&
                    availableStock !==
                      null && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "6px",
                        }}
                      >
                        {isOutOfStock ? (
                          <span>
                            Out of stock
                          </span>
                        ) : availableStock <=
                          5 ? (
                          <span>
                            Only{" "}
                            {availableStock}{" "}
                            left
                          </span>
                        ) : (
                          <span>
                            In stock
                          </span>
                        )}
                      </small>
                    )}

                  <div className="cart-actions">

                    {/* QUANTITY */}
                    <div className="quantity">

                      <button
                        onClick={() =>
                          onDecrease(
                            item.id
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                      >
                        −
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          onIncrease(
                            item.id
                          )
                        }
                        disabled={
                          isOutOfStock ||
                          maxReached
                        }
                        title={
                          maxReached
                            ? "Maximum available stock reached"
                            : ""
                        }
                      >
                        +
                      </button>

                    </div>

                    {/* REMOVE */}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        onRemove(item.id)
                      }
                    >
                      Remove
                    </button>

                  </div>

                  {/* STOCK WARNING */}
                  {maxReached &&
                    !isOutOfStock && (
                      <small
                        style={{
                          display: "block",
                          marginTop: "8px",
                        }}
                      >
                        Maximum available
                        quantity reached.
                      </small>
                    )}

                </div>

                {/* ITEM TOTAL */}
                <div className="cart-item-total">
                  {money(
                    Number(item.price || 0) *
                      Number(
                        item.quantity || 0
                      )
                  )}
                </div>

              </div>
            );
          })}

        </div>

        {/* ====================================
            SUMMARY
        ==================================== */}
        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              {money(subtotal)}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong>
              {delivery === 0
                ? "FREE"
                : money(delivery)}
            </strong>
          </div>

          <div className="summary-line" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              {money(total)}
            </strong>
          </div>

         <button
  type="button"
  className="cart-checkout-btn"
  onClick={() => navigate("/checkout")}
>
  <span>Proceed to Checkout</span>
  <span className="cart-checkout-arrow">→</span>
</button>

          <p className="delivery-note">
            🚚 Free delivery on orders over
            ₹499
          </p>

        </aside>

      </div>
    </div>
  );
}

export default Cart;
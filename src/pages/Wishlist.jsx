import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../Services/api";

export default function Wishlist() {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingId, setRemovingId] =
    useState(null);

  // =====================================================
  // NAVBAR WISHLIST COUNT UPDATE
  // =====================================================

  const notifyWishlistUpdated = () => {
    window.dispatchEvent(
      new Event("shoporaWishlistUpdated")
    );
  };

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  const loadWishlist = async () => {
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
          "/users/wishlist",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        const wishlist =
          response.data.wishlist || [];

        setProducts(wishlist);

        // Navbar count sync
        notifyWishlistUpdated();
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(
        "Wishlist error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load wishlist."
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadWishlist();
  }, []);

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeProduct =
    async (productId) => {
      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setRemovingId(productId);
        setError("");

        const response =
          await api.delete(
            `/users/wishlist/${productId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setProducts((prev) =>
            prev.filter(
              (item) =>
                String(item._id) !==
                String(productId)
            )
          );

          // Navbar wishlist count
          // immediately update
          notifyWishlistUpdated();
        }
      } catch (err) {
        console.error(
          "Remove wishlist error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to remove product."
        );
      } finally {
        setRemovingId(null);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-loading">
          <div className="wishlist-loading-icon">
            ♡
          </div>

          <h2>
            Loading your wishlist...
          </h2>

          <p>
            Please wait while we fetch
            your saved products.
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="wishlist-page">

      <div className="wishlist-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="wishlist-header">

          <div>
            <span className="wishlist-kicker">
              SHOPORA
            </span>

            <h1>
              Your Wishlist
            </h1>

            <p>
              Save products you love
              and come back to them
              anytime.
            </p>
          </div>

          <Link
            to="/"
            className="wishlist-back-btn"
          >
            ← Continue Shopping
          </Link>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="wishlist-error">
            {error}
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {products.length === 0 ? (
          <section className="wishlist-empty">

            <div className="wishlist-empty-icon">
              ♡
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              You haven't saved any
              products yet.
            </p>

            <Link
              to="/"
              className="wishlist-shop-btn"
            >
              Start Shopping
            </Link>

          </section>
        ) : (

          /* =================================================
             PRODUCTS
          ================================================= */

          <section className="wishlist-card">

            <div className="wishlist-card-header">

              <div>
                <span>
                  SAVED PRODUCTS
                </span>

                <h2>
                  {products.length}{" "}
                  {products.length === 1
                    ? "Product"
                    : "Products"}
                </h2>
              </div>

            </div>

            <div className="wishlist-grid">

              {products.map(
                (product) => (

                  <article
                    className="wishlist-product"
                    key={product._id}
                  >

                    {/* PRODUCT IMAGE */}

                    <div className="wishlist-image-box">

                      <img
                        src={
                          product.image ||
                          "/placeholder-product.png"
                        }
                        alt={
                          product.name ||
                          "Shopora product"
                        }
                        onError={(event) => {
                          event.currentTarget.src =
                            "/placeholder-product.png";
                        }}
                      />

                      <button
                        type="button"
                        className="wishlist-remove"
                        onClick={() =>
                          removeProduct(
                            product._id
                          )
                        }
                        disabled={
                          removingId ===
                          product._id
                        }
                        title="Remove from wishlist"
                      >
                        {removingId ===
                        product._id
                          ? "..."
                          : "×"}
                      </button>

                    </div>

                    {/* PRODUCT CONTENT */}

                    <div className="wishlist-product-body">

                      <span className="wishlist-category">
                        {product.category ||
                          "Product"}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      {/* RATING */}

                      <div className="wishlist-rating">
                        <span>
                          ★
                        </span>{" "}
                        {product.rating || 0}

                        <span>
                          ({product.reviews || 0})
                        </span>
                      </div>

                      {/* PRICE */}

                      <div className="wishlist-price">

                        <strong>
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                        {Number(
                          product.oldPrice || 0
                        ) >
                          Number(
                            product.price || 0
                          ) && (
                          <del>
                            ₹
                            {Number(
                              product.oldPrice
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </del>
                        )}

                      </div>

                      {/* VIEW PRODUCT */}

                      <Link
                        to={`/products/${product._id}`}
                        className="wishlist-view-btn"
                      >
                        View Product
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>

          </section>
        )}

      </div>
    </main>
  );
}
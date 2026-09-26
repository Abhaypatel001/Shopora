import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

export default function ProductDetails({
  onAddToCart = () => {},
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        if (response.data.success) {
          const backendProduct =
            response.data.product;

          const formattedProduct = {
            id: backendProduct._id,
            name: backendProduct.name,
            category: backendProduct.category,
            price: Number(
              backendProduct.price || 0
            ),
            old: Number(
              backendProduct.oldPrice || 0
            ),
            rating: Number(
              backendProduct.rating || 0
            ),
            reviews: Number(
              backendProduct.reviews || 0
            ),
            img: backendProduct.image || "",
            description:
              backendProduct.description || "",
            stock: Number(
              backendProduct.stock || 0
            ),
            section:
              backendProduct.section ||
              "trending",
            sortOrder: Number(
              backendProduct.sortOrder || 0
            ),
          };

          setProduct(formattedProduct);

          // =================================================
          // CHECK WISHLIST
          // =================================================

          const token =
            localStorage.getItem(
              "shopora_token"
            );

          if (token) {
            try {
              const wishlistResponse =
                await api.get(
                  "/users/wishlist",
                  {
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                    },
                  }
                );

              if (
                wishlistResponse.data.success
              ) {
                const wishlist =
                  wishlistResponse.data
                    .wishlist || [];

                const exists =
                  wishlist.some(
                    (item) =>
                      String(item._id) ===
                      String(backendProduct._id)
                  );

                setInWishlist(exists);
              }
            } catch (wishlistError) {
              console.error(
                "Wishlist check error:",
                wishlistError
              );

              setInWishlist(false);
            }
          } else {
            setInWishlist(false);
          }
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (
          err.response?.status === 404
        ) {
          setError("Product not found.");
        } else {
          setError(
            "Unable to load product. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =====================================================
  // WISHLIST COUNT UPDATE EVENT
  // =====================================================

  const notifyWishlistUpdated = () => {
    window.dispatchEvent(
      new Event("shoporaWishlistUpdated")
    );
  };

  // =====================================================
  // ADD / REMOVE WISHLIST
  // =====================================================

  const handleWishlist = async () => {
    const token =
      localStorage.getItem(
        "shopora_token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    if (!product?.id) {
      return;
    }

    try {
      setWishlistLoading(true);

      // ===============================================
      // REMOVE FROM WISHLIST
      // ===============================================

      if (inWishlist) {
        const response =
          await api.delete(
            `/users/wishlist/${product.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setInWishlist(false);

          // Navbar wishlist count refresh
          notifyWishlistUpdated();
        }
      }

      // ===============================================
      // ADD TO WISHLIST
      // ===============================================

      else {
        const response =
          await api.post(
            `/users/wishlist/${product.id}`,
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (response.data.success) {
          setInWishlist(true);

          // Navbar wishlist count refresh
          notifyWishlistUpdated();
        }
      }
    } catch (err) {
      console.error(
        "Wishlist action error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update wishlist."
      );
    } finally {
      setWishlistLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="pd-not-found">
        <h1>Loading Product...</h1>

        <p>
          Please wait while we fetch
          the product details.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !product) {
    return (
      <div className="pd-not-found">
        <h1>Product not found</h1>

        <p>
          {error ||
            "The product you're looking for doesn't exist."}
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // =====================================================
  // DISCOUNT
  // =====================================================

  const discount = product.old
    ? Math.round(
        (1 -
          product.price /
            product.old) *
          100
      )
    : 0;

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addProduct = () => {
    if (product.stock <= 0) {
      alert(
        "Sorry, this product is out of stock."
      );

      return;
    }

    onAddToCart(product);
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const buyNow = () => {
    if (product.stock <= 0) {
      alert(
        "Sorry, this product is out of stock."
      );

      return;
    }

    onAddToCart(product);

    navigate("/cart");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* BACK */}

        <button
          className="pd-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* PRODUCT */}

        <div className="pd-product">

          {/* IMAGE */}

          <div className="pd-image-box">
            <img
              src={product.img}
              alt={product.name}
            />

            {discount > 0 && (
              <span className="pd-discount">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* INFO */}

          <div className="pd-info">

            <div className="pd-brand">
              SHOPORA
            </div>

            <h1>
              {product.name}
            </h1>

            {/* RATING */}

            <div className="pd-rating">
              <span>★</span>

              <b>
                {product.rating}
              </b>

              <span>
                (
                {product.reviews.toLocaleString(
                  "en-IN"
                )}{" "}
                ratings)
              </span>
            </div>

            {/* PRICE */}

            <div className="pd-price">
              <strong>
                {money(product.price)}
              </strong>

              {product.old > 0 && (
                <s>
                  {money(product.old)}
                </s>
              )}

              {discount > 0 && (
                <span>
                  {discount}% off
                </span>
              )}
            </div>

            {/* DESCRIPTION */}

            <p className="pd-description">
              {product.description}
            </p>

            {/* BENEFITS */}

            <div className="pd-benefits">

              <div>
                <b>
                  🚚 Free Delivery
                </b>

                <span>
                  On orders over ₹499
                </span>
              </div>

              <div>
                <b>
                  ↩ Easy Returns
                </b>

                <span>
                  10-day return policy
                </span>
              </div>

              <div>
                <b>
                  🔒 Secure Payment
                </b>

                <span>
                  Safe & secure checkout
                </span>
              </div>

            </div>

            {/* STOCK */}

            <div className="pd-stock-info">
              {product.stock > 0 ? (
                <span>
                  ✓ In Stock (
                  {product.stock} available)
                </span>
              ) : (
                <span>
                  ✕ Out of Stock
                </span>
              )}
            </div>

            {/* ACTIONS */}

            <div className="pd-actions">

              <button
                className="pd-cart"
                onClick={addProduct}
                disabled={
                  product.stock <= 0
                }
              >
                {product.stock > 0
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>

              <button
                className="pd-buy"
                onClick={buyNow}
                disabled={
                  product.stock <= 0
                }
              >
                Buy Now
              </button>

            </div>

            {/* WISHLIST */}

            <button
              type="button"
              className={`pd-wishlist ${
                inWishlist
                  ? "active"
                  : ""
              }`}
              onClick={
                handleWishlist
              }
              disabled={
                wishlistLoading
              }
            >
              <span>
                {inWishlist
                  ? "♥"
                  : "♡"}
              </span>

              {wishlistLoading
                ? "Updating..."
                : inWishlist
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

          </div>
        </div>

        {/* PRODUCT DETAILS */}

        <section className="pd-details">
          <h2>
            Product Details
          </h2>

          <p>
            {product.description}
          </p>

          <div className="pd-specs">

            <div>
              <span>
                Product
              </span>

              <b>
                {product.name}
              </b>
            </div>

            <div>
              <span>
                Category
              </span>

              <b>
                {product.category}
              </b>
            </div>

            <div>
              <span>
                Rating
              </span>

              <b>
                {product.rating} / 5
              </b>
            </div>

            <div>
              <span>
                Reviews
              </span>

              <b>
                {product.reviews.toLocaleString(
                  "en-IN"
                )}
              </b>
            </div>

            <div>
              <span>
                Availability
              </span>

              <b
                className={
                  product.stock > 0
                    ? "pd-stock"
                    : "pd-out-stock"
                }
              >
                {product.stock > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </b>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
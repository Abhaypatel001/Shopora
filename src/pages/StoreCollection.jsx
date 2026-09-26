import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const PAGE_CONFIG = {
  deals: {
    title: "Today's Deals",
    kicker: "SHOPORA DEALS",
    description:
      "Discover products with exciting discounts and limited-time offers.",
  },

  "best-sellers": {
    title: "Best Sellers",
    kicker: "SHOPORA BEST SELLERS",
    description:
      "Explore the products customers are loving the most.",
  },

  new: {
    title: "New Releases",
    kicker: "SHOPORA NEW RELEASES",
    description:
      "Check out the latest products recently added to Shopora.",
  },
};

export default function StoreCollection() {
  const navigate = useNavigate();
  const { type } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const config =
    PAGE_CONFIG[type] ||
    PAGE_CONFIG.deals;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/products");

        if (response.data.success) {
          setProducts(
            response.data.products || []
          );
        }
      } catch (error) {
        console.error(
          "Collection products error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const list = [...products];

    if (type === "deals") {
      return list
        .filter(
          (product) =>
            Number(product.oldPrice || 0) >
            Number(product.price || 0)
        )
        .sort(
          (a, b) =>
            Number(b.oldPrice || 0) -
            Number(b.price || 0) -
            (Number(a.oldPrice || 0) -
              Number(a.price || 0))
        );
    }

    if (type === "best-sellers") {
      return list.sort((a, b) => {
        const reviewDifference =
          Number(b.reviews || 0) -
          Number(a.reviews || 0);

        if (reviewDifference !== 0) {
          return reviewDifference;
        }

        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      });
    }

    if (type === "new") {
      return list.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    return list;
  }, [products, type]);

  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="store-collection-page">

      {/* HEADER */}
      <div className="store-collection-header">

        <div>
          <div className="collection-breadcrumb">
            Home <span>›</span> {config.title}
          </div>

          <span className="collection-kicker">
            {config.kicker}
          </span>

          <h1>
            {config.title}
          </h1>

          <p>
            {config.description}
          </p>
        </div>

        <button
          className="collection-store-btn"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>

      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="collection-state">
          <div className="collection-state-icon">
            🛍️
          </div>
          <h2>Loading products...</h2>
          <p>
            Please wait while we fetch products.
          </p>
        </div>
      ) : error ? (
        <div className="collection-state">
          <div className="collection-state-icon">
            ⚠️
          </div>

          <h2>
            Unable to load products
          </h2>

          <p>{error}</p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="collection-state">
          <div className="collection-state-icon">
            📦
          </div>

          <h2>
            No products found
          </h2>

          <p>
            There are no products available
            in this section right now.
          </p>

          <button
            onClick={() => navigate("/")}
          >
            Browse Shopora
          </button>
        </div>
      ) : (
        <>
          <div className="collection-results">
            <div>
              <h2>
                {config.title}
              </h2>

              <p>
                {visibleProducts.length}{" "}
                {visibleProducts.length === 1
                  ? "product"
                  : "products"}{" "}
                available
              </p>
            </div>
          </div>

          <div className="collection-grid">

            {visibleProducts.map(
              (product) => {
                const price = Number(
                  product.price || 0
                );

                const oldPrice = Number(
                  product.oldPrice || 0
                );

                const discount =
                  oldPrice > price
                    ? Math.round(
                        ((oldPrice - price) /
                          oldPrice) *
                          100
                      )
                    : 0;

                return (
                  <article
                    key={product._id}
                    className="collection-card"
                    onClick={() =>
                      openProduct(
                        product._id
                      )
                    }
                  >

                    <div className="collection-image">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="collection-no-image">
                          🛍️
                        </div>
                      )}

                      {discount > 0 && (
                        <span className="collection-discount">
                          {discount}% OFF
                        </span>
                      )}

                      {Number(
                        product.stock || 0
                      ) === 0 && (
                        <span className="collection-stock">
                          Out of Stock
                        </span>
                      )}

                    </div>

                    <div className="collection-info">

                      <span className="collection-category">
                        {product.category}
                      </span>

                      <h3>
                        {product.name}
                      </h3>

                      <div className="collection-rating">

                        <span>★</span>

                        <strong>
                          {Number(
                            product.rating || 0
                          ).toFixed(1)}
                        </strong>

                        <small>
                          (
                          {Number(
                            product.reviews || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                          )
                        </small>

                      </div>

                      <div className="collection-price">

                        <strong>
                          {money(price)}
                        </strong>

                        {oldPrice > price && (
                          <del>
                            {money(oldPrice)}
                          </del>
                        )}

                      </div>

                      <button
                        className="collection-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProduct(
                            product._id
                          );
                        }}
                      >
                        View Product →
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        </>
      )}

    </div>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../Services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const slugToCategory = (slug) => {
  return decodeURIComponent(slug || "")
    .replace(/-/g, " ")
    .trim()
    .toLowerCase();
};

const categoryMatches = (productCategory, slug) => {
  const productValue = String(productCategory || "")
    .trim()
    .toLowerCase();

  const categorySlug = slugToCategory(slug);

  // Home & Kitchen -> home
  if (
    categorySlug === "home" ||
    categorySlug === "home kitchen"
  ) {
    return (
      productValue.includes("home") ||
      productValue.includes("kitchen")
    );
  }

  return (
    productValue === categorySlug ||
    productValue.includes(categorySlug) ||
    categorySlug.includes(productValue)
  );
};

export default function Category() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");

        if (response.data.success) {
          setProducts(
            response.data.products || []
          );
        }
      } catch (error) {
        console.error(
          "Fetch category products error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load category products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      categoryMatches(
        product.category,
        category
      )
    );
  }, [products, category]);

  const categoryTitle = useMemo(() => {
    const value = slugToCategory(category);

    if (value === "home" || value === "home kitchen") {
      return "Home & Kitchen";
    }

    return value
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }, [category]);

  const openProduct = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="category-page">

      {/* HEADER */}
      <div className="category-header">

        <div>
          <div className="category-breadcrumb">
            Home <span>›</span> {categoryTitle}
          </div>

          <span className="category-kicker">
            SHOPORA CATEGORY
          </span>

          <h1>
            {categoryTitle}
          </h1>

          <p>
            Explore the latest products in{" "}
            {categoryTitle}.
          </p>
        </div>

        <button
          className="category-back-btn"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>

      </div>


      {/* CONTENT */}
      <div className="category-content">

        {loading ? (
          <div className="category-state">
            <div className="category-state-icon">
              🛍️
            </div>

            <h2>
              Loading products...
            </h2>

            <p>
              Please wait while we fetch products.
            </p>
          </div>

        ) : error ? (

          <div className="category-state">
            <div className="category-state-icon">
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

        ) : filteredProducts.length === 0 ? (

          <div className="category-state">
            <div className="category-state-icon">
              📦
            </div>

            <h2>
              No products found
            </h2>

            <p>
              There are currently no products in{" "}
              {categoryTitle}.
            </p>

            <button
              onClick={() => navigate("/")}
            >
              Browse All Products
            </button>
          </div>

        ) : (

          <>
            <div className="category-results-heading">

              <div>
                <h2>
                  {categoryTitle} Products
                </h2>

                <p>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}{" "}
                  available
                </p>
              </div>

            </div>

            <div className="category-grid">

              {filteredProducts.map(
                (product) => {

                  const discount =
                    product.oldPrice >
                      product.price &&
                    product.oldPrice > 0
                      ? Math.round(
                          ((product.oldPrice -
                            product.price) /
                            product.oldPrice) *
                            100
                        )
                      : 0;

                  return (
                    <article
                      className="category-product-card"
                      key={product._id}
                      onClick={() =>
                        openProduct(
                          product._id
                        )
                      }
                    >

                      <div className="category-product-image">

                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        ) : (
                          <div className="category-no-image">
                            🛍️
                          </div>
                        )}

                        {discount > 0 && (
                          <span className="category-discount">
                            {discount}% OFF
                          </span>
                        )}

                        {Number(
                          product.stock || 0
                        ) === 0 && (
                          <span className="category-out-stock">
                            Out of Stock
                          </span>
                        )}

                      </div>

                      <div className="category-product-info">

                        <span className="category-product-type">
                          {product.category}
                        </span>

                        <h3>
                          {product.name}
                        </h3>

                        <div className="category-rating">
                          <span>
                            ★
                          </span>

                          <b>
                            {Number(
                              product.rating || 0
                            ).toFixed(1)}
                          </b>

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

                        <div className="category-price-row">

                          <strong>
                            {money(product.price)}
                          </strong>

                          {Number(
                            product.oldPrice || 0
                          ) > product.price && (
                            <del>
                              {money(
                                product.oldPrice
                              )}
                            </del>
                          )}

                        </div>

                        <button
                          className="category-view-btn"
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

    </div>
  );
}
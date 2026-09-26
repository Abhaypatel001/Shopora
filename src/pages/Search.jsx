import { useEffect, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import api from "../Services/api";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function Search({
  onAddToCart = () => {},
}) {
  const navigate = useNavigate();

  const [params, setParams] =
    useSearchParams();

  // ==========================================
  // URL SEARCH PARAMETERS
  // ==========================================
  const query = params.get("q") || "";

  const categoryParam =
    params.get("c") || "all";

  const category =
    categoryParam.toLowerCase();

  // ==========================================
  // STATE
  // ==========================================
  const [products, setProducts] = useState([]);

  const [externalProducts, setExternalProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [externalLoading, setExternalLoading] =
    useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // FETCH SHOPORA PRODUCTS
  // ==========================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get("/products");

        if (response.data.success) {
          const formattedProducts =
            (
              response.data.products || []
            ).map((product) => ({
              id: product._id,
              name: product.name || "",
              category:
                product.category || "",

              price: Number(
                product.price || 0
              ),

              old: Number(
                product.oldPrice || 0
              ),

              rating: Number(
                product.rating || 0
              ),

              reviews: Number(
                product.reviews || 0
              ),

              img:
                product.image || "",

              description:
                product.description || "",

              stock: Number(
                product.stock || 0
              ),

              external: false,
            }));

          setProducts(
            formattedProducts
          );
        } else {
          setError(
            "Failed to load products."
          );
        }
      } catch (err) {
        console.error(
          "Search products error:",
          err
        );

        setError(
          "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // FETCH EXTERNAL PRODUCTS
  // ==========================================
  useEffect(() => {
    const searchExternalProducts =
      async () => {
        const searchText =
          query.trim();

        if (!searchText) {
          setExternalProducts([]);
          return;
        }

        try {
          setExternalLoading(true);

          const response =
            await api.get(
              "/external-products/search",
              {
                params: {
                  q: searchText,
                },
              }
            );

          if (
            response.data?.success
          ) {
            const formattedExternal =
              (
                response.data.products ||
                []
              ).map((product) => ({
                id:
                  product.id ||
                  `external-${Date.now()}-${Math.random()}`,

                name:
                  product.name || "",

                category:
                  product.category ||
                  "External Product",

                price: Number(
                  product.price || 0
                ),

                old: Number(
                  product.old || 0
                ),

                rating: Number(
                  product.rating || 0
                ),

                reviews: Number(
                  product.reviews || 0
                ),

                img:
                  product.img || "",

                source:
                  product.source ||
                  "External Store",

                productLink:
                  product.productLink ||
                  "",

                delivery:
                  product.delivery ||
                  "",

                external: true,
              }));

            setExternalProducts(
              formattedExternal
            );
          } else {
            setExternalProducts([]);
          }
        } catch (err) {
          console.error(
            "External search error:",
            err
          );

          setExternalProducts([]);
        } finally {
          setExternalLoading(false);
        }
      };

    searchExternalProducts();
  }, [query]);

  // ==========================================
  // FILTER SHOPORA PRODUCTS
  // ==========================================
  const filteredProducts =
    useMemo(() => {
      const searchText =
        query.trim().toLowerCase();

      return products.filter(
        (product) => {
          const productName =
            product.name.toLowerCase();

          const productCategory =
            product.category.toLowerCase();

          const matchesQuery =
            !searchText ||
            productName.includes(
              searchText
            ) ||
            productCategory.includes(
              searchText
            );

          const matchesCategory =
            category === "all" ||
            productCategory === category;

          return (
            matchesQuery &&
            matchesCategory
          );
        }
      );
    }, [
      products,
      query,
      category,
    ]);

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================
  const setCategory = (value) => {
    const next =
      new URLSearchParams();

    if (
      value.toLowerCase() !== "all"
    ) {
      next.set("c", value);
    }

    next.delete("q");

    setParams(next);
  };

  // ==========================================
  // CLEAR SEARCH
  // ==========================================
  const clearSearch = () => {
    setParams({});
  };

  // ==========================================
  // SHOPORA PRODUCT DETAILS
  // ==========================================
  const openProduct = (
    productId
  ) => {
    navigate(
      `/product/${productId}`
    );
  };

  // ==========================================
  // EXTERNAL PRODUCT DETAILS
  // ==========================================
  const openExternalProduct = (
    product
  ) => {
    if (!product) {
      return;
    }

    // Product ko sessionStorage mein save
    // kar rahe hain so refresh par bhi
    // detail page recover kar sake.
    try {
      sessionStorage.setItem(
        `shopora_external_product_${product.id}`,
        JSON.stringify(product)
      );
    } catch (storageError) {
      console.error(
        "External product storage error:",
        storageError
      );
    }

    navigate(
      `/external-product/${encodeURIComponent(
        String(product.id)
      )}`,
      {
        state: {
          product,
        },
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="search-page">
        <div className="search-container">
          <div className="search-empty">
            <div className="search-empty-icon">
              🔄
            </div>

            <h2>
              Loading Products...
            </h2>

            <p>
              Please wait while we fetch
              products from Shopora.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // API ERROR
  // ==========================================
  if (error) {
    return (
      <div className="search-page">
        <div className="search-container">
          <div className="search-empty">
            <div className="search-empty-icon">
              ⚠️
            </div>

            <h2>
              Unable to Load Products
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
        </div>
      </div>
    );
  }

  // ==========================================
  // TOTAL RESULTS
  // ==========================================
  const totalResults =
    filteredProducts.length +
    externalProducts.length;

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="search-page">
      <div className="search-container">

        {/* ======================================
            HEADING
        ====================================== */}
        <div className="search-heading">
          <div>
            <span className="search-eyebrow">
              SHOPORA SEARCH
            </span>

            <h1>
              {query
                ? `Results for "${query}"`
                : "Explore Products"}
            </h1>

            <p>
              {totalResults} product
              {totalResults !== 1
                ? "s"
                : ""}{" "}
              found
            </p>
          </div>
        </div>

        {/* ======================================
            SEARCH LAYOUT
        ====================================== */}
        <div className="search-layout">

          {/* ====================================
              FILTER
          ==================================== */}
          <aside className="search-filter">
            <h3>
              Categories
            </h3>

            {/* ALL */}
            <button
              className={
                category === "all"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("all")
              }
            >
              All Products
            </button>

            {/* ELECTRONICS */}
            <button
              className={
                category ===
                "electronics"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Electronics"
                )
              }
            >
              Electronics
            </button>

            {/* FASHION */}
            <button
              className={
                category ===
                "fashion"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Fashion"
                )
              }
            >
              Fashion
            </button>

            {/* BOOKS */}
            <button
              className={
                category === "books"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("Books")
              }
            >
              Books
            </button>

            {/* HOME */}
            <button
              className={
                category === "home"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("Home")
              }
            >
              Home
            </button>

            {/* WATCHES */}
            <button
              className={
                category ===
                "watches"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Watches"
                )
              }
            >
              Watches
            </button>

            {/* FOOTWEAR */}
            <button
              className={
                category ===
                "footwear"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory(
                  "Footwear"
                )
              }
            >
              Footwear
            </button>

            {/* BAGS */}
            <button
              className={
                category === "bags"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("Bags")
              }
            >
              Bags
            </button>

            {/* AUDIO */}
            <button
              className={
                category === "audio"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCategory("Audio")
              }
            >
              Audio
            </button>
          </aside>

          {/* ====================================
              RESULTS
          ==================================== */}
          <section className="search-results">

            {/* =================================
                SHOPORA RESULTS
            ================================== */}
            {filteredProducts.length >
              0 && (
              <>
                <div className="search-section-title">
                  <div>
                    <span>
                      SHOPORA
                    </span>

                    <h2>
                      Products from Shopora
                    </h2>
                  </div>

                  <strong>
                    {
                      filteredProducts.length
                    }
                  </strong>
                </div>

                <div className="search-grid">

                  {filteredProducts.map(
                    (product) => {
                      const discount =
                        product.old > 0
                          ? Math.round(
                              (1 -
                                product.price /
                                  product.old) *
                                100
                            )
                          : 0;

                      return (
                        <article
                          className="search-card"
                          key={product.id}
                        >
                          {/* PRODUCT IMAGE */}
                          <div
                            className="search-card-image"
                            onClick={() =>
                              openProduct(
                                product.id
                              )
                            }
                          >
                            <img
                              src={
                                product.img
                              }
                              alt={
                                product.name
                              }
                            />

                            {discount >
                              0 && (
                              <span>
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* PRODUCT BODY */}
                          <div className="search-card-body">

                            <small>
                              {
                                product.category
                              }
                            </small>

                            <h3
                              onClick={() =>
                                openProduct(
                                  product.id
                                )
                              }
                            >
                              {product.name}
                            </h3>

                            {/* RATING */}
                            <div className="search-rating">
                              ★{" "}
                              {
                                product.rating
                              }

                              <span>
                                (
                                {product.reviews.toLocaleString(
                                  "en-IN"
                                )}
                                )
                              </span>
                            </div>

                            {/* PRICE */}
                            <div className="search-price">
                              <strong>
                                {money(
                                  product.price
                                )}
                              </strong>

                              {product.old >
                                0 && (
                                <s>
                                  {money(
                                    product.old
                                  )}
                                </s>
                              )}
                            </div>

                            {/* STOCK */}
                            {product.stock <=
                              0 && (
                              <small>
                                Out of Stock
                              </small>
                            )}

                            {/* ADD TO CART */}
                            <button
                              className="search-cart-btn"
                              disabled={
                                product.stock <=
                                0
                              }
                              onClick={() =>
                                onAddToCart(
                                  product
                                )
                              }
                            >
                              {product.stock >
                              0
                                ? "Add to Cart"
                                : "Out of Stock"}
                            </button>

                          </div>
                        </article>
                      );
                    }
                  )}

                </div>
              </>
            )}

            {/* =================================
                EXTERNAL RESULTS
            ================================== */}
            {query && (
              <div className="external-results-section">

                <div className="search-section-title external-section-heading">

                  <div>
                    <span>
                      EXTERNAL SHOPPING
                    </span>

                    <h2>
                      More products from the web
                    </h2>

                    <p>
                      These products are from external stores.
                    </p>
                  </div>

                  {externalProducts.length >
                    0 && (
                    <strong>
                      {
                        externalProducts.length
                      }
                    </strong>
                  )}

                </div>

                {externalLoading ? (
                  <div className="external-loading">

                    <div className="external-spinner">
                      ↻
                    </div>

                    <p>
                      Searching more products...
                    </p>

                  </div>
                ) : externalProducts.length >
                  0 ? (
                  <div className="search-grid">

                    {externalProducts.map(
                      (product) => {
                        const discount =
                          product.old >
                          0
                            ? Math.round(
                                (1 -
                                  product.price /
                                    product.old) *
                                  100
                              )
                            : 0;

                        return (
                          <article
                            className="search-card external-product-card"
                            key={
                              product.id
                            }
                          >

                            <div className="external-badge">
                              🌐 External
                            </div>

                            {/* IMAGE */}
                            <div
                              className="search-card-image"
                              onClick={() =>
                                openExternalProduct(
                                  product
                                )
                              }
                            >

                              {product.img ? (
                                <img
                                  src={
                                    product.img
                                  }
                                  alt={
                                    product.name
                                  }
                                  onError={(
                                    e
                                  ) => {
                                    e.currentTarget.style.display =
                                      "none";
                                  }}
                                />
                              ) : (
                                <div className="external-image-placeholder">
                                  🛍️
                                </div>
                              )}

                              {discount >
                                0 && (
                                <span>
                                  {discount}% OFF
                                </span>
                              )}

                            </div>

                            {/* BODY */}
                            <div className="search-card-body">

                              <small>
                                {product.source ||
                                  "External Store"}
                              </small>

                              <h3
                                onClick={() =>
                                  openExternalProduct(
                                    product
                                  )
                                }
                              >
                                {
                                  product.name
                                }
                              </h3>

                              {/* RATING */}
                              {product.rating >
                                0 && (
                                <div className="search-rating">

                                  ★{" "}
                                  {
                                    product.rating
                                  }

                                  {product.reviews >
                                    0 && (
                                    <span>
                                      (
                                      {product.reviews.toLocaleString(
                                        "en-IN"
                                      )}
                                      )
                                    </span>
                                  )}

                                </div>
                              )}

                              {/* PRICE */}
                              <div className="search-price">

                                <strong>
                                  {product.price >
                                  0
                                    ? money(
                                        product.price
                                      )
                                    : "View Price"}
                                </strong>

                                {product.old >
                                  0 && (
                                  <s>
                                    {money(
                                      product.old
                                    )}
                                  </s>
                                )}

                              </div>

                              {/* DELIVERY */}
                              {product.delivery && (
                                <small className="external-delivery-text">
                                  🚚{" "}
                                  {product.delivery}
                                </small>
                              )}

                              {/* VIEW */}
                              <button
                                className="search-cart-btn external-view-btn"
                                onClick={() =>
                                  openExternalProduct(
                                    product
                                  )
                                }
                              >
                                View Product
                              </button>

                            </div>
                          </article>
                        );
                      }
                    )}

                  </div>
                ) : filteredProducts.length ===
                  0 ? (
                  <div className="search-empty">

                    <div className="search-empty-icon">
                      🔍
                    </div>

                    <h2>
                      No products found
                    </h2>

                    <p>
                      We couldn't find this product
                      right now.
                    </p>

                    <button
                      onClick={
                        clearSearch
                      }
                    >
                      Clear Search
                    </button>

                  </div>
                ) : null}

              </div>
            )}

            {/* =================================
                NO QUERY
            ================================== */}
            {!query &&
              filteredProducts.length ===
                0 && (
                <div className="search-empty">

                  <div className="search-empty-icon">
                    🔍
                  </div>

                  <h2>
                    No products found
                  </h2>

                  <p>
                    Try another search term or
                    choose a different category.
                  </p>

                  <button
                    onClick={clearSearch}
                  >
                    Clear Search
                  </button>

                </div>
              )}

          </section>
        </div>
      </div>
    </div>
  );
}
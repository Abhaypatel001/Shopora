import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function ExternalProductDetails() {
  const navigate = useNavigate();

  const location = useLocation();

  const { id } = useParams();

  const [product, setProduct] =
    useState(
      location.state?.product || null
    );

  // ==========================================
  // RESTORE PRODUCT AFTER REFRESH
  // ==========================================
  useEffect(() => {
    if (product) {
      return;
    }

    try {
      const stored =
        sessionStorage.getItem(
          `shopora_external_product_${id}`
        );

      if (stored) {
        setProduct(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.error(
        "External product restore error:",
        error
      );
    }
  }, [id, product]);

  // ==========================================
  // BUY FROM ORIGINAL STORE
  // ==========================================
  const buyFromStore = () => {
    if (!product?.productLink) {
      return;
    }

    window.open(
      product.productLink,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==========================================
  // PRODUCT NOT FOUND
  // ==========================================
  if (!product) {
    return (
      <div className="external-detail-page">
        <div className="external-detail-not-found">

          <div className="external-detail-icon">
            🔍
          </div>

          <h1>
            Product Not Available
          </h1>

          <p>
            This external product information
            is no longer available.
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
          >
            ← Go Back
          </button>

        </div>
      </div>
    );
  }

  const discount =
    product.old > 0
      ? Math.round(
          (1 -
            Number(product.price) /
              Number(product.old)) *
            100
        )
      : 0;

  return (
    <div className="external-detail-page">

      <div className="external-detail-container">

        {/* =====================================
            BACK
        ====================================== */}
        <button
          className="external-detail-back"
          onClick={() =>
            navigate(-1)
          }
        >
          ← Back to Search
        </button>

        {/* =====================================
            PRODUCT CARD
        ====================================== */}
        <div className="external-detail-card">

          {/* IMAGE */}
          <div className="external-detail-image-wrap">

            <div className="external-detail-badge">
              🌐 External Product
            </div>

            {discount > 0 && (
              <div className="external-detail-discount">
                {discount}% OFF
              </div>
            )}

            {product.img ? (
              <img
                className="external-detail-image"
                src={product.img}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <div className="external-detail-image-placeholder">
                🛍️
              </div>
            )}

          </div>

          {/* INFO */}
          <div className="external-detail-info">

            <span className="external-detail-label">
              {product.source ||
                "External Store"}
            </span>

            <h1>
              {product.name}
            </h1>

            {/* RATING */}
            {product.rating > 0 && (
              <div className="external-detail-rating">

                <span>
                  ★ {product.rating}
                </span>

                {product.reviews > 0 && (
                  <small>
                    (
                    {Number(
                      product.reviews
                    ).toLocaleString(
                      "en-IN"
                    )}{" "}
                    reviews)
                  </small>
                )}

              </div>
            )}

            {/* PRICE */}
            <div className="external-detail-price">

              {product.price > 0 ? (
                <strong>
                  {money(product.price)}
                </strong>
              ) : (
                <strong>
                  View Price
                </strong>
              )}

              {product.old > 0 && (
                <s>
                  {money(product.old)}
                </s>
              )}

            </div>

            {/* DELIVERY */}
            {product.delivery && (
              <div className="external-detail-delivery">
                🚚{" "}
                {product.delivery}
              </div>
            )}

            {/* INFO */}
            <div className="external-detail-info-box">

              <div>
                <span>Store</span>
                <strong>
                  {product.source ||
                    "External Store"}
                </strong>
              </div>

              <div>
                <span>Availability</span>
                <strong>
                  Check on store
                </strong>
              </div>

              <div>
                <span>Shopora</span>
                <strong>
                  External listing
                </strong>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="external-detail-actions">

              <button
                className="external-buy-btn"
                onClick={buyFromStore}
                disabled={
                  !product.productLink
                }
              >
                Buy from Store ↗
              </button>

              <button
                className="external-back-btn"
                onClick={() =>
                  navigate(-1)
                }
              >
                Continue Searching
              </button>

            </div>

            {/* NOTE */}
            <div className="external-detail-note">
              <span>ⓘ</span>

              <p>
                This product is listed from an
                external shopping source. Price,
                availability and delivery may
                change on the original store.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
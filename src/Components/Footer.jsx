
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "🚚",
    title: "Fast & Reliable Delivery",
    text: "Quick delivery across India",
  },
  {
    icon: "🔒",
    title: "100% Secure Payments",
    text: "Protected & trusted checkout",
  },
  {
    icon: "↩",
    title: "Easy Returns",
    text: "Simple & hassle-free returns",
  },
  {
    icon: "💬",
    title: "Dedicated Support",
    text: "We're here whenever you need us",
  },
];

const shopLinks = [
  ["Today's Deals", "/deals"],
  ["Best Sellers", "/best-sellers"],
  ["New Releases", "/new"],
  ["Mobiles", "/c/mobiles"],
  ["Fashion", "/c/fashion"],
  ["Electronics", "/c/electronics"],
  ["Home & Kitchen", "/c/home-kitchen"],
];

export default function Footer({ user = null }) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="shopora-footer">

      {/* =====================================================
          BENEFITS
      ===================================================== */}
      <section
        className="footer-benefits"
        aria-label="Why shop with Shopora"
      >
        <div className="footer-container footer-benefits-grid">
          {benefits.map((item) => (
            <div
              className="footer-benefit"
              key={item.title}
            >
              <div
                className="footer-benefit-icon"
                aria-hidden="true"
              >
                {item.icon}
              </div>

              <div className="footer-benefit-content">
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* =====================================================
          NEWSLETTER
      ===================================================== */}
      <section className="footer-newsletter">
        <div className="footer-container newsletter-inner">

          <div className="newsletter-content">
            <span className="newsletter-eyebrow">
              STAY IN THE LOOP
            </span>

            <h2>
              Get the latest deals
              <span> straight to your inbox.</span>
            </h2>

            <p>
              New arrivals, exclusive offers and shopping inspiration —
              delivered without the noise.
            </p>
          </div>

          <form
            className="newsletter-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="newsletter-input-wrap">
              <span aria-hidden="true">✉</span>

              <input
                type="email"
                placeholder="Enter your email address"
                aria-label="Email address"
                autoComplete="email"
              />
            </div>

            <button type="submit">
              Subscribe
              <span aria-hidden="true">→</span>
            </button>
          </form>

        </div>
      </section>


      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}
      <section className="footer-main">
        <div className="footer-container footer-main-grid">

          {/* BRAND */}
          <div className="footer-brand-column">

            <Link
              to="/"
              className="footer-logo"
              aria-label="Shopora Home"
            >
              shopora<span>.</span>
            </Link>

            <p className="footer-brand-text">
              Smart shopping, better choices and a smoother way
              to shop online.
            </p>

            <a
              className="footer-contact"
              href="mailto:support@shopora.com"
            >
              support@shopora.com
            </a>

            {/* SOCIAL */}
            <div className="footer-social">
              <span>Follow us</span>

              <div className="footer-social-icons">

                <a
                  href="#instagram"
                  aria-label="Instagram"
                >
                  ◎
                </a>

                <a
                  href="#facebook"
                  aria-label="Facebook"
                >
                  f
                </a>

                <a
                  href="#x"
                  aria-label="X"
                >
                  𝕏
                </a>

                <a
                  href="#youtube"
                  aria-label="YouTube"
                >
                  ▶
                </a>

              </div>
            </div>

          </div>


          {/* SHOP */}
          <div className="footer-column">
            <h3>Shop</h3>

            {shopLinks.map(([label, path]) => (
              <Link
                key={label}
                to={path}
              >
                {label}
              </Link>
            ))}
          </div>


          {/* ACCOUNT */}
          <div className="footer-column">
            <h3>Your account</h3>

            {user ? (
              <>
                <Link to="/account">
                  Your Account
                </Link>

                <Link to="/orders">
                  Your Orders
                </Link>

                <Link to="/wishlist">
                  Wishlist
                </Link>

                <Link to="/addresses">
                  Saved Addresses
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  Sign In
                </Link>

                <Link to="/register">
                  Create Account
                </Link>

                <Link to="/login">
                  Your Orders
                </Link>

                <Link to="/login">
                  Wishlist
                </Link>
              </>
            )}
          </div>


          {/* HELP */}
          <div className="footer-column">
            <h3>Help &amp; support</h3>

            <Link to="/help">
              Customer Service
            </Link>

            <Link to="/orders">
              Track Orders
            </Link>

            <Link to="/addresses">
              Delivery Addresses
            </Link>

            <a href="#returns">
              Returns &amp; Refunds
            </a>

            <a href="#payments">
              Payment Help
            </a>

            <a href="mailto:support@shopora.com">
              Contact Us
            </a>
          </div>


          {/* ADMIN */}
          {user?.role === "admin" && (
            <div className="footer-column footer-admin-column">
              <h3>Admin</h3>

              <Link to="/admin">
                Dashboard
              </Link>

              <Link to="/admin/products">
                Manage Products
              </Link>

              <Link to="/admin/orders">
                Manage Orders
              </Link>

              <Link to="/admin/users">
                Manage Users
              </Link>

              <Link to="/admin/support">
                Customer Support
              </Link>
            </div>
          )}

        </div>
      </section>


      {/* =====================================================
          TRUST + PAYMENT STRIP
      ===================================================== */}
      <section className="footer-trust-strip">
        <div className="footer-container trust-strip-inner">

          <div className="trust-item">
            <span aria-hidden="true">✓</span>

            <div>
              <strong>Secure Checkout</strong>
              <small>Encrypted payments</small>
            </div>
          </div>


          <div className="trust-item">
            <span aria-hidden="true">✓</span>

            <div>
              <strong>Genuine Products</strong>
              <small>Quality you can trust</small>
            </div>
          </div>


          <div className="trust-item">
            <span aria-hidden="true">✓</span>

            <div>
              <strong>Easy Returns</strong>
              <small>Hassle-free process</small>
            </div>
          </div>


          <div className="payment-methods">
            <small>We accept</small>

            <b>UPI</b>
            <b>VISA</b>
            <b>RuPay</b>
            <b>COD</b>
          </div>

        </div>
      </section>


      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">

          <p className="footer-copy">
            © {new Date().getFullYear()} Shopora.
            All rights reserved.
          </p>


          <div className="footer-legal">
            <a href="#privacy">
              Privacy
            </a>

            <a href="#terms">
              Terms
            </a>

            <a href="#cookies">
              Cookies
            </a>
          </div>


          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollTop}
            aria-label="Back to top"
          >
            <span aria-hidden="true">↑</span>
            Back to top
          </button>

        </div>
      </div>


      {/* =====================================================
          DECORATIVE WORDMARK
      ===================================================== */}
      <div
        className="footer-mark"
        aria-hidden="true"
      >
        shopora
      </div>

    </footer>
  );
}


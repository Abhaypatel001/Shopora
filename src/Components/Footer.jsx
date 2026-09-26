import { Link } from "react-router-dom";

export default function Footer({ user = null }) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="shopora-footer">

      {/* ==========================================
          BACK TO TOP
      ========================================== */}

      <button
        className="footer-back-top"
        onClick={scrollTop}
      >
        ↑ Back to top
      </button>


      {/* ==========================================
          MAIN FOOTER
      ========================================== */}

      <div className="footer-main">

        <div className="footer-container">

          {/* BRAND */}

          <div className="footer-brand-column">

            <Link
              to="/"
              className="footer-logo"
            >
              shopora<span>.</span>
            </Link>

            <p className="footer-brand-text">
              Smart shopping, better
              choices and a smoother
              way to shop online.
            </p>

            <div className="footer-trust">

              <div>
                <span>✓</span>
                Secure Payments
              </div>

              <div>
                <span>✓</span>
                Easy Returns
              </div>

              <div>
                <span>✓</span>
                Customer Support
              </div>

            </div>

          </div>


          {/* SHOP */}

          <div className="footer-column">

            <h3>
              Shop
            </h3>

            <Link to="/deals">
              Today's Deals
            </Link>

            <Link to="/best-sellers">
              Best Sellers
            </Link>

            <Link to="/new">
              New Releases
            </Link>

            <Link to="/c/mobiles">
              Mobiles
            </Link>

            <Link to="/c/fashion">
              Fashion
            </Link>

            <Link to="/c/electronics">
              Electronics
            </Link>

            <Link to="/c/home-kitchen">
              Home & Kitchen
            </Link>

          </div>


          {/* ACCOUNT */}

          <div className="footer-column">

            <h3>
              Your Account
            </h3>

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

            <h3>
              Help & Support
            </h3>

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
              Returns & Refunds
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
            <div className="footer-column">

              <h3>
                Admin
              </h3>

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

      </div>


      {/* ==========================================
          MIDDLE STRIP
      ========================================== */}

      <div className="footer-benefits">

        <div className="footer-container">

          <div className="footer-benefit">

            <span className="footer-benefit-icon">
              🚚
            </span>

            <div>
              <strong>
                Fast Delivery
              </strong>

              <small>
                Reliable delivery across India
              </small>
            </div>

          </div>


          <div className="footer-benefit">

            <span className="footer-benefit-icon">
              🔒
            </span>

            <div>
              <strong>
                Secure Payments
              </strong>

              <small>
                Safe and trusted checkout
              </small>
            </div>

          </div>


          <div className="footer-benefit">

            <span className="footer-benefit-icon">
              ↩
            </span>

            <div>
              <strong>
                Easy Returns
              </strong>

              <small>
                Simple return experience
              </small>
            </div>

          </div>


          <div className="footer-benefit">

            <span className="footer-benefit-icon">
              💬
            </span>

            <div>
              <strong>
                Real Support
              </strong>

              <small>
                We're here when you need us
              </small>
            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          BOTTOM
      ========================================== */}

      <div className="footer-bottom">

        <div className="footer-container footer-bottom-inner">

          <div className="footer-copy">
            © {new Date().getFullYear()} Shopora.
            All rights reserved.
          </div>

          <div className="footer-links">

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


          <div className="footer-payment">

            <span>We accept</span>

            <b>UPI</b>
            <b>VISA</b>
            <b>RuPay</b>
            <b>COD</b>

          </div>

        </div>

      </div>

    </footer>
  );
}
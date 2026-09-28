import { Link } from "react-router-dom";

const benefits = [
  { icon: "🚚", title: "Fast delivery", text: "Reliable shipping across India" },
  { icon: "🔒", title: "Secure payments", text: "Safe and trusted checkout" },
  { icon: "↩", title: "Easy returns", text: "Simple, no-fuss returns" },
  { icon: "💬", title: "Real support", text: "Help when you need it" },
];

export default function Footer({ user = null }) {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="shopora-footer">
      {/* ================= BENEFITS ================= */}
      <section className="footer-benefits" aria-label="Why shop with us">
        <div className="footer-container">
          {benefits.map((item) => (
            <div className="footer-benefit" key={item.title}>
              <span className="footer-benefit-icon" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.text}</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <div className="footer-main">
        <div className="footer-container footer-main-inner">
          {/* Brand */}
          <div className="footer-brand-column">
            <Link to="/" className="footer-logo">
              shopora<span>.</span>
            </Link>

            <p className="footer-brand-text">
              Smart shopping, better choices and a smoother way to shop online.
            </p>

            <a className="footer-contact" href="mailto:support@shopora.com">
              support@shopora.com
            </a>

            <ul className="footer-trust">
              <li><span aria-hidden="true">✓</span> Secure payments</li>
              <li><span aria-hidden="true">✓</span> Easy returns</li>
              <li><span aria-hidden="true">✓</span> Customer support</li>
            </ul>
          </div>

          {/* Link columns */}
          <nav className="footer-links-grid" aria-label="Footer">
            <div className="footer-column">
              <h3>Shop</h3>
              <Link to="/deals">Today's Deals</Link>
              <Link to="/best-sellers">Best Sellers</Link>
              <Link to="/new">New Releases</Link>
              <Link to="/c/mobiles">Mobiles</Link>
              <Link to="/c/fashion">Fashion</Link>
              <Link to="/c/electronics">Electronics</Link>
              <Link to="/c/home-kitchen">Home &amp; Kitchen</Link>
            </div>

            <div className="footer-column">
              <h3>Your account</h3>
              {user ? (
                <>
                  <Link to="/account">Your Account</Link>
                  <Link to="/orders">Your Orders</Link>
                  <Link to="/wishlist">Wishlist</Link>
                  <Link to="/addresses">Saved Addresses</Link>
                </>
              ) : (
                <>
                  <Link to="/login">Sign In</Link>
                  <Link to="/register">Create Account</Link>
                  <Link to="/login">Your Orders</Link>
                  <Link to="/login">Wishlist</Link>
                </>
              )}
            </div>

            <div className="footer-column">
              <h3>Help &amp; support</h3>
              <Link to="/help">Customer Service</Link>
              <Link to="/orders">Track Orders</Link>
              <Link to="/addresses">Delivery Addresses</Link>
              <a href="#returns">Returns &amp; Refunds</a>
              <a href="#payments">Payment Help</a>
              <a href="mailto:support@shopora.com">Contact Us</a>
            </div>

            {user?.role === "admin" && (
              <div className="footer-column">
                <h3>Admin</h3>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/products">Manage Products</Link>
                <Link to="/admin/orders">Manage Orders</Link>
                <Link to="/admin/users">Manage Users</Link>
                <Link to="/admin/support">Customer Support</Link>
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="footer-bottom">
        <div className="footer-container footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} Shopora. All rights reserved.
          </p>

          <div className="footer-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>

          <div className="footer-payment">
            <span>We accept</span>
            <b>UPI</b>
            <b>VISA</b>
            <b>RuPay</b>
            <b>COD</b>
          </div>

          <button
            type="button"
            className="footer-top-btn"
            onClick={scrollTop}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </div>

      {/* Decorative wordmark */}
      <div className="footer-mark" aria-hidden="true">
        shopora
      </div>
    </footer>
  );
}

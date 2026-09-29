/* ---------- Data (yahin se links/contact edit karo) ---------- */
const SHOP_LINKS = [
  { label: "Today's Deals", href: "/sale" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "New Releases", href: "/new" },
  { label: "Mobiles", href: "/c/mobiles" },
  { label: "Fashion", href: "/c/fashion" },
  { label: "Electronics", href: "/c/electronics" },
  { label: "Home & Kitchen", href: "/c/home-kitchen" },
];

const CARE_LINKS = [
  { label: "Your Account", href: "/account" },
  { label: "Your Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Saved Addresses", href: "/addresses" },
  { label: "Customer Service", href: "/customer-service" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
];

const PAYMENTS = ["VISA", "MASTERCARD", "UPI", "RUPAY", "COD"];

const CONTACT = {
  address: "123 Commerce Street, Fatehpur, Uttar Pradesh",
  phone: "+91 88587 01053",
  email: "abhayjipatel9821@gmail.com",
  hours: "Mon – Sat, 10:00 AM – 7:00 PM",
};

/* ---------- Icons ---------- */
const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
);

const ICONS = {
  facebook:
    "M13.5 22v-8.2h2.8l.4-3.3h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.5H7.4v3.3h2.8V22h3.3z",
  instagram:
    "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21 8.6c-.1-1.5-.4-2.8-1.5-3.9S17 3.1 15.4 3C13.9 3 10.1 3 8.6 3 7.1 3.1 5.8 3.4 4.7 4.5S3.1 7 3 8.6C3 10.1 3 13.9 3 15.4c.1 1.5.4 2.8 1.5 3.9s2.4 1.5 3.9 1.6c1.5.1 5.3.1 6.8 0 1.5-.1 2.8-.4 3.9-1.5s1.5-2.4 1.6-3.9c.1-1.5.1-5.3 0-6.9zm-2 8.8c-.3.8-.9 1.4-1.7 1.7-1.2.5-4.1.4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4.1-.4-5.3s-.1-4.1.4-5.3c.3-.8.9-1.4 1.7-1.7 1.2-.5 4.1-.4 5.3-.4s4.1-.1 5.3.4c.8.3 1.4.9 1.7 1.7.5 1.2.4 4.1.4 5.3s.1 4.1-.4 5.3z",
  x: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z",
  youtube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3-5.2 3z",
  pin: "M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z",
  phone:
    "M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1l-2.2 2.2z",
  mail: "M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z",
  clock:
    "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.2 13.5-5.2-3.1V7h1.5v4.6l4.5 2.6-.8 1.3z",
  truck:
    "M3 6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2h3l3 4v5h-2a3 3 0 0 1-6 0H9a3 3 0 0 1-6 0V6zm4 12.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  returns: "M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z",
  shield:
    "M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4zm-1 15-4-4 1.4-1.4L11 13.2l4.6-4.6L17 10l-6 6z",
  support:
    "M12 2a9 9 0 0 0-9 9v7a3 3 0 0 0 3 3h2v-8H5v-2a7 7 0 0 1 14 0v2h-3v8h3v1h-6v2h6a3 3 0 0 0 3-3v-8a9 9 0 0 0-9-9z",
};

const SOCIALS = [
  { name: "Facebook", href: "#", icon: ICONS.facebook },
  { name: "Instagram", href: "#", icon: ICONS.instagram },
  { name: "X / Twitter", href: "#", icon: ICONS.x },
  { name: "YouTube", href: "#", icon: ICONS.youtube },
];

const TRUST = [
  { icon: ICONS.truck, title: "Free Shipping", text: "On orders above ₹999" },
  { icon: ICONS.returns, title: "Easy Returns", text: "7-day hassle-free returns" },
  { icon: ICONS.shield, title: "Secure Payments", text: "100% protected checkout" },
  { icon: ICONS.support, title: "24/7 Support", text: "We're always here to help" },
];

/* ---------- Component ---------- */
export default function Footer() {
  return (
    <>
      <footer className="sf-footer" id="site-footer">
        <div className="sf-container">
          {/* Main columns */}
          <div className="sf-main">
            <div className="sf-col">
              <a href="/" className="sf-logo">
                Shop<span>ora</span>
              </a>
              <p className="sf-about">
                Premium products, honest prices and a shopping experience built
                around you. Quality you can trust, delivered to your door.
              </p>
              <div className="sf-social">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.href} aria-label={s.name}>
                    <Icon d={s.icon} />
                  </a>
                ))}
              </div>
            </div>

            <div className="sf-col sf-links">
              <h4>Shop</h4>
              <ul>
                {SHOP_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sf-col sf-links">
              <h4>Customer Care</h4>
              <ul>
                {CARE_LINKS.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sf-col">
              <h4>Get in Touch</h4>
              <ul className="sf-contact">
                <li>
                  <Icon d={ICONS.pin} />
                  <span>{CONTACT.address}</span>
                </li>
                <li>
                  <Icon d={ICONS.phone} />
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
                </li>
                <li>
                  <Icon d={ICONS.mail} />
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
                <li>
                  <Icon d={ICONS.clock} />
                  <span>{CONTACT.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust strip */}
          <div className="sf-trust">
            {TRUST.map((t) => (
              <div key={t.title}>
                <Icon d={t.icon} />
                <p>
                  <strong>{t.title}</strong>
                  <small>{t.text}</small>
                </p>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="sf-bottom">
            <p>&copy; {new Date().getFullYear()} Shopora. All rights reserved.</p>
            <div className="sf-pay" aria-label="Accepted payment methods">
              {PAYMENTS.map((p) => (
                <span key={p}>{p}</span>
              ))}
            </div>
            <nav className="sf-legal" aria-label="Legal">
              {LEGAL_LINKS.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}

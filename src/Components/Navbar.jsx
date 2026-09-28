import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../Services/api";
import "./Navbar.css";

const CATEGORIES = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home & Kitchen",
  "Books",
  "Beauty",
  "Grocery",
  "Sports",
];

const SUB_LINKS = [
  { label: "Today's Deals", href: "/deals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "New Releases", href: "/new" },
  { label: "Mobiles", href: "/c/mobiles" },
  { label: "Fashion", href: "/c/fashion" },
  { label: "Electronics", href: "/c/electronics" },
  { label: "Home & Kitchen", href: "/c/home-kitchen" },
  { label: "Customer Service", href: "/help" },
];

const ACCOUNT_LINKS = [
  { label: "Your Account", href: "/account" },
  { label: "Your Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Saved Addresses", href: "/addresses" },
];

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Manage Products", href: "/admin/products" },
  { label: "Manage Orders", href: "/admin/orders" },
  { label: "Manage Users", href: "/admin/users" },
  { label: "Customer Support", href: "/admin/support" },
];

const ICONS = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4-4",
  cart: "M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 8H6.2M9 20h.01M17 20h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  pin: "M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  chevron: "M6 9l6 6 6-6",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
};

function Icon({ name, size = 22 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getSuggestionScore = (product, searchTerm) => {
  const queryText = normalizeText(searchTerm);
  if (!queryText) return 0;

  const name = normalizeText(product.name);
  const category = normalizeText(product.category);
  let score = 0;

  if (name.startsWith(queryText)) score += 100;
  if (name.includes(queryText)) score += 70;
  if (category.includes(queryText)) score += 35;

  const queryWords = queryText.split(" ");
  const nameWords = name.split(" ");

  queryWords.forEach((word) => {
    nameWords.forEach((nameWord) => {
      if (nameWord.startsWith(word)) score += 15;
    });
  });

  const compactQuery = queryText.replace(/\s/g, "");
  const compactName = name.replace(/\s/g, "");

  if (compactQuery.length >= 3 && compactName.length >= 3) {
    let matchedChars = 0;
    let startIndex = 0;

    for (const char of compactQuery) {
      const foundIndex = compactName.indexOf(char, startIndex);
      if (foundIndex !== -1) {
        matchedChars += 1;
        startIndex = foundIndex + 1;
      }
    }

    if (matchedChars / compactQuery.length >= 0.75) score += 20;
  }

  return score;
};

export default function Navbar({
  user = null,
  cartCount = 0,
  location = "India",
  onLogout = () => {},
  onSearch = () => {},
}) {
  const routeLocation = useLocation();
  const searchBoxRef = useRef(null);

  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const isAdmin = user?.role === "admin";
  const firstName = user ? user.name.split(" ")[0] : "";

  useEffect(() => {
    const loadSearchProducts = async () => {
      try {
        const response = await api.get("/products");
        if (response.data?.success) {
          setAllProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Navbar search products error:", error);
      }
    };

    loadSearchProducts();
  }, []);

  useEffect(() => {
    const term = query.trim();

    if (!term) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSuggestionsLoading(false);
      setActiveSuggestion(-1);
      return;
    }

    setSuggestionsLoading(true);

    const timer = setTimeout(() => {
      const normalizedQuery = normalizeText(term);

      const filtered = allProducts
        .filter((product) => {
          if (
            category !== "All" &&
            normalizeText(product.category) !== normalizeText(category)
          ) {
            return false;
          }

          return (
            normalizeText(product.name).includes(normalizedQuery) ||
            normalizeText(product.category).includes(normalizedQuery) ||
            getSuggestionScore(product, term) > 15
          );
        })
        .map((product) => ({
          product,
          score: getSuggestionScore(product, term),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

      setSuggestions(filtered.map((item) => item.product));
      setSuggestionsLoading(false);
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, category, allProducts]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!sideOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setSideOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sideOpen]);

  useEffect(() => {
    const loadDefaultAddress = async () => {
      if (!user) {
        setDeliveryAddress(null);
        return;
      }

      try {
        const token = localStorage.getItem("shopora_token");

        if (!token) {
          setDeliveryAddress(null);
          return;
        }

        const response = await api.get("/users/addresses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const addresses = response.data.addresses || [];
          setDeliveryAddress(
            addresses.find((item) => item.isDefault) || addresses[0] || null
          );
        }
      } catch (error) {
        console.error("Navbar address error:", error);
      }
    };

    loadDefaultAddress();

    const handleAddressUpdate = () => loadDefaultAddress();

    window.addEventListener("shoporaAddressUpdated", handleAddressUpdate);

    return () =>
      window.removeEventListener(
        "shoporaAddressUpdated",
        handleAddressUpdate
      );
  }, [user, routeLocation.pathname]);

  const submitSearch = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;

    setShowSuggestions(false);
    setActiveSuggestion(-1);
    onSearch({ query: term, category });
  };

  const selectSuggestion = (product) => {
    if (!product) return;

    const nextQuery = product.name || "";
    setQuery(nextQuery);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    onSearch({ query: nextQuery, category });
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((current) =>
        Math.min(current + 1, suggestions.length - 1)
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((current) => Math.max(current - 1, -1));
      return;
    }

    if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const logout = () => {
    setSideOpen(false);
    onLogout();
  };

  return (
    <header className="shopora-nav">
      <div className="sn-main">
        <button
          className="sn-menu"
          onClick={() => setSideOpen(true)}
          aria-label="Open menu"
        >
          <Icon name="menu" size={24} />
        </button>

        <a href="/" className="sn-logo" aria-label="Shopora home">
          shopora<span>.</span>
        </a>

        <a href="/addresses" className="sn-delivery">
          <span className="sn-delivery-icon">
            <Icon name="pin" size={18} />
          </span>
          <span>
            <small>Deliver to</small>
            <b>
              {deliveryAddress
                ? `${deliveryAddress.city} - ${deliveryAddress.pincode}`
                : user
                ? "Add address"
                : location}
            </b>
          </span>
        </a>

        <form
          ref={searchBoxRef}
          className="sn-search"
          role="search"
          onSubmit={submitSearch}
        >
          <select
            value={category}
            aria-label="Search category"
            onChange={(e) => {
              setCategory(e.target.value);
              setActiveSuggestion(-1);
            }}
          >
            <option>All</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search products, brands & more"
            value={query}
            autoComplete="off"
            onFocus={() => {
              if (query.trim()) setShowSuggestions(true);
            }}
            onKeyDown={handleSearchKeyDown}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit" aria-label="Search">
            <Icon name="search" size={21} />
          </button>

          {showSuggestions && query.trim() && (
            <div className="sn-suggestions">
              {suggestionsLoading ? (
                <div className="sn-suggestion-status">Searching...</div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="sn-suggestion-title">Suggested products</div>
                  {suggestions.map((product, index) => {
                    const productId = product._id || product.id;

                    return (
                      <button
                        type="button"
                        key={productId || index}
                        className={`sn-suggestion ${
                          activeSuggestion === index ? "is-active" : ""
                        }`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectSuggestion(product);
                        }}
                      >
                        <span className="sn-suggestion-icon">
                          <Icon name="search" size={15} />
                        </span>
                        <span>
                          <strong>{product.name}</strong>
                          <small>{product.category || "Product"}</small>
                        </span>
                        <b>→</b>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="sn-see-all"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowSuggestions(false);
                      onSearch({ query: query.trim(), category });
                    }}
                  >
                    Search for "{query.trim()}"
                  </button>
                </>
              ) : (
                <div className="sn-no-results">
                  <strong>No direct matches</strong>
                  <span>Search anyway to find more products.</span>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowSuggestions(false);
                      onSearch({ query: query.trim(), category });
                    }}
                  >
                    Search anyway →
                  </button>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="sn-account">
          <button className="sn-action">
            <span className="sn-action-icon">
              <Icon name="user" size={23} />
            </span>
            <span className="sn-action-text">
              <small>Hello, {user ? firstName : "sign in"}</small>
              <b>Account</b>
            </span>
          </button>

          <div className="sn-account-menu">
            {user ? (
              <div className="sn-menu-user">
                <strong>Hi, {user.name}</strong>
                {isAdmin && <span>Admin</span>}
              </div>
            ) : (
              <div className="sn-menu-user sn-guest">
                <a href="/login">Sign in</a>
                <small>
                  New customer? <a href="/register">Start here.</a>
                </small>
              </div>
            )}

            <div className="sn-menu-grid">
              <div>
                <h4>Your account</h4>
                {ACCOUNT_LINKS.map((item) => (
                  <a key={item.href} href={user ? item.href : "/login"}>
                    {item.label}
                  </a>
                ))}
              </div>

              {isAdmin && (
                <div>
                  <h4>Admin</h4>
                  {ADMIN_LINKS.map((item) => (
                    <a key={item.href} href={item.href}>
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <button className="sn-signout" onClick={logout}>
                Sign out
              </button>
            )}
          </div>
        </div>

        <a href="/wishlist" className="sn-icon-action" aria-label="Wishlist">
          <span>♡</span>
          <small>Wishlist</small>
        </a>

        <a href="/orders" className="sn-orders">
          <small>Track</small>
          <b>Orders</b>
        </a>

        <a
          href="/cart"
          className="sn-cart"
          aria-label={`Cart, ${cartCount} items`}
        >
          <span className="sn-cart-icon">
            <Icon name="cart" size={27} />
            <em>{cartCount}</em>
          </span>
          <b>Cart</b>
        </a>
      </div>

      <nav className="sn-nav" aria-label="Main navigation">
        <div className="sn-nav-inner">
          <button className="sn-all" onClick={() => setSideOpen(true)}>
            <Icon name="menu" size={18} />
            Categories
          </button>

          <div className="sn-links">
            {SUB_LINKS.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
            {isAdmin && (
              <a href="/admin" className="sn-admin-link">
                Admin Panel
              </a>
            )}
          </div>
        </div>
      </nav>

      <div
        className={`sn-overlay ${sideOpen ? "is-open" : ""}`}
        onClick={() => setSideOpen(false)}
      />

      <aside className={`sn-drawer ${sideOpen ? "is-open" : ""}`}>
        <div className="sn-drawer-head">
          <div>
            <span className="sn-drawer-user">
              <Icon name="user" size={22} />
            </span>
            <strong>Hello, {user ? user.name : "sign in"}</strong>
            {isAdmin && <em>Admin</em>}
          </div>

          <button onClick={() => setSideOpen(false)} aria-label="Close menu">
            <Icon name="close" size={22} />
          </button>
        </div>

        <div className="sn-drawer-body">
          <h3>Shop by category</h3>
          {CATEGORIES.map((categoryName) => (
            <a
              key={categoryName}
              href={`/c/${categoryName
                .toLowerCase()
                .replace(/ & /g, "-")
                .replace(/\s+/g, "-")}`}
            >
              {categoryName}
            </a>
          ))}

          <h3>Programs & features</h3>
          <a href="/deals">Today's Deals</a>
          <a href="/best-sellers">Best Sellers</a>
          <a href="/new">New Releases</a>

          {isAdmin && (
            <>
              <h3>Admin</h3>
              {ADMIN_LINKS.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </>
          )}

          <h3>Help & settings</h3>
          <a href={user ? "/account" : "/login"}>Your Account</a>
          <a href="/orders">Your Orders</a>
          <a href="/help">Customer Service</a>

          {user ? (
            <button className="sn-drawer-signout" onClick={logout}>
              Sign out
            </button>
          ) : (
            <a href="/login">Sign in</a>
          )}
        </div>
      </aside>
    </header>
  );
}

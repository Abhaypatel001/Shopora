import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import api from "../Services/api";

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
  {
    label: "Today's Deals",
    href: "/deals",
  },
  {
    label: "Best Sellers",
    href: "/best-sellers",
  },
  {
    label: "New Releases",
    href: "/new",
  },
  {
    label: "Mobiles",
    href: "/c/mobiles",
  },
  {
    label: "Fashion",
    href: "/c/fashion",
  },
  {
    label: "Electronics",
    href: "/c/electronics",
  },
  {
    label: "Home & Kitchen",
    href: "/c/home-kitchen",
  },
  {
    label: "Customer Service",
    href: "/help",
  },
];

const ACCOUNT_LINKS = [
  {
    label: "Your Account",
    href: "/account",
  },
  {
    label: "Your Orders",
    href: "/orders",
  },
  {
    label: "Wishlist",
    href: "/wishlist",
  },
  {
    label: "Saved Addresses",
    href: "/addresses",
  },
];

const ADMIN_LINKS = [
  {
    label: "Dashboard",
    href: "/admin",
  },
  {
    label: "Manage Products",
    href: "/admin/products",
  },
  {
    label: "Manage Orders",
    href: "/admin/orders",
  },
  {
    label: "Manage Users",
    href: "/admin/users",
  },
  {
    label: "Customer Support",
    href: "/admin/support",
  },
];

const ICONS = {
  search:
    "M11 4a7 7 0 1 0 0 14 7 7 0 0 0-0-14Zm9 16-4-4",

  cart:
    "M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.7L20 8H6.2M9 20h.01M17 20h.01",

  menu:
    "M4 7h16M4 12h16M4 17h16",

  close:
    "M6 6l12 12M18 6 6 18",

  pin:
    "M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Zm0-7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",

  chevron:
    "M6 9l6 6 6-6",

  user:
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
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

/* =========================================================
   SEARCH HELPERS
========================================================= */

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

  // Exact beginning match
  if (name.startsWith(queryText)) {
    score += 100;
  }

  // Name contains query
  if (name.includes(queryText)) {
    score += 70;
  }

  // Category contains query
  if (category.includes(queryText)) {
    score += 35;
  }

  // Word-level match
  const queryWords = queryText.split(" ");
  const nameWords = name.split(" ");

  queryWords.forEach((word) => {
    nameWords.forEach((nameWord) => {
      if (nameWord.startsWith(word)) {
        score += 15;
      }
    });
  });

  // Small typo tolerance
  const compactQuery = queryText.replace(/\s/g, "");
  const compactName = name.replace(/\s/g, "");

  if (
    compactQuery.length >= 3 &&
    compactName.length >= 3
  ) {
    let matchedChars = 0;
    let startIndex = 0;

    for (const char of compactQuery) {
      const foundIndex = compactName.indexOf(
        char,
        startIndex
      );

      if (foundIndex !== -1) {
        matchedChars += 1;
        startIndex = foundIndex + 1;
      }
    }

    const ratio =
      matchedChars / compactQuery.length;

    if (ratio >= 0.75) {
      score += 20;
    }
  }

  return score;
};

/**
 * Props
 * user       : null or logged-in user
 * cartCount  : cart item count
 * onLogout   : logout callback
 * onSearch   : { query, category }
 */
export default function Navbar({
  user = null,
  cartCount = 0,
  location = "India",
  onLogout = () => {},
  onSearch = () => {},
}) {
  const routeLocation = useLocation();

  const searchBoxRef = useRef(null);

  const [deliveryAddress, setDeliveryAddress] =
    useState(null);

  const [sideOpen, setSideOpen] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [category, setCategory] =
    useState("All");

  /* ---------- autocomplete state ---------- */

  const [allProducts, setAllProducts] =
    useState([]);

  const [suggestions, setSuggestions] =
    useState([]);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const [suggestionsLoading, setSuggestionsLoading] =
    useState(false);

  const [activeSuggestion, setActiveSuggestion] =
    useState(-1);

  const isAdmin =
    user?.role === "admin";

  const firstName =
    user
      ? user.name.split(" ")[0]
      : "";

  /* =========================================================
     LOAD PRODUCTS FOR AUTOCOMPLETE
  ========================================================= */

  useEffect(() => {
    const loadSearchProducts = async () => {
      try {
        const response =
          await api.get("/products");

        if (response.data?.success) {
          setAllProducts(
            response.data.products || []
          );
        }
      } catch (error) {
        console.error(
          "Navbar search products error:",
          error
        );
      }
    };

    loadSearchProducts();
  }, []);

  /* =========================================================
     DEBOUNCED AUTOCOMPLETE
  ========================================================= */

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
      const normalizedQuery =
        normalizeText(term);

      const filtered =
        allProducts
          .filter((product) => {
            if (
              category !== "All" &&
              normalizeText(
                product.category
              ) !==
                normalizeText(category)
            ) {
              return false;
            }

            return (
              normalizeText(
                product.name
              ).includes(
                normalizedQuery
              ) ||
              normalizeText(
                product.category
              ).includes(
                normalizedQuery
              ) ||
              getSuggestionScore(
                product,
                term
              ) > 15
            );
          })
          .map((product) => ({
            product,
            score:
              getSuggestionScore(
                product,
                term
              ),
          }))
          .sort(
            (a, b) =>
              b.score - a.score
          )
          .slice(0, 6);

      setSuggestions(
        filtered.map(
          (item) => item.product
        )
      );

      setSuggestionsLoading(false);
      setShowSuggestions(true);
      setActiveSuggestion(-1);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [
    query,
    category,
    allProducts,
  ]);

  /* =========================================================
     CLOSE AUTOCOMPLETE ON OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(
          event.target
        )
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================================================
     DRAWER
  ========================================================= */

  useEffect(() => {
    if (!sideOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setSideOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      onKey
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        onKey
      );

      document.body.style.overflow =
        "";
    };
  }, [sideOpen]);

  /* =========================================================
     DELIVERY ADDRESS
  ========================================================= */

  useEffect(() => {
    const loadDefaultAddress =
      async () => {
        if (!user) {
          setDeliveryAddress(null);
          return;
        }

        try {
          const token =
            localStorage.getItem(
              "shopora_token"
            );

          if (!token) {
            setDeliveryAddress(null);
            return;
          }

          const response =
            await api.get(
              "/users/addresses",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (
            response.data.success
          ) {
            const addresses =
              response.data.addresses ||
              [];

            const defaultAddress =
              addresses.find(
                (item) =>
                  item.isDefault
              ) ||
              addresses[0] ||
              null;

            setDeliveryAddress(
              defaultAddress
            );
          }
        } catch (error) {
          console.error(
            "Navbar address error:",
            error
          );
        }
      };

    loadDefaultAddress();

    const handleAddressUpdate =
      () => {
        loadDefaultAddress();
      };

    window.addEventListener(
      "shoporaAddressUpdated",
      handleAddressUpdate
    );

    return () => {
      window.removeEventListener(
        "shoporaAddressUpdated",
        handleAddressUpdate
      );
    };
  }, [
    user,
    routeLocation.pathname,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const submitSearch = (e) => {
    e.preventDefault();

    const term =
      query.trim();

    if (!term) {
      return;
    }

    setShowSuggestions(false);
    setActiveSuggestion(-1);

    onSearch({
      query: term,
      category,
    });
  };

  const selectSuggestion = (
    product
  ) => {
    if (!product) return;

    const nextQuery =
      product.name || "";

    setQuery(nextQuery);
    setShowSuggestions(false);
    setActiveSuggestion(-1);

    onSearch({
      query: nextQuery,
      category,
    });
  };

  /* =========================================================
     KEYBOARD NAVIGATION
  ========================================================= */

  const handleSearchKeyDown = (
    e
  ) => {
    if (!showSuggestions) {
      return;
    }

    if (
      e.key === "ArrowDown"
    ) {
      e.preventDefault();

      setActiveSuggestion((current) =>
        Math.min(
          current + 1,
          suggestions.length - 1
        )
      );

      return;
    }

    if (
      e.key === "ArrowUp"
    ) {
      e.preventDefault();

      setActiveSuggestion((current) =>
        Math.max(
          current - 1,
          -1
        )
      );

      return;
    }

    if (
      e.key === "Enter" &&
      activeSuggestion >= 0
    ) {
      e.preventDefault();

      const product =
        suggestions[
          activeSuggestion
        ];

      selectSuggestion(product);
    }

    if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    setSideOpen(false);
    onLogout();
  };

  return (
    <header className="sp">
      {/* =====================================================
          TOP ROW
      ===================================================== */}

      <div className="sp-top">
        <button
          className="sp-burger"
          onClick={() =>
            setSideOpen(true)
          }
          aria-label="Open menu"
        >
          <Icon
            name="menu"
            size={26}
          />
        </button>

        <a
          href="/"
          className="sp-logo"
          aria-label="Shopora home"
        >
          shopora
          <span>.</span>
        </a>

        <a
          href="/addresses"
          className="sp-deliver"
        >
          <Icon
            name="pin"
            size={20}
          />

          <span>
            <small>
              Deliver to
            </small>

            <b>
              {deliveryAddress
                ? `${deliveryAddress.city} - ${deliveryAddress.pincode}`
                : user
                ? "Add address"
                : "India"}
            </b>
          </span>
        </a>

        {/* =================================================
            SEARCH
        ================================================= */}

        <form
          ref={searchBoxRef}
          className="sp-search"
          role="search"
          onSubmit={submitSearch}
        >
          <label
            htmlFor="sp-cat"
            className="sp-sr"
          >
            Search category
          </label>

          <select
            id="sp-cat"
            value={category}
            onChange={(e) => {
              setCategory(
                e.target.value
              );
              setActiveSuggestion(-1);
            }}
          >
            <option>
              All
            </option>

            {CATEGORIES.map(
              (c) => (
                <option
                  key={c}
                >
                  {c}
                </option>
              )
            )}
          </select>

          <label
            htmlFor="sp-q"
            className="sp-sr"
          >
            Search Shopora
          </label>

          <input
            id="sp-q"
            type="search"
            placeholder="Search Shopora"
            value={query}
            autoComplete="off"
            onFocus={() => {
              if (
                query.trim()
              ) {
                setShowSuggestions(
                  true
                );
              }
            }}
            onKeyDown={
              handleSearchKeyDown
            }
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
          />

          <button
            type="submit"
            aria-label="Search"
          >
            <Icon
              name="search"
              size={22}
            />
          </button>

          {/* =================================================
              AUTOCOMPLETE DROPDOWN
          ================================================= */}

          {showSuggestions &&
            query.trim() && (
              <div className="sp-search-suggestions">
                {suggestionsLoading ? (
                  <div className="sp-search-loading">
                    <span className="sp-search-mini-spinner" />
                    Searching...
                  </div>
                ) : suggestions.length >
                  0 ? (
                  <>
                    <div className="sp-search-suggestion-title">
                      Suggested products
                    </div>

                    {suggestions.map(
                      (
                        product,
                        index
                      ) => {
                        const productId =
                          product._id ||
                          product.id;

                        return (
                          <button
                            type="button"
                            key={
                              productId ||
                              index
                            }
                            className={`sp-search-suggestion ${
                              activeSuggestion ===
                              index
                                ? "sp-search-suggestion-active"
                                : ""
                            }`}
                            onMouseDown={(
                              e
                            ) => {
                              e.preventDefault();
                              selectSuggestion(
                                product
                              );
                            }}
                          >
                            <span className="sp-search-suggestion-icon">
                              <Icon
                                name="search"
                                size={16}
                              />
                            </span>

                            <span className="sp-search-suggestion-content">
                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <small>
                                {product.category ||
                                  "Product"}
                              </small>
                            </span>

                            <span className="sp-search-suggestion-arrow">
                              →
                            </span>
                          </button>
                        );
                      }
                    )}

                    <button
                      type="button"
                      className="sp-search-see-all"
                      onMouseDown={(
                        e
                      ) => {
                        e.preventDefault();

                        setShowSuggestions(
                          false
                        );

                        onSearch({
                          query:
                            query.trim(),
                          category,
                        });
                      }}
                    >
                      Search for "
                      {query.trim()}"
                    </button>
                  </>
                ) : (
                  <div className="sp-search-no-results">
                    <strong>
                      No direct matches
                    </strong>

                    <span>
                      Search anyway to find more products
                      from Shopora and the web.
                    </span>

                    <button
                      type="button"
                      onMouseDown={(
                        e
                      ) => {
                        e.preventDefault();

                        setShowSuggestions(
                          false
                        );

                        onSearch({
                          query:
                            query.trim(),
                          category,
                        });
                      }}
                    >
                      Search anyway →
                    </button>
                  </div>
                )}
              </div>
            )}
        </form>

        {/* =================================================
            ACCOUNT
        ================================================= */}

        <div className="sp-account">
          <button
            className="sp-tile"
            aria-haspopup="true"
          >
            <small>
              Hello,{" "}
              {user
                ? firstName
                : "sign in"}
            </small>

            <b>
              Account &amp; Lists{" "}
              <Icon
                name="chevron"
                size={12}
              />
            </b>
          </button>

          <span
            className="sp-tile-icon"
            aria-hidden="true"
          >
            <Icon
              name="user"
              size={26}
            />
          </span>

          <div className="sp-drop">
            {user ? (
              <div className="sp-drop-head">
                <b>
                  Hi, {user.name}
                </b>

                {isAdmin && (
                  <span className="sp-badge">
                    Admin
                  </span>
                )}
              </div>
            ) : (
              <div className="sp-drop-head sp-drop-guest">
                <a
                  href="/login"
                  className="sp-btn"
                >
                  Sign in
                </a>

                <p>
                  New customer?{" "}
                  <a href="/register">
                    Start here.
                  </a>
                </p>
              </div>
            )}

            <div className="sp-drop-cols">
              <div>
                <h4>
                  Your account
                </h4>

                <ul>
                  {ACCOUNT_LINKS.map(
                    (l) => (
                      <li
                        key={l.href}
                      >
                        <a
                          href={
                            user
                              ? l.href
                              : "/login"
                          }
                        >
                          {l.label}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {isAdmin && (
                <div>
                  <h4>
                    Admin
                  </h4>

                  <ul>
                    {ADMIN_LINKS.map(
                      (l) => (
                        <li
                          key={
                            l.href
                          }
                        >
                          <a
                            href={
                              l.href
                            }
                          >
                            {l.label}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            {user && (
              <button
                className="sp-signout"
                onClick={logout}
              >
                Sign out
              </button>
            )}
          </div>
        </div>

        <a
          href="/orders"
          className="sp-tile sp-returns"
        >
          <small>
            Returns
          </small>

          <b>
            &amp; Orders
          </b>
        </a>

        <a
          href="/cart"
          className="sp-cart"
          aria-label={`Cart, ${cartCount} items`}
        >
          <span className="sp-cart-icon">
            <Icon
              name="cart"
              size={32}
            />

            <em>
              {cartCount}
            </em>
          </span>

          <b>
            Cart
          </b>
        </a>
      </div>

      {/* =====================================================
          SUB ROW
      ===================================================== */}

      <nav
        className="sp-sub"
        aria-label="Main"
      >
        <button
          className="sp-all"
          onClick={() =>
            setSideOpen(true)
          }
        >
          <Icon
            name="menu"
            size={20}
          />{" "}
          All
        </button>

        <ul>
          {SUB_LINKS.map(
            (l) => (
              <li
                key={l.href}
              >
                <a
                  href={l.href}
                >
                  {l.label}
                </a>
              </li>
            )
          )}

          {isAdmin && (
            <li>
              <a
                href="/admin"
                className="sp-sub-admin"
              >
                Admin Panel
              </a>
            </li>
          )}
        </ul>
      </nav>

      {/* =====================================================
          SIDE DRAWER
      ===================================================== */}

      <div
        className={`sp-overlay ${
          sideOpen
            ? "sp-overlay--on"
            : ""
        }`}
        onClick={() =>
          setSideOpen(false)
        }
      />

      <aside
        className={`sp-side ${
          sideOpen
            ? "sp-side--open"
            : ""
        }`}
        aria-label="Menu"
        aria-hidden={!sideOpen}
      >
        <div className="sp-side-head">
          <Icon
            name="user"
            size={26}
          />

          <b>
            Hello,{" "}
            {user
              ? user.name
              : "sign in"}
          </b>

          {isAdmin && (
            <span className="sp-badge">
              Admin
            </span>
          )}

          <button
            onClick={() =>
              setSideOpen(false)
            }
            aria-label="Close menu"
          >
            <Icon
              name="close"
              size={22}
            />
          </button>
        </div>

        <div className="sp-side-body">
          <h3>
            Shop by category
          </h3>

          <ul>
            {CATEGORIES.map(
              (c) => (
                <li
                  key={c}
                >
                  <a
                    href={`/c/${c
                      .toLowerCase()
                      .replace(
                        / & /g,
                        "-"
                      )}`}
                  >
                    {c}
                  </a>
                </li>
              )
            )}
          </ul>

          <h3>
            Programs &amp; features
          </h3>

          <ul>
            <li>
              <a href="/deals">
                Today's Deals
              </a>
            </li>

            <li>
              <a href="/best-sellers">
                Best Sellers
              </a>
            </li>
          </ul>

          {isAdmin && (
            <>
              <h3>
                Admin
              </h3>

              <ul>
                {ADMIN_LINKS.map(
                  (l) => (
                    <li
                      key={
                        l.href
                      }
                    >
                      <a
                        href={
                          l.href
                        }
                      >
                        {l.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </>
          )}

          <h3>
            Help &amp; settings
          </h3>

          <ul>
            <li>
              <a
                href={
                  user
                    ? "/account"
                    : "/login"
                }
              >
                Your Account
              </a>
            </li>

            <li>
              <a href="/orders">
                Your Orders
              </a>
            </li>

            <li>
              <a href="/help">
                Customer Service
              </a>
            </li>

            <li>
              {user ? (
                <button
                  className="sp-side-link"
                  onClick={logout}
                >
                  Sign out
                </button>
              ) : (
                <a href="/login">
                  Sign in
                </a>
              )}
            </li>
          </ul>
        </div>
      </aside>
    </header>
  );
}
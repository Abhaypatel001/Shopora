import {
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../Services/api";

/* ---------- small icon set (no external packages) ---------- */

const ART = {
  phone:
    "M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2 16h2",

  headphones:
    "M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 1 1-1v-4Z",

  shirt:
    "M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0Z",

  watch:
    "M8 2h8l1 4H7l1-4Zm-1 16h10l-1 4H8l-1-4ZM7 6h10v12H7V6Zm5 3v3l2 1",

  lamp:
    "M8 3h8l3 9H5l3-9Zm4 9v8m-4 0h8",

  book:
    "M4 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4V4Zm16 0h-7v14h7V4Z",

  shoe:
    "M3 16c0-2 1-3 3-3l3-4 3 2h3l5 3v4H3v-2Z",

  bag:
    "M6 8h12l1 12H5L6 8Zm3 0V7a3 3 0 0 1 6 0v1",

  truck:
    "M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",

  refresh:
    "M4 12a8 8 0 1 1 3 6.2M4 12V7m0 5h5",

  shield:
    "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Zm-3 9 2 2 4-4",
};

function Art({
  kind,
  size = 64,
  stroke = 1.6,
}) {
  const icon = ART[kind] || ART.bag;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={icon} />
    </svg>
  );
}

/* ---------- hero slides ---------- */

const SLIDES = [
  {
    id: 1,
    tone: "navy",
    kind: "phone",
    title: "Big savings on everyday tech",
    text: "Phones, audio and wearables with up to 40% off this week.",
    cta: "Shop electronics",
    href: "/c/electronics",
  },

  {
    id: 2,
    tone: "amber",
    kind: "shirt",
    title: "New season, new wardrobe",
    text: "Fresh fashion for men and women, with free returns on every order.",
    cta: "Explore fashion",
    href: "/c/fashion",
  },

  {
    id: 3,
    tone: "teal",
    kind: "lamp",
    title: "Make your home feel like home",
    text: "Lighting, kitchen and decor picks starting at ₹299.",
    cta: "Shop home & kitchen",
    href: "/c/home-kitchen",
  },
];

/* ---------- categories ---------- */

const CATEGORIES = [
  {
    name: "Mobiles",
    kind: "phone",
    hue: 215,
    href: "/c/mobiles",
  },

  {
    name: "Audio",
    kind: "headphones",
    hue: 265,
    href: "/c/audio",
  },

  {
    name: "Fashion",
    kind: "shirt",
    hue: 335,
    href: "/c/fashion",
  },

  {
    name: "Watches",
    kind: "watch",
    hue: 25,
    href: "/c/watches",
  },

  {
    name: "Home",
    kind: "lamp",
    hue: 45,
    href: "/c/home-kitchen",
  },

  {
    name: "Books",
    kind: "book",
    hue: 150,
    href: "/c/books",
  },

  {
    name: "Footwear",
    kind: "shoe",
    hue: 190,
    href: "/c/footwear",
  },

  {
    name: "Bags",
    kind: "bag",
    hue: 0,
    href: "/c/bags",
  },
];

/* ---------- trust section ---------- */

const TRUST = [
  {
    kind: "truck",
    title: "Free delivery",
    text: "On orders over ₹499",
  },

  {
    kind: "refresh",
    title: "Easy returns",
    text: "10-day no-questions returns",
  },

  {
    kind: "shield",
    title: "Secure payments",
    text: "UPI, cards and cash on delivery",
  },

  {
    kind: "headphones",
    title: "Real support",
    text: "Help is one tap away, every day",
  },
];

/* ---------- helpers ---------- */

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN")}`;

const secondsToMidnight = () => {
  const now = new Date();

  const end = new Date(now);

  end.setHours(24, 0, 0, 0);

  return Math.max(
    0,
    Math.floor((end - now) / 1000)
  );
};

const clock = (s) => {
  const h = String(
    Math.floor(s / 3600)
  ).padStart(2, "0");

  const m = String(
    Math.floor((s % 3600) / 60)
  ).padStart(2, "0");

  const sec = String(
    s % 60
  ).padStart(2, "0");

  return `${h}:${m}:${sec}`;
};

/* ---------- product type helper ---------- */

const getProductKind = (
  category = ""
) => {
  const value = category.toLowerCase();

  if (
    value.includes("mobile") ||
    value.includes("phone")
  ) {
    return "phone";
  }

  if (
    value.includes("audio") ||
    value.includes("headphone") ||
    value.includes("earphone")
  ) {
    return "headphones";
  }

  if (
    value.includes("fashion") ||
    value.includes("shirt") ||
    value.includes("clothing")
  ) {
    return "shirt";
  }

  if (
    value.includes("watch") ||
    value.includes("watches")
  ) {
    return "watch";
  }

  if (
    value.includes("home") ||
    value.includes("lamp")
  ) {
    return "lamp";
  }

  if (value.includes("book")) {
    return "book";
  }

  if (
    value.includes("footwear") ||
    value.includes("shoe")
  ) {
    return "shoe";
  }

  if (
    value.includes("bag") ||
    value.includes("bags")
  ) {
    return "bag";
  }

  return "bag";
};

const getProductHue = (kind) => {
  const hues = {
    phone: 215,
    headphones: 265,
    shirt: 335,
    watch: 25,
    lamp: 45,
    book: 150,
    shoe: 190,
    bag: 0,
  };

  return hues[kind] ?? 215;
};

/* ---------- product card ---------- */

function ProductCard({
  p,
  added,
  onAdd,
}) {
  const off =
    p.old > p.price
      ? Math.round(
          (1 - p.price / p.old) * 100
        )
      : 0;

  return (
    <article className="hm-card">
      <a
        href={`/product/${p.id}`}
        className="hm-card-art"
        style={{
          "--h": p.hue,
        }}
        aria-label={p.name}
      >
        {p.img ? (
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display =
                "none";

              e.currentTarget.nextElementSibling?.removeAttribute(
                "hidden"
              );
            }}
          />
        ) : null}

        <span
          hidden={Boolean(p.img)}
          className="hm-card-art-fallback"
        >
          <Art
            kind={p.kind}
            size={72}
          />
        </span>

        {off > 0 && (
          <span className="hm-off">
            {off}% off
          </span>
        )}
      </a>

      <div className="hm-card-body">
        <a
          href={`/product/${p.id}`}
          className="hm-card-name"
        >
          {p.name}
        </a>

        <div className="hm-rating">
          <span
            className="hm-stars"
            style={{
              "--r": p.rating,
            }}
            aria-hidden="true"
          >
            ★★★★★
          </span>

          <span>
            {p.rating || 0} (
            {Number(
              p.reviews || 0
            ).toLocaleString("en-IN")}
            )
          </span>
        </div>

        <div className="hm-price">
          <b>
            {money(p.price)}
          </b>

          {p.old > p.price && (
            <s>
              {money(p.old)}
            </s>
          )}
        </div>

        <button
          className={`hm-add ${
            added
              ? "hm-add--done"
              : ""
          }`}
          onClick={() => onAdd(p)}
        >
          {added
            ? "Added to cart"
            : "Add to cart"}
        </button>
      </div>
    </article>
  );
}

/* ---------- page ---------- */

export default function Home({
  onAddToCart = () => {},
}) {
  const [slide, setSlide] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  const [left, setLeft] = useState(
    secondsToMidnight
  );

  const [addedId, setAddedId] =
    useState(null);

  /* ---------- backend products ---------- */

  const [products, setProducts] =
    useState([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(true);

  const [
    productError,
    setProductError,
  ] = useState("");

  /* =========================================================
     TOUCH / MOUSE / TOUCHPAD REFS
  ========================================================= */

  const touchStartX =
    useRef(null);

  const touchCurrentX =
    useRef(null);

  const mouseStartX =
    useRef(null);

  const mouseCurrentX =
    useRef(null);

  const mouseDragging =
    useRef(false);

  const wheelAccumulator =
    useRef(0);

  const wheelLocked =
    useRef(false);

  const wheelUnlockTimer =
    useRef(null);

  const SWIPE_THRESHOLD = 50;
  const WHEEL_THRESHOLD = 70;

  /* ---------- fetch products ---------- */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductError("");

        const response =
          await api.get(
            "/products"
          );

        if (
          response.data.success
        ) {
          const formattedProducts = (
            response.data.products ||
            []
          ).map((product) => {
            const kind =
              getProductKind(
                product.category
              );

            return {
              id: product._id,

              name: product.name,

              category:
                product.category,

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
                product.description ||
                "",

              stock: Number(
                product.stock || 0
              ),

              kind,

              hue:
                getProductHue(
                  kind
                ),
            };
          });

          setProducts(
            formattedProducts
          );
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Fetch products error:",
          error
        );

        setProductError(
          "Unable to load products."
        );

        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------- auto hero slider ---------- */

  useEffect(() => {
    if (
      paused ||
      window
        .matchMedia(
          "(prefers-reduced-motion: reduce)"
        )
        .matches
    ) {
      return;
    }

    const t = setInterval(
      () =>
        setSlide(
          (s) =>
            (s + 1) %
            SLIDES.length
        ),
      2000
    );

    return () =>
      clearInterval(t);
  }, [paused]);

  /* ---------- clean wheel timer ---------- */

  useEffect(() => {
    return () => {
      if (
        wheelUnlockTimer.current
      ) {
        clearTimeout(
          wheelUnlockTimer.current
        );
      }
    };
  }, []);

  /* ---------- deal countdown ---------- */

  useEffect(() => {
    const t = setInterval(
      () =>
        setLeft(
          secondsToMidnight()
        ),
      1000
    );

    return () =>
      clearInterval(t);
  }, []);

  /* ---------- add to cart ---------- */

  const add = (p) => {
    onAddToCart(p);

    setAddedId(p.id);

    setTimeout(() => {
      setAddedId((id) =>
        id === p.id ? null : id
      );
    }, 1400);
  };

  /* =========================================================
     GO TO NEXT / PREVIOUS
  ========================================================= */

  const nextSlide = () => {
    setSlide(
      (current) =>
        (current + 1) %
        SLIDES.length
    );
  };

  const previousSlide = () => {
    setSlide(
      (current) =>
        (current -
          1 +
          SLIDES.length) %
        SLIDES.length
    );
  };

  /* =========================================================
     MOBILE FINGER SWIPE
  ========================================================= */

  const handleTouchStart = (e) => {
    if (!e.touches?.length) {
      return;
    }

    touchStartX.current =
      e.touches[0].clientX;

    touchCurrentX.current =
      e.touches[0].clientX;

    setPaused(true);
  };

  const handleTouchMove = (e) => {
    if (!e.touches?.length) {
      return;
    }

    touchCurrentX.current =
      e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchCurrentX.current === null
    ) {
      setPaused(false);
      return;
    }

    const distance =
      touchStartX.current -
      touchCurrentX.current;

    if (
      distance >=
      SWIPE_THRESHOLD
    ) {
      nextSlide();
    } else if (
      distance <=
      -SWIPE_THRESHOLD
    ) {
      previousSlide();
    }

    touchStartX.current = null;
    touchCurrentX.current = null;

    setPaused(false);
  };

  const handleTouchCancel = () => {
    touchStartX.current =
      null;

    touchCurrentX.current =
      null;

    setPaused(false);
  };

  /* =========================================================
     LAPTOP TOUCHPAD HORIZONTAL SCROLL
  ========================================================= */

  const handleWheel = (e) => {
    const horizontal =
      Math.abs(e.deltaX) >
      Math.abs(e.deltaY);

    if (!horizontal) {
      return;
    }

    if (
      Math.abs(e.deltaX) <
      1
    ) {
      return;
    }

    e.preventDefault();

    wheelAccumulator.current +=
      e.deltaX;

    if (
      Math.abs(
        wheelAccumulator.current
      ) <
      WHEEL_THRESHOLD
    ) {
      return;
    }

    if (wheelLocked.current) {
      wheelAccumulator.current = 0;
      return;
    }

    if (
      wheelAccumulator.current >
      0
    ) {
      nextSlide();
    } else {
      previousSlide();
    }

    wheelAccumulator.current = 0;

    wheelLocked.current = true;
    setPaused(true);

    if (
      wheelUnlockTimer.current
    ) {
      clearTimeout(
        wheelUnlockTimer.current
      );
    }

    wheelUnlockTimer.current =
      setTimeout(() => {
        wheelLocked.current = false;
        setPaused(false);
      }, 450);
  };

  /* =========================================================
     LAPTOP MOUSE DRAG
  ========================================================= */

  const handleMouseDown = (e) => {
    // Only left mouse button
    if (e.button !== 0) {
      return;
    }

    mouseStartX.current =
      e.clientX;

    mouseCurrentX.current =
      e.clientX;

    mouseDragging.current =
      true;

    setPaused(true);
  };

  const handleMouseMove = (e) => {
    if (!mouseDragging.current) {
      return;
    }

    mouseCurrentX.current =
      e.clientX;
  };

  const handleMouseUp = () => {
    if (!mouseDragging.current) {
      return;
    }

    const start =
      mouseStartX.current;

    const current =
      mouseCurrentX.current;

    if (
      start !== null &&
      current !== null
    ) {
      const distance =
        start - current;

      if (
        distance >=
        SWIPE_THRESHOLD
      ) {
        nextSlide();
      } else if (
        distance <=
        -SWIPE_THRESHOLD
      ) {
        previousSlide();
      }
    }

    mouseStartX.current = null;
    mouseCurrentX.current = null;
    mouseDragging.current = false;

    setPaused(false);
  };

  const handleMouseLeave = () => {
    if (mouseDragging.current) {
      const start =
        mouseStartX.current;

      const current =
        mouseCurrentX.current;

      if (
        start !== null &&
        current !== null
      ) {
        const distance =
          start - current;

        if (
          distance >=
          SWIPE_THRESHOLD
        ) {
          nextSlide();
        } else if (
          distance <=
          -SWIPE_THRESHOLD
        ) {
          previousSlide();
        }
      }
    }

    mouseStartX.current = null;
    mouseCurrentX.current = null;
    mouseDragging.current = false;

    setPaused(false);
  };

  /* ---------- current slide ---------- */

  const s = SLIDES[slide];

  const go = (i) =>
    setSlide(
      (i + SLIDES.length) %
        SLIDES.length
    );

  /* ---------- products for sections ---------- */

  const dealProducts =
    products.slice(0, 4);

  const trendingProducts =
    products.slice(4, 12);

  return (
    <div className="hm">
      <div className="hm-wrap">

        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="hm-hero"
          aria-roledescription="carousel"
          aria-label="Featured offers"

          onMouseEnter={() =>
            setPaused(true)
          }

          onMouseLeave={
            handleMouseLeave
          }

          onFocus={() =>
            setPaused(true)
          }

          onBlur={() =>
            setPaused(false)
          }

          onTouchStart={
            handleTouchStart
          }

          onTouchMove={
            handleTouchMove
          }

          onTouchEnd={
            handleTouchEnd
          }

          onTouchCancel={
            handleTouchCancel
          }

          onWheel={
            handleWheel
          }

          onMouseDown={
            handleMouseDown
          }

          onMouseMove={
            handleMouseMove
          }

          onMouseUp={
            handleMouseUp
          }
        >
          <div
            key={s.id}
            className={`hm-slide hm-slide--${s.tone}`}
          >
            <div className="hm-slide-copy">
              <h1>
                {s.title}
              </h1>

              <p>
                {s.text}
              </p>

              <a
                href={s.href}
                className="hm-cta"
              >
                {s.cta}
              </a>
            </div>

            <div
              className="hm-slide-art"
              aria-hidden="true"
            >
              <Art
                kind={s.kind}
                size={220}
                stroke={0.9}
              />
            </div>
          </div>

          <button
            className="hm-arrow hm-arrow--prev"
            onClick={() =>
              go(slide - 1)
            }
            aria-label="Previous offer"
          >
            ‹
          </button>

          <button
            className="hm-arrow hm-arrow--next"
            onClick={() =>
              go(slide + 1)
            }
            aria-label="Next offer"
          >
            ›
          </button>

          <div className="hm-dots">
            {SLIDES.map(
              (d, i) => (
                <button
                  key={d.id}
                  className={
                    i === slide
                      ? "hm-dot hm-dot--on"
                      : "hm-dot"
                  }
                  onClick={() =>
                    go(i)
                  }
                  aria-label={`Show offer ${
                    i + 1
                  }`}
                  aria-current={
                    i === slide
                  }
                />
              )
            )}
          </div>
        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section aria-labelledby="hm-cats">
          <div className="hm-head">
            <h2 id="hm-cats">
              Shop by category
            </h2>

            <a href="/categories">
              See all
            </a>
          </div>

          <ul className="hm-cats">
            {CATEGORIES.map(
              (c) => (
                <li key={c.name}>
                  <a
                    href={c.href}
                    className="hm-cat"
                    style={{
                      "--h": c.hue,
                    }}
                  >
                    <span className="hm-cat-icon">
                      <Art
                        kind={c.kind}
                        size={30}
                      />
                    </span>

                    {c.name}
                  </a>
                </li>
              )
            )}
          </ul>
        </section>

        {/* =================================================
            DEAL OF THE DAY
        ================================================= */}

        <section
          className="hm-panel"
          aria-labelledby="hm-deals"
        >
          <div className="hm-head">
            <div className="hm-head-group">
              <h2 id="hm-deals">
                Deals of the day
              </h2>

              <span
                className="hm-timer"
                aria-label="Time left"
              >
                Ends in{" "}
                {clock(left)}
              </span>
            </div>

            <a href="/deals">
              See all deals
            </a>
          </div>

          {loadingProducts ? (
            <div className="hm-products-message">
              Loading products...
            </div>
          ) : productError ? (
            <div className="hm-products-message">
              {productError}
            </div>
          ) : dealProducts.length ===
            0 ? (
            <div className="hm-products-message">
              No products available.
            </div>
          ) : (
            <div className="hm-grid hm-grid--4">
              {dealProducts.map(
                (p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    added={
                      addedId ===
                      p.id
                    }
                    onAdd={add}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* =================================================
            PROMO BANNERS
        ================================================= */}

        <section className="hm-promos">
          <a
            href="/c/fashion"
            className="hm-promo hm-promo--rose"
          >
            <div>
              <h3>
                Up to 60% off fashion
              </h3>

              <p>
                Clothing, footwear and
                bags from top brands.
              </p>

              <span>
                Shop the sale
              </span>
            </div>

            <Art
              kind="shirt"
              size={110}
              stroke={1}
            />
          </a>

          <a
            href="/c/electronics"
            className="hm-promo hm-promo--mega"
          >
            <div className="hm-mega-copy">
              <span className="hm-mega-badge">
                LIMITED TIME
              </span>

              <h3>
                Mega Deals
                <br />
                Are Live
              </h3>

              <p>
                Up to 50% OFF on
                electronics, gadgets
                and accessories.
              </p>

              <span className="hm-mega-link">
                Shop Electronics →
              </span>
            </div>

            <div className="hm-mega-offer">
              <strong>
                50%
              </strong>

              <span>
                OFF
              </span>
            </div>
          </a>
        </section>

        {/* =================================================
            TRENDING
        ================================================= */}

        <section
          aria-labelledby="hm-trend"
        >
          <div className="hm-head">
            <h2 id="hm-trend">
              Trending now
            </h2>

            <a href="/best-sellers">
              See best sellers
            </a>
          </div>

          {loadingProducts ? (
            <div className="hm-products-message">
              Loading products...
            </div>
          ) : productError ? (
            <div className="hm-products-message">
              {productError}
            </div>
          ) : trendingProducts.length ===
            0 ? (
            <div className="hm-products-message">
              No trending products
              available.
            </div>
          ) : (
            <div className="hm-grid hm-grid--4">
              {trendingProducts.map(
                (p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    added={
                      addedId ===
                      p.id
                    }
                    onAdd={add}
                  />
                )
              )}
            </div>
          )}
        </section>

        {/* =================================================
            TRUST STRIP
        ================================================= */}

        <section
          className="hm-trust"
          aria-label="Why shop with Shopora"
        >
          {TRUST.map((t) => (
            <div
              key={t.title}
              className="hm-trust-item"
            >
              <span className="hm-trust-icon">
                <Art
                  kind={t.kind}
                  size={26}
                />
              </span>

              <div>
                <b>
                  {t.title}
                </b>

                <p>
                  {t.text}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminSupport from "./pages/AdminSupport";

import Category from "./pages/Category";
import StoreCollection from "./pages/StoreCollection";

import CustomerService from "./pages/CustomerService";
import Addresses from "./pages/Addresses";
import Account from "./pages/Account";
import Wishlist from "./pages/Wishlist";
import Footer from "./Components/Footer";
import ExternalProductDetails from "./pages/ExternalProductDetails";


// =====================================================
// LOAD USER
// =====================================================

const loadUser = () => {
  try {
    const savedUser =
      localStorage.getItem("shopora_user");

    if (!savedUser) {
      return null;
    }

    return JSON.parse(savedUser);
  } catch {
    return null;
  }
};


// =====================================================
// SIMPLE PAGE
// =====================================================

function Simple({ title }) {
  return (
    <div className="page">
      <h1>{title}</h1>
    </div>
  );
}


// =====================================================
// LOGIN PROTECTION
// =====================================================

function RequireLogin({
  user,
  children,
}) {
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// ADMIN PROTECTION
// =====================================================

function RequireAdmin({
  user,
  children,
}) {
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}


// =====================================================
// SHELL
// =====================================================

function Shell() {
  const navigate = useNavigate();

  // ===================================================
  // USER
  // ===================================================

  const [user, setUser] =
    useState(loadUser);


  // ===================================================
  // CART
  // ===================================================

  const [cart, setCart] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              "shopora_cart"
            )
          ) || []
        );
      } catch {
        return [];
      }
    });


  // ===================================================
  // ORDERS - LOCAL UI HISTORY
  // ===================================================

  const [orders, setOrders] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem(
              "shopora_orders"
            )
          ) || []
        );
      } catch {
        return [];
      }
    });


  // ===================================================
  // PLACE ORDER
  // ===================================================

  const placeOrder = (order) => {
    setOrders(
      (currentOrders) => {
        const updated = [
          order,
          ...currentOrders,
        ];

        localStorage.setItem(
          "shopora_orders",
          JSON.stringify(updated)
        );

        return updated;
      }
    );

    setCart([]);
  };


  // ===================================================
  // CART COUNT
  // ===================================================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // ===================================================
  // ADD TO CART
  // ===================================================

  const addToCart = (product) => {
    setCart(
      (currentCart) => {
        const existing =
          currentCart.find(
            (item) =>
              item.id === product.id
          );

        if (existing) {
          return currentCart.map(
            (item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
          );
        }

        return [
          ...currentCart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }
    );
  };


  // ===================================================
  // USER LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "shopora_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(
        "shopora_user"
      );
    }
  }, [user]);


  // ===================================================
  // CART LOCAL STORAGE
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      "shopora_cart",
      JSON.stringify(cart)
    );
  }, [cart]);


  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "shopora_token"
    );

    localStorage.removeItem(
      "shopora_user"
    );

    navigate("/");
  };


  // ===================================================
  // INCREASE QUANTITY
  // ===================================================

  const increaseQuantity = (
    id
  ) => {
    setCart((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };


  // ===================================================
  // DECREASE QUANTITY
  // ===================================================

  const decreaseQuantity = (
    id
  ) => {
    setCart((items) =>
      items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };


  // ===================================================
  // REMOVE FROM CART
  // ===================================================

  const removeFromCart = (
    id
  ) => {
    setCart((items) =>
      items.filter(
        (item) => item.id !== id
      )
    );
  };


  // ===================================================
  // UI
  // ===================================================

  return (
    <>
      <Navbar
        user={user}
        cartCount={cartCount}
        location="India"
        onLogout={logout}
        onSearch={({
          query,
          category,
        }) => {
          navigate(
            `/search?q=${encodeURIComponent(
              query
            )}&c=${category}`
          );
        }}
      />


      <main>

        <Routes>

          {/* =========================================
              HOME
          ========================================= */}

          <Route
            path="/"
            element={
              <Home
                onAddToCart={
                  addToCart
                }
              />
            }
          />


          {/* =========================================
              LOGIN
          ========================================= */}

          <Route
            path="/login"
            element={
              <Login
                onLogin={setUser}
              />
            }
          />


          {/* =========================================
              PRODUCT DETAILS
              BOTH ROUTES SUPPORTED
          ========================================= */}

          <Route
            path="/product/:id"
            element={
              <ProductDetails
                onAddToCart={
                  addToCart
                }
              />
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProductDetails
                onAddToCart={
                  addToCart
                }
              />
            }
          />
          <Route
  path="/external-product/:id"
  element={
    <ExternalProductDetails />
  }
/>


          {/* =========================================
              REGISTER
          ========================================= */}

          <Route
            path="/register"
            element={
              <Register
                onLogin={setUser}
              />
            }
          />


          {/* =========================================
              CART
          ========================================= */}

          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onIncrease={
                  increaseQuantity
                }
                onDecrease={
                  decreaseQuantity
                }
                onRemove={
                  removeFromCart
                }
              />
            }
          />


          {/* =========================================
              CHECKOUT
          ========================================= */}

          <Route
            path="/checkout"
            element={
              <RequireLogin user={user}>
                <Checkout
                  cart={cart}
                  user={user}
                  onPlaceOrder={
                    placeOrder
                  }
                />
              </RequireLogin>
            }
          />


          {/* =========================================
              SEARCH
          ========================================= */}

          <Route
            path="/search"
            element={
              <Search
                onAddToCart={
                  addToCart
                }
              />
            }
          />


          {/* =========================================
              CATEGORY
          ========================================= */}

          <Route
            path="/c/:category"
            element={
              <Category />
            }
          />


          {/* =========================================
              STORE COLLECTIONS
          ========================================= */}

          <Route
            path="/deals"
            element={
              <StoreCollection
                type="deals"
              />
            }
          />

          <Route
            path="/best-sellers"
            element={
              <StoreCollection
                type="best-sellers"
              />
            }
          />

          <Route
            path="/new"
            element={
              <StoreCollection
                type="new"
              />
            }
          />


          {/* =========================================
              CUSTOMER SERVICE
          ========================================= */}

          <Route
            path="/help"
            element={
              <CustomerService
                user={user}
              />
            }
          />


          {/* =========================================
              ACCOUNT
          ========================================= */}

          <Route
            path="/account"
            element={
              <RequireLogin
                user={user}
              >
                <Account
                  user={user}
                />
              </RequireLogin>
            }
          />


          {/* =========================================
              ORDERS
          ========================================= */}

          <Route
            path="/orders"
            element={
              <RequireLogin
                user={user}
              >
                <Orders
                  orders={orders}
                  onAddToCart={
                    addToCart
                  }
                />
              </RequireLogin>
            }
          />


          {/* =========================================
              ORDER DETAILS
          ========================================= */}

          <Route
            path="/orders/:id"
            element={
              <RequireLogin
                user={user}
              >
                <OrderDetails />
              </RequireLogin>
            }
          />


          {/* =========================================
              ADDRESSES
          ========================================= */}

          <Route
            path="/addresses"
            element={
              <RequireLogin
                user={user}
              >
                <Addresses
                  user={user}
                />
              </RequireLogin>
            }
          />


          {/* =========================================
              WISHLIST
          ========================================= */}

          <Route
            path="/wishlist"
            element={
              <RequireLogin
                user={user}
              >
                <Wishlist />
              </RequireLogin>
            }
          />


          {/* =========================================
              ADMIN DASHBOARD
          ========================================= */}

          <Route
            path="/admin"
            element={
              <RequireAdmin
                user={user}
              >
                <AdminDashboard />
              </RequireAdmin>
            }
          />


          {/* =========================================
              ADMIN PRODUCTS
          ========================================= */}

          <Route
            path="/admin/products"
            element={
              <RequireAdmin
                user={user}
              >
                <AdminDashboard />
              </RequireAdmin>
            }
          />


          {/* =========================================
              ADMIN SUPPORT
          ========================================= */}

          <Route
            path="/admin/support"
            element={
              <RequireAdmin
                user={user}
              >
                <AdminSupport />
              </RequireAdmin>
            }
          />


          {/* =========================================
              ADMIN ORDERS
          ========================================= */}

          <Route
            path="/admin/orders"
            element={
              <RequireAdmin
                user={user}
              >
                <AdminOrders />
              </RequireAdmin>
            }
          />


          {/* =========================================
              ADMIN USERS
          ========================================= */}

          <Route
            path="/admin/users"
            element={
              <RequireAdmin
                user={user}
              >
                <AdminUsers />
              </RequireAdmin>
            }
          />


          {/* =========================================
              FALLBACK
          ========================================= */}

          <Route
            path="*"
            element={
              <Simple
                title="Page not found"
              />
            }
          />

        </Routes>
        <Footer user={user} />

      </main>
    </>
  );
}


// =====================================================
// APP
// =====================================================

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}
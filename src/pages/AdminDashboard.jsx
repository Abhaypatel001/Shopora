import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  rating: "",
  reviews: "",
  description: "",
  stock: "",
  section: "trending",
  sortOrder: "",
};

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ==========================================
  // CHECK ADMIN
  // ==========================================
  useEffect(() => {
    const userString =
      localStorage.getItem("shopora_user");

    if (!userString) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);

      if (user.role !== "admin") {
        navigate("/");
      }
    } catch (error) {
      console.error("User parse error:", error);
      navigate("/login");
    }
  }, [navigate]);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const updateField = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    console.log("Selected image:", file);
    console.log("Image name:", file.name);
    console.log("Image type:", file.type);
    console.log("Image size:", file.size);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ==========================================
  // RESET FORM
  // ==========================================
  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setImageFile(null);
    setImagePreview("");
  };

  // ==========================================
  // START EDIT
  // ==========================================
  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      rating: product.rating ?? "",
      reviews: product.reviews ?? "",
      description: product.description || "",
      stock: product.stock ?? "",
      section: product.section || "trending",
      sortOrder: product.sortOrder ?? "",
    });

    setImageFile(null);
    setImagePreview(product.image || "");

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("shopora_token");

      if (!token) {
        navigate("/login");
        return;
      }

      // ----------------------------------------
      // VALUES
      // ----------------------------------------
      const name = form.name.trim();
      const category = form.category.trim();

      const price = Number(form.price);
      const oldPrice = Number(
        form.oldPrice || 0
      );
      const rating = Number(
        form.rating || 0
      );
      const reviews = Number(
        form.reviews || 0
      );
      const stock = Number(
        form.stock || 0
      );
      const sortOrder = Number(
        form.sortOrder || 0
      );

      // ----------------------------------------
      // VALIDATION
      // ----------------------------------------
      if (!name) {
        setError(
          "Product name is required."
        );
        return;
      }

      if (!category) {
        setError(
          "Category is required."
        );
        return;
      }

      if (
        Number.isNaN(price) ||
        price < 0
      ) {
        setError(
          "Please enter a valid price."
        );
        return;
      }

      if (
        Number.isNaN(oldPrice) ||
        oldPrice < 0
      ) {
        setError(
          "Please enter a valid old price."
        );
        return;
      }

      if (
        Number.isNaN(rating) ||
        rating < 0 ||
        rating > 5
      ) {
        setError(
          "Rating must be between 0 and 5."
        );
        return;
      }

      if (
        Number.isNaN(reviews) ||
        reviews < 0
      ) {
        setError(
          "Reviews cannot be negative."
        );
        return;
      }

      if (
        Number.isNaN(stock) ||
        stock < 0
      ) {
        setError(
          "Stock cannot be negative."
        );
        return;
      }

      if (
        Number.isNaN(sortOrder) ||
        sortOrder < 0
      ) {
        setError(
          "Sort order cannot be negative."
        );
        return;
      }

      // ----------------------------------------
      // FORM DATA
      // ----------------------------------------
      const formData = new FormData();

      formData.append("name", name);
      formData.append(
        "category",
        category
      );
      formData.append(
        "price",
        price.toString()
      );
      formData.append(
        "oldPrice",
        oldPrice.toString()
      );
      formData.append(
        "rating",
        rating.toString()
      );
      formData.append(
        "reviews",
        reviews.toString()
      );
      formData.append(
        "description",
        form.description.trim()
      );
      formData.append(
        "stock",
        stock.toString()
      );
      formData.append(
        "section",
        form.section
      );
      formData.append(
        "sortOrder",
        sortOrder.toString()
      );

      // ----------------------------------------
      // IMAGE
      // ----------------------------------------
      if (imageFile) {
        console.log(
          "Uploading image:",
          imageFile.name
        );

        formData.append(
          "image",
          imageFile
        );
      } else {
        console.log(
          "No new image selected"
        );
      }

      // Check what is being sent
      console.log(
        "FormData image:",
        formData.get("image")
      );

      console.log(
        "FormData name:",
        formData.get("name")
      );

      // ----------------------------------------
      // REQUEST URL
      // ----------------------------------------
      const url = editingId
        ? `https://shopora-uefe.onrender.com/api/products/${editingId}`
        : "https://shopora-uefe.onrender.com/api/products";

      const method = editingId
        ? "PUT"
        : "POST";

      // ----------------------------------------
      // FETCH REQUEST
      // ----------------------------------------
      const response = await fetch(
        url,
        {
          method,

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      console.log(
        "Product API response:",
        data
      );

      // ----------------------------------------
      // ERROR
      // ----------------------------------------
      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save product."
        );
      }

      // ----------------------------------------
      // SUCCESS
      // ----------------------------------------
      if (data.success) {
        setSuccess(
          editingId
            ? "Product updated successfully."
            : "Product added successfully."
        );

        resetForm();

        await fetchProducts();
      }

    } catch (error) {
      console.error(
        "Save product error:",
        error
      );

      setError(
        error.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.delete(
        `/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(
          "Product deleted successfully."
        );

        await fetchProducts();

        if (editingId === id) {
          resetForm();
        }
      }

    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "shopora_token"
        );

        localStorage.removeItem(
          "shopora_user"
        );

        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    localStorage.removeItem(
      "shopora_token"
    );

    localStorage.removeItem(
      "shopora_user"
    );

    navigate("/login");
  };

  // ==========================================
  // STATS
  // ==========================================
  const totalProducts =
    products.length;

  const totalStock =
    products.reduce(
      (sum, product) =>
        sum +
        Number(product.stock || 0),
      0
    );

  const dealsCount =
    products.filter(
      (product) =>
        product.section === "deals"
    ).length;

  const lowStockCount =
    products.filter(
      (product) =>
        Number(product.stock || 0) > 0 &&
        Number(product.stock || 0) <= 5
    ).length;

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="admin-page">

      {/* HEADER */}
      <header className="admin-header">

        <div>
          <span className="admin-kicker">
            SHOPORA ADMIN
          </span>

          <h1>
            Manage Products
          </h1>

          <p>
            Add, edit, delete and manage
            product inventory.
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            className="admin-home-btn"
            onClick={() =>
              navigate("/")
            }
          >
            View Store
          </button>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* MESSAGES */}
      {error && (
        <div className="admin-message admin-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-message admin-success">
          {success}
        </div>
      )}


      {/* STATS */}
      <section className="admin-stats">

        <div className="admin-stat-card">
          <span>Products</span>
          <strong>
            {totalProducts}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Stock</span>
          <strong>
            {totalStock}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Deals</span>
          <strong>
            {dealsCount}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Low Stock</span>
          <strong>
            {lowStockCount}
          </strong>
        </div>

      </section>


      {/* MAIN */}
      <section className="admin-content">

        {/* PRODUCT FORM */}
        <div className="admin-form-card">

          <div className="admin-card-heading">

            <div>
              <span>
                PRODUCT MANAGEMENT
              </span>

              <h2>
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                className="admin-cancel-btn"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>


          <form
            className="admin-product-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}
            <div className="admin-field">
              <label>
                Product Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Enter product name"
                required
              />
            </div>


            {/* CATEGORY */}
            <div className="admin-field">
              <label>
                Category
              </label>

              <input
                name="category"
                value={form.category}
                onChange={updateField}
                placeholder="e.g. Fashion"
                required
              />
            </div>


            {/* PRICE */}
            <div className="admin-form-row">

              <div className="admin-field">
                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={updateField}
                  min="0"
                  placeholder="14999"
                  required
                />
              </div>

              <div className="admin-field">
                <label>
                  Old Price
                </label>

                <input
                  type="number"
                  name="oldPrice"
                  value={form.oldPrice}
                  onChange={updateField}
                  min="0"
                  placeholder="19999"
                />
              </div>

            </div>


            {/* RATING */}
            <div className="admin-form-row">

              <div className="admin-field">
                <label>
                  Rating
                </label>

                <input
                  type="number"
                  name="rating"
                  value={form.rating}
                  onChange={updateField}
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                />
              </div>

              <div className="admin-field">
                <label>
                  Reviews
                </label>

                <input
                  type="number"
                  name="reviews"
                  value={form.reviews}
                  onChange={updateField}
                  min="0"
                  placeholder="1200"
                />
              </div>

            </div>


            {/* STOCK */}
            <div className="admin-form-row">

              <div className="admin-field">
                <label>
                  Stock
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={updateField}
                  min="0"
                  placeholder="50"
                  required
                />
              </div>

              <div className="admin-field">
                <label>
                  Sort Order
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
                  onChange={updateField}
                  min="0"
                  placeholder="1"
                />
              </div>

            </div>


            {/* SECTION */}
            <div className="admin-field">

              <label>
                Section
              </label>

              <select
                name="section"
                value={form.section}
                onChange={updateField}
              >
                <option value="deals">
                  Deals
                </option>

                <option value="trending">
                  Trending
                </option>
              </select>

            </div>


            {/* IMAGE */}
            <div className="admin-field">

              <label>
                Product Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
              />

              <small
                style={{
                  color: "#7b8192",
                  fontSize: "12px",
                }}
              >
                JPG, PNG or WEBP • Max 5MB
              </small>

              {imagePreview && (
                <div className="admin-image-preview">

                  <img
                    src={imagePreview}
                    alt="Product preview"
                  />

                </div>
              )}

            </div>


            {/* DESCRIPTION */}
            <div className="admin-field">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                rows="5"
                placeholder="Product description..."
              />

            </div>


            {/* SAVE */}
            <button
              className="admin-save-btn"
              type="submit"
              disabled={saving}
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Uploading..."
                : editingId
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>

        </div>


        {/* PRODUCT LIST */}
        <div className="admin-products-card">

          <div className="admin-card-heading">

            <div>
              <span>
                INVENTORY
              </span>

              <h2>
                All Products
              </h2>
            </div>

            <span className="admin-product-count">
              {products.length} products
            </span>

          </div>


          {loading ? (

            <div className="admin-loading">
              Loading products...
            </div>

          ) : products.length === 0 ? (

            <div className="admin-empty">
              No products found.
            </div>

          ) : (

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Section</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => (

                      <tr
                        key={product._id}
                      >

                        <td>

                          <div className="admin-product-cell">

                            <div className="admin-product-image">

                              {product.image ? (

                                <img
                                  src={
                                    product.image
                                  }
                                  alt={
                                    product.name
                                  }
                                />

                              ) : (

                                <span>
                                  🛍️
                                </span>

                              )}

                            </div>

                            <div>

                              <strong>
                                {product.name}
                              </strong>

                              <small>
                                ID:{" "}
                                {product._id}
                              </small>

                            </div>

                          </div>

                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td>
                          {money(
                            product.price
                          )}
                        </td>

                        <td>

                          <span
                            className={`admin-stock ${
                              Number(
                                product.stock
                              ) === 0
                                ? "out"
                                : Number(
                                    product.stock
                                  ) <= 5
                                ? "low"
                                : "good"
                            }`}
                          >
                            {product.stock}
                          </span>

                        </td>

                        <td>

                          <span className="admin-section-badge">
                            {product.section}
                          </span>

                        </td>

                        <td>

                          <div className="admin-actions">

                            <button
                              type="button"
                              className="admin-edit-btn"
                              onClick={() =>
                                handleEdit(
                                  product
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  product._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}
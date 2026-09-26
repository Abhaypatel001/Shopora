import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

const emptyForm = {
  label: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function Addresses({
  user,
}) {
  const navigate = useNavigate();

  const [addresses, setAddresses] =
    useState([]);

  const [form, setForm] =
    useState({ ...emptyForm });

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==========================================
  // FETCH ADDRESSES
  // ==========================================
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      if (!token) {
        navigate("/login");
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

      if (response.data.success) {
        setAddresses(
          response.data.addresses || []
        );
      }

    } catch (error) {
      console.error(
        "Fetch addresses error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load addresses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ==========================================
  // INPUT
  // ==========================================
  const updateField = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // RESET
  // ==========================================
  const resetForm = () => {
    setForm({
      ...emptyForm,
      name: user?.name || "",
    });

    setEditingId(null);
    setError("");
  };

  // ==========================================
  // ADD / UPDATE
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
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

      const payload = {
        ...form,
        phone: form.phone.trim(),
        pincode: form.pincode.trim(),
      };

      let response;

      if (editingId) {
        response = await api.put(
          `/users/addresses/${editingId}`,
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await api.post(
          "/users/addresses",
          payload,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setAddresses(
          response.data.addresses || []
        );

        setSuccess(
          editingId
            ? "Address updated successfully."
            : "Address added successfully."
        );

        resetForm();

        window.dispatchEvent(
          new Event(
            "shoporaAddressUpdated"
          )
        );
      }

    } catch (error) {
      console.error(
        "Save address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save address."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // EDIT
  // ==========================================
  const handleEdit = (address) => {
    setEditingId(address._id);

    setForm({
      label: address.label || "Home",
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      isDefault: Boolean(
        address.isDefault
      ),
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete = async (
    addressId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this address?"
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

      const response =
        await api.delete(
          `/users/addresses/${addressId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setAddresses(
          response.data.addresses || []
        );

        setSuccess(
          "Address deleted successfully."
        );

        window.dispatchEvent(
          new Event(
            "shoporaAddressUpdated"
          )
        );
      }

    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete address."
      );
    }
  };

  // ==========================================
  // SET DEFAULT
  // ==========================================
  const handleDefault = async (
    addressId
  ) => {
    try {
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem(
          "shopora_token"
        );

      const response =
        await api.patch(
          `/users/addresses/${addressId}/default`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (response.data.success) {
        setAddresses(
          response.data.addresses || []
        );

        setSuccess(
          "Default address updated."
        );

        window.dispatchEvent(
          new Event(
            "shoporaAddressUpdated"
          )
        );
      }

    } catch (error) {
      console.error(
        "Default address error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update default address."
      );
    }
  };

  return (
    <div className="addresses-page">

      {/* HEADER */}
      <div className="addresses-header">

        <div>
          <span className="addresses-kicker">
            SHOPORA
          </span>

          <h1>
            Your Addresses
          </h1>

          <p>
            Add and manage your delivery
            addresses.
          </p>
        </div>

        <button
          className="addresses-back-btn"
          onClick={() => navigate("/")}
        >
          ← Continue Shopping
        </button>

      </div>

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

      <div className="addresses-layout">

        {/* FORM */}
        <section className="address-form-card">

          <div className="address-card-heading">

            <span>
              DELIVERY ADDRESS
            </span>

            <h2>
              {editingId
                ? "Edit Address"
                : "Add New Address"}
            </h2>

          </div>

          <form
            className="address-form"
            onSubmit={handleSubmit}
          >

            <div className="address-labels">

              {[
                "Home",
                "Work",
                "Other",
              ].map((label) => (
                <button
                  type="button"
                  key={label}
                  className={
                    form.label === label
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      label,
                    }))
                  }
                >
                  {label}
                </button>
              ))}

            </div>

            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Full name"
              required
            />

            <input
              name="phone"
              value={form.phone}
              onChange={updateField}
              placeholder="10-digit phone number"
              inputMode="numeric"
              maxLength="10"
              required
            />

            <textarea
              name="address"
              value={form.address}
              onChange={updateField}
              rows="3"
              placeholder="House no., street, area"
              required
            />

            <div className="address-two-col">

              <input
                name="city"
                value={form.city}
                onChange={updateField}
                placeholder="City"
                required
              />

              <input
                name="state"
                value={form.state}
                onChange={updateField}
                placeholder="State"
                required
              />

            </div>

            <input
              name="pincode"
              value={form.pincode}
              onChange={updateField}
              placeholder="6-digit PIN code"
              inputMode="numeric"
              maxLength="6"
              required
            />

            <label className="default-check">

              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={updateField}
              />

              <span>
                Set as default address
              </span>

            </label>

            <div className="address-form-actions">

              <button
                type="submit"
                className="address-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Address"
                  : "Add Address"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="address-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>


        {/* LIST */}
        <section className="address-list-card">

          <div className="address-card-heading">

            <span>
              SAVED ADDRESSES
            </span>

            <h2>
              {addresses.length}{" "}
              {addresses.length === 1
                ? "Address"
                : "Addresses"}
            </h2>

          </div>

          {loading ? (
            <div className="address-empty">
              Loading addresses...
            </div>
          ) : addresses.length === 0 ? (
            <div className="address-empty">
              <div>📍</div>

              <h3>
                No saved addresses
              </h3>

              <p>
                Add an address to make checkout
                faster.
              </p>
            </div>
          ) : (
            <div className="address-list">

              {addresses.map(
                (address) => (
                  <article
                    key={address._id}
                    className={`saved-address-card ${
                      address.isDefault
                        ? "default"
                        : ""
                    }`}
                  >

                    <div className="saved-address-top">

                      <div>

                        <span className="address-type">
                          {address.label}
                        </span>

                        {address.isDefault && (
                          <span className="default-badge">
                            Default
                          </span>
                        )}

                      </div>

                      <div className="saved-address-actions">

                        <button
                          onClick={() =>
                            handleEdit(
                              address
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              address._id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                    <h3>
                      {address.name}
                    </h3>

                    <p>
                      {address.address}
                    </p>

                    <p>
                      {address.city},{" "}
                      {address.state} -{" "}
                      {address.pincode}
                    </p>

                    <p>
                      📞 {address.phone}
                    </p>

                    {!address.isDefault && (
                      <button
                        className="make-default-btn"
                        onClick={() =>
                          handleDefault(
                            address._id
                          )
                        }
                      >
                        Make Default
                      </button>
                    )}

                  </article>
                )
              )}

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

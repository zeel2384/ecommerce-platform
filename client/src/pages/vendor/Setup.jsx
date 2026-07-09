import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setupVendorShop } from "../../api";
import toast from "react-hot-toast";

const Setup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    shopAddress: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("shopName", formData.shopName);
      data.append("shopDescription", formData.shopDescription);
      data.append("shopAddress", formData.shopAddress);
      if (logo) {
        data.append("shopLogo", logo);
      }

      await setupVendorShop(data);
      toast.success("Shop created successfully! Waiting for approval.");
      navigate("/vendor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create shop");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    border: "1.5px solid var(--border)",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "var(--surface2)",
    color: "var(--text)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "600",
    color: "var(--text)",
    fontSize: "14px",
  };

  return (
    <div
      style={{
        backgroundColor: "var(--bg)",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <p
              style={{
                color: "#6366f1",
                fontWeight: "700",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Vendor Setup
            </p>
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}
            >
              Create your shop
            </h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Add your shop details, logo, and address so customers can start
              discovering your products.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1.25rem" }}
          >
            <div>
              <label style={labelStyle}>Shop Name</label>
              <input
                style={inputStyle}
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                placeholder="Enter your shop name"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Shop Description</label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "140px",
                  resize: "vertical",
                }}
                name="shopDescription"
                value={formData.shopDescription}
                onChange={handleChange}
                placeholder="Tell customers what you sell"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Shop Address</label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "110px",
                  resize: "vertical",
                }}
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                placeholder="Shop address or business location"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Shop Logo</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.85rem 1.2rem",
                    borderRadius: "12px",
                    backgroundColor: "#6366f1",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ display: "none" }}
                  />
                </label>
                <span
                  style={{ color: "var(--text-secondary)", fontSize: "14px" }}
                >
                  PNG, JPG or WEBP
                </span>
              </div>
              {preview && (
                <div
                  style={{
                    marginTop: "1rem",
                    width: "120px",
                    height: "120px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface2)",
                  }}
                >
                  <img
                    src={preview}
                    alt="Shop logo preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.9rem 1.5rem",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: loading ? "#a5b4fc" : "#6366f1",
                  color: "white",
                  fontWeight: "800",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Creating..." : "Create Shop"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/vendor/dashboard")}
                style={{
                  padding: "0.9rem 1.5rem",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface2)",
                  color: "var(--text)",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setup;

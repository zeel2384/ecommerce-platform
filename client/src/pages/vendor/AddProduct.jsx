import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../api";
import toast from "react-hot-toast";

const categories = [
  "Electronics",
  "Clothing",
  "Food",
  "Books",
  "Sports",
  "Beauty",
  "Home",
  "Toys",
  "Other",
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "Electronics",
    stock: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed!");
      return;
    }
    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice || 0);
      data.append("category", formData.category);
      data.append("stock", formData.stock);
      images.forEach((image) => {
        data.append("images", image);
      });
      await createProduct(data);
      toast.success("Product created successfully! 🎉");
      navigate("/vendor/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
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
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "var(--surface)",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "var(--text)",
                marginBottom: "0.5rem",
              }}
            >
              Add New Product 📦
            </h1>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "15px",
              }}
            >
              Fill in the details to list your product on VendorMart
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Product Name */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Product Name *</label>
              <input
                style={inputStyle}
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
                name="description"
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            {/* Price Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>Original Price (₹) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="price"
                  placeholder="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Discount Price (₹)
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontWeight: "400",
                      marginLeft: "4px",
                    }}
                  >
                    (optional)
                  </span>
                </label>
                <input
                  style={inputStyle}
                  type="number"
                  name="discountPrice"
                  placeholder="0"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            {/* Category and Stock */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <label style={labelStyle}>Category *</label>
                <select
                  style={inputStyle}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Stock Quantity *</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Images */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>
                Product Images
                <span
                  style={{
                    color: "var(--text-muted)",
                    fontWeight: "400",
                    marginLeft: "4px",
                  }}
                >
                  (max 5 images)
                </span>
              </label>
              <div
                style={{
                  border: "2px dashed var(--border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  textAlign: "center",
                  backgroundColor: "var(--surface2)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
                <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📸</p>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Click to upload images
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "12px",
                  }}
                >
                  JPG, PNG, WEBP — max 5MB each
                </p>
              </div>

              {/* Image Previews */}
              {previews.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    marginTop: "1rem",
                  }}
                >
                  {previews.map((preview, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "2px solid var(--border)",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          backgroundColor: "#6366f1",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          fontSize: "11px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                        }}
                      >
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--surface2)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
                onClick={() => navigate("/vendor/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "0.75rem 2rem",
                  backgroundColor: loading ? "#a5b4fc" : "#6366f1",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                disabled={loading}
              >
                {loading ? "Creating... ⏳" : "Create Product 🚀"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

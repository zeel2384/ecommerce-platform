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

    // Create previews
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("discountPrice", formData.discountPrice || 0);
      data.append("category", formData.category);
      data.append("stock", formData.stock);

      // Append images
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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Add New Product 📦</h1>
        <p style={styles.subtitle}>Fill in the details to list your product</p>

        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div style={styles.field}>
            <label style={styles.label}>Product Name *</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.field}>
            <label style={styles.label}>Description *</label>
            <textarea
              style={styles.textarea}
              name="description"
              placeholder="Describe your product..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
            />
          </div>

          {/* Price Row */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                style={styles.input}
                type="number"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Discount Price (₹)</label>
              <input
                style={styles.input}
                type="number"
                name="discountPrice"
                placeholder="0 (optional)"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          {/* Category and Stock Row */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Category *</label>
              <select
                style={styles.input}
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
            <div style={styles.field}>
              <label style={styles.label}>Stock *</label>
              <input
                style={styles.input}
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
          <div style={styles.field}>
            <label style={styles.label}>Product Images (max 5)</label>
            <input
              style={styles.fileInput}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
            />
            <p style={styles.fileHint}>
              Supported: JPG, PNG, WEBP (max 5MB each)
            </p>
          </div>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div style={styles.previews}>
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  style={styles.preview}
                />
              ))}
            </div>
          )}

          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/vendor/dashboard")}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={loading ? styles.buttonDisabled : styles.button}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Product 🚀"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#666",
    marginBottom: "2rem",
  },
  field: {
    marginBottom: "1.5rem",
    flex: 1,
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#333",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "1rem",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    color: "#333",
    fontFamily: "inherit",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  },
  fileInput: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "2px dashed #e5e7eb",
    fontSize: "14px",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  fileHint: {
    fontSize: "12px",
    color: "#999",
    marginTop: "4px",
  },
  previews: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  preview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
  },
  button: {
    padding: "0.75rem 2rem",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "0.75rem 2rem",
    backgroundColor: "#a5b4fc",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "not-allowed",
  },
  cancelBtn: {
    padding: "0.75rem 2rem",
    backgroundColor: "transparent",
    color: "#666",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AddProduct;

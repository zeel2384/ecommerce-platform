import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api";
import ProductCard from "../../components/product/ProductCard";
import toast from "react-hot-toast";

const categories = [
  "All",
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

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, sort, currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts({
        keyword,
        category,
        sort,
        page: currentPage,
        limit: 12,
      });
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setCurrentPage(1);
    if (cat === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleSort = (e) => {
    setCurrentPage(1);
    searchParams.set("sort", e.target.value);
    setSearchParams(searchParams);
  };

  return (
    <div style={styles.container}>
      {/* Hero Banner */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to VendorMart 🛒</h1>
        <p style={styles.heroSubtitle}>
          Discover amazing products from multiple vendors
        </p>
      </div>

      {/* Category Filter */}
      <div style={styles.categories}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={
              category === cat || (cat === "All" && !category)
                ? styles.categoryBtnActive
                : styles.categoryBtn
            }
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort and Results */}
      <div style={styles.toolbar}>
        <p style={styles.resultsText}>
          {loading ? "Loading..." : `${products.length} products found`}
          {keyword && ` for "${keyword}"`}
        </p>
        <select style={styles.sortSelect} onChange={handleSort} value={sort}>
          <option value="">Sort by: Latest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={styles.loading}>
          <p>Loading products... ⏳</p>
        </div>
      ) : products.length === 0 ? (
        <div style={styles.empty}>
          <p>😕 No products found</p>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={currentPage === 1 ? styles.pageDisabled : styles.pageBtn}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          <span style={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            style={
              currentPage === totalPages ? styles.pageDisabled : styles.pageBtn
            }
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem 2rem",
  },
  hero: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "16px",
    padding: "3rem 2rem",
    textAlign: "center",
    marginBottom: "2rem",
    color: "white",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  heroSubtitle: {
    fontSize: "1.1rem",
    opacity: 0.9,
  },
  categories: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "1.5rem",
  },
  categoryBtn: {
    padding: "6px 16px",
    borderRadius: "25px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    cursor: "pointer",
    fontSize: "14px",
    color: "#666",
  },
  categoryBtnActive: {
    padding: "6px 16px",
    borderRadius: "25px",
    border: "1px solid #6366f1",
    backgroundColor: "#6366f1",
    cursor: "pointer",
    fontSize: "14px",
    color: "white",
    fontWeight: "600",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  resultsText: {
    color: "#666",
    fontSize: "14px",
  },
  sortSelect: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  },
  loading: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    color: "#666",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
    paddingBottom: "2rem",
  },
  pageBtn: {
    padding: "8px 16px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  pageDisabled: {
    padding: "8px 16px",
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    border: "none",
    borderRadius: "8px",
    cursor: "not-allowed",
    fontWeight: "500",
  },
  pageInfo: {
    color: "#666",
    fontSize: "14px",
  },
};

export default Home;

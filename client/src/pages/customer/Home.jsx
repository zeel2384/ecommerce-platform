import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../../api";
import ProductCard from "../../components/product/ProductCard";
import useViewport from "../../hooks/useViewport";
import toast from "react-hot-toast";

const categories = [
  { name: "All", icon: "🛍️" },
  { name: "Electronics", icon: "📱" },
  { name: "Clothing", icon: "👕" },
  { name: "Food", icon: "🍕" },
  { name: "Books", icon: "📚" },
  { name: "Sports", icon: "⚽" },
  { name: "Beauty", icon: "💄" },
  { name: "Home", icon: "🏠" },
  { name: "Toys", icon: "🧸" },
  { name: "Other", icon: "📦" },
];

const Home = () => {
  const { isMobile } = useViewport();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const fetchProducts = useCallback(async () => {
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
  }, [keyword, category, sort, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Hero Banner */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
          padding: isMobile ? "2.5rem 1rem" : "4rem 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-30px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.05)",
          }}
        />

        <h1
          style={{
            fontSize: isMobile ? "2rem" : "3rem",
            fontWeight: "900",
            color: "white",
            marginBottom: "1rem",
            letterSpacing: "-1px",
            position: "relative",
          }}
        >
          Welcome to VendorMart 🛒
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "2rem",
            position: "relative",
          }}
        >
          Discover amazing products from multiple vendors
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? "1.2rem" : "3rem",
            flexWrap: "wrap",
            position: "relative",
          }}
        >
          {[
            { label: "Products", value: "100+" },
            { label: "Vendors", value: "50+" },
            { label: "Categories", value: "10" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: "white",
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "1rem" : "2rem",
        }}
      >
        {/* Category Filter */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "var(--text)",
              marginBottom: "1rem",
            }}
          >
            Browse by Category
          </h2>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                style={{
                  padding: "8px 16px",
                  borderRadius: "25px",
                  border:
                    category === cat.name || (cat.name === "All" && !category)
                      ? "2px solid #6366f1"
                      : "2px solid var(--border)",
                  backgroundColor:
                    category === cat.name || (cat.name === "All" && !category)
                      ? "#6366f1"
                      : "var(--surface)",
                  color:
                    category === cat.name || (cat.name === "All" && !category)
                      ? "white"
                      : "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
                onClick={() => handleCategory(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "0.75rem" : "0",
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            backgroundColor: "var(--surface)",
            borderRadius: "10px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {loading ? "Loading..." : `${products.length} products found`}
            {keyword && (
              <span style={{ color: "#6366f1" }}> for "{keyword}"</span>
            )}
          </p>
          <select
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              fontWeight: "500",
            }}
            onChange={handleSort}
            value={sort}
          >
            <option value="">Sort by: Latest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
            <p style={{ fontSize: "1.1rem" }}>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--text-secondary)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
            <h3 style={{ marginBottom: "0.5rem", color: "var(--text)" }}>
              No products found
            </h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "2.5rem",
              paddingBottom: "2rem",
            }}
          >
            <button
              style={{
                padding: "8px 20px",
                backgroundColor:
                  currentPage === 1 ? "var(--surface2)" : "#6366f1",
                color: currentPage === 1 ? "var(--text-muted)" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
            <span
              style={{
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Page {currentPage} of {totalPages}
            </span>
            <button
              style={{
                padding: "8px 20px",
                backgroundColor:
                  currentPage === totalPages ? "var(--surface2)" : "#6366f1",
                color:
                  currentPage === totalPages ? "var(--text-muted)" : "white",
                border: "none",
                borderRadius: "8px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

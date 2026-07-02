import API from "./axios";

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Product APIs
export const getProducts = (params) => API.get("/products", { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post("/products", data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const addReview = (id, data) =>
  API.post(`/products/${id}/reviews`, data);

// Vendor APIs
export const setupVendorShop = (data) => API.post("/vendor/setup", data);
export const getVendorProfile = () => API.get("/vendor/profile");
export const updateVendorProfile = (data) => API.put("/vendor/profile", data);
export const getAllVendors = () => API.get("/vendor/all");
export const approveVendor = (id, data) =>
  API.put(`/vendor/${id}/approve`, data);

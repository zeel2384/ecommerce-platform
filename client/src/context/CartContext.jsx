import toast from "react-hot-toast";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load cart when userId changes
  useEffect(() => {
    if (userId) {
      // Load this user's cart
      try {
        const saved = localStorage.getItem(`cart_${userId}`);
        setCartItems(saved ? JSON.parse(saved) : []);
      } catch {
        setCartItems([]);
      }
    } else {
      // No user logged in — empty cart
      setCartItems([]);
    }
  }, [userId]);

  // Save cart whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    }
  }, [cartItems, userId]);

  // Called by AuthContext when user logs in
  const loadUserCart = (id) => {
    setUserId(id);
  };

  // Called by AuthContext when user logs out
  const clearUserCart = () => {
    setUserId(null);
    setCartItems([]);
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    if (!userId) {
      toast.error("Please login to add items to cart! 🛒", {
        duration: 2000,
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return false; // ← return false when not logged in
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { ...product, quantity }];
    });
    return true; // ← return true when added successfully
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
  };

  // Calculate totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadUserCart,
        clearUserCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

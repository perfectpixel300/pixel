import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CartSnackbar } from "../components/storefront/CartSnackbar";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "pixel_cart_items";

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to read cart from localStorage:", e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const snackbarTimerRef = useRef(null);

  // Sync to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Failed to persist cart items:", e);
    }
  }, [cartItems]);

  // Ensure cart drawer is never open when user is unauthenticated
  useEffect(() => {
    if (!isAuthenticated && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [isAuthenticated, isCartOpen]);

  // Clean up snackbar timer on unmount
  useEffect(() => {
    return () => {
      if (snackbarTimerRef.current) {
        clearTimeout(snackbarTimerRef.current);
      }
    };
  }, []);

  const showSnackbar = (itemData) => {
    if (snackbarTimerRef.current) {
      clearTimeout(snackbarTimerRef.current);
    }
    setSnackbar(itemData);
    snackbarTimerRef.current = setTimeout(() => {
      setSnackbar(null);
    }, 4000);
  };

  const dismissSnackbar = () => {
    if (snackbarTimerRef.current) {
      clearTimeout(snackbarTimerRef.current);
    }
    setSnackbar(null);
  };

  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return false;
    }
    if (!product) return;

    const productId = product._id || product.slug || product.id;
    const regPrice = Number(product.indicativePrice || product.price) || 0;
    const discPrice = Number(product.discountPrice) || 0;
    const effectivePrice =
      discPrice > 0 && regPrice > 0 && discPrice < regPrice ? discPrice : regPrice;

    const mainImage =
      product.images && product.images.length > 0 ? product.images[0] : "";

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === productId);

      if (existingIndex > -1) {
        const updated = [...prev];
        const currentItem = updated[existingIndex];
        const newQty = currentItem.quantity + quantity;
        const maxStock = product.stock !== undefined ? Number(product.stock) : Infinity;

        updated[existingIndex] = {
          ...currentItem,
          quantity: Math.min(newQty, maxStock > 0 ? maxStock : newQty),
          price: effectivePrice,
          originalPrice: regPrice,
          image: mainImage || currentItem.image,
        };
        return updated;
      } else {
        const maxStock = product.stock !== undefined ? Number(product.stock) : Infinity;
        const initialQty = Math.min(quantity, maxStock > 0 ? maxStock : quantity);

        return [
          ...prev,
          {
            id: productId,
            name: product.name,
            price: effectivePrice,
            originalPrice: regPrice,
            image: mainImage,
            category: product.category || "General",
            slug: product.slug || product._id,
            stock: product.stock,
            isAvailable: product.isAvailable !== false,
            quantity: Math.max(1, initialQty),
            options: selectedOptions,
          },
        ];
      }
    });

    // Display snackbar notification instead of opening cart drawer
    showSnackbar({
      id: productId,
      name: product.name,
      image: mainImage,
      price: effectivePrice,
      quantity,
    });

    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const maxStock = item.stock !== undefined ? Number(item.stock) : Infinity;
          const cappedQty = maxStock > 0 ? Math.min(newQuantity, maxStock) : newQuantity;
          return { ...item, quantity: cappedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setIsCartOpen(true);
  };

  const closeCart = () => setIsCartOpen(false);

  const toggleCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    setIsCartOpen((prev) => !prev);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        showSnackbar,
        dismissSnackbar,
      }}
    >
      {children}
      <CartSnackbar
        item={snackbar}
        onClose={dismissSnackbar}
        onOpenCart={() => {
          dismissSnackbar();
          openCart();
        }}
      />
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  MessageCircle,
  Package,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function CartDrawer({ onInquireWithCart }) {
  const navigate = useNavigate();
  const {
    cartItems,
    totalItems,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  // Build WhatsApp pre-formatted order message
  const handleWhatsAppCheckout = () => {
    let orderText = `*PIXEL PERFECT - NEW ORDER*\n\n`;
    orderText += `Hello! I would like to place an order for the following items:\n\n`;

    cartItems.forEach((item, idx) => {
      orderText += `${idx + 1}. *${item.name}*\n`;
      orderText += `   Quantity: ${item.quantity} × NRs. ${item.price.toLocaleString()}\n`;
      orderText += `   Total: NRs. ${(item.price * item.quantity).toLocaleString()}\n\n`;
    });

    orderText += `------------------------------------\n`;
    orderText += `*Total Order Value:* NRs. ${subtotal.toLocaleString()}\n`;
    orderText += `------------------------------------\n\n`;

    if (user) {
      orderText += `*Customer Information:*\n`;
      orderText += `Name: ${user.fullName || user.name || "Customer"}\n`;
      orderText += `Email: ${user.email}\n`;
      if (user.contactNumber) orderText += `Phone: ${user.contactNumber}\n`;
      if (user.currentAddress) orderText += `Delivery Address: ${user.currentAddress}\n`;
      if (user.nearbyLandmark) orderText += `Landmark: ${user.nearbyLandmark}\n`;
    }

    const encoded = encodeURIComponent(orderText);
    window.open(`https://wa.me/9779808950275?text=${encoded}`, "_blank");
  };

  const handleInquireCheckout = () => {
    if (onInquireWithCart) {
      const summary = cartItems
        .map(
          (item) =>
            `${item.name} (Qty: ${item.quantity}, Unit Price: NRs. ${item.price.toLocaleString()})`
        )
        .join("\n");

      onInquireWithCart({
        name: `Cart Order (${totalItems} items)`,
        indicativePrice: subtotal,
        type: "order",
        category: "Catalog Order",
        description: `Items in cart:\n${summary}\n\nEstimated Subtotal: NRs. ${subtotal.toLocaleString()}`,
      });
      closeCart();
    }
  };

  const handleItemClick = (slugOrId) => {
    closeCart();
    navigate(`/products/${slugOrId}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-[fadeIn_0.2s_ease-out]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Container */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full max-w-md bg-[var(--bg-card)] border-l border-[var(--border-subtle)] shadow-2xl flex flex-col h-full animate-[slideLeft_0.25s_ease-out]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-card)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
              <ShoppingBag size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold m-0 flex items-center gap-2">
                <span>Your Cart</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-semibold">
                  {totalItems}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[0.725rem] text-[var(--text-muted)] hover:text-rose-400 transition-colors px-2 py-1"
                title="Empty cart"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              className="btn-icon btn-ghost !w-8 !h-8"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Item List or Empty State */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-[var(--border-subtle)]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
              <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] mb-4">
                <ShoppingBag size={28} className="opacity-50" />
              </div>
              <h3 className="text-base font-bold m-0">Your cart is empty</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1.5 mb-6 max-w-xs">
                Explore our catalog to add fine prints, stationery, tech disciplines, and limited pieces.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate("/products");
                }}
                className="btn btn-primary btn-sm gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => {
                const imageUrl = getOptimizedImageUrl(item.image, { width: 160 });
                const itemTotal = (item.price || 0) * (item.quantity || 1);

                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3.5 pt-4 first:pt-0"
                  >
                    {/* Thumbnail */}
                    <div
                      onClick={() => handleItemClick(item.slug || item.id)}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-[var(--radius-sm)] bg-[#0a0a0c] border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center cursor-pointer group"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Package size={22} className="text-zinc-600" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          onClick={() => handleItemClick(item.slug || item.id)}
                          className="text-xs sm:text-sm font-bold m-0 leading-tight truncate hover:text-zinc-300 cursor-pointer"
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[var(--text-muted)] hover:text-rose-400 p-1 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-[0.675rem] text-[var(--text-muted)] font-mono">
                        {item.category}
                      </div>

                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xs sm:text-sm font-bold font-mono text-[var(--text-primary)]">
                          NRs. {item.price.toLocaleString()}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[0.65rem] text-[var(--text-muted)] line-through font-mono">
                            NRs. {item.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Quantity Selector & Item Total */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-[var(--border-medium)] rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-bold select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-white/5 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                          NRs. {itemTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-card)] shrink-0 flex flex-col gap-3">
            {/* Subtotal */}
            <div className="flex items-baseline justify-between">
              <span className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                Subtotal
              </span>
              <div className="text-right">
                <div className="text-lg sm:text-xl font-black font-mono text-[var(--text-primary)]">
                  NRs. {subtotal.toLocaleString()}
                </div>
                <div className="text-[0.675rem] text-[var(--text-muted)]">
                  Taxes and local delivery coordinated directly
                </div>
              </div>
            </div>

            {/* Logged in notification badge */}
            {user && (
              <div className="text-[0.7rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-[var(--radius-sm)] flex items-center gap-1.5">
                <Sparkles size={13} className="shrink-0" />
                <span className="truncate">
                  Ordering as: <strong>{user.fullName || user.name}</strong> ({user.email})
                </span>
              </div>
            )}

            {/* Order Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleWhatsAppCheckout}
                className="btn btn-primary py-3 w-full text-xs sm:text-sm font-bold gap-2 shadow-md"
              >
                <MessageCircle size={16} />
                <span>Order via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleInquireCheckout}
                className="btn btn-secondary py-2.5 w-full text-xs font-semibold gap-2"
              >
                <span>Submit as Web Inquiry</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

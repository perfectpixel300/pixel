import React from "react";
import { Check, ShoppingBag, ArrowRight, X } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function CartSnackbar({ item, onClose, onOpenCart }) {
  if (!item) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-[2500] w-[calc(100%-1.5rem)] sm:w-auto min-w-[320px] max-w-md bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] p-3 sm:py-3.5 sm:px-4 flex items-center justify-between gap-3 text-[var(--text-primary)] animate-[snackbarIn_0.25s_ease-out]"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Thumbnail or Icon */}
        <div className="relative shrink-0 w-10 h-10 rounded-[var(--radius-xs)] overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center">
          {item.image ? (
            <img
              src={getOptimizedImageUrl(item.image, 80)}
              alt={item.name || "Cart item"}
              className="w-full h-full object-cover"
            />
          ) : (
            <ShoppingBag size={18} className="text-[var(--text-secondary)]" />
          )}
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-sm">
            <Check size={10} strokeWidth={3} />
          </span>
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1 text-left">
          <div className="text-[0.7rem] font-bold text-emerald-500 uppercase tracking-wide flex items-center gap-1">
            <span>Added to Cart</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)] truncate m-0">
            {item.quantity > 1 ? `${item.quantity}× ` : ""}{item.name}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onOpenCart}
          className="btn btn-primary !py-1.5 !px-3 text-xs font-bold gap-1 shadow-sm"
        >
          <span>View Cart</span>
          <ArrowRight size={13} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="btn-icon btn-ghost !p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}

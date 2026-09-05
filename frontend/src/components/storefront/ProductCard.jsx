import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, ArrowUpRight, Package, ShoppingBag } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export function ProductCard({ product, onViewDetails, onInquire }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!product) return null;

  const rawImage = product?.images && product.images.length > 0 ? product.images[0] : "";
  const imageUrl = getOptimizedImageUrl(rawImage, { width: 600 });
  const regPrice = Number(product?.indicativePrice || product?.price) || 0;
  const discPrice = Number(product?.discountPrice) || 0;
  const hasDiscount = Boolean(discPrice > 0 && regPrice > 0 && discPrice < regPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regPrice - discPrice) / regPrice) * 100)
    : 0;

  const productUrl = `/products/${product.slug || product._id}`;
  const isStocked = Boolean(product?.isAvailable && (product?.stock === undefined || Number(product?.stock) > 0));
  const categoryName = typeof product?.category === "object" ? product?.category?.name : product?.category;

  const handleNavigate = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (onViewDetails) {
      onViewDetails(product);
    }
    navigate(productUrl);
  };

  const handleInquire = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (onInquire) {
      onInquire(product);
    }
  };

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col h-full transition-all duration-300 border border-[var(--border-subtle)] hover:shadow-xl group cursor-pointer"
    >
      {/* Image Container with zoom */}
      <div
        className="h-38 xs:h-44 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden bg-[#050505] flex items-center justify-center shrink-0"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
            <Package size={32} className="opacity-40" />
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider font-semibold opacity-60">
              No Image
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between gap-1.5 pointer-events-none">
          {categoryName ? (
            <span className="badge badge-dark backdrop-blur-md text-[0.6rem] sm:text-[0.6875rem] px-2 py-0.5 sm:px-2.5 sm:py-1 font-medium shadow-sm whitespace-normal text-left max-w-[55%] xs:max-w-[62%] leading-tight truncate">
              {categoryName}
            </span>
          ) : <div />}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {hasDiscount && discountPercent > 0 && (
              <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
            {product.featured && (
              <span className="badge badge-white text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 whitespace-nowrap">
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Quick View Hover overlay indicator */}
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full bg-black/75 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
          <ArrowUpRight size={13} className="sm:hidden" />
          <ArrowUpRight size={15} className="hidden sm:block" />
        </div>
      </div>

      {/* Info Body */}
      <div className="p-2.5 xs:p-3 sm:p-4.5 md:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1">
        <div>
          {categoryName && (
            <div className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider text-[var(--text-muted)] font-semibold mb-1 truncate">
              {categoryName}
            </div>
          )}
          <h3 className="text-xs sm:text-base font-bold m-0 leading-snug hover:text-zinc-400 transition-colors capitalize line-clamp-2 min-h-[30px] sm:min-h-[44px]">
            {product.name}
          </h3>

          <div className="mt-1.5 sm:mt-2 flex items-baseline gap-2 flex-wrap">
            {hasDiscount ? (
              <>
                <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-emerald-400">
                  NRs. {discPrice.toLocaleString()}
                </span>
                <span className="text-[0.625rem] sm:text-[0.725rem] text-[var(--text-muted)] line-through font-mono whitespace-nowrap">
                  NRs. {regPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-[var(--text-primary)]">
                NRs. {regPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-[0.7rem] sm:text-[0.8rem] text-[var(--text-secondary)] leading-relaxed m-0 line-clamp-2 min-h-[28px] sm:min-h-[38px]">
          {product.description}
        </p>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-2.5 sm:pt-3 flex flex-col gap-2 border-t border-[var(--border-subtle)]">
          {/* Availability Status: Dedicated Uncongested Row */}
          <div className="flex items-center justify-between min-w-0">
            <span
              className={`inline-flex items-center gap-1.5 text-[0.6875rem] sm:text-xs font-semibold ${
                isStocked ? "text-emerald-400" : "text-zinc-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isStocked ? "bg-emerald-400" : "bg-zinc-500"
                }`}
              />
              {isStocked ? (
                <>
                  <span className="hidden sm:inline">Available in Stock</span>
                  <span className="sm:hidden">In Stock</span>
                </>
              ) : (
                "Out of Stock"
              )}
            </span>

            {isStocked && product.stock !== undefined && Number(product.stock) > 0 && Number(product.stock) <= 5 && (
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-mono text-amber-400 font-medium shrink-0 ml-1">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Action Buttons: Adaptive Mobile-First Grid (Full Cart row + 2-col Inquire/Specs on mobile; 3-col on desktop) */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-1.5 w-full">
            <button
              onClick={handleAddToCart}
              disabled={!isStocked}
              className={`btn btn-sm gap-1 text-[0.72rem] sm:text-xs !py-1.5 px-2 justify-center w-full font-semibold ${
                isStocked
                  ? "btn-primary"
                  : "btn-secondary opacity-40 cursor-not-allowed"
              }`}
              title="Add to Shopping Cart"
            >
              <ShoppingBag size={12} className="shrink-0" />
              <span>Cart</span>
            </button>
            <div className="grid grid-cols-2 gap-1.5 sm:contents">
              <button
                onClick={handleInquire}
                className="btn btn-secondary btn-sm gap-1 text-[0.72rem] sm:text-xs !py-1.5 px-1.5 justify-center w-full"
                title="Inquire about this piece"
              >
                <MessageSquare size={12} className="shrink-0" />
                <span className="truncate">Inquire</span>
              </button>
              <button
                onClick={handleNavigate}
                className="btn btn-ghost btn-sm text-[0.72rem] sm:text-xs !py-1.5 px-1.5 justify-center w-full border border-[var(--border-subtle)] hover:border-white"
                title="View Specifications"
              >
                <span className="truncate">Specs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

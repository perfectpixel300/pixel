import React from "react";
import { MessageSquare, ArrowUpRight, Package } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function ProductCard({ product, onViewDetails, onInquire }) {
  const rawImage = product?.images && product.images.length > 0 ? product.images[0] : "";
  const imageUrl = getOptimizedImageUrl(rawImage, { width: 600 });
  const hasDiscount =
    product?.discountPrice &&
    Number(product.discountPrice) > 0 &&
    Number(product.discountPrice) < Number(product.indicativePrice);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.indicativePrice) - Number(product.discountPrice)) /
          Number(product.indicativePrice)) *
          100
      )
    : 0;

  return (
    <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col h-full transition-all duration-300 border border-[var(--border-subtle)] hover:shadow-xl group">
      {/* Image Container with zoom */}
      <div
        onClick={() => onViewDetails(product)}
        className="h-44 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden cursor-pointer bg-[#050505] flex items-center justify-center shrink-0"
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
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center gap-1">
          <span className="badge badge-dark backdrop-blur-sm text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 truncate max-w-[110px]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            {hasDiscount && (
              <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {product.featured && (
              <span className="badge badge-white text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1">
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
      <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2.5">
          <h3
            onClick={() => onViewDetails(product)}
            className="text-xs sm:text-base font-bold m-0 leading-snug cursor-pointer hover:text-zinc-400 transition-colors capitalize line-clamp-1 sm:line-clamp-2 sm:min-h-[44px] flex-1"
          >
            {product.name}
          </h3>
          <div className="flex flex-col items-start sm:items-end shrink-0">
            {hasDiscount ? (
              <>
                <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-emerald-400">
                  NRs. {Number(product.discountPrice).toLocaleString()}
                </span>
                <span className="text-[0.625rem] sm:text-[0.7rem] text-[var(--text-muted)] line-through font-mono">
                  NRs. {Number(product.indicativePrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-[var(--text-primary)]">
                NRs. {Number(product.indicativePrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-[0.7rem] sm:text-[0.8rem] text-[var(--text-secondary)] leading-relaxed m-0 line-clamp-2 min-h-[30px] sm:min-h-[38px]">
          {product.description}
        </p>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-2.5 sm:pt-3 flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[var(--border-subtle)]">
          <span
            className={`text-[0.65rem] sm:text-[0.725rem] font-semibold ${
              product.isAvailable && (product.stock === undefined || Number(product.stock) > 0)
                ? "text-[var(--color-success)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            ● {product.isAvailable && (product.stock === undefined || Number(product.stock) > 0) ? "Available" : "Out of Stock"}
          </span>

          <div className="flex gap-1 sm:gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => onInquire(product)}
              className="btn btn-secondary btn-sm flex-1 sm:flex-initial gap-1 text-[0.65rem] sm:text-[0.725rem] !px-2 !py-1 sm:!px-2.5 sm:!py-1.5"
              title="Inquire about this piece"
            >
              <MessageSquare size={11} />
              <span>Inquire</span>
            </button>
            <button
              onClick={() => onViewDetails(product)}
              className="btn btn-primary btn-sm flex-1 sm:flex-initial text-[0.65rem] sm:text-[0.725rem] !px-2 !py-1 sm:!px-2.5 sm:!py-1.5"
            >
              Specs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

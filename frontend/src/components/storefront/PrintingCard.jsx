import React from "react";
import { MessageSquare, ArrowUpRight, Printer, Star } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function PrintingCard({ service, onViewDetails, onInquire }) {
  const rawImage = service?.images && service.images.length > 0 ? service.images[0] : "";
  const imageUrl = getOptimizedImageUrl(rawImage, { width: 600 });
  const regPrice = Number(service?.indicativePrice || service?.price) || 0;
  const discPrice = Number(service?.discountPrice) || 0;
  const hasDiscount = Boolean(discPrice > 0 && regPrice > 0 && discPrice < regPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regPrice - discPrice) / regPrice) * 100)
    : 0;
  const activePrice = hasDiscount ? discPrice : regPrice;

  return (
    <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col h-full transition-all duration-300 border border-[var(--border-subtle)] hover:shadow-xl group">
      {/* Image Container with zoom */}
      <div
        onClick={() => onViewDetails && onViewDetails(service)}
        className="h-44 sm:h-56 md:h-64 lg:h-72 relative overflow-hidden cursor-pointer bg-[#050505] flex items-center justify-center shrink-0"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={service.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[var(--text-muted)] gap-2">
            <Printer size={32} className="opacity-40" />
            <span className="text-[0.65rem] sm:text-[0.7rem] uppercase tracking-wider font-semibold opacity-60">
              Print Service
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex justify-between items-center gap-1">
          <span className="badge badge-dark backdrop-blur-sm text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 truncate max-w-[110px]">
            {service.category || "Printing"}
          </span>
          <div className="flex items-center gap-1">
            {hasDiscount && discountPercent > 0 && (
              <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
            {(service.featured || service.isFeatured) && (
              <span className="badge badge-white text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 flex items-center gap-0.5">
                <Star size={9} fill="currentColor" />
                <span>Featured</span>
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
            onClick={() => onViewDetails && onViewDetails(service)}
            className="text-xs sm:text-base font-bold m-0 leading-snug cursor-pointer hover:text-zinc-400 transition-colors capitalize line-clamp-1 sm:line-clamp-2 sm:min-h-[44px] flex-1"
          >
            {service.name}
          </h3>
          <div className="flex flex-col items-start sm:items-end shrink-0">
            {hasDiscount ? (
              <>
                <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-emerald-400">
                  NRs. {activePrice.toLocaleString()}
                </span>
                <span className="text-[0.625rem] sm:text-[0.7rem] text-[var(--text-muted)] line-through font-mono">
                  NRs. {regPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="font-bold font-mono text-xs sm:text-[0.95rem] whitespace-nowrap text-[var(--text-primary)]">
                NRs. {activePrice.toLocaleString()}
              </span>
            )}
            <span className="text-[0.575rem] sm:text-[0.625rem] text-[var(--text-muted)] font-mono">
              {service.priceUnit || "per page"}
            </span>
          </div>
        </div>

        <p className="text-[0.7rem] sm:text-[0.8rem] text-[var(--text-secondary)] leading-relaxed m-0 line-clamp-2 min-h-[30px] sm:min-h-[38px]">
          {service.shortDescription || service.description}
        </p>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-2.5 sm:pt-3 flex flex-col xs:flex-row sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-[var(--border-subtle)]">
          <span
            className={`text-[0.65rem] sm:text-[0.725rem] font-semibold ${
              service.isAvailable !== false ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"
            }`}
          >
            ● {service.isAvailable !== false ? service.turnaroundTime || "24-48h" : "Unavailable"}
          </span>

          <div className="flex gap-1 sm:gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => {
                if (onInquire) {
                  onInquire({
                    name: service.name,
                    indicativePrice: activePrice,
                    type: "service",
                    category: service.category || "Printing Service",
                    description: service.shortDescription || service.description,
                  });
                }
              }}
              className="btn btn-secondary btn-sm flex-1 sm:flex-initial gap-1 text-[0.65rem] sm:text-[0.725rem] !px-2 !py-1 sm:!px-2.5 sm:!py-1.5"
              title="Inquire about this printing service"
            >
              <MessageSquare size={11} />
              <span>Inquire</span>
            </button>
            <button
              onClick={() => onViewDetails && onViewDetails(service)}
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

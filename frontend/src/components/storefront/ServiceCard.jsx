import React from "react";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { getServiceIcon } from "../../pages/ServicesPage";

export function ServiceCard({ service, onViewDetails, onInquire }) {
  const regPrice = Number(service?.price) || 0;
  const discPrice = Number(service?.discountPrice) || 0;
  const hasDiscount = Boolean(discPrice > 0 && regPrice > 0 && discPrice < regPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regPrice - discPrice) / regPrice) * 100)
    : 0;
  const activePrice = hasDiscount ? discPrice : regPrice;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] rounded-[var(--radius-md)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-md)] group h-full">
      {/* Top image or banner if available */}
      {service.bannerImage ? (
        <div className="h-36 relative overflow-hidden bg-[var(--bg-sidebar)] shrink-0">
          <img
            src={getOptimizedImageUrl(service.bannerImage, { width: 800 })}
            alt={service.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="badge badge-dark text-[0.625rem]">
              {service.category}
            </span>
            {hasDiscount && (
              <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] px-1.5 py-0.5 shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          {(service.isFeatured || service.featured) && (
            <div className="absolute top-3 right-3">
              <span className="badge badge-white text-[0.6rem] gap-1">
                <Star size={10} fill="currentColor" />
                <span>Featured</span>
              </span>
            </div>
          )}
        </div>
      ) : null}

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
        {!service.bannerImage && (
          <div className="flex justify-between items-center">
            <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center">
              {getServiceIcon(service.icon, 18)}
            </div>
            <div className="flex items-center gap-1.5">
              {hasDiscount && (
                <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] px-1.5 py-0.5 shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              <span className="badge badge-neutral text-[0.625rem]">
                {service.category}
              </span>
              {(service.isFeatured || service.featured) && (
                <span className="badge badge-white text-[0.6rem] gap-1">
                  <Star size={9} fill="currentColor" />
                  <span>Featured</span>
                </span>
              )}
            </div>
          </div>
        )}

        <div>
          <h3
            onClick={() => onViewDetails && onViewDetails(service)}
            className="text-base sm:text-lg font-bold text-[var(--text-primary)] m-0 leading-snug cursor-pointer hover:text-zinc-400 transition-colors"
          >
            {service.title}
          </h3>
          <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed mt-2 line-clamp-2 min-h-[38px]">
            {service.shortDescription || service.description}
          </p>
        </div>

        {/* Pricing in NRs & Delivery Time */}
        <div className="pt-2.5 flex justify-between items-baseline border-t border-[var(--border-subtle)] mt-auto">
          <div>
            <span className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider block">
              {service.priceType === "hourly"
                ? "Hourly Rate"
                : service.priceType === "fixed"
                ? "Fixed Investment"
                : "Starting From"}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-mono text-base font-bold ${
                  hasDiscount ? "text-emerald-400" : "text-[var(--text-primary)]"
                }`}
              >
                NRs. {activePrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                  NRs. {regPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider block">
              Timeline
            </span>
            <span className="text-xs text-[var(--text-secondary)] font-mono">
              {service.deliveryTime || "1-2 Weeks"}
            </span>
          </div>
        </div>

        {/* Features Snippet (Top 3) */}
        {service.features && service.features.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <CheckCircle2 size={12} className="text-white shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <button
            onClick={() => onViewDetails && onViewDetails(service)}
            className="btn btn-secondary btn-sm text-[0.75rem]"
          >
            View Details
          </button>
          <button
            onClick={() => {
              if (onInquire) {
                onInquire({
                  name: service.title,
                  indicativePrice: activePrice,
                  type: "service",
                  category: service.category,
                  description: service.shortDescription || service.description,
                });
              }
            }}
            className="btn btn-primary btn-sm text-[0.75rem]"
          >
            Inquire
          </button>
        </div>
      </div>
    </div>
  );
}

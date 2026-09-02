import React from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useSmoothSwiper } from "../../utils/useSmoothSwiper";

export function CategorySwiperRow({
  categoryName,
  items = [],
  onViewAll,
  renderItem,
  badgeLabel,
}) {
  const {
    currentIndex,
    setCurrentIndex,
    itemsPerView,
    maxIndex,
    handlePrev,
    handleNext,
    trackStyle,
    sliderProps,
  } = useSmoothSwiper({ itemCount: items.length, defaultItemsPerView: 4 });

  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      {/* Category Row Header */}
      <div className="flex justify-between items-center mb-5 pb-3 border-b border-[var(--border-subtle)] flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[var(--text-primary)]" />
          <h3 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)] m-0">
            {categoryName}
          </h3>
          <span className="text-[0.68rem] px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] font-mono font-bold">
            {items.length} {badgeLabel || (items.length === 1 ? "item" : "items")}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Swiper Arrow Buttons */}
          {items.length > itemsPerView && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                  currentIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-xs"
                }`}
                aria-label={`Previous ${categoryName}`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                  currentIndex >= maxIndex
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-xs"
                }`}
                aria-label={`Next ${categoryName}`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="btn-ghost !text-xs font-bold gap-1 !px-2.5 !py-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer inline-flex items-center"
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Swiper Track Viewport */}
      <div {...sliderProps}>
        <div className="overflow-hidden -mx-1.5 sm:-mx-2.5">
          <div
            className="flex items-stretch select-none"
            style={trackStyle}
          >
            {items.map((item) => (
              <div
                key={item._id || item.id || item.slug}
                className="px-1.5 sm:px-2.5 shrink-0 flex flex-col pointer-events-auto"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>
        </div>

        {/* Optional Pagination Dots */}
        {items.length > itemsPerView && maxIndex > 0 && maxIndex <= 8 && (
          <div className="flex justify-center items-center gap-1.5 mt-5">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                  currentIndex === idx
                    ? "w-6 bg-[var(--text-primary)]"
                    : "w-1.5 bg-[var(--border-bright)] hover:bg-[var(--text-secondary)] opacity-50 hover:opacity-100"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

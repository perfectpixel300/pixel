import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { PrintingCard } from "./PrintingCard";
import { useSmoothSwiper } from "../../utils/useSmoothSwiper";

export function FeaturedPrintingSection({
  printingServices = [],
  onViewDetails,
  onInquire,
  onBrowseAll,
}) {
  const navigate = useNavigate();

  // Dynamic featured printing services (fallbacks to all available if none explicitly marked featured)
  const featuredServices = (printingServices || []).filter(
    (s) => (s.featured || s.isFeatured) && s.isAvailable !== false
  );
  const displayItems =
    featuredServices.length > 0
      ? featuredServices
      : (printingServices || []).filter((s) => s.isAvailable !== false);

  const {
    currentIndex,
    setCurrentIndex,
    itemsPerView,
    maxIndex,
    handlePrev,
    handleNext,
    trackStyle,
    sliderProps,
    totalDots,
    activeDotIndex,
    handleDotClick,
  } = useSmoothSwiper({ itemCount: displayItems.length, defaultItemsPerView: 4 });

  if (displayItems.length === 0) return null;

  return (
    <section
      id="home-featured-printing"
      className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-app)] overflow-hidden"
    >
      <div className="storefront-container">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em] text-[var(--text-primary)]">
              Featured Printing Services
            </h2>
            <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[640px]">
              High-resolution photo prints, architectural blueprints, hardcover bookbinding, and custom packaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Swiper Arrow Buttons */}
            {displayItems.length > itemsPerView && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                    currentIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-md"
                  }`}
                  aria-label="Previous featured printing service"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className={`w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                    currentIndex >= maxIndex
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-md"
                  }`}
                  aria-label="Next featured printing service"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (onBrowseAll) onBrowseAll();
                navigate("/printing");
              }}
              className="btn btn-secondary gap-1.5"
            >
              <span>View All Printing</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Custom Zero-Dependency Smooth Swiper Slider */}
        <div {...sliderProps}>
          {/* Swiper Viewport */}
          <div className="overflow-hidden -mx-2 sm:-mx-3">
            <div
              className="flex items-stretch select-none"
              style={trackStyle}
            >
              {displayItems.map((service) => (
                <div
                  key={service._id}
                  className="px-2 sm:px-3 shrink-0 flex flex-col pointer-events-auto"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <PrintingCard
                    service={service}
                    onViewDetails={onViewDetails}
                    onInquire={onInquire}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Swiper Pagination Dots Indicator */}
          {totalDots > 0 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                    activeDotIndex === idx
                      ? "w-7 bg-[var(--text-primary)]"
                      : "w-2 bg-[var(--border-bright)] hover:bg-[var(--text-secondary)] opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

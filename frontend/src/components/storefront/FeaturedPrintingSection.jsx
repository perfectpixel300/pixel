import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Printer, Star, Clock, Layers } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function FeaturedPrintingSection({
  printingServices = [],
  onViewDetails,
  onInquire,
  onBrowseAll,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  // Dynamic featured printing services (fallbacks to all available if none explicitly marked featured)
  const featuredServices = (printingServices || []).filter(
    (s) => (s.featured || s.isFeatured) && s.isAvailable !== false
  );
  const displayItems =
    featuredServices.length > 0
      ? featuredServices
      : (printingServices || []).filter((s) => s.isAvailable !== false);

  // Responsive items per view: 1 on mobile, 2 on sm/md, 3 on lg/xl
  const updateItemsPerView = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width >= 1024) {
      setItemsPerView(3);
    } else if (width >= 640) {
      setItemsPerView(2);
    } else {
      setItemsPerView(1);
    }
  }, []);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  const maxIndex = Math.max(0, displayItems.length - itemsPerView);

  // Ensure currentIndex stays within bounds when resizing
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 45;
    if (isSwipe) {
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag handlers for desktop swiping
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setDragDeltaX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragDeltaX < -50) {
      handleNext();
    } else if (dragDeltaX > 50) {
      handlePrev();
    }
    setIsDragging(false);
    setDragDeltaX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragDeltaX(0);
    }
  };

  if (displayItems.length === 0) return null;

  return (
    <section
      id="home-featured-printing"
      className="py-20 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden"
    >
      <div className="storefront-container">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] mb-3">
              <Printer size={13} />
              <span>Spotlight • Featured Printing Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-[-0.03em] text-[var(--text-primary)]">
              Custom Printing & Document Services
            </h2>
            <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[640px]">
              High-resolution photo prints, architectural blueprints, hardcover bookbinding, document copies, and custom packaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Swiper Arrow Buttons */}
            {displayItems.length > itemsPerView && (
              <div className="flex items-center gap-2">
                <button
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

            <button onClick={onBrowseAll} className="btn btn-secondary gap-1.5">
              <span>View All Printing</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Custom Zero-Dependency Swiper Slider */}
        <div
          className="relative select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Swiper Viewport */}
          <div className="overflow-hidden -mx-2 sm:-mx-3">
            <div
              className="flex items-stretch transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {displayItems.map((service) => {
                const rawImg = service.images && service.images[0] ? service.images[0] : "";
                const img = getOptimizedImageUrl(rawImg, { width: 800 });
                const hasDiscount =
                  service.discountPrice &&
                  Number(service.discountPrice) > 0 &&
                  Number(service.discountPrice) < Number(service.indicativePrice);
                const discountPercent = hasDiscount
                  ? Math.round(
                      ((Number(service.indicativePrice) - Number(service.discountPrice)) /
                        Number(service.indicativePrice)) *
                        100
                    )
                  : 0;
                const activePrice = hasDiscount
                  ? Number(service.discountPrice)
                  : Number(service.indicativePrice);

                return (
                  <div
                    key={service._id}
                    className="px-2 sm:px-3 shrink-0 flex flex-col"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-[var(--shadow-lg)] group">
                      {/* Image Preview */}
                      <div className="h-48 relative overflow-hidden bg-[var(--bg-sidebar)] flex items-center justify-center shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={service.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <Printer size={36} className="text-[var(--text-muted)] opacity-30" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-80 pointer-events-none" />

                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span className="badge badge-dark text-[0.625rem] backdrop-blur-sm shadow-sm">
                            {service.category}
                          </span>
                          {hasDiscount && (
                            <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] sm:text-[0.6875rem] px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {(service.featured || service.isFeatured) && (
                          <div className="absolute top-3 right-3">
                            <span className="badge badge-white text-[0.6rem] gap-1 shadow-sm">
                              <Star size={10} fill="currentColor" />
                              <span>Featured</span>
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-3 right-3 badge badge-dark backdrop-blur-sm text-[0.65rem] px-2 py-0.5 rounded font-mono flex items-center gap-1 shadow-sm">
                          <Clock size={11} />
                          <span>{service.turnaroundTime || "24-48h"}</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] m-0 leading-snug">
                            {service.name}
                          </h3>
                          <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed mt-1.5 line-clamp-2">
                            {service.shortDescription || service.description}
                          </p>
                        </div>

                        {/* Price Display */}
                        <div className="pt-3 flex justify-between items-baseline border-t border-[var(--border-subtle)] mt-auto">
                          <div>
                            <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                              Investment ({service.priceUnit || "per page"})
                            </span>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span
                                className={`font-mono text-lg font-extrabold ${
                                  hasDiscount ? "text-emerald-400" : "text-[var(--text-primary)]"
                                }`}
                              >
                                NRs. {activePrice.toLocaleString()}
                              </span>
                              {hasDiscount && (
                                <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                                  NRs. {Number(service.indicativePrice).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          {service.specs?.paperGsm && (
                            <div className="text-right">
                              <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider block font-bold">
                                Media
                              </span>
                              <span className="text-xs font-mono text-[var(--text-secondary)] truncate max-w-[120px] block">
                                {service.specs.paperGsm.split(" ")[0]} GSM
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]">
                          <button
                            onClick={() => {
                              if (onViewDetails) {
                                onViewDetails(service);
                              }
                            }}
                            className="btn btn-secondary btn-sm text-[0.75rem]"
                          >
                            Details
                          </button>
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
                            className="btn btn-primary btn-sm text-[0.75rem]"
                          >
                            Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Swiper Pagination Dots */}
          {displayItems.length > itemsPerView && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                    currentIndex === idx
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

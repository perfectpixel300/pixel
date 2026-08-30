import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

export function FeaturedSection({ products = [], onViewDetails, onInquire, onBrowseAll }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  // Dynamic featured products (shows all featured products dynamically; fallbacks to all products if none marked featured)
  const featuredProducts = (products || []).filter((p) => p.featured);
  const displayItems = featuredProducts.length > 0 ? featuredProducts : (products || []);

  // Responsive items per view (matching products section: 2 on mobile, 2 on sm, 3 on lg, 4 on xl)
  const updateItemsPerView = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (width >= 1280) {
      setItemsPerView(4);
    } else if (width >= 1024) {
      setItemsPerView(3);
    } else if (width >= 640) {
      setItemsPerView(2);
    } else {
      setItemsPerView(2);
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
    <section className="py-20 border-b border-[var(--border-subtle)] overflow-hidden">
      <div className="storefront-container">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
              Featured Products
            </h2>
            <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2">
              Select objects highlighted for exceptional material purity and thoughtful engineering.
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
                      : "hover:bg-white hover:text-black cursor-pointer shadow-md"
                  }`}
                  aria-label="Previous featured product"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  className={`w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                    currentIndex >= maxIndex
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-white hover:text-black cursor-pointer shadow-md"
                  }`}
                  aria-label="Next featured product"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            <button onClick={onBrowseAll} className="btn btn-secondary gap-1.5">
              <span>View All Products</span>
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
              {displayItems.map((product) => (
                <div
                  key={product._id}
                  className="px-2 sm:px-3 shrink-0 flex flex-col"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={onViewDetails}
                    onInquire={onInquire}
                  />
                </div>
              ))}
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
                      ? "w-7 bg-white"
                      : "w-2 bg-zinc-700 hover:bg-zinc-500"
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

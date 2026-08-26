import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export function HeroBannerCarousel({ banners, onCtaClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => (a.order || 0) - (b.order || 0));

  // Auto advance every 7 seconds if multiple banners
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeBanners.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentSlide % activeBanners.length];

  return (
    <div
      className="relative min-h-[560px] flex items-center bg-cover bg-center border-b border-[var(--border-subtle)] transition-[background-image] duration-500 ease-in-out overflow-hidden"
      style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
    >
      {/* High-Contrast Monochrome Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/85" />

      {/* Main Banner Content */}
      <div className="storefront-container relative z-10 w-full sm:px-6">
        <div
          className={`max-w-[680px] ${
            currentBanner.alignment === "center"
              ? "text-center mx-auto"
              : currentBanner.alignment === "right"
              ? "text-right ml-auto mr-0"
              : "text-left mr-auto ml-0"
          }`}
        >
          {currentBanner.badge && (
            <div className="mb-4">
              <span className="badge badge-white text-[0.725rem] px-3 py-1 tracking-[0.1em]">
                {currentBanner.badge}
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-[-0.03em] text-white mb-4 drop-shadow-md">
            {currentBanner.title}
          </h1>

          {currentBanner.subtitle && (
            <p className="text-base sm:text-lg leading-relaxed text-white/90 mb-7 max-w-[540px] drop-shadow-sm">
              {currentBanner.subtitle}
            </p>
          )}

          <div
            className={`flex gap-3 ${
              currentBanner.alignment === "center" ? "justify-center" : "justify-start"
            }`}
          >
            <button
              onClick={() => onCtaClick(currentBanner.ctaLink || "/products")}
              className="btn btn-primary px-6.5 py-3 text-sm gap-2"
            >
              <span>{currentBanner.ctaText || "Explore Collection"}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Sleek, Fixed Position Buttons */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev > 0 ? prev - 1 : activeBanners.length - 1))
            }
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 shadow-xl cursor-pointer"
            title="Previous Banner"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeBanners.length)}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-full bg-black/65 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 shadow-xl cursor-pointer"
            title="Next Banner"
            aria-label="Next Slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                  currentSlide % activeBanners.length === idx
                    ? "w-7 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

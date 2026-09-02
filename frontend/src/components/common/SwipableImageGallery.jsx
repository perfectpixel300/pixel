import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function SwipableImageGallery({
  images = [],
  alt = "Image",
  heightClass = "h-[360px] sm:h-[460px]",
  thumbnailSize = "w-16 h-16 sm:w-18 sm:h-18",
  showThumbnails = true,
  className = "",
}) {
  const validImages = Array.isArray(images) ? images.filter(Boolean) : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const isHorizontalSwipeRef = useRef(null);
  const hasDraggedRef = useRef(false);

  // Keep activeIndex within range
  useEffect(() => {
    if (activeIndex >= validImages.length) {
      setActiveIndex(0);
    }
  }, [validImages.length, activeIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : validImages.length - 1));
  }, [validImages.length]);

  const endDrag = useCallback(() => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    isHorizontalSwipeRef.current = null;

    const delta = dragOffset;
    const duration = Math.max(1, Date.now() - startTimeRef.current);
    const velocity = Math.abs(delta) / duration;

    const containerWidth = containerRef.current?.offsetWidth || 300;

    if (velocity > 0.3 && Math.abs(delta) > 25) {
      if (delta < 0 && activeIndex < validImages.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (delta > 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    } else if (Math.abs(delta) >= containerWidth * 0.2) {
      if (delta < 0 && activeIndex < validImages.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (delta > 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }

    setDragOffset(0);
    setIsDragging(false);

    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 60);
  }, [dragOffset, activeIndex, validImages.length]);

  // Window mouse listener for smooth desktop drag
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isPointerDownRef.current) return;
      const deltaX = e.clientX - startXRef.current;
      if (!hasDraggedRef.current && Math.abs(deltaX) > 4) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }
      if (hasDraggedRef.current) {
        let effective = deltaX;
        if (
          (activeIndex === 0 && effective > 0) ||
          (activeIndex === validImages.length - 1 && effective < 0)
        ) {
          effective *= 0.3;
        }
        setDragOffset(effective);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isPointerDownRef.current) {
        endDrag();
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [activeIndex, validImages.length, endDrag]);

  const handleMouseDown = (e) => {
    if (validImages.length <= 1) return;
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startTimeRef.current = Date.now();
    hasDraggedRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (validImages.length <= 1) return;
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.targetTouches[0].clientX;
    startYRef.current = e.targetTouches[0].clientY;
    startTimeRef.current = Date.now();
    hasDraggedRef.current = false;
    isHorizontalSwipeRef.current = null;
  };

  const handleTouchMove = (e) => {
    if (!isPointerDownRef.current || !e.targetTouches || e.targetTouches.length === 0) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isHorizontalSwipeRef.current = true;
      } else if (Math.abs(deltaY) > 6) {
        isHorizontalSwipeRef.current = false;
      }
    }

    if (isHorizontalSwipeRef.current === true) {
      hasDraggedRef.current = true;
      setIsDragging(true);
      let effective = deltaX;
      if (
        (activeIndex === 0 && effective > 0) ||
        (activeIndex === validImages.length - 1 && effective < 0)
      ) {
        effective *= 0.3;
      }
      setDragOffset(effective);
    }
  };

  const handleTouchEnd = () => {
    if (isPointerDownRef.current) {
      endDrag();
    }
  };

  if (validImages.length === 0) {
    return (
      <div
        className={`rounded-[var(--radius-md)] overflow-hidden ${heightClass} bg-[#050505] border border-[var(--border-subtle)] flex flex-col items-center justify-center text-[var(--text-muted)] gap-2`}
      >
        <Package size={42} className="opacity-40" />
        <span className="text-xs uppercase tracking-wider font-semibold opacity-60">
          No image available
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Main Swipable Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClickCapture={(e) => {
          if (hasDraggedRef.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        className={`relative overflow-hidden rounded-[var(--radius-md)] bg-[#050505] border border-[var(--border-subtle)] ${heightClass} ${
          validImages.length > 1 ? "cursor-grab active:cursor-grabbing touch-pan-y" : ""
        } select-none flex items-center justify-center`}
      >
        <div
          className="flex h-full w-full"
          style={{
            transform: isDragging
              ? `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))`
              : `translateX(-${activeIndex * 100}%)`,
            transition: isDragging
              ? "none"
              : "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {validImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full h-full shrink-0 flex items-center justify-center overflow-hidden"
            >
              <img
                src={getOptimizedImageUrl(img, { width: 1200 })}
                alt={`${alt} - view ${idx + 1}`}
                draggable={false}
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          ))}
        </div>

        {/* Previous & Next Navigation Overlay Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              disabled={activeIndex === 0}
              className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all ${
                activeIndex === 0
                  ? "opacity-0 pointer-events-none"
                  : "opacity-80 hover:opacity-100 cursor-pointer shadow-md"
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={activeIndex >= validImages.length - 1}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs border border-white/20 transition-all ${
                activeIndex >= validImages.length - 1
                  ? "opacity-0 pointer-events-none"
                  : "opacity-80 hover:opacity-100 cursor-pointer shadow-md"
              }`}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>

            {/* Indicator Dots Overlay */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                    activeIndex === idx
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Row Below */}
      {showThumbnails && validImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar justify-center">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`${thumbnailSize} rounded-[var(--radius-sm)] overflow-hidden cursor-pointer shrink-0 transition-all duration-200 p-0 border-0 bg-transparent ${
                activeIndex === idx
                  ? "opacity-100 scale-105 ring-2 ring-white"
                  : "opacity-60 hover:opacity-90"
              }`}
              aria-label={`Select thumbnail ${idx + 1}`}
            >
              <img
                src={getOptimizedImageUrl(img, { width: 200 })}
                alt={`${alt} thumbnail ${idx + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

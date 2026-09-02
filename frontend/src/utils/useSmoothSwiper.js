import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export function useSmoothSwiper({
  itemCount = 0,
  defaultItemsPerView = 4,
  getItemsPerView,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(defaultItemsPerView);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const currentDeltaRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const isHorizontalSwipeRef = useRef(null);

  // Responsive items per view: customizable or defaults to 2 on mobile (<1024px), 3 on laptop (1024-1279px), 4 on desktop (>=1280px)
  const updateItemsPerView = useCallback(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    if (getItemsPerView) {
      setItemsPerView(getItemsPerView(width));
    } else {
      if (width >= 1280) {
        setItemsPerView(4);
      } else if (width >= 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(2);
      }
    }
  }, [getItemsPerView]);

  useEffect(() => {
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, [updateItemsPerView]);

  const maxIndex = Math.max(0, itemCount - itemsPerView);

  // Keep index within bounds on resize or item change
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : maxIndex));
  }, [maxIndex]);

  // Finish drag / swipe interaction and smoothly snap to appropriate card
  const endDrag = useCallback(() => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    isHorizontalSwipeRef.current = null;

    const delta = currentDeltaRef.current;
    const duration = Math.max(1, Date.now() - startTimeRef.current);
    const velocity = Math.abs(delta) / duration; // px per ms

    const containerWidth = containerRef.current?.offsetWidth || 300;
    const cardWidth = containerWidth / itemsPerView;

    let targetIndex = currentIndex;

    // Fast flick (>0.35 px/ms) or drag distance > 22% of card width
    if (velocity > 0.35 && Math.abs(delta) > 20) {
      if (delta < 0) {
        targetIndex = Math.min(maxIndex, currentIndex + 1);
      } else {
        targetIndex = Math.max(0, currentIndex - 1);
      }
    } else if (Math.abs(delta) >= cardWidth * 0.22) {
      const slidesMoved = Math.round(-delta / cardWidth);
      if (slidesMoved !== 0) {
        targetIndex = Math.min(maxIndex, Math.max(0, currentIndex + slidesMoved));
      }
    }

    setCurrentIndex(targetIndex);
    setDragOffset(0);
    setIsDragging(false);
    currentDeltaRef.current = 0;

    // Keep hasDraggedRef true for a tiny window so child click events don't trigger accidentally
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 80);
  }, [currentIndex, maxIndex, itemsPerView]);

  // Window-level mouse up / move ensures drag doesn't freeze if pointer exits container
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (!isPointerDownRef.current) return;

      const deltaX = e.clientX - startXRef.current;
      if (!hasDraggedRef.current && Math.abs(deltaX) > 4) {
        hasDraggedRef.current = true;
        setIsDragging(true);
      }

      if (hasDraggedRef.current) {
        let effectiveDelta = deltaX;
        // Elastic rubber-banding at boundaries
        if (
          (currentIndex === 0 && effectiveDelta > 0) ||
          (currentIndex >= maxIndex && effectiveDelta < 0)
        ) {
          effectiveDelta *= 0.3;
        }
        currentDeltaRef.current = effectiveDelta;
        setDragOffset(effectiveDelta);
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
  }, [currentIndex, maxIndex, endDrag]);

  // Mouse handlers for container
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startTimeRef.current = Date.now();
    currentDeltaRef.current = 0;
    hasDraggedRef.current = false;
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (!e.targetTouches || e.targetTouches.length === 0) return;
    isPointerDownRef.current = true;
    startXRef.current = e.targetTouches[0].clientX;
    startYRef.current = e.targetTouches[0].clientY;
    startTimeRef.current = Date.now();
    currentDeltaRef.current = 0;
    hasDraggedRef.current = false;
    isHorizontalSwipeRef.current = null;
  };

  const handleTouchMove = (e) => {
    if (!isPointerDownRef.current || !e.targetTouches || e.targetTouches.length === 0) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const deltaX = currentX - startXRef.current;
    const deltaY = currentY - startYRef.current;

    // Determine direction on first significant movement
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

      let effectiveDelta = deltaX;
      if (
        (currentIndex === 0 && effectiveDelta > 0) ||
        (currentIndex >= maxIndex && effectiveDelta < 0)
      ) {
        effectiveDelta *= 0.3;
      }
      currentDeltaRef.current = effectiveDelta;
      setDragOffset(effectiveDelta);
    }
  };

  const handleTouchEnd = () => {
    if (isPointerDownRef.current) {
      endDrag();
    }
  };

  const handleClickCapture = (e) => {
    if (hasDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Indicator dots calculation: guarantees indicators for every swiper
  const totalDots = useMemo(() => {
    if (itemCount === 0) return 0;
    if (maxIndex <= 10) return Math.max(1, maxIndex + 1);
    return Math.ceil(itemCount / itemsPerView);
  }, [maxIndex, itemCount, itemsPerView]);

  const activeDotIndex = useMemo(() => {
    if (maxIndex <= 10) return currentIndex;
    const page = Math.round(currentIndex / itemsPerView);
    return Math.min(totalDots - 1, page);
  }, [currentIndex, maxIndex, totalDots, itemsPerView]);

  const handleDotClick = useCallback(
    (dotIdx) => {
      if (maxIndex <= 10) {
        setCurrentIndex(Math.min(maxIndex, dotIdx));
      } else {
        setCurrentIndex(Math.min(maxIndex, dotIdx * itemsPerView));
      }
    },
    [maxIndex, itemsPerView]
  );

  // Dynamic CSS transform and transition for smooth real-time tracking
  const trackStyle = useMemo(() => {
    const basePercent = -(currentIndex * (100 / itemsPerView));
    if (isDragging) {
      return {
        transform: `translateX(calc(${basePercent}% + ${dragOffset}px))`,
        transition: "none",
        cursor: "grabbing",
      };
    }
    return {
      transform: `translateX(${basePercent}%)`,
      transition: "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)",
    };
  }, [currentIndex, itemsPerView, isDragging, dragOffset]);

  return {
    currentIndex,
    setCurrentIndex,
    itemsPerView,
    maxIndex,
    isDragging,
    handlePrev,
    handleNext,
    containerRef,
    trackStyle,
    totalDots,
    activeDotIndex,
    handleDotClick,
    sliderProps: {
      ref: containerRef,
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onClickCapture: handleClickCapture,
      className: "relative select-none cursor-grab active:cursor-grabbing touch-pan-y",
    },
  };
}

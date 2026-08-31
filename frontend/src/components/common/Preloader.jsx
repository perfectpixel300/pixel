import React, { useState, useEffect } from "react";

export function Preloader({ isLoading }) {
  const [shouldRender, setShouldRender] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Begin smooth fade out
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 350);

      // Completely remove from DOM after fade animation completes
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
      }, 900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    } else {
      setShouldRender(true);
      setIsFading(false);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center select-none transition-opacity duration-500 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden={isFading}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Minimal Logo */}
        <div className="w-14 h-14 rounded-[var(--radius-md)] border border-white/15 bg-zinc-950 flex items-center justify-center shadow-2xl relative overflow-hidden p-2">
          <img
            src="/pixelperfect.png"
            alt="Pixel Perfect"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Minimal Typography */}
        <div className="text-center">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-white m-0">
            Pixel Perfect
          </h2>
          <p className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 font-mono mt-1 m-0">
            Welcome to Pixel Perfect
          </p>
          <p className="text-[0.625rem] sm:text-[0.6875rem] uppercase tracking-[0.2em] text-zinc-500 font-mono mt-1 m-0">
            Stationery, Studio, Gifts and IT 
          </p>
        </div>

        {/* Minimal Progress Line Indicator */}
        <div className="w-36 h-[2px] bg-zinc-900 rounded-full overflow-hidden relative mt-1">
          <div className="preloader-progress-bar h-full bg-white rounded-full" />
        </div>

        {/* Minimal Animated Loading Text */}
        <div className="flex items-center gap-0.5 text-[0.625rem] font-mono uppercase tracking-[0.25em] text-zinc-400 opacity-80 mt-1 animate-pulse">
          <span>Loading</span>
          <span className="inline-flex">
            <span className="animate-[pulse_1.2s_ease-in-out_infinite_0.1s]">.</span>
            <span className="animate-[pulse_1.2s_ease-in-out_infinite_0.3s]">.</span>
            <span className="animate-[pulse_1.2s_ease-in-out_infinite_0.5s]">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

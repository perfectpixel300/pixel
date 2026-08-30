import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[var(--bg-elevated)]/90 backdrop-blur-md border border-[var(--border-medium)] text-[var(--text-primary)] hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex items-center justify-center cursor-pointer animate-[fadeIn_0.25s_ease-out]"
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} strokeWidth={2.2} />
    </button>
  );
}

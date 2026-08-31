import React, { useState, useEffect } from "react";
import { ArrowRight, Clock, Sparkles, Flame, Tag, CheckCircle2 } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { calculateTimeRemaining } from "../../utils/timezone";

export function DynamicPromoStrip({ promoBanners = [], onCtaClick }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const activePromos = (promoBanners || [])
    .filter((p) => p.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const currentPromo = activePromos.length > 0 ? activePromos[0] : null;

  // Real-time Countdown Timer logic (GMT+5:45 Kathmandu Time)
  useEffect(() => {
    if (!currentPromo || !currentPromo.hasTimer || !currentPromo.timerEndDate) {
      return;
    }

    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(currentPromo.timerEndDate);
      setTimeLeft(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [currentPromo?.timerEndDate, currentPromo?.hasTimer]);

  // Fallback to Default Philosophy if no custom promo banner is configured or active
  if (!currentPromo) {
    return (
      <section className="py-18 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="storefront-container text-center max-w-[800px] mx-auto">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Our Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mt-2.5 tracking-[-0.03em] text-[var(--text-primary)]">
            "Quality materials, thoughtful design, and tools built to last."
          </h2>
          <p className="text-[0.95rem] text-[var(--text-secondary)] leading-relaxed mt-4">
            Pixel Perfect designs and delivers premium stationery, solid writing instruments,
            leather desk accessories, and modern digital services.
          </p>
        </div>
      </section>
    );
  }

  const hasImage = Boolean(currentPromo.imageUrl && currentPromo.imageUrl.trim());
  const hasTimer = Boolean(currentPromo.hasTimer && currentPromo.timerEndDate);

  return (
    <section className="py-14 sm:py-18 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Decorative ambient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="storefront-container relative z-10">
        <div
          className={`flex flex-col ${
            hasImage
              ? "lg:flex-row lg:items-center justify-between gap-8 lg:gap-14"
              : currentPromo.alignment === "left"
              ? "items-start text-left max-w-[900px]"
              : currentPromo.alignment === "right"
              ? "items-end text-right ml-auto max-w-[900px]"
              : "items-center text-center max-w-[860px] mx-auto"
          }`}
        >
          {/* Main Text Content */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Badge */}
            {currentPromo.badge && (
              <div
                className={`flex items-center gap-2 ${
                  hasImage || currentPromo.alignment === "left"
                    ? "justify-start"
                    : currentPromo.alignment === "right"
                    ? "justify-end"
                    : "justify-center"
                }`}
              >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                  {hasTimer ? (
                    <Flame size={12} className="text-amber-400 fill-amber-400" />
                  ) : (
                    <Sparkles size={12} className="text-white" />
                  )}
                  <span>{currentPromo.badge}</span>
                </div>
              </div>
            )}

            {/* Headline Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-[-0.03em] text-[var(--text-primary)] m-0">
              {currentPromo.title}
            </h2>

            {/* Subtitle / Description */}
            {currentPromo.subtitle && (
              <p
                className={`text-[0.925rem] sm:text-[1rem] text-[var(--text-secondary)] leading-relaxed m-0 max-w-[700px] ${
                  hasImage || currentPromo.alignment === "left"
                    ? ""
                    : currentPromo.alignment === "right"
                    ? "ml-auto"
                    : "mx-auto"
                }`}
              >
                {currentPromo.subtitle}
              </p>
            )}

            {/* Live Countdown Timer if enabled */}
            {hasTimer && (
              <div
                className={`mt-3 flex flex-col gap-2 ${
                  hasImage || currentPromo.alignment === "left"
                    ? "items-start"
                    : currentPromo.alignment === "right"
                    ? "items-end"
                    : "items-center"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider font-semibold">
                  <Clock size={13} />
                  <span>{currentPromo.timerTitle || "Offer Ends In"}</span>
                </div>

                {!timeLeft.isExpired ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center justify-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-medium)] shadow-sm">
                      <span className="font-mono text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] leading-none">
                        {String(timeLeft.days).padStart(2, "0")}
                      </span>
                      <span className="text-[0.55rem] sm:text-[0.625rem] uppercase font-bold text-[var(--text-muted)] mt-1">
                        Days
                      </span>
                    </div>

                    <span className="font-mono font-bold text-lg text-[var(--text-muted)]">:</span>

                    <div className="flex flex-col items-center justify-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-medium)] shadow-sm">
                      <span className="font-mono text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] leading-none">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                      <span className="text-[0.55rem] sm:text-[0.625rem] uppercase font-bold text-[var(--text-muted)] mt-1">
                        Hours
                      </span>
                    </div>

                    <span className="font-mono font-bold text-lg text-[var(--text-muted)]">:</span>

                    <div className="flex flex-col items-center justify-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-medium)] shadow-sm">
                      <span className="font-mono text-lg sm:text-2xl font-extrabold text-[var(--text-primary)] leading-none">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                      <span className="text-[0.55rem] sm:text-[0.625rem] uppercase font-bold text-[var(--text-muted)] mt-1">
                        Mins
                      </span>
                    </div>

                    <span className="font-mono font-bold text-lg text-[var(--text-muted)]">:</span>

                    <div className="flex flex-col items-center justify-center min-w-[54px] sm:min-w-[62px] px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-emerald-500/30 text-emerald-400 shadow-sm">
                      <span className="font-mono text-lg sm:text-2xl font-extrabold leading-none">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                      <span className="text-[0.55rem] sm:text-[0.625rem] uppercase font-bold text-[var(--text-muted)] mt-1">
                        Secs
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-3 py-1 rounded border border-[var(--border-subtle)]">
                    Offer Concluded
                  </span>
                )}
              </div>
            )}

            {/* CTA Button */}
            {currentPromo.ctaText && (
              <div
                className={`mt-4 flex ${
                  hasImage || currentPromo.alignment === "left"
                    ? "justify-start"
                    : currentPromo.alignment === "right"
                    ? "justify-end"
                    : "justify-center"
                }`}
              >
                <button
                  onClick={() => onCtaClick(currentPromo.ctaLink || "/products")}
                  className="btn btn-primary gap-2 text-sm px-6 py-2.5"
                >
                  <span>{currentPromo.ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Optional Side Image Showcase */}
          {hasImage && (
            <div className="w-full lg:w-[440px] shrink-0">
              <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-card)] shadow-xl group max-h-[280px] sm:max-h-[320px]">
                <img
                  src={getOptimizedImageUrl(currentPromo.imageUrl, { width: 800 })}
                  alt={currentPromo.title}
                  className="w-full h-full object-cover max-h-[280px] sm:max-h-[320px] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

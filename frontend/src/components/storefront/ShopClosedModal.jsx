import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  X,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Calendar,
  Info,
} from "lucide-react";

export function ShopClosedModal({
  isOpen,
  onClose,
  shopStatus,
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  const status = shopStatus?.status || (shopStatus?.isOpen !== false ? "open" : "closed");
  const isOpenStatus = status === "open";
  const isPartial = status === "partial";
  const isClosed = status === "closed";
  const timerTarget = shopStatus?.timerTarget;
  const isTimerEnabled = Boolean(shopStatus?.timerEnabled && timerTarget);

  useEffect(() => {
    if (!isTimerEnabled || !timerTarget) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const calculateTimeLeft = () => {
      const targetTime = new Date(timerTarget).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [timerTarget, isTimerEnabled]);

  if (!isOpen) return null;

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect! I saw your store status (${
        isOpenStatus ? "Shop Open" : isPartial ? "Partial Services" : "Currently Closed"
      }), and I'd like to leave an inquiry.`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  const formattedTargetDate = timerTarget
    ? new Date(timerTarget).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  return (
    <div className="modal-overlay z-[200] p-4 sm:p-6" onClick={onClose}>
      <div
        className="modal-card max-w-[560px] !border-2 border-white/20 bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-card)] shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-[scaleUp_0.2s_ease-out] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Status Ambient Ribbon */}
        <div
          className={`px-5 py-2.5 flex items-center justify-between font-bold text-xs uppercase tracking-wider ${
            isOpenStatus
              ? "bg-emerald-600 text-white"
              : isPartial
              ? "bg-blue-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isOpenStatus
                  ? "bg-white animate-pulse"
                  : isPartial
                  ? "bg-white animate-pulse"
                  : "bg-white animate-ping"
              } inline-block`}
            />
            <span>
              {isOpenStatus
                ? "Operating Notice • Shop is Open"
                : isPartial
                ? "Service Notice • Partial Availability"
                : "Store Notice • Currently Closed"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-icon !w-6 !h-6 bg-white/20 hover:bg-white/30 text-white border-0 rounded-full cursor-pointer"
            title="Dismiss notice"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* Header icon & title */}
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${
                isOpenStatus
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                  : isPartial
                  ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                  : "bg-red-500/20 border-red-500/40 text-red-400"
              }`}
            >
              {isOpenStatus ? (
                <CheckCircle2 size={24} />
              ) : isPartial ? (
                <Info size={24} />
              ) : (
                <Clock size={24} />
              )}
            </div>
            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[0.68rem] font-bold uppercase tracking-wider mb-1.5 ${
                  isOpenStatus
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                    : isPartial
                    ? "bg-blue-500/15 border-blue-500/30 text-blue-300"
                    : "bg-red-500/15 border-red-500/30 text-red-300"
                }`}
              >
                {isOpenStatus ? (
                  <CheckCircle2 size={12} className="text-emerald-400" />
                ) : isPartial ? (
                  <Info size={12} className="text-blue-400" />
                ) : (
                  <ShieldAlert size={12} className="text-red-400" />
                )}
                <span>
                  {isOpenStatus
                    ? "Storefront Live & Operating"
                    : isPartial
                    ? "Selected Services Active"
                    : "Store Currently Closed"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold m-0 text-[var(--text-primary)] leading-tight">
                {isOpenStatus
                  ? shopStatus?.openTitle || shopStatus?.title || "Pixel Perfect is Open & Operating"
                  : isPartial
                  ? shopStatus?.partialTitle || "Partial Service Availability • Selected Hours"
                  : shopStatus?.closedTitle || shopStatus?.title || "We're Currently Closed"}
              </h2>
            </div>
          </div>

          {/* Notice Message */}
          <div
            className={`p-4 rounded-[var(--radius-md)] border text-[0.875rem] leading-relaxed whitespace-pre-line ${
              isOpenStatus
                ? "bg-emerald-500/10 border-emerald-500/25 text-[var(--text-primary)]"
                : isPartial
                ? "bg-blue-500/10 border-blue-500/25 text-[var(--text-primary)]"
                : "bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {isOpenStatus
              ? shopStatus?.openMessage ||
                "We are currently open and taking orders and consulting inquiries. Feel free to explore our products and request service quotes!"
              : isPartial
              ? shopStatus?.partialMessage ||
                "Some particular services are currently undergoing maintenance or unavailable, while our core stationery catalog and select digital services remain actively operational with their scheduled timings."
              : shopStatus?.closedMessage ||
                "We are currently closed for off-hours / maintenance. You can still explore our curated catalog, view IT services, and submit inquiries or message us on WhatsApp. We will process them immediately once open!"}
          </div>

          {/* Countdown Timer Block (If Enabled & Target in Future) */}
          {isTimerEnabled && !timeLeft.isExpired && (
            <div
              className={`rounded-[var(--radius-md)] bg-gradient-to-r border-2 p-4 sm:p-5 flex flex-col items-center text-center shadow-inner ${
                isOpenStatus
                  ? "from-emerald-950/40 via-[var(--bg-card)] to-emerald-950/40 border-emerald-500/40"
                  : isPartial
                  ? "from-blue-950/40 via-[var(--bg-card)] to-blue-950/40 border-blue-500/40"
                  : "from-[var(--bg-card)] via-[var(--bg-elevated)] to-[var(--bg-card)] border-white/20"
              }`}
            >
              <div
                className={`text-[0.72rem] font-bold uppercase tracking-[0.12em] flex items-center gap-1.5 mb-3 ${
                  isOpenStatus
                    ? "text-emerald-400"
                    : isPartial
                    ? "text-blue-400"
                    : "text-[var(--text-muted)]"
                }`}
              >
                <Sparkles size={13} />
                <span>
                  {shopStatus?.timerLabel ||
                    (isOpenStatus
                      ? "Next Schedule Window"
                      : isPartial
                      ? "Full Services Resume In"
                      : "Reopening In")}
                </span>
              </div>

              {/* Digital countdown tiles */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[380px]">
                <div className="flex flex-col items-center bg-[var(--bg-app)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] py-2.5 px-1.5">
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-extrabold leading-none ${
                      isOpenStatus
                        ? "text-emerald-300"
                        : isPartial
                        ? "text-blue-300"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1">
                    Days
                  </span>
                </div>

                <div className="flex flex-col items-center bg-[var(--bg-app)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] py-2.5 px-1.5">
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-extrabold leading-none ${
                      isOpenStatus
                        ? "text-emerald-300"
                        : isPartial
                        ? "text-blue-300"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1">
                    Hours
                  </span>
                </div>

                <div className="flex flex-col items-center bg-[var(--bg-app)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] py-2.5 px-1.5">
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-extrabold leading-none ${
                      isOpenStatus
                        ? "text-emerald-300"
                        : isPartial
                        ? "text-blue-300"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1">
                    Mins
                  </span>
                </div>

                <div className="flex flex-col items-center bg-[var(--bg-app)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] py-2.5 px-1.5">
                  <span
                    className={`font-mono text-2xl sm:text-3xl font-extrabold leading-none ${
                      isOpenStatus
                        ? "text-emerald-300"
                        : isPartial
                        ? "text-blue-300"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[0.625rem] text-[var(--text-muted)] uppercase tracking-wider font-semibold mt-1">
                    Secs
                  </span>
                </div>
              </div>

              {formattedTargetDate && (
                <div className="flex items-center gap-1.5 text-[0.725rem] text-[var(--text-muted)] mt-3 font-mono">
                  <Calendar size={12} />
                  <span>Target Date: {formattedTargetDate}</span>
                </div>
              )}
            </div>
          )}

          {/* Quick contact alternatives */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
            <span>Need direct assistance?</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenWhatsApp}
                className="btn-ghost !p-0 text-xs font-semibold text-[var(--text-primary)] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </button>
              <span>•</span>
              <a
                href={`tel:${shopStatus?.contactPhone || "+9779845991878"}`}
                className="text-xs font-semibold text-[var(--text-primary)] hover:underline flex items-center gap-1"
              >
                <Phone size={13} />
                <span>Call Us</span>
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              className="btn btn-primary w-full py-3 text-sm font-bold gap-2 justify-center shadow-lg"
            >
              <span>
                {isOpenStatus
                  ? "Acknowledge & Start Exploring"
                  : isPartial
                  ? "Acknowledge & Browse Available Services"
                  : "Acknowledge & Browse Catalog"}
              </span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


import React, { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Save,
  RotateCcw,
  Calendar,
  Eye,
  ShieldAlert,
  Phone,
  Mail,
  Zap,
  Info,
} from "lucide-react";

export function ShopStatusManagement({
  shopStatus,
  onUpdateShopStatus,
  showToast,
}) {
  const [formData, setFormData] = useState({
    status: "open", // 'open' | 'partial' | 'closed'
    isOpen: true,
    title: "Pixel Perfect Atelier is Open",
    partialTitle: "Partial Service Availability • Selected Hours",
    closedMessage:
      "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
    partialMessage:
      "Some particular services are currently undergoing maintenance or unavailable, while our core stationery catalog and select digital services remain actively operational with their scheduled timings.",
    openMessage: "We are currently open and taking orders and consulting inquiries.",
    bannerNotice: "",
    timerEnabled: false,
    timerTarget: "",
    timerLabel: "Next Window In",
    timerAction: "reopen",
    showPopupWhenClosed: true,
    contactPhone: "+977 9845991878",
    contactEmail: "atelier@pixelperfect.com",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState("closed-modal"); // 'closed-modal' | 'navbar-pill'

  // Sync state with incoming shopStatus prop
  useEffect(() => {
    if (shopStatus) {
      let localDatetimeStr = "";
      if (shopStatus.timerTarget) {
        try {
          const date = new Date(shopStatus.timerTarget);
          if (!isNaN(date.getTime())) {
            const offset = date.getTimezoneOffset() * 60000;
            const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
            localDatetimeStr = localISODate;
          }
        } catch {}
      }

      const currentStatus =
        shopStatus.status || (shopStatus.isOpen !== false ? "open" : "closed");

      setFormData({
        status: currentStatus,
        isOpen: currentStatus !== "closed",
        title: shopStatus.title || "Pixel Perfect Atelier is Open",
        partialTitle:
          shopStatus.partialTitle || "Partial Service Availability • Selected Hours",
        closedMessage:
          shopStatus.closedMessage ||
          "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
        partialMessage:
          shopStatus.partialMessage ||
          "Some particular services are currently undergoing maintenance or unavailable, while our core stationery catalog and select digital services remain actively operational with their scheduled timings.",
        openMessage:
          shopStatus.openMessage ||
          "We are currently open and taking orders and consulting inquiries.",
        bannerNotice: shopStatus.bannerNotice || "",
        timerEnabled: Boolean(shopStatus.timerEnabled),
        timerTarget: localDatetimeStr,
        timerLabel:
          shopStatus.timerLabel ||
          (currentStatus === "partial" ? "Full Services In" : "Reopening In"),
        timerAction: shopStatus.timerAction || "reopen",
        showPopupWhenClosed:
          shopStatus.showPopupWhenClosed !== undefined
            ? Boolean(shopStatus.showPopupWhenClosed)
            : true,
        contactPhone: shopStatus.contactPhone || "+977 9845991878",
        contactEmail: shopStatus.contactEmail || "atelier@pixelperfect.com",
      });
    }
  }, [shopStatus]);

  // Live countdown calculation for admin preview
  const [previewTimeLeft, setPreviewTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
  });

  useEffect(() => {
    if (!formData.timerEnabled || !formData.timerTarget) {
      setPreviewTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      return;
    }

    const calculateTime = () => {
      const targetTime = new Date(formData.timerTarget).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setPreviewTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setPreviewTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [formData.timerEnabled, formData.timerTarget]);

  // Preset helper for quick timer dates
  const applyPreset = (hoursOffset, fixedHour = null) => {
    const now = new Date();
    let target = new Date(now.getTime() + hoursOffset * 60 * 60 * 1000);

    if (fixedHour !== null) {
      target.setHours(fixedHour, 0, 0, 0);
      if (target.getTime() <= now.getTime()) {
        target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
      }
    }

    const offset = target.getTimezoneOffset() * 60000;
    const localISODate = new Date(target.getTime() - offset).toISOString().slice(0, 16);

    setFormData((prev) => ({
      ...prev,
      timerEnabled: true,
      timerTarget: localISODate,
    }));
  };

  const handleSelectStatus = (newStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      isOpen: newStatus !== "closed",
      timerLabel:
        newStatus === "partial"
          ? "Full Services In"
          : newStatus === "closed"
          ? "Reopening In"
          : prev.timerLabel,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        isOpen: formData.status !== "closed",
        timerTarget: formData.timerTarget ? new Date(formData.timerTarget).toISOString() : null,
      };
      await onUpdateShopStatus(payload);
      showToast(
        `Shop status updated: ${
          formData.status === "open"
            ? "OPEN 🟢"
            : formData.status === "partial"
            ? "PARTIAL AVAILABILITY 🔵"
            : "CLOSED 🔴"
        }`
      );
    } catch (err) {
      showToast(err.message || "Failed to update shop status", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Top Banner Overview */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-black font-extrabold text-[0.65rem] uppercase tracking-wider mb-2">
            <Clock size={12} fill="currentColor" />
            <span>Store Availability Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold m-0 text-[var(--text-primary)]">
            Shop Status, Partial Services & Countdown Timer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-[650px] m-0">
            Control live storefront status for visitors with 3 operational modes: <strong>Open</strong>, <strong>Partial Availability (Selected Services Active with Timing)</strong>, or <strong>Closed</strong>.
          </p>
        </div>

        {/* Current State Indicator Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-4 py-2 rounded-[var(--radius-sm)] border flex items-center gap-2.5 font-bold text-xs uppercase tracking-wider ${
              formData.status === "open"
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : formData.status === "partial"
                ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                : "bg-red-500/20 border-red-500/50 text-red-300"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                formData.status === "open"
                  ? "bg-emerald-400"
                  : formData.status === "partial"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-red-400 animate-ping"
              }`}
            />
            <span>
              Currently:{" "}
              {formData.status === "open"
                ? "OPEN TO VISITORS"
                : formData.status === "partial"
                ? "PARTIAL SERVICES ACTIVE"
                : "STORE CLOSED"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: SETTINGS FORM (7 cols)
            ========================================================================= */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
          {/* Master 3-Option Operational Mode Selector */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col gap-5">
            <div>
              <h3 className="text-base font-extrabold m-0 text-[var(--text-primary)]">
                Master Operating Mode (3 Options)
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 m-0">
                Select your storefront availability status for clients and visitors
              </p>
            </div>

            {/* 3 Visual State Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Option 1: Open */}
              <div
                onClick={() => handleSelectStatus("open")}
                className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex flex-col gap-2.5 ${
                  formData.status === "open"
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/40"
                    : "bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-55 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[0.65rem] font-mono uppercase font-bold text-emerald-400">
                    Full Live
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    🟢 Shop is Open
                  </div>
                  <div className="text-[0.7rem] text-[var(--text-secondary)] mt-1 leading-snug">
                    All products & IT services are actively accepting orders and inquiries.
                  </div>
                </div>
              </div>

              {/* Option 2: Partial Availability (Blue Icon & Theme) */}
              <div
                onClick={() => handleSelectStatus("partial")}
                className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex flex-col gap-2.5 ${
                  formData.status === "partial"
                    ? "bg-blue-500/15 border-blue-500/60 shadow-sm ring-1 ring-blue-500/50"
                    : "bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-55 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-blue-500/25 text-blue-400 flex items-center justify-center shrink-0">
                    <Info size={18} />
                  </div>
                  <span className="text-[0.65rem] font-mono uppercase font-bold text-blue-400">
                    Partial Active
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-400">
                    🔵 Partial Services
                  </div>
                  <div className="text-[0.7rem] text-[var(--text-secondary)] mt-1 leading-snug">
                    Some services unavailable, while others are active with scheduled timings.
                  </div>
                </div>
              </div>

              {/* Option 3: Closed */}
              <div
                onClick={() => handleSelectStatus("closed")}
                className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex flex-col gap-2.5 ${
                  formData.status === "closed"
                    ? "bg-red-500/15 border-red-500/60 shadow-sm ring-1 ring-red-500/50"
                    : "bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-55 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                    <ShieldAlert size={18} />
                  </div>
                  <span className="text-[0.65rem] font-mono uppercase font-bold text-red-400">
                    Offline
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    🔴 Store Closed
                  </div>
                  <div className="text-[0.7rem] text-[var(--text-secondary)] mt-1 leading-snug">
                    Store is fully closed for maintenance or off-hours with reopen countdown.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown Timer Configuration */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <div>
                <h3 className="text-base font-extrabold m-0 text-[var(--text-primary)] flex items-center gap-2">
                  <Clock size={16} />
                  <span>Countdown Timer & Schedule Target</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 m-0">
                  Provide visitors an exact countdown until full services resume or reopening occurs
                </p>
              </div>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.timerEnabled}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, timerEnabled: e.target.checked }))
                  }
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {formData.timerEnabled ? (
              <div className="flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]">
                {/* Quick Presets */}
                <div>
                  <label className="form-label !mb-1.5 flex items-center gap-1 text-[0.725rem]">
                    <Sparkles size={11} />
                    <span>Quick Schedule Presets</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset(1)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      +1 Hour
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(3)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      +3 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(24)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      +24 Hours
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 9)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      Tomorrow 9:00 AM
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0, 14)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      Tomorrow 2:00 PM
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(48)}
                      className="btn btn-secondary btn-sm !text-[0.7rem] !py-1 !px-2.5"
                    >
                      In 2 Days
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          timerTarget: "",
                          timerEnabled: false,
                        }))
                      }
                      className="btn btn-ghost btn-sm !text-[0.7rem] !py-1 !px-2.5 text-[var(--color-danger)]"
                    >
                      Clear Timer
                    </button>
                  </div>
                </div>

                {/* Target Date Input & Timer Label */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="form-group !mb-0">
                    <label className="form-label">Target Date & Time *</label>
                    <input
                      type="datetime-local"
                      required={formData.timerEnabled}
                      value={formData.timerTarget}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, timerTarget: e.target.value }))
                      }
                      className="form-input text-xs font-mono"
                    />
                  </div>

                  <div className="form-group !mb-0">
                    <label className="form-label">Timer Header / Action Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Full Services Resume In / Next Window In:"
                      value={formData.timerLabel}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, timerLabel: e.target.value }))
                      }
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                {/* Live ticker summary */}
                {formData.timerTarget && (
                  <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                      <Calendar size={13} />
                      <span>
                        Target:{" "}
                        {new Date(formData.timerTarget).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </span>

                    {!previewTimeLeft.isExpired ? (
                      <span className="font-mono font-bold text-blue-400">
                        ⏱ {previewTimeLeft.days}d {previewTimeLeft.hours}h {previewTimeLeft.minutes}m {previewTimeLeft.seconds}s
                      </span>
                    ) : (
                      <span className="text-[var(--color-danger)] font-semibold">Target date is in the past</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-dashed border-[var(--border-subtle)] text-xs text-[var(--text-muted)] text-center">
                Timer is currently disabled. Enable toggle above to set a live countdown clock for visitors.
              </div>
            )}
          </div>

          {/* Visitor Notification Messages */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col gap-4">
            <h3 className="text-base font-extrabold m-0 text-[var(--text-primary)]">
              Visitor Notification Messages
            </h3>

            {/* Dynamic fields based on current status */}
            {formData.status === "partial" && (
              <div className="flex flex-col gap-4 p-4 rounded-[var(--radius-md)] bg-blue-500/10 border border-blue-500/30">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <Info size={15} />
                  <span>Partial Availability Notice Fields</span>
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Partial Notice Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Partial Service Availability • Scheduled Maintenance"
                    value={formData.partialTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, partialTitle: e.target.value }))}
                    className="form-input text-xs"
                  />
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Partial Availability Message (Shown to Visitors)</label>
                  <textarea
                    rows="3"
                    placeholder="Describe which services are unavailable, which are available, and the operating schedule..."
                    value={formData.partialMessage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, partialMessage: e.target.value }))
                    }
                    className="form-textarea text-xs !min-h-[75px]"
                  />
                </div>
              </div>
            )}

            {formData.status === "closed" && (
              <div className="flex flex-col gap-4 p-4 rounded-[var(--radius-md)] bg-red-500/10 border border-red-500/30">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                  <ShieldAlert size={15} />
                  <span>Store Closed Notice Fields</span>
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Closed Notice Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. We're Currently Closed / Atelier Maintenance"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="form-input text-xs"
                  />
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Closed Popup Message (Shown to Visitors)</label>
                  <textarea
                    rows="3"
                    placeholder="Message explaining reason for closure and when inquiries will be addressed..."
                    value={formData.closedMessage}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, closedMessage: e.target.value }))
                    }
                    className="form-textarea text-xs !min-h-[75px]"
                  />
                </div>
              </div>
            )}

            {formData.status === "open" && (
              <div className="form-group !mb-0">
                <label className="form-label">Open Status Announcement (Shown in Popover)</label>
                <textarea
                  rows="2"
                  placeholder="Message displayed when shop is open and client clicks status..."
                  value={formData.openMessage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, openMessage: e.target.value }))
                  }
                  className="form-textarea text-xs !min-h-[55px]"
                />
              </div>
            )}

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="form-group !mb-0">
                <label className="form-label flex items-center gap-1">
                  <Phone size={11} />
                  <span>Support / WhatsApp Phone</span>
                </label>
                <input
                  type="text"
                  placeholder="+977 9845991878"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactPhone: e.target.value }))
                  }
                  className="form-input text-xs font-mono"
                />
              </div>

              <div className="form-group !mb-0">
                <label className="form-label flex items-center gap-1">
                  <Mail size={11} />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  placeholder="atelier@pixelperfect.com"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
                  }
                  className="form-input text-xs font-mono"
                />
              </div>
            </div>

            {/* Show Popup Modal Toggle */}
            <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between mt-2">
              <div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  Show Automatic Announcement Modal on Initial Page Load
                </div>
                <div className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                  When enabled, visitors will see the full announcement popup instantly upon opening the site if closed or partial.
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.showPopupWhenClosed}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showPopupWhenClosed: e.target.checked,
                    }))
                  }
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary px-6 py-3 font-bold text-sm gap-2 shadow-lg"
            >
              <Save size={16} />
              <span>{isSubmitting ? "Saving Changes..." : "Save Operating Status & Timer"}</span>
            </button>
          </div>
        </form>

        {/* =========================================================================
            RIGHT COLUMN: INTERACTIVE VISITOR LIVE PREVIEW (5 cols)
            ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
          <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-[var(--text-muted)]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Client Live Preview
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex bg-[var(--bg-input)] rounded-[var(--radius-xs)] p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewTab("closed-modal")}
                  className={`btn-sm !py-1 !px-2.5 text-[0.7rem] rounded-[var(--radius-xs)] border-0 cursor-pointer ${
                    previewTab === "closed-modal" ? "bg-white text-black font-bold" : "bg-transparent text-[var(--text-muted)]"
                  }`}
                >
                  Modal Popup
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("navbar-pill")}
                  className={`btn-sm !py-1 !px-2.5 text-[0.7rem] rounded-[var(--radius-xs)] border-0 cursor-pointer ${
                    previewTab === "navbar-pill" ? "bg-white text-black font-bold" : "bg-transparent text-[var(--text-muted)]"
                  }`}
                >
                  Navbar Badge
                </button>
              </div>
            </div>

            {/* Preview Canvas */}
            {previewTab === "closed-modal" ? (
              /* Modal Mockup Preview */
              <div className="rounded-[var(--radius-md)] border border-white/20 bg-[var(--bg-elevated)] p-4 sm:p-5 flex flex-col gap-4 shadow-md">
                {/* Modal Top Ribbon */}
                <div
                  className={`-m-4 sm:-m-5 mb-3 px-4 py-2 flex items-center justify-between text-[0.675rem] font-extrabold uppercase tracking-wider ${
                    formData.status === "partial"
                      ? "bg-blue-600 text-white"
                      : formData.status === "closed"
                      ? "bg-red-600 text-white"
                      : "bg-emerald-600 text-white"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping inline-block" />
                    <span>
                      {formData.status === "partial"
                        ? "Service Update • Partial Availability"
                        : formData.status === "closed"
                        ? "Store Notice • Currently Closed"
                        : "Operating Update • Shop is Open"}
                    </span>
                  </div>
                  <span className="opacity-60">✕</span>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <div
                    className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.status === "partial"
                        ? "bg-blue-500/20 border-blue-500/40 text-blue-400"
                        : formData.status === "closed"
                        ? "bg-red-500/20 border-red-500/40 text-red-400"
                        : "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    }`}
                  >
                    {formData.status === "partial" ? (
                      <Info size={18} />
                    ) : formData.status === "closed" ? (
                      <Clock size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}
                  </div>
                  <div>
                    <span
                      className={`badge text-[0.55rem] mb-1 ${
                        formData.status === "partial"
                          ? "bg-blue-500/20 text-blue-300"
                          : formData.status === "closed"
                          ? "badge-neutral"
                          : "badge-success"
                      }`}
                    >
                      {formData.status === "partial"
                        ? "Partial Services"
                        : formData.status === "closed"
                        ? "Store Closed"
                        : "Live Storefront"}
                    </span>
                    <h4 className="text-sm font-extrabold m-0 leading-tight">
                      {formData.status === "partial"
                        ? formData.partialTitle || "Partial Service Availability"
                        : formData.status === "closed"
                        ? formData.title || "We're Currently Closed"
                        : formData.title || "Pixel Perfect Atelier is Open"}
                    </h4>
                  </div>
                </div>

                <p className="text-[0.775rem] text-[var(--text-secondary)] bg-[var(--bg-app)] p-3 rounded leading-relaxed m-0 border border-[var(--border-subtle)]">
                  {formData.status === "partial"
                    ? formData.partialMessage
                    : formData.status === "closed"
                    ? formData.closedMessage
                    : formData.openMessage}
                </p>

                {/* Countdown Preview */}
                {formData.timerEnabled && !previewTimeLeft.isExpired && (
                  <div className="rounded bg-[var(--bg-app)] border border-[var(--border-medium)] p-3 flex flex-col items-center text-center">
                    <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1">
                      <Sparkles size={10} />
                      <span>{formData.timerLabel || "Next Window In"}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 w-full max-w-[260px]">
                      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded py-1 px-1">
                        <span className="font-mono text-base font-extrabold block leading-none">
                          {String(previewTimeLeft.days).padStart(2, "0")}
                        </span>
                        <span className="text-[0.55rem] text-[var(--text-muted)] uppercase">Days</span>
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded py-1 px-1">
                        <span className="font-mono text-base font-extrabold block leading-none">
                          {String(previewTimeLeft.hours).padStart(2, "0")}
                        </span>
                        <span className="text-[0.55rem] text-[var(--text-muted)] uppercase">Hours</span>
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded py-1 px-1">
                        <span className="font-mono text-base font-extrabold block leading-none">
                          {String(previewTimeLeft.minutes).padStart(2, "0")}
                        </span>
                        <span className="text-[0.55rem] text-[var(--text-muted)] uppercase">Mins</span>
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded py-1 px-1">
                        <span className="font-mono text-base font-extrabold block leading-none">
                          {String(previewTimeLeft.seconds).padStart(2, "0")}
                        </span>
                        <span className="text-[0.55rem] text-[var(--text-muted)] uppercase">Secs</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn btn-primary btn-sm w-full font-bold text-xs py-2"
                >
                  Acknowledge & Browse Catalog
                </button>
              </div>
            ) : (
              /* Navbar Pill Mockup Preview */
              <div className="rounded-[var(--radius-md)] border border-[var(--border-medium)] bg-[var(--bg-app)] p-5 flex flex-col gap-4">
                <div className="text-xs font-semibold text-[var(--text-muted)]">
                  Simulated Header Navigation:
                </div>

                <div className="p-3 bg-[var(--bg-card)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="font-extrabold tracking-wider text-xs">PIXEL PERFECT</span>

                  {/* The Simulated Badge */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                      formData.status === "open"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : formData.status === "partial"
                        ? "bg-blue-500/15 border-blue-500/40 text-blue-300"
                        : "bg-red-500/15 border-red-500/40 text-red-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.status === "open"
                          ? "bg-emerald-500"
                          : formData.status === "partial"
                          ? "bg-blue-400 animate-pulse"
                          : "bg-red-500 animate-ping"
                      }`}
                    />
                    <span>
                      {formData.status === "open"
                        ? "Shop Open"
                        : formData.status === "partial"
                        ? "Partial Services"
                        : "Shop Closed"}
                    </span>
                    {formData.timerEnabled && !previewTimeLeft.isExpired && (
                      <span
                        className={`text-[0.65rem] font-mono border-l pl-1 ${
                          formData.status === "partial"
                            ? "border-blue-500/40 text-blue-300"
                            : "border-red-500/30"
                        }`}
                      >
                        {previewTimeLeft.days > 0
                          ? `${previewTimeLeft.days}d ${previewTimeLeft.hours}h`
                          : `${previewTimeLeft.hours}h ${previewTimeLeft.minutes}m`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[0.72rem] text-[var(--text-secondary)] leading-relaxed">
                  {formData.status === "open"
                    ? "Visitors will see a discreet 🟢 Shop Open badge with operating info on hover."
                    : formData.status === "partial"
                    ? "Visitors will see a distinct 🔵 Partial Services badge with blue icon and schedule."
                    : "Visitors will see a clear 🔴 Shop Closed badge with live countdown in the top bar."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";

export function ShopStatusManagement({
  shopStatus,
  onUpdateShopStatus,
  showToast,
}) {
  const [formData, setFormData] = useState({
    isOpen: true,
    title: "Pixel Perfect Atelier is Open",
    closedMessage:
      "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
    openMessage: "We are currently open and taking orders and consulting inquiries.",
    bannerNotice: "",
    timerEnabled: false,
    timerTarget: "",
    timerLabel: "Reopening In",
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
      // Format ISO string to datetime-local format (YYYY-MM-DDTHH:MM)
      let localDatetimeStr = "";
      if (shopStatus.timerTarget) {
        try {
          const date = new Date(shopStatus.timerTarget);
          if (!isNaN(date.getTime())) {
            // Convert to YYYY-MM-DDTHH:mm
            const offset = date.getTimezoneOffset() * 60000;
            const localISODate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
            localDatetimeStr = localISODate;
          }
        } catch {}
      }

      setFormData({
        isOpen: shopStatus.isOpen !== undefined ? Boolean(shopStatus.isOpen) : true,
        title: shopStatus.title || "Pixel Perfect Atelier is Open",
        closedMessage:
          shopStatus.closedMessage ||
          "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages. We will process them immediately once open!",
        openMessage:
          shopStatus.openMessage || "We are currently open and taking orders and consulting inquiries.",
        bannerNotice: shopStatus.bannerNotice || "",
        timerEnabled: Boolean(shopStatus.timerEnabled),
        timerTarget: localDatetimeStr,
        timerLabel: shopStatus.timerLabel || "Reopening In",
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
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        timerTarget: formData.timerTarget ? new Date(formData.timerTarget).toISOString() : null,
      };
      await onUpdateShopStatus(payload);
      showToast(`Shop status updated: ${formData.isOpen ? "OPEN 🟢" : "CLOSED 🔴"}`);
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
            Shop Status, Operating Hours & Countdown Timer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-[650px] m-0">
            Control live storefront status for visitors. When set to <strong>Closed</strong>, a stylish announcement popup with an optional live countdown timer will greet visitors immediately upon site entry.
          </p>
        </div>

        {/* Current State Indicator Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-4 py-2 rounded-[var(--radius-sm)] border flex items-center gap-2.5 font-bold text-xs uppercase tracking-wider ${
              formData.isOpen
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-red-500/20 border-red-500/50 text-red-300"
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                formData.isOpen ? "bg-emerald-400" : "bg-red-400 animate-ping"
              }`}
            />
            <span>Currently: {formData.isOpen ? "OPEN TO VISITORS" : "STORE CLOSED"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            LEFT COLUMN: SETTINGS FORM (7 cols)
            ========================================================================= */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
          {/* Master Open / Closed Card */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold m-0 text-[var(--text-primary)]">
                  Master Storefront Toggle
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 m-0">
                  Switch store state between Open and Closed
                </p>
              </div>

              {/* Big Interactive Toggle Switch */}
              <label className="toggle-switch !w-16 !h-8">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => {
                    const isNowOpen = e.target.checked;
                    setFormData((prev) => ({
                      ...prev,
                      isOpen: isNowOpen,
                      title: isNowOpen ? "Pixel Perfect Atelier is Open" : "We're Currently Closed",
                    }));
                  }}
                />
                <span className="toggle-slider !rounded-full before:!w-6 before:!h-6 before:!bottom-1" />
              </label>
            </div>

            {/* Visual State Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: true,
                    title: "Pixel Perfect Atelier is Open",
                  }))
                }
                className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex items-start gap-3 ${
                  formData.isOpen
                    ? "bg-emerald-500/10 border-emerald-500/50 shadow-sm"
                    : "bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-55 hover:opacity-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    🟢 Shop is Open
                  </div>
                  <div className="text-[0.7rem] text-[var(--text-secondary)] mt-1 leading-snug">
                    No popup shown. Visitors browse normally with live "Shop Open" indicator in header.
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isOpen: false,
                    title: "We're Currently Closed",
                  }))
                }
                className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex items-start gap-3 ${
                  !formData.isOpen
                    ? "bg-red-500/15 border-red-500/50 shadow-sm"
                    : "bg-[var(--bg-app)] border-[var(--border-subtle)] opacity-55 hover:opacity-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    🔴 Shop is Closed
                  </div>
                  <div className="text-[0.7rem] text-[var(--text-secondary)] mt-1 leading-snug">
                    Popup modal displays right upon website loading with custom message and live timer.
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
                  <span>Countdown Timer & Reopen Schedule</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 m-0">
                  Provide visitors an exact countdown until the store reopens
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
                    <label className="form-label">Reopening Date & Time *</label>
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
                      placeholder="e.g. Reopening In / Next Opening:"
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
                      <span className="font-mono font-bold text-emerald-400">
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

          {/* Visitor Messages & Popup Configuration */}
          <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col gap-4">
            <h3 className="text-base font-extrabold m-0 text-[var(--text-primary)]">
              Visitor Notification Messages
            </h3>

            {/* Closed Modal Title */}
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

            {/* Closed Notice Body Message */}
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

            {/* Open Announcement Message */}
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
                  Show Automatic Popup Modal on Initial Page Load
                </div>
                <div className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                  When enabled, visitors will see the full modal instantly when opening the site if closed.
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
              <span>{isSubmitting ? "Saving Changes..." : "Save Shop Status & Timer"}</span>
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
                  Closed Popup
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
                <div className="bg-white text-black -m-4 sm:-m-5 mb-3 px-4 py-2 flex items-center justify-between text-[0.675rem] font-extrabold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                    <span>Store Notice • Currently Closed</span>
                  </div>
                  <span className="opacity-60">✕</span>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="badge badge-neutral text-[0.55rem] mb-1">Operating Update</span>
                    <h4 className="text-sm font-extrabold m-0 leading-tight">
                      {formData.title || "We're Currently Closed"}
                    </h4>
                  </div>
                </div>

                <p className="text-[0.775rem] text-[var(--text-secondary)] bg-[var(--bg-app)] p-3 rounded leading-relaxed m-0 border border-[var(--border-subtle)]">
                  {formData.closedMessage}
                </p>

                {/* Countdown Preview */}
                {formData.timerEnabled && !previewTimeLeft.isExpired && (
                  <div className="rounded bg-[var(--bg-app)] border border-[var(--border-medium)] p-3 flex flex-col items-center text-center">
                    <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 flex items-center gap-1">
                      <Sparkles size={10} />
                      <span>{formData.timerLabel || "Reopening In"}</span>
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
                      formData.isOpen
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/15 border-red-500/40 text-red-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.isOpen ? "bg-emerald-500" : "bg-red-500 animate-ping"
                      }`}
                    />
                    <span>{formData.isOpen ? "Shop Open" : "Shop Closed"}</span>
                    {!formData.isOpen && formData.timerEnabled && !previewTimeLeft.isExpired && (
                      <span className="text-[0.65rem] font-mono border-l border-red-500/30 pl-1">
                        {previewTimeLeft.days > 0
                          ? `${previewTimeLeft.days}d ${previewTimeLeft.hours}h`
                          : `${previewTimeLeft.hours}h ${previewTimeLeft.minutes}m`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[0.72rem] text-[var(--text-secondary)] leading-relaxed">
                  {formData.isOpen
                    ? "Visitors will see a discreet 🟢 Shop Open badge with operating info on hover."
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

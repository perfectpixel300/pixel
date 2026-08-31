import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  Loader2,
  Trash2,
  Clock,
  Sparkles,
  Flame,
  Tag,
} from "lucide-react";
import { api } from "../../services/api";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { formatToKathmanduInput, parseKathmanduInputToISO, calculateTimeRemaining } from "../../utils/timezone";

export function PromoFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingPromo,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    badge: "Our Philosophy",
    title: "",
    subtitle: "",
    imageUrl: "",
    hasTimer: false,
    timerEndDate: "",
    timerTitle: "Offer Ends In",
    ctaText: "",
    ctaLink: "/products",
    alignment: "center",
    style: "philosophy",
    order: 1,
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  // Real-time ticking preview timer for modal
  useEffect(() => {
    if (!formData.hasTimer || !formData.timerEndDate) return;

    const updatePreviewTimer = () => {
      const remaining = calculateTimeRemaining(formData.timerEndDate);
      setPreviewTimeLeft(remaining);
    };

    updatePreviewTimer();
    const interval = setInterval(updatePreviewTimer, 1000);
    return () => clearInterval(interval);
  }, [formData.hasTimer, formData.timerEndDate]);

  useEffect(() => {
    if (editingPromo) {
      const formattedDate = editingPromo.timerEndDate
        ? formatToKathmanduInput(editingPromo.timerEndDate)
        : "";

      setFormData({
        badge: editingPromo.badge || "Our Philosophy",
        title: editingPromo.title || "",
        subtitle: editingPromo.subtitle || "",
        imageUrl: editingPromo.imageUrl || "",
        hasTimer: Boolean(editingPromo.hasTimer),
        timerEndDate: formattedDate,
        timerTitle: editingPromo.timerTitle || "Offer Ends In",
        ctaText: editingPromo.ctaText || "",
        ctaLink: editingPromo.ctaLink || "/products",
        alignment: editingPromo.alignment || "center",
        style: editingPromo.style || "philosophy",
        order: editingPromo.order !== undefined ? editingPromo.order : 1,
        isActive: editingPromo.isActive !== undefined ? editingPromo.isActive : true,
      });
    } else {
      setFormData({
        badge: "Our Philosophy",
        title: "",
        subtitle: "",
        imageUrl: "",
        hasTimer: false,
        timerEndDate: "",
        timerTitle: "Offer Ends In",
        ctaText: "",
        ctaLink: "/products",
        alignment: "center",
        style: "philosophy",
        order: 1,
        isActive: true,
      });
    }
    setErrors({});
    setUploadError("");
    setShowManualUrl(false);
  }, [editingPromo, isOpen]);

  if (!isOpen) return null;

  // Handle Cloudinary Image File Upload for Promo Banner
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      const res = await api.uploadImage(files[0], "promos");
      if (res.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.url,
        }));
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title || !formData.title.trim()) {
      errs.title = "Headline title is required";
    }
    if (formData.hasTimer && !formData.timerEndDate) {
      errs.timerEndDate = "Please select an expiration date & time";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...formData,
      timerEndDate: formData.hasTimer ? parseKathmanduInputToISO(formData.timerEndDate) : null,
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[720px] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <Sparkles size={16} />
            <h3 className="text-base font-extrabold m-0">
              {editingPromo ? "Edit Promo / Philosophy Strip" : "Create Promo / Offer Strip"}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="modal-body overflow-y-auto flex flex-col gap-4.5">
          {/* Live Mini Preview Box */}
          <div className="bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex flex-col gap-2">
            <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider">
              Live Strip Preview
            </span>
            <div
              className={`p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-2 ${
                formData.alignment === "center"
                  ? "text-center items-center"
                  : formData.alignment === "right"
                  ? "text-right items-end"
                  : "text-left items-start"
              }`}
            >
              {formData.badge && (
                <span className="badge badge-white text-[0.625rem] px-2 py-0.5 font-bold">
                  {formData.badge}
                </span>
              )}
              <h4 className="text-white font-extrabold text-base sm:text-lg m-0 leading-snug">
                {formData.title || "Headline Title Here"}
              </h4>
              {formData.subtitle && (
                <p className="text-white/80 text-xs m-0 max-w-[500px]">
                  {formData.subtitle}
                </p>
              )}
              {formData.hasTimer && formData.timerEndDate && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-[var(--bg-card)] px-2.5 py-1 rounded border border-amber-500/20 shadow-sm">
                  <Clock size={11} />
                  {!previewTimeLeft.isExpired ? (
                    <span>
                      {formData.timerTitle || "Offer Ends In"}: {String(previewTimeLeft.days).padStart(2, "0")}d {String(previewTimeLeft.hours).padStart(2, "0")}h {String(previewTimeLeft.minutes).padStart(2, "0")}m {String(previewTimeLeft.seconds).padStart(2, "0")}s
                    </span>
                  ) : (
                    <span className="text-zinc-400">Offer Concluded / Target Expired</span>
                  )}
                </div>
              )}
              {formData.imageUrl && (
                <div className="w-full max-w-[260px] h-28 rounded overflow-hidden border border-white/10 mt-1">
                  <img
                    src={getOptimizedImageUrl(formData.imageUrl, { width: 300 })}
                    alt="Artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {formData.ctaText && (
                <span className="btn btn-primary btn-sm text-[0.7rem] !py-1 !px-3 mt-1">
                  {formData.ctaText}
                </span>
              )}
            </div>
          </div>

          {/* Badge & Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="form-group">
              <label className="form-label">
                Badge / Tag
              </label>
              <input
                type="text"
                className="form-input text-xs"
                placeholder="e.g. Our Philosophy, Flash Offer, 25% Off"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Style / Purpose</label>
              <select
                className="form-select text-xs"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              >
                <option value="philosophy">Design Philosophy Quote</option>
                <option value="offer">Flash Offer / Promotional Discount</option>
                <option value="advertisement">Advertisement / Showcase with Image</option>
                <option value="minimal">Minimal Clean Notice</option>
              </select>
            </div>
          </div>

          {/* Headline Title */}
          <div className="form-group">
            <label className="form-label">
              Headline Title *
              {errors.title && <span className="text-[var(--color-danger)] ml-1 text-xs">{errors.title}</span>}
            </label>
            <input
              type="text"
              className="form-input text-xs"
              placeholder="e.g. Quality materials, thoughtful design, and tools built to last."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Subtitle / Description */}
          <div className="form-group">
            <label className="form-label">Subtitle / Quote Body</label>
            <textarea
              className="form-textarea text-xs"
              rows={2}
              placeholder="e.g. Pixel Perfect designs and delivers premium stationery, solid writing instruments, and modern digital services."
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />
          </div>

          {/* Image Upload for Advertisement / Side Showcase */}
          <div className="form-group">
            <label className="form-label flex justify-between items-center">
              <span>Optional Showcase Image / Background</span>
              <button
                type="button"
                onClick={() => setShowManualUrl(!showManualUrl)}
                className="text-[0.7rem] text-[var(--text-muted)] hover:text-white underline cursor-pointer bg-transparent border-0"
              >
                {showManualUrl ? "Upload File instead" : "Enter Image URL directly"}
              </button>
            </label>

            {!showManualUrl ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="btn btn-secondary btn-sm gap-2 text-xs flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={14} />
                        <span>Upload Promo Artwork (Cloudinary)</span>
                      </>
                    )}
                  </button>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="btn-icon btn-ghost text-[var(--color-danger)] !w-8 !h-8"
                      title="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {uploadError && (
                  <span className="text-[0.7rem] text-[var(--color-danger)] font-medium">
                    {uploadError}
                  </span>
                )}
              </div>
            ) : (
              <input
                type="url"
                className="form-input text-xs"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            )}

            {formData.imageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)]">
                <img
                  src={getOptimizedImageUrl(formData.imageUrl, { width: 120 })}
                  alt="Preview"
                  className="w-14 h-10 object-cover rounded"
                />
                <span className="text-xs text-[var(--text-muted)] truncate flex-1 font-mono">
                  {formData.imageUrl}
                </span>
              </div>
            )}
          </div>

          {/* Countdown Timer Section */}
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={15} className="text-amber-400" />
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Enable Live Countdown Timer
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasTimer}
                  onChange={(e) => setFormData({ ...formData, hasTimer: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black" />
              </label>
            </div>

            {formData.hasTimer && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <div className="form-group">
                  <label className="form-label">Timer Header / Title</label>
                  <input
                    type="text"
                    className="form-input text-xs"
                    placeholder="e.g. Flash Offer Ends In"
                    value={formData.timerTitle}
                    onChange={(e) => setFormData({ ...formData, timerTitle: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label flex items-center justify-between">
                    <span>Expiration Date & Time (Kathmandu / NPT) *</span>
                    {errors.timerEndDate && (
                      <span className="text-[var(--color-danger)] text-xs">{errors.timerEndDate}</span>
                    )}
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input text-xs font-mono"
                    value={formData.timerEndDate}
                    onChange={(e) => setFormData({ ...formData, timerEndDate: e.target.value })}
                  />
                  <span className="text-[0.65rem] text-[var(--text-muted)] mt-1 block">
                    Target timezone: Nepal Standard Time (UTC+05:45)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* CTA Link & Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="form-group">
              <label className="form-label">Optional CTA Button Text</label>
              <input
                type="text"
                className="form-input text-xs"
                placeholder="e.g. Shop Flash Sale, Explore Prints"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Link</label>
              <input
                type="text"
                className="form-input text-xs"
                placeholder="e.g. /products, /printing, /services"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
              />
            </div>
          </div>

          {/* Text Alignment & Active Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center pt-2 border-t border-[var(--border-subtle)]">
            <div>
              <label className="form-label block mb-1.5">Text Alignment</label>
              <div className="flex gap-1">
                {[
                  { align: "left", icon: <AlignLeft size={14} /> },
                  { align: "center", icon: <AlignCenter size={14} /> },
                  { align: "right", icon: <AlignRight size={14} /> },
                ].map(({ align, icon }) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() => setFormData({ ...formData, alignment: align })}
                    className={`btn-icon !w-8 !h-8 ${
                      formData.alignment === align ? "btn-primary" : "btn-secondary"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Active on Storefront</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-white peer-checked:after:bg-black" />
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm gap-1.5"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingPromo ? "Update Strip" : "Create Strip"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

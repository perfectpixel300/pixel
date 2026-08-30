import React, { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, UploadCloud, Loader2, Trash2 } from "lucide-react";
import { api } from "../../services/api";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingBanner,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "",
    imageUrl: "",
    ctaText: "Explore Collection",
    ctaLink: "/products",
    alignment: "left",
    order: 1,
    isActive: true,
    overlayDarkness: 50,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        title: editingBanner.title || "",
        subtitle: editingBanner.subtitle || "",
        badge: editingBanner.badge || "",
        imageUrl: editingBanner.imageUrl || "",
        ctaText: editingBanner.ctaText || "Explore Collection",
        ctaLink: editingBanner.ctaLink || "/products",
        alignment: editingBanner.alignment || "left",
        order: editingBanner.order !== undefined ? editingBanner.order : 1,
        isActive: editingBanner.isActive !== undefined ? editingBanner.isActive : true,
        overlayDarkness: editingBanner.overlayDarkness !== undefined ? editingBanner.overlayDarkness : 50,
      });
    } else {
      setFormData({
        title: "",
        subtitle: "",
        badge: "",
        imageUrl: "",
        ctaText: "Explore Collection",
        ctaLink: "/products",
        alignment: "left",
        order: 1,
        isActive: true,
        overlayDarkness: 50,
      });
    }
    setErrors({});
    setUploadError("");
    setShowManualUrl(false);
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  // Handle Cloudinary Image File Upload for Banner
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      const res = await api.uploadImage(files[0], "banners");
      if (res.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.url,
        }));
      }
    } catch (err) {
      console.error("Banner upload failed:", err);
      setUploadError(err.message || "Failed to upload banner image to Cloudinary.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const validate = () => {
    const errs = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      errs.title = "Headline is required";
    } else if (/^\d+$/.test(trimmedTitle)) {
      errs.title = "Headline cannot be only numbers";
    }
    if (!formData.imageUrl.trim()) errs.imageUrl = "Image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      order: Number(formData.order),
      overlayDarkness: Number(formData.overlayDarkness),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[720px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-white text-black flex items-center justify-center font-extrabold">
              <ImageIcon size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {editingBanner ? "Edit Home Hero Banner" : "Create Home Hero Banner"}
              </h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0">
                Configure high-impact hero carousel banner with Cloudinary optimization
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="modal-body">
            {/* Live Mini Preview Bar */}
            {formData.imageUrl && (
              <div className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-[0.7rem] font-bold uppercase text-[var(--text-muted)]">
                    Real-time Hero Preview
                  </span>
                  <span className={`text-[0.7rem] ${formData.isActive ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"}`}>
                    ● {formData.isActive ? "Live on Home" : "Draft (Hidden)"}
                  </span>
                </div>

                <div
                  className="h-38 rounded-[var(--radius-sm)] relative overflow-hidden bg-cover bg-center flex items-center p-5 border border-[var(--border-medium)]"
                  style={{
                    backgroundImage: `url(${getOptimizedImageUrl(formData.imageUrl, { width: 1000 })})`,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${formData.overlayDarkness / 100})`,
                    }}
                  />
                  <div
                    className={`relative z-[2] max-w-[480px] ${
                      formData.alignment === "center"
                        ? "text-center mx-auto"
                        : formData.alignment === "right"
                        ? "text-right ml-auto mr-0"
                        : "text-left mr-auto ml-0"
                    }`}
                  >
                    {formData.badge && (
                      <span className="badge badge-white text-[0.6rem] px-1.5 py-0.5 mb-1">
                        {formData.badge}
                      </span>
                    )}
                    <h4 className="text-white text-base font-extrabold my-0.5 leading-tight">
                      {formData.title || "Banner Headline"}
                    </h4>
                    {formData.subtitle && (
                      <p className="text-white/80 text-[0.725rem] my-0.5 mb-1.5 line-clamp-1">
                        {formData.subtitle}
                      </p>
                    )}
                    <button type="button" className="btn btn-primary btn-sm text-[0.68rem] py-1 px-2.5">
                      {formData.ctaText || "Explore"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1fr] gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Headline Title *
                  {errors.title && <span className="text-[var(--color-danger)] ml-1">{errors.title}</span>}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tactile Instruments for Deep Focus"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Tag (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2026 Edition"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subtitle Description</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Meticulously crafted notebooks and desk essentials..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* Cloudinary Banner Image Upload */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label !mb-0">
                  Banner Hero Image * (Cloudinary CDN)
                  {errors.imageUrl && <span className="text-[var(--color-danger)] ml-1">{errors.imageUrl}</span>}
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[0.725rem] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent border-0 cursor-pointer"
                >
                  {showManualUrl ? "Hide URL Input" : "+ Paste Image URL"}
                </button>
              </div>

              {uploadError && (
                <div className="mb-2 p-2 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-xs)] text-xs">
                  {uploadError}
                </div>
              )}

              {!formData.imageUrl ? (
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[var(--radius-sm)] p-5 text-center cursor-pointer transition-all duration-200 ${
                    uploading
                      ? "border-[var(--border-bright)] bg-[var(--bg-elevated)]"
                      : "border-[var(--border-medium)] hover:border-[var(--border-bright)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-2">
                      <Loader2 size={22} className="animate-spin text-[var(--text-primary)]" />
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        Uploading banner to Cloudinary...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                        <UploadCloud size={16} />
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        Click to upload hero banner image
                      </div>
                      <div className="text-[0.68rem] text-[var(--text-muted)]">
                        High resolution supported • Auto-delivered in WebP/AVIF via Cloudinary
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <div className="flex-1 text-xs font-mono truncate p-2 rounded bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    {formData.imageUrl}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                    className="btn btn-secondary btn-sm text-xs text-[var(--color-danger)]"
                  >
                    <Trash2 size={13} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </div>
              )}

              {showManualUrl && (
                <div className="mt-2">
                  <input
                    type="url"
                    className="form-input text-xs"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              )}
            </div>

            {/* CTA & Alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">CTA Label</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">CTA Link</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ctaLink}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[var(--bg-input)] rounded-[var(--radius-sm)] items-center">
              {/* Alignment */}
              <div>
                <label className="form-label !mb-1">Alignment</label>
                <div className="flex gap-1">
                  {["left", "center", "right"].map((align) => (
                    <button
                      key={align}
                      type="button"
                      onClick={() => setFormData({ ...formData, alignment: align })}
                      className={`btn-icon !w-7 !h-7 ${formData.alignment === align ? "btn-primary" : "btn-secondary"}`}
                    >
                      {align === "left" && <AlignLeft size={13} />}
                      {align === "center" && <AlignCenter size={13} />}
                      {align === "right" && <AlignRight size={13} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Darkness Slider */}
              <div>
                <div className="flex justify-between text-[0.725rem] text-[var(--text-secondary)] mb-1">
                  <span>Darkness</span>
                  <span>{formData.overlayDarkness}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={formData.overlayDarkness}
                  onChange={(e) => setFormData({ ...formData, overlayDarkness: e.target.value })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2.5 justify-end">
                <div className="text-right">
                  <div className="text-[0.775rem] font-bold">Live Status</div>
                  <div className="text-[0.65rem] text-[var(--text-muted)]">{formData.isActive ? "Active" : "Draft"}</div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting || uploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

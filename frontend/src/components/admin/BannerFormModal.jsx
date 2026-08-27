import React, { useState, useEffect } from "react";
import { X, Sparkles, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { PRESET_BANNER_IMAGES } from "../../data/mockData";

export function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingBanner,
  isSubmitting,
}) {
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
  const [showPresets, setShowPresets] = useState(false);

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
        title: "Tactile Instruments for Deep Focus",
        subtitle: "Meticulously crafted notebooks, raw brass instruments, and desktop essentials.",
        badge: "2026 Edition",
        imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1800",
        ctaText: "Explore Collection",
        ctaLink: "/products",
        alignment: "left",
        order: 1,
        isActive: true,
        overlayDarkness: 50,
      });
    }
    setErrors({});
  }, [editingBanner, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle) {
      errs.title = "Headline is required";
    } else if (/^\d+$/.test(trimmedTitle)) {
      errs.title = "Headline cannot be only numbers";
    }
    if (!formData.imageUrl.trim()) errs.imageUrl = "Image URL is required";
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
                Configure high-impact hero carousel banner for storefront
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
                  backgroundImage: `url(${formData.imageUrl || "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1800"})`,
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
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>

            {/* Image URL & Preset Selection */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label !mb-0">Banner Image URL *</label>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="btn btn-secondary btn-sm text-[0.725rem] py-1 px-2 gap-1"
                >
                  <Sparkles size={12} />
                  <span>Choose Preset Image</span>
                </button>
              </div>

              {showPresets && (
                <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] p-2 mb-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {PRESET_BANNER_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: preset.url });
                        setShowPresets(false);
                      }}
                      className="cursor-pointer rounded-[var(--radius-xs)] overflow-hidden"
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover block" />
                      <div className="text-[0.65rem] p-1 truncate">{preset.name}</div>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="url"
                className="form-input"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
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
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingBanner ? "Update Banner" : "Create Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

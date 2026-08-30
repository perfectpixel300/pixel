import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Printer, UploadCloud, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

const DEFAULT_CATEGORIES = [
  "Fine Art & Giclée",
  "Technical & CAD",
  "Document & Bookbinding",
  "Large Format & Signage",
  "Commercial & Corporate",
  "Packaging & Labels",
];

export function PrintingFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingService,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: DEFAULT_CATEGORIES[0],
    customCategory: "",
    shortDescription: "",
    description: "",
    indicativePrice: "",
    discountPrice: "",
    costPrice: "",
    priceUnit: "per piece",
    turnaroundTime: "24-48 Hours",
    minOrderQuantity: 1,
    images: [],
    isAvailable: true,
    featured: false,
    specs: {
      paperGsm: "",
      binding: "",
      color: "",
      dimensions: "",
      printTechnology: "",
      maxResolution: "",
    },
    displayOrder: 0,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualUrlInput, setManualUrlInput] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    if (editingService) {
      const isKnownCategory = DEFAULT_CATEGORIES.includes(editingService.category);
      setIsCustomCategory(!isKnownCategory && Boolean(editingService.category));

      setFormData({
        name: editingService.name || "",
        slug: editingService.slug || "",
        category: isKnownCategory ? editingService.category : "Custom",
        customCategory: isKnownCategory ? "" : editingService.category || "",
        shortDescription: editingService.shortDescription || "",
        description: editingService.description || "",
        indicativePrice: editingService.indicativePrice !== undefined ? editingService.indicativePrice : "",
        discountPrice:
          editingService.discountPrice !== undefined && editingService.discountPrice !== 0
            ? editingService.discountPrice
            : "",
        costPrice: editingService.costPrice !== undefined ? editingService.costPrice : "",
        priceUnit: editingService.priceUnit || "per piece",
        turnaroundTime: editingService.turnaroundTime || "24-48 Hours",
        minOrderQuantity: editingService.minOrderQuantity !== undefined ? editingService.minOrderQuantity : 1,
        images: Array.isArray(editingService.images) ? [...editingService.images] : [],
        isAvailable: editingService.isAvailable !== undefined ? editingService.isAvailable : true,
        featured: editingService.featured !== undefined ? editingService.featured : false,
        specs: {
          paperGsm: editingService.specs?.paperGsm || "",
          binding: editingService.specs?.binding || "",
          color: editingService.specs?.color || "",
          dimensions: editingService.specs?.dimensions || "",
          printTechnology: editingService.specs?.printTechnology || "",
          maxResolution: editingService.specs?.maxResolution || "",
        },
        displayOrder: editingService.displayOrder || 0,
      });
    } else {
      setIsCustomCategory(false);
      setFormData({
        name: "",
        slug: "",
        category: DEFAULT_CATEGORIES[0],
        customCategory: "",
        shortDescription: "",
        description: "",
        indicativePrice: "",
        discountPrice: "",
        costPrice: "",
        priceUnit: "per piece",
        turnaroundTime: "24-48 Hours",
        minOrderQuantity: 1,
        images: [],
        isAvailable: true,
        featured: false,
        specs: {
          paperGsm: "",
          binding: "",
          color: "",
          dimensions: "",
          printTechnology: "",
          maxResolution: "",
        },
        displayOrder: 0,
      });
    }
    setErrors({});
    setUploadError("");
    setManualUrlInput("");
    setShowManualUrl(false);
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");

    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      if (files.length === 1) {
        const res = await api.uploadImage(files[0], "printing");
        if (res.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, res.url],
          }));
        }
      } else {
        const res = await api.uploadImages(files, "printing");
        if (res.urls && res.urls.length > 0) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...res.urls],
          }));
        }
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setManualUrlInput("");
    setShowManualUrl(false);
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const errs = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errs.name = "Name is required";
    } else if (trimmedName.length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    if (isCustomCategory && !formData.customCategory.trim()) {
      errs.category = "Please specify a category name";
    }

    if (!formData.description.trim()) {
      errs.description = "Description is required";
    }

    if (
      formData.indicativePrice === "" ||
      isNaN(Number(formData.indicativePrice)) ||
      Number(formData.indicativePrice) < 0
    ) {
      errs.indicativePrice = "Valid positive price in NRs. required";
    }

    if (
      formData.discountPrice !== "" &&
      (isNaN(Number(formData.discountPrice)) || Number(formData.discountPrice) < 0)
    ) {
      errs.discountPrice = "Discount price must be a positive number";
    } else if (
      formData.discountPrice !== "" &&
      formData.indicativePrice !== "" &&
      Number(formData.discountPrice) >= Number(formData.indicativePrice)
    ) {
      errs.discountPrice = "Discount price must be lower than regular price";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resolvedCategory = isCustomCategory ? formData.customCategory.trim() : formData.category;

    onSubmit({
      ...formData,
      category: resolvedCategory,
      shortDescription: formData.shortDescription || formData.description.slice(0, 160),
      indicativePrice: Number(formData.indicativePrice),
      discountPrice: formData.discountPrice !== "" ? Number(formData.discountPrice) : 0,
      costPrice: formData.costPrice !== "" ? Number(formData.costPrice) : 0,
      minOrderQuantity: Number(formData.minOrderQuantity) || 1,
      isAvailable: Boolean(formData.isAvailable),
      featured: Boolean(formData.featured),
      currency: "NRs.",
      images: formData.images.filter((img) => img && img.trim().length > 0),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card max-w-[720px]" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-white text-black flex items-center justify-center font-extrabold">
              <Printer size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {editingService ? "Edit Printing Service" : "Add Printing Service"}
              </h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0">
                Configure fine art & commercial printing specs, pricing in NRs., and media
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="modal-body">
            {/* Service Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Printing Service Name *
                  {errors.name && <span className="text-[var(--color-danger)] ml-1">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fine Art Giclée Archival Print"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category *
                  {errors.category && <span className="text-[var(--color-danger)] ml-1">{errors.category}</span>}
                </label>
                <select
                  className="form-select"
                  value={isCustomCategory ? "Custom" : formData.category}
                  onChange={(e) => {
                    if (e.target.value === "Custom") {
                      setIsCustomCategory(true);
                    } else {
                      setIsCustomCategory(false);
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Custom Category...</option>
                </select>
                {isCustomCategory && (
                  <input
                    type="text"
                    className="form-input mt-2 text-xs"
                    placeholder="Enter custom category name"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  />
                )}
              </div>
            </div>

            {/* Price (NRs.), Discount Price (NRs.), Cost Price (NRs.) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Regular Price (NRs.) *
                  {errors.indicativePrice && (
                    <span className="text-[var(--color-danger)] ml-1">{errors.indicativePrice}</span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="form-input font-mono"
                  placeholder="e.g. 2800"
                  value={formData.indicativePrice}
                  onChange={(e) => setFormData({ ...formData, indicativePrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Discount Price (NRs.)
                  {errors.discountPrice && (
                    <span className="text-[var(--color-danger)] ml-1">{errors.discountPrice}</span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="form-input font-mono border-emerald-500/40 focus:border-emerald-500"
                  placeholder="Optional (e.g. 2450)"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cost Price (Admin Only)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="form-input font-mono"
                  placeholder="e.g. 1200"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Price Unit, Turnaround, Min Order */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="form-group">
                <label className="form-label">Price Unit / Scope</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. per piece, per sq. ft., per 100 cards"
                  value={formData.priceUnit}
                  onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Turnaround</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. 24-48 Hours, Same Day"
                  value={formData.turnaroundTime}
                  onChange={(e) => setFormData({ ...formData, turnaroundTime: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Min Order Qty (MOQ)</label>
                <input
                  type="number"
                  min="1"
                  className="form-input font-mono text-xs"
                  value={formData.minOrderQuantity}
                  onChange={(e) => setFormData({ ...formData, minOrderQuantity: e.target.value })}
                />
              </div>
            </div>

            {/* Slug & Short Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input font-mono text-xs"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Summary (Tagline)</label>
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="e.g. Museum-grade pigment printing on 310 GSM cotton rag"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>
            </div>

            {/* Full Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Service Description *
                {errors.description && (
                  <span className="text-[var(--color-danger)] ml-1">{errors.description}</span>
                )}
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Detail the printing process, ink technology, longevity, and applications..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Cloudinary Image Upload Section */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label !mb-0">
                  Printing Service Images (Cloudinary CDN)
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[0.725rem] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent border-0 cursor-pointer"
                >
                  {showManualUrl ? "Hide URL Input" : "+ Add image via URL"}
                </button>
              </div>

              {uploadError && (
                <div className="mb-2 p-2 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-xs)] text-xs">
                  {uploadError}
                </div>
              )}

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
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />

                {uploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-2">
                    <Loader2 size={24} className="animate-spin text-[var(--text-primary)]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      Uploading to Cloudinary CDN...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                      <UploadCloud size={18} />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">
                      Click to upload printing sample photo(s)
                    </div>
                    <div className="text-[0.7rem] text-[var(--text-muted)]">
                      Supports JPG, PNG, WEBP, AVIF (Auto-optimized & delivered fast)
                    </div>
                  </div>
                )}
              </div>

              {showManualUrl && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="url"
                    placeholder="https://..."
                    value={manualUrlInput}
                    onChange={(e) => setManualUrlInput(e.target.value)}
                    className="form-input flex-1 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddManualUrl}
                    className="btn btn-secondary btn-sm text-xs"
                  >
                    Add URL
                  </button>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-3">
                  <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1.5">
                    Uploaded Media ({formData.images.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-[var(--radius-xs)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-app)] group h-24"
                      >
                        <img
                          src={getOptimizedImageUrl(imgUrl, { width: 300 })}
                          alt={`Print preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 badge badge-dark text-[0.6rem] py-0.5 px-1 bg-black/80">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 btn-icon btn-secondary !w-6 !h-6 bg-black/80 text-[var(--color-danger)] opacity-90 hover:opacity-100"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Switches */}
            <div className="flex gap-6 p-3 bg-[var(--bg-input)] rounded-[var(--radius-sm)] mb-3.5 flex-wrap">
              <div className="flex items-center gap-2.5">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <div className="text-[0.8rem] font-bold">
                    {formData.isAvailable ? "Available for Orders" : "Temporarily Unavailable"}
                  </div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">
                    {formData.isAvailable ? "Accepting client print inquiries" : "Hidden from active inquiries"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <div className="text-[0.8rem] font-bold">Featured Printing Service</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">Highlight on Home & Services page</div>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <div className="text-[0.725rem] font-bold uppercase text-[var(--text-muted)] tracking-[0.06em] mb-2">
                Technical Print & Paper Specifications (Optional)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Paper GSM (e.g. 310 GSM 100% Cotton Rag)"
                  value={formData.specs.paperGsm}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, paperGsm: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Binding / Finish (e.g. Smyth Sewn / Gold Foil)"
                  value={formData.specs.binding}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, binding: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Print Technology (e.g. 12-Color Lucia PRO Giclée)"
                  value={formData.specs.printTechnology}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, printTechnology: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Max Resolution (e.g. 2400 x 1200 DPI)"
                  value={formData.specs.maxResolution}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, maxResolution: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Supported Sizes (e.g. A4, A3, A2, A1, Custom)"
                  value={formData.specs.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, dimensions: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Inks / Gamut (e.g. Archival Pigment Inks / CMYK+)"
                  value={formData.specs.color}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
              disabled={isSubmitting || uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || uploading}
            >
              {isSubmitting ? "Saving..." : editingService ? "Update Printing Service" : "Create Printing Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

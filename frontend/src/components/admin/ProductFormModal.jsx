import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Package, UploadCloud, Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "../../services/api";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories = [],
  isSubmitting,
}) {
  const defaultCategory = categories.length > 0 ? categories[0].name : "Notebooks";
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: defaultCategory,
    indicativePrice: "",
    discountPrice: "",
    costPrice: "",
    stock: 25,
    description: "",
    images: [],
    isAvailable: true,
    featured: false,
    specs: {
      paperGsm: "",
      binding: "",
      color: "",
      dimensions: "",
      origin: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [manualUrlInput, setManualUrlInput] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        slug: editingProduct.slug || "",
        category: editingProduct.category || defaultCategory,
        indicativePrice: editingProduct.indicativePrice !== undefined ? editingProduct.indicativePrice : "",
        discountPrice:
          editingProduct.discountPrice !== undefined &&
          editingProduct.discountPrice !== null &&
          Number(editingProduct.discountPrice) > 0
            ? editingProduct.discountPrice
            : "",
        costPrice:
          editingProduct.costPrice !== undefined &&
          editingProduct.costPrice !== null &&
          Number(editingProduct.costPrice) > 0
            ? editingProduct.costPrice
            : "",
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 25,
        description: editingProduct.description || "",
        images: Array.isArray(editingProduct.images) ? [...editingProduct.images] : [],
        isAvailable: editingProduct.isAvailable !== undefined ? editingProduct.isAvailable : true,
        featured: editingProduct.featured !== undefined ? editingProduct.featured : false,
        specs: {
          paperGsm: editingProduct.specs?.paperGsm || "",
          binding: editingProduct.specs?.binding || "",
          color: editingProduct.specs?.color || "",
          dimensions: editingProduct.specs?.dimensions || "",
          origin: editingProduct.specs?.origin || "",
        },
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        category: defaultCategory,
        indicativePrice: "",
        discountPrice: "",
        costPrice: "",
        stock: 25,
        description: "",
        images: [],
        isAvailable: true,
        featured: false,
        specs: {
          paperGsm: "",
          binding: "",
          color: "",
          dimensions: "",
          origin: "",
        },
      });
    }
    setErrors({});
    setUploadError("");
    setManualUrlInput("");
    setShowManualUrl(false);
  }, [editingProduct, isOpen, defaultCategory]);

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

  // Handle Cloudinary Image File Upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      if (files.length === 1) {
        const res = await api.uploadImage(files[0], "products");
        if (res.url) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, res.url],
          }));
        }
      } else {
        const res = await api.uploadImages(files, "products");
        if (res.urls && res.urls.length > 0) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...res.urls],
          }));
        }
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
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
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = "Product name cannot be only numbers";
    } else if (trimmedName.length < 2) {
      errs.name = "Product name must be at least 2 characters";
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
      errs.discountPrice = "Discount price must be lower than regular selling price";
    }

    if (
      formData.stock !== "" &&
      (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)
    ) {
      errs.stock = "Stock must be a non-negative number";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const stockNum = Number(formData.stock);
    const isAvailableVal = stockNum === 0 ? false : Boolean(formData.isAvailable);

    onSubmit({
      ...formData,
      indicativePrice: Number(formData.indicativePrice),
      discountPrice:
        formData.discountPrice !== "" &&
        formData.discountPrice !== null &&
        !isNaN(Number(formData.discountPrice)) &&
        Number(formData.discountPrice) > 0
          ? Number(formData.discountPrice)
          : 0,
      costPrice:
        formData.costPrice !== "" &&
        formData.costPrice !== null &&
        !isNaN(Number(formData.costPrice)) &&
        Number(formData.costPrice) > 0
          ? Number(formData.costPrice)
          : 0,
      stock: stockNum,
      isAvailable: isAvailableVal,
      featured: Boolean(formData.featured),
      currency: "NRs.",
      images: formData.images.filter((img) => img && img.trim().length > 0),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[700px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-white text-black flex items-center justify-center font-extrabold">
              <Package size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0">
                Manage catalog attributes, pricing in NRs., Cloudinary media, and specifications
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="modal-body">
            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Product Name *
                  {errors.name && <span className="text-[var(--color-danger)] ml-1">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Architect Hardcover Grid Journal"
                  value={formData.name}
                  onChange={handleNameChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat._id || cat.name} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="e.g. 1650.50"
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
                  placeholder="Optional (e.g. 1350.25)"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Cost Price (Admin Only)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  className="form-input font-mono"
                  placeholder="e.g. 950.00"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                />
              </div>
            </div>

            {/* Stock, Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Stock Units
                  {errors.stock && <span className="text-[var(--color-danger)] ml-1">{errors.stock}</span>}
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input font-mono"
                  value={formData.stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = Number(val);
                    setFormData((prev) => ({
                      ...prev,
                      stock: val,
                      isAvailable:
                        val === ""
                          ? prev.isAvailable
                          : num === 0
                          ? false
                          : Number(prev.stock) === 0
                          ? true
                          : prev.isAvailable,
                    }));
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input font-mono text-xs"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description *
                {errors.description && (
                  <span className="text-[var(--color-danger)] ml-1">{errors.description}</span>
                )}
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Detail the materials, craftsmanship, and tactile features..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Cloudinary Image Upload Section */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label !mb-0">
                  Product Images (Cloudinary CDN)
                </label>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[0.725rem] text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent border-0 cursor-pointer"
                >
                  {showManualUrl ? "Hide URL Input" : "+ Add image via URL"}
                </button>
              </div>

              {/* Upload error banner */}
              {uploadError && (
                <div className="mb-2 p-2 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-xs)] text-xs">
                  {uploadError}
                </div>
              )}

              {/* Cloudinary Drag & Drop / File Selector Box */}
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
                      Uploading and optimizing to Cloudinary...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                      <UploadCloud size={18} />
                    </div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">
                      Click to upload product image(s) to Cloudinary
                    </div>
                    <div className="text-[0.7rem] text-[var(--text-muted)]">
                      Supports JPG, PNG, WEBP, AVIF (Auto-optimized & delivered fast)
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Manual URL Input */}
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

              {/* Uploaded Images Thumbnails Grid */}
              {formData.images.length > 0 && (
                <div className="mt-3">
                  <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)] tracking-wider mb-1.5">
                    Uploaded Images ({formData.images.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-[var(--radius-xs)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-app)] group h-24"
                      >
                        <img
                          src={getOptimizedImageUrl(imgUrl, { width: 300 })}
                          alt={`Product preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 badge badge-dark backdrop-blur-sm text-[0.6rem] py-0.5 px-1.5 shadow-sm">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 btn-icon btn-secondary !w-6 !h-6 text-[var(--color-danger)] shadow-sm"
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
                    checked={Number(formData.stock) === 0 ? false : formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    disabled={Number(formData.stock) === 0}
                  />
                  <span className="toggle-slider"></span>
                </label>
                <div>
                  <div className="text-[0.8rem] font-bold">
                    {Number(formData.stock) === 0
                      ? "Out of Stock"
                      : formData.isAvailable
                      ? "In Stock"
                      : "Out of Stock"}
                  </div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">
                    {Number(formData.stock) === 0
                      ? "0 stock units (marked unavailable)"
                      : formData.isAvailable
                      ? "Available for inquiry"
                      : "Unavailable for inquiry"}
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
                  <div className="text-[0.8rem] font-bold">Featured Product</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">Highlight on storefront home</div>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="text-[0.725rem] font-bold uppercase text-[var(--text-muted)] tracking-[0.06em] mb-2">
                Material Specifications (Optional)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Paper (e.g. 120 GSM Munken)"
                  value={formData.specs.paperGsm}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, paperGsm: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Binding (e.g. Lay-Flat Smyth Sewn)"
                  value={formData.specs.binding}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, binding: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Finish (e.g. Raw Machined Brass)"
                  value={formData.specs.color}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })
                  }
                />
                <input
                  type="text"
                  className="form-input text-xs"
                  placeholder="Dimensions (e.g. A5 148 x 210 mm)"
                  value={formData.specs.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, specs: { ...formData.specs, dimensions: e.target.value } })
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting || uploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

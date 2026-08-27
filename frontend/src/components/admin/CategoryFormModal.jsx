import React, { useState, useEffect, useRef } from "react";
import { X, Layers, UploadCloud, Loader2, Trash2 } from "lucide-react";
import { api } from "../../services/api";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isSubmitting,
}) {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showManualUrl, setShowManualUrl] = useState(false);

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || "",
        slug: editingCategory.slug || "",
        description: editingCategory.description || "",
        imageUrl: editingCategory.imageUrl || "",
        displayOrder: editingCategory.displayOrder !== undefined ? editingCategory.displayOrder : 0,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        imageUrl: "",
        displayOrder: 0,
      });
    }
    setErrors({});
    setUploadError("");
    setShowManualUrl(false);
  }, [editingCategory, isOpen]);

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

  // Handle Cloudinary Image File Upload for Category
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      setUploadError("");

      const res = await api.uploadImage(files[0], "categories");
      if (res.url) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: res.url,
        }));
      }
    } catch (err) {
      console.error("Category image upload failed:", err);
      setUploadError(err.message || "Failed to upload category image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const validate = () => {
    const errs = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errs.name = "Category name is required";
    } else if (/^\d+$/.test(trimmedName)) {
      errs.name = "Category name cannot be only numbers";
    } else if (trimmedName.length < 2) {
      errs.name = "Category name must be at least 2 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      displayOrder: Number(formData.displayOrder || 0),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[560px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-white text-black flex items-center justify-center font-extrabold">
              <Layers size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0">
                Configure product category attributes, Cloudinary cover media, and curation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">
                Category Name *
                {errors.name && <span className="text-[var(--color-danger)] ml-1">{errors.name}</span>}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Leather Goods"
                value={formData.name}
                onChange={handleNameChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] gap-3">
              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input font-mono text-xs"
                  placeholder="e.g. leather-goods"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                rows="2"
                className="form-textarea"
                placeholder="Brief summary of items in this category..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Cloudinary Category Cover Image Upload */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label !mb-0">Category Cover Image (Cloudinary CDN)</label>
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[0.725rem] text-[var(--text-muted)] hover:text-white bg-transparent border-0 cursor-pointer"
                >
                  {showManualUrl ? "Hide URL Input" : "+ Paste Image URL"}
                </button>
              </div>

              {uploadError && (
                <div className="mb-2 p-2 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-xs)] text-xs">
                  {uploadError}
                </div>
              )}

              {/* Upload Box */}
              {!formData.imageUrl ? (
                <div
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-[var(--radius-sm)] p-5 text-center cursor-pointer transition-all duration-200 ${
                    uploading
                      ? "border-[var(--border-bright)] bg-[var(--bg-elevated)]"
                      : "border-[var(--border-medium)] hover:border-white hover:bg-[var(--bg-elevated)]"
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
                      <Loader2 size={22} className="animate-spin text-white" />
                      <span className="text-xs font-bold text-white">
                        Uploading cover to Cloudinary...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-white">
                        <UploadCloud size={16} />
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        Click to upload category cover image
                      </div>
                      <div className="text-[0.68rem] text-[var(--text-muted)]">
                        Auto-optimized format & compression via Cloudinary
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-app)] h-32 group">
                  <img
                    src={getOptimizedImageUrl(formData.imageUrl, { width: 600 })}
                    alt="Category Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary btn-sm text-xs py-1 px-2.5"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                      className="btn btn-secondary btn-sm text-xs py-1 px-2 text-[var(--color-danger)]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
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

              {/* Manual URL Input (Optional) */}
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
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting || uploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting || uploading}>
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

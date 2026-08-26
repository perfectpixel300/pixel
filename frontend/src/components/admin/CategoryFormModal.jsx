import React, { useState, useEffect } from "react";
import { X, Layers, Sparkles } from "lucide-react";
import { PRESET_IMAGES } from "../../data/mockData";

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    displayOrder: 0,
  });

  const [errors, setErrors] = useState({});
  const [showPresets, setShowPresets] = useState(false);

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
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
        displayOrder: 0,
      });
    }
    setErrors({});
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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Category name is required";
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
                Configure product category attributes and curation
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
                  className="form-input"
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

            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label !mb-0">Category Cover Image (Optional)</label>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="btn btn-secondary btn-sm text-[0.725rem] py-1 px-2 gap-1"
                >
                  <Sparkles size={12} />
                  <span>Choose Preset</span>
                </button>
              </div>

              {showPresets && (
                <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] p-2 mb-2.5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setFormData({ ...formData, imageUrl: preset.url });
                        setShowPresets(false);
                      }}
                      className="cursor-pointer rounded-[var(--radius-xs)] overflow-hidden"
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-11 object-cover block" />
                      <div className="text-[0.625rem] p-1 truncate">{preset.name}</div>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

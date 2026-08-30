import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Palette,
  FileText,
  Layers,
  Maximize,
  Tag,
  Package,
  Sparkles,
  Shield,
  Zap,
  Cpu,
  Bookmark,
} from "lucide-react";

export const PRINTING_AVAILABLE_ICONS = [
  { name: "Printer", label: "Printer / General", icon: <Printer size={18} /> },
  { name: "Palette", label: "Fine Art / Color", icon: <Palette size={18} /> },
  { name: "FileText", label: "Documents / Prints", icon: <FileText size={18} /> },
  { name: "Layers", label: "Binding / Multi-layer", icon: <Layers size={18} /> },
  { name: "Maximize", label: "Large Format / Signage", icon: <Maximize size={18} /> },
  { name: "Tag", label: "Labels & Stickers", icon: <Tag size={18} /> },
  { name: "Package", label: "Packaging & Boxes", icon: <Package size={18} /> },
  { name: "Sparkles", label: "Specialty / Foil / UV", icon: <Sparkles size={18} /> },
  { name: "Cpu", label: "CAD / Technical Blueprints", icon: <Cpu size={18} /> },
  { name: "Bookmark", label: "Bookbinding / Editorial", icon: <Bookmark size={18} /> },
  { name: "Shield", label: "Official / Security", icon: <Shield size={18} /> },
  { name: "Zap", label: "Express / Quick Turnaround", icon: <Zap size={18} /> },
];

export function getPrintingCategoryIcon(iconName) {
  const match = PRINTING_AVAILABLE_ICONS.find(
    (i) => i.name.toLowerCase() === (iconName || "").toLowerCase()
  );
  return match ? match.icon : <Printer size={16} />;
}

export function PrintingCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory = null,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Printer",
    displayOrder: 1,
    isActive: true,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        _id: editingCategory._id,
        name: editingCategory.name || "",
        description: editingCategory.description || "",
        icon: editingCategory.icon || "Printer",
        displayOrder: editingCategory.displayOrder || 1,
        isActive: editingCategory.isActive !== undefined ? Boolean(editingCategory.isActive) : true,
      });
    } else {
      setFormData({
        _id: undefined,
        name: "",
        description: "",
        icon: "Printer",
        displayOrder: 1,
        isActive: true,
      });
    }
    setError("");
  }, [editingCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setError("Please provide a category name");
      return;
    }
    if (/^\d+$/.test(trimmedName)) {
      setError("Category name cannot be only numbers");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Category name must be at least 2 characters");
      return;
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      icon: formData.icon.trim() || "Printer",
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: Boolean(formData.isActive),
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[540px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="text-base font-bold m-0">
              {editingCategory ? `Edit Printing Category: ${editingCategory.name}` : "Create Printing Category"}
            </h3>
            <span className="text-[0.725rem] text-[var(--text-muted)]">
              Organize print disciplines, paper types, and production categories
            </span>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="modal-body flex flex-col gap-4">
          {error && (
            <div className="p-2.5 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-[0.8rem]">
              {error}
            </div>
          )}

          {/* Category Name */}
          <div className="form-group !mb-0">
            <label className="form-label">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Fine Art & Giclée, Technical & CAD, Bookbinding"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input text-xs"
            />
          </div>

          {/* Description */}
          <div className="form-group !mb-0">
            <label className="form-label">Short Description</label>
            <textarea
              rows="2"
              placeholder="Brief summary of printing methods or paper types grouped here..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea text-xs !min-h-[55px]"
            />
          </div>

          {/* Icon Picker */}
          <div className="form-group !mb-0">
            <label className="form-label mb-2">Discipline Icon</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto p-1 bg-[var(--bg-app)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]">
              {PRINTING_AVAILABLE_ICONS.map((item) => {
                const isSelected = formData.icon.toLowerCase() === item.name.toLowerCase();
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: item.name })}
                    className={`p-2.5 flex flex-col items-center gap-1 rounded-[var(--radius-xs)] border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold border-[var(--btn-primary-bg)] shadow-sm"
                        : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]"
                    }`}
                    title={item.label}
                  >
                    <div>{item.icon}</div>
                    <span className="text-[0.6rem] truncate w-full text-center">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Display Order & Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)] items-center">
            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-white"
              />
              <span>Active in Filter Bar</span>
            </label>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-[0.7rem] text-[var(--text-muted)] uppercase font-bold">Display Order:</span>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: e.target.value })}
                className="form-input !w-16 text-xs text-center py-1 px-1.5"
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="modal-footer !p-0 !pt-3 !border-0">
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-sm"
            >
              {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

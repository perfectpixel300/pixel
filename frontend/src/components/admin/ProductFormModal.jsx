import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Sparkles, Package } from "lucide-react";
import { PRESET_IMAGES } from "../../data/mockData";

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories = [],
  isSubmitting,
}) {
  const defaultCategory = categories.length > 0 ? categories[0].name : "Notebooks";

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: defaultCategory,
    indicativePrice: "",
    stock: 25,
    description: "",
    images: [""],
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
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || "",
        slug: editingProduct.slug || "",
        category: editingProduct.category || defaultCategory,
        indicativePrice: editingProduct.indicativePrice !== undefined ? editingProduct.indicativePrice : "",
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 25,
        description: editingProduct.description || "",
        images: editingProduct.images && editingProduct.images.length > 0 ? editingProduct.images : [""],
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
        stock: 25,
        description: "",
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000"],
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

  const handleImageChange = (index, value) => {
    const nextImages = [...formData.images];
    nextImages[index] = value;
    setFormData({ ...formData, images: nextImages });
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const handleRemoveImage = (index) => {
    const nextImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: nextImages.length ? nextImages : [""] });
  };

  const handleSelectPreset = (presetUrl) => {
    const filteredImages = formData.images.filter((img) => img.trim().length > 0);
    setFormData({
      ...formData,
      images: [...filteredImages, presetUrl],
    });
    setShowPresets(false);
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

    if (formData.indicativePrice === "" || isNaN(Number(formData.indicativePrice)) || Number(formData.indicativePrice) < 0) {
      errs.indicativePrice = "Valid positive price in NRs. required";
    }

    if (formData.stock !== "" && (isNaN(Number(formData.stock)) || Number(formData.stock) < 0)) {
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
      stock: stockNum,
      isAvailable: isAvailableVal,
      featured: Boolean(formData.featured),
      currency: "NRs.",
      images: formData.images.filter((img) => img.trim().length > 0),
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
                {editingProduct ? "Edit Atelier Product" : "Create New Catalog Product"}
              </h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0">
                Manage catalog attributes, pricing in NRs., specifications, and images
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
                  placeholder="Architect Hardcover Grid Journal"
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

            {/* Price (NRs.), Stock, Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="form-group">
                <label className="form-label">
                  Price (NRs.) *
                  {errors.indicativePrice && <span className="text-[var(--color-danger)] ml-1">{errors.indicativePrice}</span>}
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  className="form-input"
                  placeholder="1650"
                  value={formData.indicativePrice}
                  onChange={(e) => setFormData({ ...formData, indicativePrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Stock Units
                  {errors.stock && <span className="text-[var(--color-danger)] ml-1">{errors.stock}</span>}
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    const num = Number(val);
                    setFormData((prev) => ({
                      ...prev,
                      stock: val,
                      isAvailable: val === "" ? prev.isAvailable : num === 0 ? false : (Number(prev.stock) === 0 ? true : prev.isAvailable),
                    }));
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Description *
                {errors.description && <span className="text-[var(--color-danger)] ml-1">{errors.description}</span>}
              </label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Detail the materials, craftsmanship, and tactile features..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Image URLs & Presets */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label !mb-0">Product Images</label>
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
                <div className="bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] p-2 mb-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5 max-h-40 overflow-y-auto">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectPreset(preset.url)}
                      className="cursor-pointer rounded-[var(--radius-xs)] overflow-hidden"
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-14 object-cover block" />
                      <div className="text-[0.65rem] p-1 truncate">
                        {preset.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="url"
                      className="form-input flex-1"
                      placeholder="https://images.unsplash.com/..."
                      value={imgUrl}
                      onChange={(e) => handleImageChange(idx, e.target.value)}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="btn-icon btn-ghost text-[var(--color-danger)]"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="btn btn-ghost btn-sm self-start text-[0.725rem] gap-1"
                >
                  <Plus size={12} />
                  <span>Add Another Image</span>
                </button>
              </div>
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
                    {Number(formData.stock) === 0 ? "Out of Stock" : formData.isAvailable ? "In Atelier Stock" : "Out of Stock"}
                  </div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">
                    {Number(formData.stock) === 0 ? "0 stock units (marked unavailable)" : formData.isAvailable ? "Available for inquiry" : "Unavailable for inquiry"}
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
                  <div className="text-[0.8rem] font-bold">Featured Artifact</div>
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
                  className="form-input"
                  placeholder="Paper (e.g. 120 GSM Munken)"
                  value={formData.specs.paperGsm}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, paperGsm: e.target.value } })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Binding (e.g. Lay-Flat Smyth Sewn)"
                  value={formData.specs.binding}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, binding: e.target.value } })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Finish (e.g. Raw Machined Brass)"
                  value={formData.specs.color}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value } })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dimensions (e.g. A5 148 x 210 mm)"
                  value={formData.specs.dimensions}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, dimensions: e.target.value } })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

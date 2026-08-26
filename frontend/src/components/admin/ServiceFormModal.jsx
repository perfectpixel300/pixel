import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Code, Globe, Smartphone, Shield, Cloud, Bot, Palette, Terminal, Layers } from "lucide-react";
import { SERVICE_CATEGORIES } from "../../data/mockData";

const ICON_OPTIONS = [
  { label: "Code / Full-Stack", value: "Code" },
  { label: "Globe / Web", value: "Globe" },
  { label: "Smartphone / Mobile", value: "Smartphone" },
  { label: "Palette / UI/UX Design", value: "Palette" },
  { label: "Cloud / DevOps", value: "Cloud" },
  { label: "Shield / Security", value: "Shield" },
  { label: "Bot / AI", value: "Bot" },
  { label: "Terminal / Consulting", value: "Terminal" },
  { label: "Layers / Architecture", value: "Layers" },
];

const PRESET_SERVICE_IMAGES = [
  { name: "Code & Screen", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop" },
  { name: "Analytics & Dashboard", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop" },
  { name: "Enterprise Server Architecture", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" },
  { name: "Mobile App Wireframing", url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop" },
  { name: "UI/UX Product Design", url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop" },
  { name: "Cloud & Global Network", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop" },
  { name: "Cybersecurity Shield", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop" },
  { name: "AI Neural Network", url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop" },
];

export function ServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingService = null,
  isSubmitting = false,
  serviceCategories = [],
}) {
  // Normalize category options
  const categoryOptions =
    serviceCategories && serviceCategories.length > 0
      ? serviceCategories.map((c) => (typeof c === "string" ? c : c.name))
      : SERVICE_CATEGORIES;

  // Make sure editing service category is in options if not present
  if (editingService?.category && !categoryOptions.includes(editingService.category)) {
    categoryOptions.push(editingService.category);
  }

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: categoryOptions[0] || "Web Development",
    shortDescription: "",
    description: "",
    price: 25000,
    priceType: "starting_at",
    deliveryTime: "1-2 Weeks",
    icon: "Code",
    bannerImage: "",
    features: [""],
    technologies: "",
    isWebDevPackage: false,
    packageTier: "none",
    tierBadge: "",
    isFeatured: false,
    isActive: true,
    displayOrder: 1,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingService) {
      setFormData({
        _id: editingService._id,
        title: editingService.title || "",
        slug: editingService.slug || "",
        category: editingService.category || "Web Development",
        shortDescription: editingService.shortDescription || "",
        description: editingService.description || "",
        price: editingService.price !== undefined ? editingService.price : 25000,
        priceType: editingService.priceType || "starting_at",
        deliveryTime: editingService.deliveryTime || "1-2 Weeks",
        icon: editingService.icon || "Code",
        bannerImage: editingService.bannerImage || "",
        features:
          editingService.features && editingService.features.length > 0
            ? [...editingService.features]
            : [""],
        technologies:
          editingService.technologies && Array.isArray(editingService.technologies)
            ? editingService.technologies.join(", ")
            : "",
        isWebDevPackage: Boolean(editingService.isWebDevPackage),
        packageTier: editingService.packageTier || "none",
        tierBadge: editingService.tierBadge || "",
        isFeatured: Boolean(editingService.isFeatured),
        isActive: editingService.isActive !== undefined ? Boolean(editingService.isActive) : true,
        displayOrder: editingService.displayOrder || 1,
      });
    } else {
      setFormData({
        _id: undefined,
        title: "",
        slug: "",
        category: "Web Development",
        shortDescription: "",
        description: "",
        price: 25000,
        priceType: "starting_at",
        deliveryTime: "1-2 Weeks",
        icon: "Code",
        bannerImage: "",
        features: [""],
        technologies: "",
        isWebDevPackage: false,
        packageTier: "none",
        tierBadge: "",
        isFeatured: false,
        isActive: true,
        displayOrder: 1,
      });
    }
    setError("");
  }, [editingService, isOpen]);

  if (!isOpen) return null;

  // Features list handlers
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated.length > 0 ? updated : [""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please provide a service title");
      return;
    }
    if (!formData.shortDescription.trim()) {
      setError("Please provide a short summary");
      return;
    }
    if (formData.price === undefined || formData.price === null || formData.price < 0) {
      setError("Please provide a valid price in NRs.");
      return;
    }

    const techArray = formData.technologies
      ? formData.technologies
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

    const cleanedFeatures = formData.features
      .map((f) => f.trim())
      .filter((f) => f);

    const payload = {
      ...formData,
      _id: editingService?._id || formData._id,
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      description: formData.description?.trim() || formData.shortDescription.trim(),
      price: Number(formData.price),
      features: cleanedFeatures,
      technologies: techArray,
      isWebDevPackage: Boolean(formData.isWebDevPackage),
      packageTier: formData.isWebDevPackage ? formData.packageTier : "none",
      displayOrder: Number(formData.displayOrder) || 0,
    };

    onSubmit(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[650px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="text-base font-bold m-0">
              {editingService ? `Edit Service: ${editingService.title}` : "Add New IT Service / Package"}
            </h3>
            <span className="text-[0.725rem] text-[var(--text-muted)]">
              Configure IT capabilities, deliverables, and NPr pricing
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

          {/* Web Development Package Toggle (Highlight) */}
          <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Web Development 3-Tier Package
              </div>
              <div className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
                Enable if this service represents one of the 3 primary web development tiers
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={formData.isWebDevPackage}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setFormData({
                    ...formData,
                    isWebDevPackage: isChecked,
                    category: isChecked ? "Web Development" : formData.category,
                    packageTier: isChecked ? "starter" : "none",
                    isFeatured: isChecked ? true : formData.isFeatured,
                  });
                }}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Tier Selector (Only if Web Dev Package) */}
          {formData.isWebDevPackage && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)]">
              <div className="form-group !mb-0">
                <label className="form-label">Package Tier</label>
                <select
                  value={formData.packageTier}
                  onChange={(e) => setFormData({ ...formData, packageTier: e.target.value })}
                  className="form-select text-xs"
                >
                  <option value="starter">Starter Package</option>
                  <option value="professional">Professional Package (Most Popular)</option>
                  <option value="enterprise">Enterprise Package</option>
                </select>
              </div>

              <div className="form-group !mb-0">
                <label className="form-label">Tier Highlight Badge</label>
                <input
                  type="text"
                  placeholder="e.g. Most Popular / Recommended"
                  value={formData.tierBadge}
                  onChange={(e) => setFormData({ ...formData, tierBadge: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group !mb-0">
              <label className="form-label">Service Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Professional Full-Stack Web App"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input text-xs"
              />
            </div>

            <div className="form-group !mb-0">
              <label className="form-label">Discipline / Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-select text-xs"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price (NRs.), Price Type & Turnaround Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="form-group !mb-0">
              <label className="form-label">Price in NRs. *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="55000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="form-input font-mono text-xs"
              />
            </div>

            <div className="form-group !mb-0">
              <label className="form-label">Price Type</label>
              <select
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="form-select text-xs"
              >
                <option value="starting_at">Starting From</option>
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
                <option value="custom_quote">Custom Quote</option>
              </select>
            </div>

            <div className="form-group !mb-0">
              <label className="form-label">Estimated Delivery</label>
              <input
                type="text"
                placeholder="e.g. 2-3 Weeks"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="form-input text-xs"
              />
            </div>
          </div>

          {/* Short Summary */}
          <div className="form-group !mb-0">
            <label className="form-label">Short Summary *</label>
            <textarea
              required
              rows="2"
              placeholder="Concise overview of what this service delivers..."
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="form-textarea text-xs !min-h-[55px]"
            />
          </div>

          {/* Detailed Description */}
          <div className="form-group !mb-0">
            <label className="form-label">Full Technical Description</label>
            <textarea
              rows="3"
              placeholder="In-depth details on engineering approach, architecture, and scope..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea text-xs !min-h-[75px]"
            />
          </div>

          {/* Key Deliverables & Features */}
          <div className="form-group !mb-0">
            <div className="flex justify-between items-center mb-1.5">
              <label className="form-label !mb-0">Features & Deliverables Checklist</label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-[0.725rem] font-semibold text-[var(--text-primary)] hover:underline flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <Plus size={12} />
                <span>Add Deliverable</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Deliverable #${idx + 1} (e.g. Full MERN Stack, Admin CMS, eSewa Gateway)`}
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    className="form-input text-xs py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="btn-icon btn-ghost !w-7 !h-7 text-[var(--color-danger)]"
                    title="Remove deliverable"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack & Icon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group !mb-0">
              <label className="form-label">Technologies (Comma Separated)</label>
              <input
                type="text"
                placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="form-input text-xs"
              />
            </div>

            <div className="form-group !mb-0">
              <label className="form-label">Icon Representation</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="form-select text-xs"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Banner Image URL with Presets */}
          <div className="form-group !mb-0">
            <label className="form-label">Banner Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.bannerImage}
              onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
              className="form-input text-xs mb-2"
            />
            {/* Quick preset selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {PRESET_SERVICE_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFormData({ ...formData, bannerImage: preset.url })}
                  className="badge badge-neutral text-[0.625rem] whitespace-nowrap cursor-pointer hover:bg-[var(--bg-elevated)]"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles (Active, Featured, Display Order) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)] items-center">
            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="accent-white"
              />
              <span>Active on Public Page</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-[var(--text-primary)] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="accent-white"
              />
              <span>Featured Spotlight</span>
            </label>

            <div className="flex items-center gap-2 justify-end">
              <span className="text-[0.7rem] text-[var(--text-muted)] uppercase font-bold">Order:</span>
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
              {isSubmitting ? "Saving..." : editingService ? "Update Service" : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  List,
  LayoutGrid,
  Star,
  Terminal,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import { getServiceIcon } from "../../pages/ServicesPage";

const DEFAULT_IT_CATEGORIES = [
  "Mobile Development",
  "UI/UX Design",
  "Cloud & DevOps",
  "Cybersecurity",
  "AI & Automation",
  "IT Consulting",
];

export function ServicesManagement({
  services = [],
  serviceCategories = [],
  onOpenCreateModal,
  onEditService,
  onDeleteService,
  onToggleActive,
  onToggleFeatured,
  onManageCategories,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // 'table' | 'grid'
  const [sortBy, setSortBy] = useState("order_asc");

  // Non-web development categories (dynamic)
  const itCategories =
    serviceCategories && serviceCategories.length > 0
      ? serviceCategories
          .map((c) => (typeof c === "string" ? c : c.name))
          .filter((c) => c !== "Web Development")
      : DEFAULT_IT_CATEGORIES;

  // Filter only general IT services (strictly keeping Web Development 3-tier packages apart)
  const itServices = services.filter((s) => !s.isWebDevPackage);

  const filtered = itServices
    .filter((s) => {
      if (selectedCategory !== "All" && s.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = s.title?.toLowerCase().includes(q);
        const matchDesc = s.shortDescription?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
        const matchCat = s.category?.toLowerCase().includes(q);
        const matchTech = s.technologies?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchCat && !matchTech) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "title_asc") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "title_desc") return (b.title || "").localeCompare(a.title || "");
      return (a.displayOrder || 0) - (b.displayOrder || 0);
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Category Pills Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`btn btn-sm !rounded-full ${
            selectedCategory === "All" ? "btn-primary" : "btn-secondary"
          }`}
        >
          All IT Disciplines ({itServices.length})
        </button>

        {itCategories.map((cat) => {
          const count = itServices.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm !rounded-full whitespace-nowrap ${
                selectedCategory === cat ? "btn-primary" : "btn-secondary"
              }`}
            >
              <span>{cat}</span>
              <span className="opacity-65 text-[0.68rem]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-55">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search IT capabilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-8 text-xs py-2 px-2.5"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select !w-auto text-xs py-2 px-2.5"
          >
            <option value="order_asc">Display Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A to Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--bg-input)] rounded-[var(--radius-xs)]">
            <button
              onClick={() => setViewMode("table")}
              className={`btn-icon !w-7 !h-7 ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
              title="Table View"
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`btn-icon !w-7 !h-7 ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {onManageCategories && (
            <button
              onClick={onManageCategories}
              className="btn btn-secondary btn-sm gap-1.5"
              title="Manage and reorganize service categories"
            >
              <Layers size={13} />
              <span>Manage Categories</span>
            </button>
          )}

          <button
            onClick={() => onOpenCreateModal({ isWebDevPackage: false, category: itCategories[0] || "Mobile Development" })}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus size={13} />
            <span>Add IT Capability</span>
          </button>
        </div>
      </div>

      {/* Content Table or Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)] bg-[var(--bg-card)]">
          <Terminal size={28} className="text-[var(--text-muted)] mb-2 mx-auto" />
          <h3 className="text-base font-bold">No IT services found</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            Add your first IT capability or reset filter queries.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[0.825rem]">
              <thead>
                <tr className="bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase">
                  <th className="py-2.5 px-3.5">Service Title</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">Price (NRs.)</th>
                  <th className="py-2.5 px-3.5">Delivery Time</th>
                  <th className="py-2.5 px-3.5">Deliverables</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Featured</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id} className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                          {getServiceIcon(s.icon, 15)}
                        </div>
                        <div>
                          <div className="font-bold">{s.title}</div>
                          <div className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                            /{s.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5">
                      <span className="badge badge-neutral">{s.category}</span>
                    </td>
                    <td className="py-3 px-3.5 font-bold font-mono">
                      NRs. {Number(s.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-3.5 text-xs text-[var(--text-secondary)] font-mono">
                      {s.deliveryTime || "1-2 Weeks"}
                    </td>
                    <td className="py-3 px-3.5 text-xs text-[var(--text-muted)]">
                      {s.features?.length || 0} items
                    </td>
                    <td className="py-3 px-3.5">
                      <button
                        onClick={() => onToggleActive(s._id)}
                        className={`badge cursor-pointer ${s.isActive ? "badge-success" : "badge-neutral"}`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 px-3.5">
                      <button
                        onClick={() => onToggleFeatured(s._id)}
                        className={`btn-icon btn-ghost !w-7 !h-7 ${s.isFeatured ? "text-[var(--color-warning)]" : "text-[var(--text-muted)]"}`}
                      >
                        <Star size={14} fill={s.isFeatured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => onEditService(s)}
                          className="btn-icon btn-secondary !w-7.5 !h-7.5"
                          title="Edit Service"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteService(s)}
                          className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]"
                          title="Delete Service"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)] p-5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded bg-[var(--bg-elevated)] flex items-center justify-center">
                  {getServiceIcon(s.icon, 18)}
                </div>
                <span className="badge badge-neutral text-[0.625rem]">{s.category}</span>
              </div>

              <h3 className="text-base font-bold m-0">{s.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2">
                {s.shortDescription}
              </p>

              <div className="my-3 py-2 px-3 rounded bg-[var(--bg-app)] flex justify-between items-center text-xs">
                <span className="text-[var(--text-muted)] font-mono">NRs. {Number(s.price).toLocaleString()}</span>
                <span className="text-[var(--text-muted)]">{s.deliveryTime}</span>
              </div>

              <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center">
                <button
                  onClick={() => onToggleActive(s._id)}
                  className={`badge cursor-pointer ${s.isActive ? "badge-success" : "badge-neutral"}`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </button>

                <div className="flex gap-1">
                  <button
                    onClick={() => onEditService(s)}
                    className="btn-icon btn-secondary !w-7.5 !h-7.5"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteService(s)}
                    className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

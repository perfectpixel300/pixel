import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  List,
  LayoutGrid,
  Layers,
  Sparkles,
  ArrowRight,
  Code,
} from "lucide-react";
import { getServiceIcon } from "../../pages/ServicesPage";

export function ServiceCategoryManagement({
  categories = [],
  services = [],
  onOpenCreateModal,
  onEditCategory,
  onDeleteCategory,
  onNavigateToServices,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Calculate live service count for each category
  const categoriesWithLiveCount = categories.map((cat) => {
    const count = services.filter((s) => s.category === cat.name).length;
    return {
      ...cat,
      liveCount: count,
    };
  });

  const filtered = categoriesWithLiveCount
    .filter((cat) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          cat.name?.toLowerCase().includes(q) ||
          cat.slug?.toLowerCase().includes(q) ||
          cat.description?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-black font-extrabold text-[0.65rem] uppercase tracking-wider mb-2">
            <Layers size={12} fill="currentColor" />
            <span>Service Disciplines & Taxonomies</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold m-0 text-[var(--text-primary)]">
            Service Categories Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-[650px] m-0">
            Add, edit, or remove categories for your IT services. Changes instantly update the storefront filter pills and service creation selectors.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus size={13} />
            <span>Add Service Category</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search service categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input !pl-8 text-xs py-2 px-2.5"
          />
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
        </div>
      </div>

      {/* Categories Content */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)] bg-[var(--bg-card)]">
          <Layers size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
          <h3 className="text-base font-bold">No Service Categories Found</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Create your first dynamic IT service category to group capabilities on the storefront.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary btn-sm mt-4 gap-1.5"
          >
            <Plus size={13} />
            <span>Create First Category</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[0.825rem]">
              <thead>
                <tr className="bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase">
                  <th className="py-2.5 px-3.5">Icon & Category Name</th>
                  <th className="py-2.5 px-3.5">Slug</th>
                  <th className="py-2.5 px-3.5">Description</th>
                  <th className="py-2.5 px-3.5">Assigned Services</th>
                  <th className="py-2.5 px-3.5 text-center">Order</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat._id} className="border-b border-[var(--border-subtle)]">
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] flex items-center justify-center shrink-0">
                          {getServiceIcon(cat.icon, 16)}
                        </div>
                        <div className="font-bold text-[var(--text-primary)]">
                          {cat.name}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 font-mono text-xs text-[var(--text-muted)]">
                      /{cat.slug}
                    </td>

                    <td className="py-3 px-3.5 text-xs text-[var(--text-secondary)] max-w-xs truncate">
                      {cat.description || "—"}
                    </td>

                    <td className="py-3 px-3.5">
                      <span className="badge badge-neutral text-[0.675rem]">
                        {cat.liveCount || 0} {cat.liveCount === 1 ? "service" : "services"}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 font-mono text-center text-xs">
                      {cat.displayOrder || 0}
                    </td>

                    <td className="py-3 px-3.5">
                      <span className={`badge ${cat.isActive !== false ? "badge-success" : "badge-neutral"}`}>
                        {cat.isActive !== false ? "Active" : "Hidden"}
                      </span>
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => onEditCategory(cat)}
                          className="btn-icon btn-secondary !w-7.5 !h-7.5"
                          title="Edit Category"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]"
                          title="Delete Category"
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
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)] p-5 transition-all hover:border-[var(--border-bright)]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] flex items-center justify-center">
                  {getServiceIcon(cat.icon, 20)}
                </div>
                <span className="badge badge-neutral text-[0.65rem]">
                  {cat.liveCount || 0} Services
                </span>
              </div>

              <h3 className="text-base font-bold m-0 text-[var(--text-primary)]">{cat.name}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 line-clamp-2 min-h-[34px]">
                {cat.description || "Custom IT capability category."}
              </p>

              <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex justify-between items-center text-xs">
                <span className="font-mono text-[0.68rem] text-[var(--text-muted)]">
                  Order: {cat.displayOrder || 0}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => onEditCategory(cat)}
                    className="btn-icon btn-secondary !w-7.5 !h-7.5"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat)}
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

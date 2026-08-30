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
  Printer,
  Sliders,
} from "lucide-react";
import { getPrintingCategoryIcon } from "./PrintingCategoryFormModal";

export function PrintingCategoryManagement({
  categories = [],
  printingServices = [],
  onOpenCreateModal,
  onEditCategory,
  onDeleteCategory,
  onNavigateToPrintingServices,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // Calculate live printing service count for each category
  const categoriesWithLiveCount = categories.map((cat) => {
    const count = printingServices.filter((s) => s.category === cat.name).length;
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

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive !== false).length;
  const totalAssignedServices = printingServices.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-black font-extrabold text-[0.65rem] uppercase tracking-wider mb-2">
            <Printer size={12} fill="currentColor" />
            <span>Printing Disciplines & Formats</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold m-0 text-[var(--text-primary)]">
            Printing Categories Management
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-[650px] m-0">
            Create, update, and organize categories for printing press services, large formats, fine art giclée, and bindery. Updates immediately sync to storefront discipline filters.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus size={13} />
            <span>Add Printing Category</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Printing Categories
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono">
              {totalCategories}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Sliders size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Active in Filter Bar
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-emerald-400">
              {activeCategories} <span className="text-xs text-[var(--text-muted)] font-normal">of {totalCategories}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Assigned Print Services
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono">
              {totalAssignedServices} Services
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Printer size={16} />
          </div>
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
            placeholder="Search printing categories..."
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
              <List size={13} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`btn-icon !w-7 !h-7 ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
              title="Grid View"
            >
              <LayoutGrid size={13} />
            </button>
          </div>

          {onNavigateToPrintingServices && (
            <button
              onClick={onNavigateToPrintingServices}
              className="btn btn-secondary btn-sm gap-1 text-xs"
            >
              <span>View Printing Services</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)] bg-[var(--bg-card)]">
          <Printer size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
          <h3 className="text-base font-bold">No Printing Categories Found</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {searchTerm ? `No category matching "${searchTerm}"` : "Create your first category to group printing services."}
          </p>
          <button
            onClick={onOpenCreateModal}
            className="btn btn-primary btn-sm mt-4 gap-1.5"
          >
            <Plus size={13} />
            <span>Create First Printing Category</span>
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[0.825rem]">
              <thead>
                <tr className="bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase">
                  <th className="py-2.5 px-3.5">Category Discipline</th>
                  <th className="py-2.5 px-3.5">Description</th>
                  <th className="py-2.5 px-3.5 text-center">Display Order</th>
                  <th className="py-2.5 px-3.5 text-center">Services</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat) => (
                  <tr
                    key={cat._id || cat.name}
                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <td className="py-3 px-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
                          {getPrintingCategoryIcon(cat.icon)}
                        </div>
                        <div>
                          <div className="font-bold text-[var(--text-primary)]">{cat.name}</div>
                          <div className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                            /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-")}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-[var(--text-secondary)] text-xs max-w-[280px] truncate">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3 px-3.5 text-center font-mono text-xs">
                      #{cat.displayOrder || 0}
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <span className="badge badge-neutral text-xs font-mono font-bold">
                        {cat.liveCount || 0} services
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`badge ${
                          cat.isActive !== false ? "badge-success" : "badge-neutral"
                        }`}
                      >
                        {cat.isActive !== false ? "● Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditCategory(cat)}
                          className="btn-icon btn-secondary !w-7 !h-7"
                          title="Edit printing category"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"
                          title="Delete printing category"
                        >
                          <Trash2 size={12} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <div
              key={cat._id || cat.name}
              className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                    {getPrintingCategoryIcon(cat.icon)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="badge badge-neutral text-[0.65rem] font-mono">
                      #{cat.displayOrder || 0}
                    </span>
                    <span
                      className={`badge text-[0.65rem] ${
                        cat.isActive !== false ? "badge-success" : "badge-neutral"
                      }`}
                    >
                      {cat.isActive !== false ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] m-0">
                  {cat.name}
                </h3>
                <div className="text-[0.7rem] text-[var(--text-muted)] font-mono mb-2">
                  /{cat.slug}
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 m-0 mb-4 min-h-[32px]">
                  {cat.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)] mt-auto">
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                  {cat.liveCount || 0} services
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditCategory(cat)}
                    className="btn-icon btn-secondary !w-7 !h-7"
                    title="Edit printing category"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat)}
                    className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"
                    title="Delete printing category"
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

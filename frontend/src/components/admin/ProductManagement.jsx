import React, { useState } from "react";
import { Search, Plus, List, LayoutGrid, Star, Edit2, Trash2, Package } from "lucide-react";

export function ProductManagement({
  products,
  categories = [],
  onOpenCreateModal,
  onEditProduct,
  onDeleteProduct,
  onToggleAvailability,
  onToggleFeatured,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [viewMode, setViewMode] = useState("table");

  const filtered = products
    .filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.indicativePrice || 0) - (b.indicativePrice || 0);
      if (sortBy === "price_desc") return (b.indicativePrice || 0) - (a.indicativePrice || 0);
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="flex flex-col gap-5">
      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`btn btn-sm !rounded-full ${selectedCategory === "All" ? "btn-primary" : "btn-secondary"}`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => {
          const count = products.filter((p) => p.category === cat.name).length;
          return (
            <button
              key={cat._id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`btn btn-sm !rounded-full whitespace-nowrap ${selectedCategory === cat.name ? "btn-primary" : "btn-secondary"}`}
            >
              <span>{cat.name}</span>
              <span className="opacity-65 text-[0.68rem]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-55">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search products..."
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
            <option value="createdAt_desc">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--bg-input)] rounded-[var(--radius-xs)]">
            <button
              onClick={() => setViewMode("table")}
              className={`btn-icon !w-7 !h-7 ${viewMode === "table" ? "btn-primary" : "btn-ghost"}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`btn-icon !w-7 !h-7 ${viewMode === "grid" ? "btn-primary" : "btn-ghost"}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={13} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)]">
          <Package size={28} className="text-[var(--text-muted)] mb-2 mx-auto" />
          <h3 className="text-base font-bold">No products found</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            Create your first catalog item or reset filters.
          </p>
        </div>
      ) : viewMode === "table" ? (
        /* Table Mode */
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[0.825rem]">
              <thead>
                <tr className="bg-[var(--bg-sidebar)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase">
                  <th className="py-2.5 px-3.5">Product</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">Price (NRs.)</th>
                  <th className="py-2.5 px-3.5">Stock</th>
                  <th className="py-2.5 px-3.5">Specs</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Featured</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const img = p.images && p.images[0] ? p.images[0] : "";
                  return (
                    <tr key={p._id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          <img src={img} alt={p.name} className="w-10 h-10 rounded-[var(--radius-xs)] object-cover" />
                          <div>
                            <div className="font-bold">{p.name}</div>
                            <div className="text-[0.68rem] text-[var(--text-muted)] font-mono">/{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="badge badge-neutral">{p.category}</span>
                      </td>
                      <td className="py-3 px-3.5 font-bold font-mono">
                        NRs. {Number(p.indicativePrice).toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="badge badge-neutral">{p.stock || 0} units</span>
                      </td>
                      <td className="py-3 px-3.5 text-[0.725rem] text-[var(--text-muted)]">
                        {p.specs?.paperGsm || p.specs?.color || "Standard"}
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => onToggleAvailability(p._id)}
                          className={`badge cursor-pointer ${p.isAvailable ? "badge-success" : "badge-neutral"}`}
                        >
                          {p.isAvailable ? "In Stock" : "Unavailable"}
                        </button>
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          onClick={() => onToggleFeatured(p._id)}
                          className={`btn-icon btn-ghost !w-7 !h-7 ${p.featured ? "text-[var(--color-warning)]" : "text-[var(--text-muted)]"}`}
                        >
                          <Star size={15} fill={p.featured ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => onEditProduct(p)} className="btn-icon btn-secondary !w-7.5 !h-7.5">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => onDeleteProduct(p)} className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p._id} className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]">
              <div className="h-40 relative">
                <img src={p.images && p.images[0] ? p.images[0] : ""} alt={p.name} className="w-full h-full object-cover" />
                <span className="badge badge-dark absolute top-2 left-2">{p.category}</span>
              </div>
              <div className="p-4 flex flex-col gap-1.5 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold m-0">{p.name}</h4>
                  <span className="font-bold font-mono text-sm">NRs. {Number(p.indicativePrice).toLocaleString()}</span>
                </div>
                <div className="mt-auto pt-2.5 flex justify-between items-center">
                  <button onClick={() => onToggleAvailability(p._id)} className={`badge cursor-pointer ${p.isAvailable ? "badge-success" : "badge-neutral"}`}>
                    {p.isAvailable ? "Available" : "Unavailable"}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => onEditProduct(p)} className="btn-icon btn-secondary !w-7 !h-7"><Edit2 size={12} /></button>
                    <button onClick={() => onDeleteProduct(p)} className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

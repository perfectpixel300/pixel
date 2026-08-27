import React, { useState } from "react";
import { Search, Plus, List, LayoutGrid, Star, Edit2, Trash2, Package, Coins } from "lucide-react";

export function ProductManagement({
  products = [],
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

  const totalInventoryPrice = products.reduce(
    (acc, p) => acc + (Number(p?.indicativePrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalStockUnits = products.reduce(
    (acc, p) => acc + (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );

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
      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Products
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight">
              {products.length} Items
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Package size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Stock Units
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight">
              {totalStockUnits.toLocaleString()} Units
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Package size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Inventory Price
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalInventoryPrice.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Coins size={16} />
          </div>
        </div>
      </div>

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
                  <th className="py-2.5 px-3.5">Total Value (NRs.)</th>
                  <th className="py-2.5 px-3.5">Specs</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Featured</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const img = p.images && p.images[0] ? p.images[0] : "";
                  const totalVal = (Number(p.indicativePrice) || 0) * (p.stock !== undefined ? Number(p.stock) : 0);
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
                      <td className="py-3 px-3.5 font-bold font-mono text-[var(--text-primary)]">
                        NRs. {totalVal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-[0.725rem] text-[var(--text-muted)]">
                        {p.specs?.paperGsm || p.specs?.color || "Standard"}
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleAvailability(p._id)}
                          className={`badge cursor-pointer ${
                            p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                              ? "badge-success"
                              : "badge-neutral"
                          }`}
                          title={
                            p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                              ? "In Stock (Click to mark Out of Stock)"
                              : "Out of Stock (Click to mark In Stock)"
                          }
                        >
                          {p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                            ? "In Stock"
                            : "Out of Stock"}
                        </button>
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(p._id)}
                          className={`btn-icon btn-ghost !w-7 !h-7 ${
                            p.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"
                          }`}
                          title={p.featured ? "Featured Product (Click to unfeature)" : "Click to feature product"}
                        >
                          <Star
                            size={15}
                            fill={p.featured ? "#fbbf24" : "none"}
                            stroke={p.featured ? "#fbbf24" : "currentColor"}
                          />
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
          {filtered.map((p) => {
            const totalVal = (Number(p.indicativePrice) || 0) * (p.stock !== undefined ? Number(p.stock) : 0);
            return (
              <div key={p._id} className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]">
                <div className="h-40 relative">
                  <img src={p.images && p.images[0] ? p.images[0] : ""} alt={p.name} className="w-full h-full object-cover" />
                  <span className="badge badge-dark absolute top-2 left-2">{p.category}</span>
                  {p.featured && (
                    <span className="badge badge-white absolute top-2 right-2 flex items-center gap-1 text-[0.6rem]">
                      <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold m-0">{p.name}</h4>
                    <span className="font-bold font-mono text-sm">NRs. {Number(p.indicativePrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[0.72rem] text-[var(--text-muted)] font-mono">
                    <span>Stock: {p.stock || 0} units</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Total: NRs. {totalVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-auto pt-2.5 flex justify-between items-center border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => onToggleAvailability(p._id)}
                      className={`badge cursor-pointer ${
                        p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                          ? "badge-success"
                          : "badge-neutral"
                      }`}
                      title={
                        p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                          ? "In Stock (Click to mark Out of Stock)"
                          : "Out of Stock (Click to mark In Stock)"
                      }
                    >
                      {p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
                        ? "In Stock"
                        : "Out of Stock"}
                    </button>
                    <div className="flex gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(p._id)}
                        className={`btn-icon btn-ghost !w-7 !h-7 ${
                          p.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"
                        }`}
                        title={p.featured ? "Unfeature Product" : "Feature Product"}
                      >
                        <Star
                          size={14}
                          fill={p.featured ? "#fbbf24" : "none"}
                          stroke={p.featured ? "#fbbf24" : "currentColor"}
                        />
                      </button>
                      <button onClick={() => onEditProduct(p)} className="btn-icon btn-secondary !w-7 !h-7"><Edit2 size={12} /></button>
                      <button onClick={() => onDeleteProduct(p)} className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"><Trash2 size={12} /></button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

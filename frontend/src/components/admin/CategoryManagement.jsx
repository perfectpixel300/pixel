import React, { useState } from "react";
import { Plus, Edit2, Trash2, Layers, Search, Package, Coins, TrendingUp } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function CategoryManagement({
  categories = [],
  products = [],
  onOpenCreateModal,
  onEditCategory,
  onDeleteCategory,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = categories.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  const totalCatVal = products.reduce(
    (sum, p) => sum + (Number(p?.indicativePrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalCatCost = products.reduce(
    (sum, p) => sum + (Number(p?.costPrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalCatProfit = totalCatVal - totalCatCost;
  const totalCatMargin = totalCatVal > 0 ? ((totalCatProfit / totalCatVal) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Category Metric Strip (Value, Cost, Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Product Categories
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight">
              {categories.length} Disciplines
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Layers size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Category Valuation
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalCatVal.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Category Cost
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-zinc-300">
              NRs. {totalCatCost.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-zinc-400">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-emerald-500/30 bg-emerald-500/5">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-emerald-400">
              Expected Profit ({totalCatMargin}%)
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-emerald-400">
              NRs. {totalCatProfit.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Product Disciplines & Groups</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Add, rename, customize, and manage stationery categories and valuations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-50">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-8 text-xs py-2 px-2.5"
            />
          </div>

          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)]">
          <Layers size={28} className="text-[var(--text-muted)] mb-2 mx-auto" />
          <h3 className="text-base font-bold">No categories found</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            Create your first discipline or clear the search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat) => {
            const catProducts = products.filter((p) => p && p.category === cat.name);
            const count = catProducts.length;
            const stockCount = catProducts.reduce((sum, p) => sum + (p?.stock !== undefined ? Number(p.stock) || 0 : 0), 0);
            const val = catProducts.reduce(
              (sum, p) => sum + (Number(p?.indicativePrice) || 0) * (p?.stock !== undefined ? Number(p.stock) || 0 : 0),
              0
            );
            const cost = catProducts.reduce(
              (sum, p) => sum + (Number(p?.costPrice) || 0) * (p?.stock !== undefined ? Number(p.stock) || 0 : 0),
              0
            );
            const profit = val - cost;

            return (
              <div
                key={cat._id}
                className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]"
              >
                {/* Cover Image Banner */}
                <div
                  className="h-28 relative bg-cover bg-center bg-[#18181b]"
                  style={
                    cat.imageUrl
                      ? { backgroundImage: `url(${getOptimizedImageUrl(cat.imageUrl, { width: 600 })})` }
                      : {}
                  }
                >
                  <div className="absolute inset-0 bg-black/55 p-3 flex flex-col justify-between">
                    <span className="badge badge-white self-start text-[0.625rem]">
                      /{cat.slug}
                    </span>
                    <div className="text-white text-lg font-extrabold">
                      {cat.name}
                    </div>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-4.5 flex flex-col gap-2.5 flex-1">
                  <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed m-0 min-h-[36px]">
                    {cat.description || "Archival curated tools and artisan supplies."}
                  </p>

                  {/* Valuation, Cost & Profit Badges */}
                  <div className="p-2.5 rounded-[var(--radius-xs)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col gap-1 text-[0.72rem] font-mono">
                    <div className="flex justify-between items-center text-[var(--text-muted)]">
                      <span>Inventory Value:</span>
                      <span className="font-bold text-[var(--text-primary)]">NRs. {val.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[var(--text-muted)]">
                      <span>Total Cost:</span>
                      <span className="text-zinc-300">NRs. {cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-400 font-bold border-t border-[var(--border-subtle)] pt-1 mt-0.5">
                      <span>Profit:</span>
                      <span>+NRs. {profit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-2.5 border-t border-[var(--border-subtle)] flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-[0.775rem] text-[var(--text-muted)]">
                      <Package size={13} />
                      <span>{count} items ({stockCount} units)</span>
                    </div>

                    <div className="flex gap-1">
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

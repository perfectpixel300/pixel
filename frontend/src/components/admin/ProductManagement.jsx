import React, { useState } from "react";
import { Search, Plus, Minus, List, LayoutGrid, Star, Edit2, Trash2, Package, Coins, TrendingUp } from "lucide-react";
import { CategoryDropdown } from "../common/CategoryDropdown";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { api } from "../../services/api";

export function ProductManagement({
  products = [],
  categories = [],
  onOpenCreateModal,
  onEditProduct,
  onDeleteProduct,
  onToggleAvailability,
  onToggleFeatured,
  onUpdateStock,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all"); // 'all' | 'in_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [viewMode, setViewMode] = useState("table");
  const [updatingStockId, setUpdatingStockId] = useState(null);

  const handleStockChange = async (productId, currentStock, delta) => {
    const newStock = Math.max(0, (Number(currentStock) || 0) + delta);
    if (newStock === currentStock) return;
    try {
      setUpdatingStockId(productId);
      if (onUpdateStock) {
        await onUpdateStock(productId, newStock);
      } else {
        await api.updateProduct(productId, { stock: newStock });
      }
    } catch (err) {
      console.error("Failed to update stock:", err);
    } finally {
      setUpdatingStockId(null);
    }
  };

  const getEffectivePrice = (p) => {
    if (p?.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.indicativePrice)) {
      return Number(p.discountPrice);
    }
    return Number(p?.indicativePrice) || 0;
  };

  const inStockProducts = products.filter(
    (p) => p && p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
  );

  const totalInventoryPrice = inStockProducts.reduce(
    (acc, p) => acc + getEffectivePrice(p) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalCostPrice = inStockProducts.reduce(
    (acc, p) => acc + (Number(p?.costPrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalExpectedProfit = totalInventoryPrice - totalCostPrice;
  const profitMargin = totalInventoryPrice > 0 ? ((totalExpectedProfit / totalInventoryPrice) * 100).toFixed(1) : "0.0";
  const totalStockUnits = inStockProducts.reduce(
    (acc, p) => acc + (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );

  const outOfStockCount = products.filter(
    (p) => !p.isAvailable || (p.stock !== undefined && Number(p.stock) <= 0)
  ).length;
  const inStockCount = products.filter(
    (p) => p.isAvailable && (p.stock === undefined || Number(p.stock) > 0)
  ).length;

  const filtered = products
    .filter((p) => {
      // Category filter
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;

      // Stock status filter
      const isAvailable = p.isAvailable && (p.stock === undefined || Number(p.stock) > 0);
      if (stockFilter === "in_stock" && !isAvailable) return false;
      if (stockFilter === "out_of_stock" && isAvailable) return false;

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchCat = p.category?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === "price_desc") return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="flex flex-col gap-5">
      {/* Inventory Summary Cards with Profit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Products & Units
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight">
              {products.length} Items <span className="text-xs text-[var(--text-muted)] font-normal">({totalStockUnits.toLocaleString()} units)</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Package size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Inventory Value (Selling)
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalInventoryPrice.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Inventory Cost (Total)
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalCostPrice.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-emerald-500/30 bg-emerald-500/5">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-emerald-400">
              Expected Profit ({profitMargin}%)
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-emerald-400">
              NRs. {totalExpectedProfit.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative w-48 sm:w-55">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-8 text-xs py-2 px-2.5"
            />
          </div>

          {/* Minimal Category Dropdown */}
          <CategoryDropdown
            categories={categories.map((cat) => ({
              id: cat._id || cat.name,
              name: cat.name,
              count: products.filter((p) => p.category === cat.name).length,
            }))}
            selectedCategory={selectedCategory}
            onSelectCategory={(catName) => setSelectedCategory(catName)}
            totalCount={products.length}
            label="Category"
            allLabel="All Categories"
            size="sm"
          />

          {/* Quick Stock Status Filter Pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-input)] p-0.5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setStockFilter("all")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer ${
                stockFilter === "all"
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStockFilter("in_stock")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer ${
                stockFilter === "in_stock"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-[var(--text-muted)] hover:text-emerald-400"
              }`}
            >
              In Stock ({inStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter("out_of_stock")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer flex items-center gap-1.5 ${
                stockFilter === "out_of_stock"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 font-bold"
                  : "text-[var(--text-muted)] hover:text-red-400"
              }`}
            >
              <span>Out of Stock</span>
              {outOfStockCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[0.625rem] font-bold">
                  {outOfStockCount}
                </span>
              )}
            </button>
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
          <h3 className="text-base font-bold">
            {stockFilter === "out_of_stock"
              ? "No out of stock products"
              : stockFilter === "in_stock"
              ? "No in stock products"
              : "No products found"}
          </h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            {stockFilter !== "all" || selectedCategory !== "All" || searchTerm
              ? "Try resetting your stock status, category, or search filters."
              : "Create your first catalog item or reset filters."}
          </p>
          {(stockFilter !== "all" || selectedCategory !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setStockFilter("all");
                setSelectedCategory("All");
                setSearchTerm("");
              }}
              className="btn btn-secondary btn-sm mt-3"
            >
              Reset All Filters
            </button>
          )}
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
                  <th className="py-2.5 px-3.5">Selling Price</th>
                  <th className="py-2.5 px-3.5">Cost Price</th>
                  <th className="py-2.5 px-3.5">Stock</th>
                  <th className="py-2.5 px-3.5">Total Cost</th>
                  <th className="py-2.5 px-3.5">Total Value</th>
                  <th className="py-2.5 px-3.5">Expected Profit</th>
                  <th className="py-2.5 px-3.5">Specs</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Featured</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const rawImg = p.images && p.images[0] ? p.images[0] : "";
                  const img = getOptimizedImageUrl(rawImg, { width: 120 });
                  const stockNum = p.stock !== undefined ? Number(p.stock) : 0;
                  const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.indicativePrice);
                  const effectivePrice = getEffectivePrice(p);
                  const totalVal = effectivePrice * stockNum;
                  const totalCost = (Number(p.costPrice) || 0) * stockNum;
                  const profit = totalVal - totalCost;

                  return (
                    <tr key={p._id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt={p.name} loading="lazy" decoding="async" className="w-10 h-10 rounded-[var(--radius-xs)] object-cover bg-[var(--bg-app)]" />
                          ) : (
                            <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--bg-app)] flex items-center justify-center text-[var(--text-muted)]">
                              <Package size={16} />
                            </div>
                          )}
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
                        {!p.isAvailable || (p.stock !== undefined && Number(p.stock) <= 0) ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[var(--text-muted)] line-through text-[0.75rem]">
                              NRs. {Number(hasDiscount ? p.discountPrice : p.indicativePrice).toLocaleString()}
                            </span>
                            <span className="text-red-400 text-[0.65rem] font-bold uppercase tracking-wider">
                              Out of Stock
                            </span>
                          </div>
                        ) : hasDiscount ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">
                              NRs. {Number(p.discountPrice).toLocaleString()}
                            </span>
                            <span className="text-[0.65rem] text-[var(--text-muted)] line-through">
                              NRs. {Number(p.indicativePrice).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>NRs. {Number(p.indicativePrice).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[var(--text-muted)]">
                        NRs. {Number(p.costPrice || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <span className="badge badge-neutral">{stockNum} units</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <button
                              type="button"
                              onClick={() => handleStockChange(p._id, stockNum, -1)}
                              disabled={stockNum <= 0 || updatingStockId === p._id}
                              className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Decrease Stock (-1)"
                            >
                              <Minus size={11} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStockChange(p._id, stockNum, 1)}
                              disabled={updatingStockId === p._id}
                              className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-emerald-400 hover:border-emerald-400/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Increase Stock (+1)"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[var(--text-primary)]">
                        NRs. {totalCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-bold font-mono text-[var(--text-primary)]">
                        NRs. {totalVal.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-bold font-mono text-emerald-400">
                        +NRs. {profit.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-[0.725rem] text-[var(--text-muted)]">
                        {Array.isArray(p.specs)
                          ? p.specs[0]?.value || p.specs[0]?.label || "Standard"
                          : p.specs?.paperGsm || p.specs?.color || "Standard"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => {
            const rawImg = p.images && p.images[0] ? p.images[0] : "";
            const img = getOptimizedImageUrl(rawImg, { width: 400 });
            const stockNum = p.stock !== undefined ? Number(p.stock) : 0;
            const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.indicativePrice);
            const effectivePrice = getEffectivePrice(p);
            const totalVal = effectivePrice * stockNum;
            const totalCost = (Number(p.costPrice) || 0) * stockNum;
            const profit = totalVal - totalCost;

            return (
              <div key={p._id} className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]">
                <div className="h-40 relative bg-[var(--bg-sidebar)] flex items-center justify-center">
                  {img ? (
                    <img src={img} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <Package size={32} className="text-[var(--text-muted)] opacity-40" />
                  )}
                  <span className="badge badge-dark absolute top-2 left-2">{p.category}</span>
                  {p.featured && (
                    <span className="badge badge-white absolute top-2 right-2 flex items-center gap-1 text-[0.6rem]">
                      <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
                      <span>Featured</span>
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge badge-emerald bg-emerald-500/90 text-white absolute bottom-2 left-2 text-[0.6rem] font-bold">
                      SALE
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold m-0">{p.name}</h4>
                    <div className="flex flex-col items-end">
                      {!p.isAvailable || (p.stock !== undefined && Number(p.stock) <= 0) ? (
                        <>
                          <span className="text-[var(--text-muted)] line-through font-mono text-xs">
                            NRs. {Number(hasDiscount ? p.discountPrice : p.indicativePrice).toLocaleString()}
                          </span>
                          <span className="text-red-400 text-[0.65rem] font-bold uppercase tracking-wider">
                            Out of Stock
                          </span>
                        </>
                      ) : hasDiscount ? (
                        <>
                          <span className="font-bold font-mono text-sm text-emerald-400">
                            NRs. {Number(p.discountPrice).toLocaleString()}
                          </span>
                          <span className="text-[0.65rem] text-[var(--text-muted)] line-through font-mono">
                            NRs. {Number(p.indicativePrice).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold font-mono text-sm">
                          NRs. {Number(p.indicativePrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[0.72rem] text-[var(--text-muted)] font-mono">
                    <span>Cost: NRs. {Number(p.costPrice || 0).toLocaleString()}</span>
                    <div className="flex flex-col items-end gap-0.5">
                      <span>Stock: {stockNum} units</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStockChange(p._id, stockNum, -1)}
                          disabled={stockNum <= 0 || updatingStockId === p._id}
                          className="w-4.5 h-4.5 rounded flex items-center justify-center bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          title="Decrease Stock (-1)"
                        >
                          <Minus size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStockChange(p._id, stockNum, 1)}
                          disabled={updatingStockId === p._id}
                          className="w-4.5 h-4.5 rounded flex items-center justify-center bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-emerald-400 disabled:opacity-30 cursor-pointer"
                          title="Increase Stock (+1)"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[0.72rem] font-mono">
                    <span className="text-[var(--text-muted)]">Cost Total:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      NRs. {totalCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.72rem] font-mono">
                    <span className="text-[var(--text-muted)]">Inventory Value:</span>
                    <span className="font-semibold text-[var(--text-primary)]">
                      NRs. {totalVal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[0.72rem] font-mono text-emerald-400">
                    <span>Expected Profit:</span>
                    <span className="font-bold">
                      +NRs. {profit.toLocaleString()}
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

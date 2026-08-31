import React, { useState } from "react";
import { Search, Plus, List, LayoutGrid, Star, Edit2, Trash2, Printer, Coins, TrendingUp, Clock, Layers } from "lucide-react";
import { CategoryDropdown } from "../common/CategoryDropdown";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function PrintingManagement({
  printingServices = [],
  printingCategories = [],
  onOpenCreateModal,
  onEditService,
  onDeleteService,
  onToggleAvailability,
  onToggleFeatured,
  onManageCategories,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("all"); // 'all' | 'available' | 'unavailable'
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [viewMode, setViewMode] = useState("table");

  // Derive all unique categories dynamically
  const allCategories = Array.from(
    new Set([
      ...(printingCategories || []).map((c) => (typeof c === "string" ? c : c.name)).filter(Boolean),
      ...printingServices.map((s) => s.category).filter(Boolean),
    ])
  );

  const getEffectivePrice = (s) => {
    if (s?.discountPrice && Number(s.discountPrice) > 0 && Number(s.discountPrice) < Number(s.indicativePrice)) {
      return Number(s.discountPrice);
    }
    return Number(s?.indicativePrice) || 0;
  };

  const totalServices = printingServices.length;
  const activeCount = printingServices.filter((s) => s.isAvailable).length;
  const inactiveCount = printingServices.filter((s) => !s.isAvailable).length;

  const totalValue = printingServices.reduce((acc, s) => acc + getEffectivePrice(s), 0);
  const totalCost = printingServices.reduce((acc, s) => acc + (Number(s?.costPrice) || 0), 0);
  const totalExpectedProfit = totalValue - totalCost;
  const profitMargin = totalValue > 0 ? ((totalExpectedProfit / totalValue) * 100).toFixed(1) : 0;

  const filtered = printingServices
    .filter((s) => {
      // Category filter
      if (selectedCategory !== "All" && s.category !== selectedCategory) return false;

      // Availability filter
      if (availabilityFilter === "available" && !s.isAvailable) return false;
      if (availabilityFilter === "unavailable" && s.isAvailable) return false;

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = s.name?.toLowerCase().includes(q);
        const matchDesc = s.description?.toLowerCase().includes(q) || s.shortDescription?.toLowerCase().includes(q);
        const matchCat = s.category?.toLowerCase().includes(q);
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
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Printing Services
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight">
              {totalServices} Services <span className="text-xs text-[var(--text-muted)] font-normal">({activeCount} live)</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Printer size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Catalog Selling Value
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalValue.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-[var(--border-subtle)]">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)]">
              Total Production Cost
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-[var(--text-primary)]">
              NRs. {totalCost.toLocaleString()}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)]">
            <Coins size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4 flex items-center justify-between border border-emerald-500/30 bg-emerald-500/5">
          <div>
            <div className="text-[0.7rem] uppercase font-bold text-emerald-400">
              Expected Margin ({profitMargin}%)
            </div>
            <div className="text-xl font-extrabold mt-0.5 tracking-tight font-mono text-emerald-400">
              +NRs. {totalExpectedProfit.toLocaleString()}
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
          <div className="relative w-48 sm:w-60">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search printing services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-8 text-xs py-2 px-2.5"
            />
          </div>

          {/* Minimal Category Dropdown */}
          <CategoryDropdown
            categories={allCategories.map((cat) => ({
              id: cat,
              name: cat,
              count: printingServices.filter((s) => s.category === cat).length,
            }))}
            selectedCategory={selectedCategory}
            onSelectCategory={(catName) => setSelectedCategory(catName)}
            totalCount={printingServices.length}
            label="Category"
            allLabel="All Categories"
            size="sm"
          />

          {/* Quick Status Filter Pills */}
          <div className="flex items-center gap-1 bg-[var(--bg-input)] p-0.5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setAvailabilityFilter("all")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer ${
                availabilityFilter === "all"
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityFilter("available")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer ${
                availabilityFilter === "available"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-[var(--text-muted)] hover:text-emerald-400"
              }`}
            >
              Available ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setAvailabilityFilter("unavailable")}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[var(--radius-xs)] transition-all cursor-pointer flex items-center gap-1.5 ${
                availabilityFilter === "unavailable"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 font-bold"
                  : "text-[var(--text-muted)] hover:text-red-400"
              }`}
            >
              <span>Unavailable</span>
              {inactiveCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[0.625rem] font-bold">
                  {inactiveCount}
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

          {onManageCategories && (
            <button
              onClick={onManageCategories}
              className="btn btn-secondary btn-sm gap-1.5"
              title="Manage printing categories"
            >
              <Layers size={13} />
              <span className="hidden sm:inline">Manage Categories</span>
              <span className="sm:hidden">Categories</span>
            </button>
          )}

          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={13} />
            <span>Add Printing Service</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)]">
          <Printer size={28} className="text-[var(--text-muted)] mb-2 mx-auto" />
          <h3 className="text-base font-bold">
            {availabilityFilter === "unavailable"
              ? "No unavailable printing services"
              : availabilityFilter === "available"
              ? "No available printing services"
              : "No printing services found"}
          </h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            {availabilityFilter !== "all" || selectedCategory !== "All" || searchTerm
              ? "Try resetting your category, availability, or search filters."
              : "Create your first printing service catalog item."}
          </p>
          {(availabilityFilter !== "all" || selectedCategory !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setAvailabilityFilter("all");
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
                  <th className="py-2.5 px-3.5">Service Name</th>
                  <th className="py-2.5 px-3.5">Category</th>
                  <th className="py-2.5 px-3.5">Selling Price</th>
                  <th className="py-2.5 px-3.5">Cost Price</th>
                  <th className="py-2.5 px-3.5">Expected Profit</th>
                  <th className="py-2.5 px-3.5">Unit / MOQ</th>
                  <th className="py-2.5 px-3.5">Turnaround</th>
                  <th className="py-2.5 px-3.5">Specs / Media</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5">Featured</th>
                  <th className="py-2.5 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const rawImg = s.images && s.images[0] ? s.images[0] : "";
                  const img = getOptimizedImageUrl(rawImg, { width: 120 });
                  const effectivePrice = getEffectivePrice(s);
                  const hasDiscount = s.discountPrice && Number(s.discountPrice) > 0 && Number(s.discountPrice) < Number(s.indicativePrice);
                  const cost = Number(s.costPrice || 0);
                  const profit = effectivePrice - cost;
                  const margin = effectivePrice > 0 ? ((profit / effectivePrice) * 100).toFixed(1) : 0;
                  const priceUnit = s.priceUnit || "per page";

                  return (
                    <tr key={s._id} className="border-b border-[var(--border-subtle)]">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img} alt={s.name} loading="lazy" decoding="async" className="w-10 h-10 rounded-[var(--radius-xs)] object-cover bg-[var(--bg-app)]" />
                          ) : (
                            <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--bg-app)] flex items-center justify-center text-[var(--text-muted)]">
                              <Printer size={16} />
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{s.name}</div>
                            <div className="text-[0.68rem] text-[var(--text-muted)] font-mono">/{s.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="badge badge-neutral">{s.category}</span>
                      </td>
                      <td className="py-3 px-3.5 font-bold font-mono">
                        {hasDiscount ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">
                              NRs. {Number(s.discountPrice).toLocaleString()}
                            </span>
                            <span className="text-[0.65rem] text-[var(--text-muted)] line-through">
                              NRs. {Number(s.indicativePrice).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>NRs. {Number(s.indicativePrice).toLocaleString()}</span>
                        )}
                        <span className="text-[0.65rem] text-[var(--text-muted)] font-sans block font-normal">
                          {priceUnit}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-[var(--text-secondary)]">
                        <div>NRs. {cost.toLocaleString()}</div>
                        <span className="text-[0.65rem] text-[var(--text-muted)] font-sans block font-normal">
                          {priceUnit}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-bold font-mono">
                        <span className={profit >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {profit >= 0 ? "+" : ""}NRs. {profit.toLocaleString()}
                        </span>
                        <span className="text-[0.65rem] text-[var(--text-muted)] font-mono block font-normal">
                          ({margin}% margin)
                        </span>
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="badge badge-neutral text-[0.68rem]">
                          {priceUnit} (Min: {s.minOrderQuantity || 1})
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-[0.75rem] font-mono text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-[var(--text-muted)]" />
                          <span>{s.turnaroundTime || "24-48 Hours"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 text-[0.725rem] text-[var(--text-muted)] max-w-[160px] truncate">
                        {s.specs?.paperGsm || s.specs?.printTechnology || s.paperOptions?.[0] || "Standard Print"}
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleAvailability(s._id)}
                          className={`badge cursor-pointer ${
                            s.isAvailable ? "badge-success" : "badge-neutral"
                          }`}
                          title={s.isAvailable ? "Available (Click to deactivate)" : "Unavailable (Click to activate)"}
                        >
                          {s.isAvailable ? "Available" : "Unavailable"}
                        </button>
                      </td>
                      <td className="py-3 px-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleFeatured(s._id)}
                          className={`btn-icon btn-ghost !w-7 !h-7 ${
                            s.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"
                          }`}
                          title={s.featured ? "Featured on Storefront (Click to unfeature)" : "Click to feature service"}
                        >
                          <Star
                            size={15}
                            fill={s.featured ? "#fbbf24" : "none"}
                            stroke={s.featured ? "#fbbf24" : "currentColor"}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => onEditService(s)} className="btn-icon btn-secondary !w-7.5 !h-7.5">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => onDeleteService(s)} className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]">
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
          {filtered.map((s) => {
            const rawImg = s.images && s.images[0] ? s.images[0] : "";
            const img = getOptimizedImageUrl(rawImg, { width: 500 });
            const effectivePrice = getEffectivePrice(s);
            const hasDiscount = s.discountPrice && Number(s.discountPrice) > 0 && Number(s.discountPrice) < Number(s.indicativePrice);
            const cost = Number(s.costPrice || 0);
            const profit = effectivePrice - cost;
            const margin = effectivePrice > 0 ? ((profit / effectivePrice) * 100).toFixed(1) : 0;
            const priceUnit = s.priceUnit || "per page";

            return (
              <div key={s._id} className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]">
                <div className="h-40 relative bg-[var(--bg-sidebar)] flex items-center justify-center">
                  {img ? (
                    <img src={img} alt={s.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <Printer size={32} className="text-[var(--text-muted)] opacity-40" />
                  )}
                  <span className="badge badge-dark absolute top-2 left-2">{s.category}</span>
                  {s.featured && (
                    <span className="badge badge-white absolute top-2 right-2 flex items-center gap-1 text-[0.6rem]">
                      <Star size={10} fill="#fbbf24" stroke="#fbbf24" />
                      <span>Featured</span>
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="badge badge-emerald bg-emerald-500/90 text-white absolute bottom-2 left-2 text-[0.6rem] font-bold">
                      SPECIAL PRICE
                    </span>
                  )}
                  <div className="absolute bottom-2 right-2 badge badge-dark backdrop-blur-sm text-[0.625rem] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    <Clock size={10} />
                    <span>{s.turnaroundTime || "24-48h"}</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold m-0 leading-tight">{s.name}</h4>
                    <div className="flex flex-col items-end shrink-0 ml-2">
                      {hasDiscount ? (
                        <>
                          <span className="font-bold font-mono text-sm text-emerald-400">
                            NRs. {Number(s.discountPrice).toLocaleString()}
                          </span>
                          <span className="text-[0.65rem] text-[var(--text-muted)] line-through font-mono">
                            NRs. {Number(s.indicativePrice).toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold font-mono text-sm">
                          NRs. {Number(s.indicativePrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[0.75rem] text-[var(--text-muted)] line-clamp-2 mt-1">
                    {s.shortDescription || s.description}
                  </p>

                  <div className="flex justify-between items-center text-[0.72rem] text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-subtle)] mt-auto">
                    <span>Cost: NRs. {cost.toLocaleString()}</span>
                    <span>{priceUnit}</span>
                  </div>

                  <div className="flex justify-between items-center text-[0.72rem] font-mono">
                    <span className="text-[var(--text-muted)]">Expected Profit:</span>
                    <span className={`font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {profit >= 0 ? "+" : ""}NRs. {profit.toLocaleString()} ({margin}%)
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-[var(--border-subtle)]">
                    <button
                      type="button"
                      onClick={() => onToggleAvailability(s._id)}
                      className={`badge cursor-pointer ${
                        s.isAvailable ? "badge-success" : "badge-neutral"
                      }`}
                      title={s.isAvailable ? "Available (Click to deactivate)" : "Unavailable (Click to activate)"}
                    >
                      {s.isAvailable ? "Available" : "Unavailable"}
                    </button>

                    <div className="flex gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(s._id)}
                        className={`btn-icon btn-ghost !w-7 !h-7 ${
                          s.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"
                        }`}
                        title={s.featured ? "Unfeature Service" : "Feature Service"}
                      >
                        <Star
                          size={14}
                          fill={s.featured ? "#fbbf24" : "none"}
                          stroke={s.featured ? "#fbbf24" : "currentColor"}
                        />
                      </button>
                      <button onClick={() => onEditService(s)} className="btn-icon btn-secondary !w-7 !h-7"><Edit2 size={12} /></button>
                      <button onClick={() => onDeleteService(s)} className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"><Trash2 size={12} /></button>
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

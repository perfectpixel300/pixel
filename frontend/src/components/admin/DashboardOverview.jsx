import React, { useState } from "react";
import {
  Package,
  Layers,
  Image as BannerIcon,
  Star,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  Sparkles,
  MessageSquare,
  Code,
  Zap,
  Coins,
  BarChart3,
  TrendingUp,
} from "lucide-react";

export function DashboardOverview({
  stats,
  products = [],
  categories = [],
  services = [],
  banners = [],
  inquiries = [],
  setActiveTab,
  onOpenProductModal,
  onOpenCategoryModal,
  onOpenBannerModal,
  onOpenServiceModal,
  onEditProduct,
  onDeleteProduct,
  onToggleProductAvailability,
  onToggleProductFeatured,
  onSeedData,
}) {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeServices = Array.isArray(services) ? services : [];
  const safeBanners = Array.isArray(banners) ? banners : [];
  const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  const [productMetric, setProductMetric] = useState("price"); // 'price' | 'stock' | 'value'
  const [categoryMetric, setCategoryMetric] = useState("count"); // 'count' | 'stock' | 'value'

  const activeBanners = safeBanners.filter((b) => b && b.isActive);
  const recentProducts = safeProducts.slice(0, 5);
  const activeServices = safeServices.filter((s) => s && s.isActive);
  const webDevServices = safeServices.filter((s) => s && s.isWebDevPackage);

  const totalInventoryValue = safeProducts.reduce(
    (acc, p) => acc + (Number(p?.indicativePrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalInventoryCost = safeProducts.reduce(
    (acc, p) => acc + (Number(p?.costPrice) || 0) * (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );
  const totalStockUnits = safeProducts.reduce(
    (acc, p) => acc + (p?.stock !== undefined ? Number(p.stock) : 0),
    0
  );

  // Processed products for sorted horizontal bar chart
  const processedProducts = safeProducts.map((p) => {
    const price = Number(p?.indicativePrice) || 0;
    const stock = p?.stock !== undefined ? Number(p.stock) : 0;
    const value = price * stock;
    return {
      id: p._id || p.slug || Math.random().toString(),
      name: p.name || "Untitled Product",
      slug: p.slug || "",
      category: p.category || "Uncategorized",
      price,
      stock,
      value,
      isAvailable: Boolean(p.isAvailable),
      featured: Boolean(p.featured),
    };
  });

  const sortedProducts = [...processedProducts].sort((a, b) => {
    const valA =
      productMetric === "price" ? a.price : productMetric === "stock" ? a.stock : a.value;
    const valB =
      productMetric === "price" ? b.price : productMetric === "stock" ? b.stock : b.value;
    return valB - valA;
  });

  const productMaxVal =
    sortedProducts.length > 0
      ? Math.max(
          ...sortedProducts.map((p) =>
            productMetric === "price" ? p.price : productMetric === "stock" ? p.stock : p.value
          ),
          1
        )
      : 1;

  // Processed categories for sorted horizontal bar chart
  const allCategoryNames = Array.from(
    new Set([
      ...safeCategories.map((c) => c?.name).filter(Boolean),
      ...safeProducts.map((p) => p?.category).filter(Boolean),
    ])
  );

  const processedCategories = allCategoryNames.map((catName) => {
    const catProducts = safeProducts.filter((p) => p && p.category === catName);
    const count = catProducts.length;
    const totalStock = catProducts.reduce(
      (sum, p) => sum + (p?.stock !== undefined ? Number(p.stock) || 0 : 0),
      0
    );
    const totalValue = catProducts.reduce(
      (sum, p) =>
        sum +
        (Number(p?.indicativePrice) || 0) *
          (p?.stock !== undefined ? Number(p.stock) || 0 : 0),
      0
    );
    const avgPrice =
      count > 0
        ? Math.round(
            catProducts.reduce(
              (sum, p) => sum + (Number(p?.indicativePrice) || 0),
              0
            ) / count
          )
        : 0;

    return {
      name: catName,
      count,
      totalStock,
      totalValue,
      avgPrice,
    };
  });

  const sortedCategories = [...processedCategories].sort((a, b) => {
    const valA =
      categoryMetric === "count"
        ? a.count
        : categoryMetric === "stock"
        ? a.totalStock
        : a.totalValue;
    const valB =
      categoryMetric === "count"
        ? b.count
        : categoryMetric === "stock"
        ? b.totalStock
        : b.totalValue;
    return valB - valA;
  });

  const categoryMaxVal =
    sortedCategories.length > 0
      ? Math.max(
          ...sortedCategories.map((c) =>
            categoryMetric === "count"
              ? c.count
              : categoryMetric === "stock"
              ? c.totalStock
              : c.totalValue
          ),
          1
        )
      : 1;

  return (
    <div className="flex flex-col gap-7">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {/* Metric 1: Products */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Products</span>
            <Package size={14} />
          </div>
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            {safeProducts.length}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            {safeProducts.filter((p) => p && p.isAvailable).length} available
          </div>
        </div>

        {/* Metric 2: Total Inventory Value */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Inventory Value</span>
            <Coins size={14} />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] font-mono">
            NRs. {totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            {totalStockUnits.toLocaleString()} units in stock
          </div>
        </div>

        {/* Metric 3: Total Inventory Cost Price (Aside Inventory Value) */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Inventory Cost</span>
            <Coins size={14} className="text-zinc-500" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] font-mono text-zinc-300">
            NRs. {totalInventoryCost.toLocaleString()}
          </div>
          <div className="text-[0.7rem] text-[var(--text-muted)]">
            Total cost price
          </div>
        </div>

        {/* Metric 3: Categories */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Categories</span>
            <Layers size={14} />
          </div>
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            {safeCategories.length}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            Product disciplines
          </div>
        </div>

        {/* Metric 4: Web Dev Plans */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Web Dev Plans</span>
            <Zap size={14} />
          </div>
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            {webDevServices.length}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            3 Flagship tiers
          </div>
        </div>

        {/* Metric 5: IT Capabilities */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>IT Capabilities</span>
            <Code size={14} />
          </div>
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            {safeServices.filter((s) => s && !s.isWebDevPackage).length}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            Non-web disciplines
          </div>
        </div>

        {/* Metric 6: Inquiries */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-4.5 flex flex-col gap-1.5 border border-[var(--border-subtle)]">
          <div className="flex justify-between text-[var(--text-muted)] text-[0.7rem] uppercase font-bold">
            <span>Inquiries</span>
            <MessageSquare size={14} />
          </div>
          <div className="text-2xl font-extrabold tracking-[-0.03em]">
            {safeInquiries.length}
          </div>
          <div className="text-[0.7rem] text-[var(--text-secondary)]">
            {safeInquiries.filter((i) => i && i.status === "unread").length} unread
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)] rounded-[var(--radius-md)] flex-wrap border border-[var(--border-subtle)]">
        <span className="text-[0.725rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)] mr-1">
          Quick Actions:
        </span>
        <button onClick={() => setActiveTab("web-tiers")} className="btn btn-primary btn-sm gap-1.5 text-xs">
          <Zap size={12} fill="currentColor" />
          <span>Web Dev Tiers (3 Plans)</span>
        </button>
        <button onClick={() => setActiveTab("services")} className="btn btn-secondary btn-sm gap-1.5 text-xs">
          <Code size={12} />
          <span>IT Capabilities</span>
        </button>
        <button onClick={onOpenProductModal} className="btn btn-secondary btn-sm gap-1.5 text-xs">
          <Plus size={12} />
          <span>Add Product</span>
        </button>
        <button onClick={onOpenCategoryModal} className="btn btn-secondary btn-sm gap-1.5 text-xs">
          <Layers size={12} />
          <span>Add Category</span>
        </button>
        <button onClick={onOpenBannerModal} className="btn btn-secondary btn-sm gap-1.5 text-xs">
          <BannerIcon size={12} />
          <span>Create Banner</span>
        </button>
        <button onClick={() => setActiveTab("inquiries")} className="btn btn-secondary btn-sm gap-1.5 text-xs">
          <MessageSquare size={12} />
          <span>Inquiries</span>
        </button>
        <button onClick={onSeedData} className="btn btn-ghost btn-sm ml-auto gap-1 text-xs">
          <Sparkles size={12} />
          <span>Reset Samples (NRs.)</span>
        </button>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
        {/* Active Banners Strip */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-5 flex flex-col gap-4 border border-[var(--border-subtle)]">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-[0.95rem] font-bold m-0">Active Storefront Banners</h3>
              <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5 mb-0">
                Current hero slides on the homepage
              </p>
            </div>
            <button
              onClick={() => setActiveTab("banners")}
              className="btn btn-ghost btn-sm text-xs gap-1"
            >
              <span>Manage</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {activeBanners.slice(0, 3).map((banner) => (
              <div
                key={banner._id}
                className="h-28 rounded-[var(--radius-sm)] overflow-hidden bg-cover bg-center relative border border-[var(--border-subtle)]"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                <div
                  className="absolute inset-0 p-2.5 flex flex-col justify-between"
                  style={{ backgroundColor: `rgba(0,0,0,${(banner.overlayDarkness || 50) / 100})` }}
                >
                  <span className="badge badge-white text-[0.6rem] px-1 py-px self-start">
                    #{banner.order || 1}
                  </span>
                  <div>
                    <div className="text-white text-[0.8rem] font-bold leading-tight">
                      {banner.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-5 flex flex-col gap-4 border border-[var(--border-subtle)]">
          <div className="flex justify-between items-center">
            <h3 className="text-[0.95rem] font-bold m-0">Category Ratio</h3>
            <button onClick={() => setActiveTab("categories")} className="btn btn-ghost btn-sm text-[0.725rem] gap-0.5">
              <span>{safeCategories.length} Total</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {safeCategories.slice(0, 4).map((cat) => {
              const count = safeProducts.filter((p) => p && p.category === cat.name).length;
              const percent = Math.round((count / (safeProducts.length || 1)) * 100);
              return (
                <div key={cat._id || cat.name} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span>{cat.name}</span>
                    <span className="text-[var(--text-muted)]">{count} items ({percent}%)</span>
                  </div>
                  <div className="h-1 bg-[var(--bg-input)] rounded-full">
                    <div className="h-full bg-white rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Web Development Tiers Overview Widget */}
      {webDevServices.length > 0 && (
        <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-5 border border-[var(--border-subtle)]">
          <div className="flex justify-between items-center mb-3.5">
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <h3 className="text-[0.95rem] font-bold m-0">Web Development Tiers (NRs.)</h3>
            </div>
            <button onClick={() => setActiveTab("web-tiers")} className="btn btn-ghost btn-sm text-xs gap-1">
              <span>Open Web Plans Studio</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {webDevServices.map((tier) => (
              <div
                key={tier._id}
                className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="badge badge-neutral text-[0.6rem]">
                      {tier.tierBadge || tier.packageTier?.toUpperCase() || "TIER"}
                    </span>
                    <span className="text-[0.675rem] text-[var(--text-muted)] font-mono">
                      {tier.deliveryTime}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-[var(--text-primary)]">{tier.title}</div>
                  <div className="font-mono text-sm font-extrabold text-[var(--text-primary)] mt-1.5">
                    NRs. {Number(tier.price).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products Table */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-5 border border-[var(--border-subtle)]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-[0.95rem] font-bold m-0">Recent Catalog Additions</h3>
            <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5 mb-0">
              Quick inline status controls (Prices in NRs.)
            </p>
          </div>
          <button onClick={() => setActiveTab("products")} className="btn btn-secondary btn-sm gap-1">
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[0.825rem]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[0.7rem] uppercase">
                <th className="py-2 px-2.5">Item</th>
                <th className="py-2 px-2.5">Category</th>
                <th className="py-2 px-2.5">Price</th>
                <th className="py-2 px-2.5">Stock Status</th>
                <th className="py-2 px-2.5">Featured</th>
                <th className="py-2 px-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((p) => (
                <tr key={p._id} className="border-b border-[var(--border-subtle)]">
                  <td className="p-2.5">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-[0.68rem] text-[var(--text-muted)] font-mono">/{p.slug}</div>
                  </td>
                  <td className="p-2.5">
                    <span className="badge badge-neutral">{p.category}</span>
                  </td>
                  <td className="p-2.5 font-bold font-mono">
                    NRs. {Number(p.indicativePrice).toLocaleString()}
                  </td>
                  <td className="p-2.5">
                    <button
                      type="button"
                      onClick={() => onToggleProductAvailability(p._id)}
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
                  <td className="p-2.5">
                    <button
                      type="button"
                      onClick={() => onToggleProductFeatured(p._id)}
                      className={`btn-icon btn-ghost !w-6.5 !h-6.5 ${
                        p.featured ? "text-amber-400" : "text-[var(--text-muted)] hover:text-amber-400"
                      }`}
                      title={p.featured ? "Featured Product (Click to unfeature)" : "Click to feature product"}
                    >
                      <Star
                        size={14}
                        fill={p.featured ? "#fbbf24" : "none"}
                        stroke={p.featured ? "#fbbf24" : "currentColor"}
                      />
                    </button>
                  </td>
                  <td className="p-2.5 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => onEditProduct(p)} className="btn-icon btn-secondary !w-7.5 !h-7.5">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => onDeleteProduct(p)} className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]">
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

      {/* Visual Analytics Graphs Section (Shadcn UI Minimal Vertical Bar Charts - Pure Divs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Graph 1: All Products Vertical Bar Chart */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            {/* Shadcn Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-[var(--text-primary)]" />
                  <h3 className="text-sm font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                    Products Overview
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Catalog metrics across all {safeProducts.length} items
                </p>
              </div>

              {/* Shadcn Segmented Filter Tabs */}
              <div className="inline-flex items-center rounded-lg bg-[var(--bg-input)] p-1 text-xs border border-[var(--border-subtle)] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setProductMetric("price")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    productMetric === "price"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Price
                </button>
                <button
                  type="button"
                  onClick={() => setProductMetric("stock")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    productMetric === "stock"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Stock
                </button>
                <button
                  type="button"
                  onClick={() => setProductMetric("value")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    productMetric === "value"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Value
                </button>
              </div>
            </div>

            {/* Shadcn Vertical Chart Area */}
            {sortedProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--text-muted)] rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--bg-app)]">
                No products found in catalog.
              </div>
            ) : (
              <div className="relative h-56 sm:h-64 flex flex-col justify-end pt-6 pb-2 w-full">
                {/* Horizontal Dashed Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pb-7 pt-2">
                  <div className="w-full border-b border-dashed border-[var(--border-medium)]" />
                  <div className="w-full border-b border-dashed border-[var(--border-subtle)]" />
                  <div className="w-full border-b border-dashed border-[var(--border-subtle)]" />
                  <div className="w-full border-b border-[var(--border-medium)]" />
                </div>

                {/* Vertical Columns Container */}
                <div className="relative z-10 flex items-end justify-between gap-2 sm:gap-3 h-full overflow-x-auto pb-1 scrollbar-none px-1">
                  {sortedProducts.map((p, idx) => {
                    const val =
                      productMetric === "price"
                        ? p.price
                        : productMetric === "stock"
                        ? p.stock
                        : p.value;

                    const heightPct =
                      productMaxVal > 0
                        ? Math.max(Math.round((val / productMaxVal) * 100), val > 0 ? 4 : 0)
                        : 0;

                    return (
                      <div
                        key={p.id || idx}
                        className="group relative flex flex-col items-center justify-end h-full flex-1 min-w-[36px] max-w-[56px] cursor-pointer"
                      >
                        {/* Shadcn Floating Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col gap-1.5 rounded-lg border border-[var(--border-medium)] bg-[var(--bg-elevated)] p-2.5 shadow-xl text-xs whitespace-nowrap z-30 pointer-events-none transition-all">
                          <div className="font-semibold text-[var(--text-primary)] text-xs">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px]">
                            <div className="h-2 w-2 rounded-full bg-[var(--text-primary)]" />
                            <span>
                              {productMetric === "price"
                                ? "Price"
                                : productMetric === "stock"
                                ? "Stock"
                                : "Total Value"}
                              :
                            </span>
                            <span className="font-mono font-bold text-[var(--text-primary)]">
                              {productMetric === "price" || productMetric === "value"
                                ? "NRs. "
                                : ""}
                              {val.toLocaleString()}
                              {productMetric === "stock" ? " units" : ""}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] flex justify-between border-t border-[var(--border-subtle)] pt-1 mt-0.5">
                            <span>{p.category}</span>
                            <span className={p.isAvailable ? "text-emerald-400 font-medium" : "text-zinc-500"}>
                              {p.isAvailable ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        {/* The Vertical Bar Column */}
                        <div className="w-full flex items-end justify-center h-full pb-1">
                          <div
                            className="w-full bg-[var(--text-primary)] group-hover:bg-[var(--text-primary)]/80 rounded-t-[4px] transition-all duration-300 ease-out"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>

                        {/* X-Axis Item Label */}
                        <span
                          className="text-[10px] sm:text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] truncate max-w-[40px] sm:max-w-[52px] text-center mt-1 font-medium transition-colors"
                          title={p.name}
                        >
                          {p.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shadcn Card Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] flex-wrap gap-2">
            <div className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>Valuation: <strong className="font-mono text-[var(--text-primary)]">NRs. {totalInventoryValue.toLocaleString()}</strong></span>
            </div>
            <div className="font-mono text-zinc-400">
              Total Cost: <strong className="font-mono text-zinc-300">NRs. {totalInventoryCost.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Graph 2: Category Vertical Bar Chart */}
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)] p-5 sm:p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            {/* Shadcn Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[var(--text-primary)]" />
                  <h3 className="text-sm font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                    Category Breakdown
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Distribution across all {sortedCategories.length} categories
                </p>
              </div>

              {/* Shadcn Segmented Filter Tabs */}
              <div className="inline-flex items-center rounded-lg bg-[var(--bg-input)] p-1 text-xs border border-[var(--border-subtle)] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCategoryMetric("count")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    categoryMetric === "count"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Items
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryMetric("stock")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    categoryMetric === "stock"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Stock
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryMetric("value")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    categoryMetric === "value"
                      ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-xs"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Value
                </button>
              </div>
            </div>

            {/* Shadcn Vertical Chart Area */}
            {sortedCategories.length === 0 ? (
              <div className="py-12 text-center text-xs text-[var(--text-muted)] rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--bg-app)]">
                No categories available to graph.
              </div>
            ) : (
              <div className="relative h-56 sm:h-64 flex flex-col justify-end pt-6 pb-2 w-full">
                {/* Horizontal Dashed Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30 pb-7 pt-2">
                  <div className="w-full border-b border-dashed border-[var(--border-medium)]" />
                  <div className="w-full border-b border-dashed border-[var(--border-subtle)]" />
                  <div className="w-full border-b border-dashed border-[var(--border-subtle)]" />
                  <div className="w-full border-b border-[var(--border-medium)]" />
                </div>

                {/* Vertical Columns Container */}
                <div className="relative z-10 flex items-end justify-between gap-3 sm:gap-4 h-full overflow-x-auto pb-1 scrollbar-none px-1">
                  {sortedCategories.map((cat, idx) => {
                    const val =
                      categoryMetric === "count"
                        ? cat.count
                        : categoryMetric === "stock"
                        ? cat.totalStock
                        : cat.totalValue;

                    const heightPct =
                      categoryMaxVal > 0
                        ? Math.max(Math.round((val / categoryMaxVal) * 100), val > 0 ? 5 : 0)
                        : 0;

                    return (
                      <div
                        key={cat.name || idx}
                        className="group relative flex flex-col items-center justify-end h-full flex-1 min-w-[48px] max-w-[72px] cursor-pointer"
                      >
                        {/* Shadcn Floating Tooltip on Hover */}
                        <div className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col gap-1.5 rounded-lg border border-[var(--border-medium)] bg-[var(--bg-elevated)] p-2.5 shadow-xl text-xs whitespace-nowrap z-30 pointer-events-none transition-all">
                          <div className="font-semibold text-[var(--text-primary)] text-xs">
                            {cat.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px]">
                            <div className="h-2 w-2 rounded-full bg-[var(--text-primary)]" />
                            <span>
                              {categoryMetric === "count"
                                ? "Items Count"
                                : categoryMetric === "stock"
                                ? "Stock Units"
                                : "Inventory Value"}
                              :
                            </span>
                            <span className="font-mono font-bold text-[var(--text-primary)]">
                              {categoryMetric === "value" ? "NRs. " : ""}
                              {val.toLocaleString()}
                              {categoryMetric === "stock"
                                ? " units"
                                : categoryMetric === "count"
                                ? " items"
                                : ""}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] flex justify-between border-t border-[var(--border-subtle)] pt-1 mt-0.5 font-mono">
                            <span>{cat.count} total items</span>
                            <span>NRs. {cat.totalValue.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* The Vertical Bar Column */}
                        <div className="w-full flex items-end justify-center h-full pb-1">
                          <div
                            className="w-full bg-[var(--text-primary)] group-hover:bg-[var(--text-primary)]/80 rounded-t-[4px] transition-all duration-300 ease-out"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>

                        {/* X-Axis Item Label */}
                        <span
                          className="text-[10px] sm:text-[11px] text-[var(--text-muted)] group-hover:text-[var(--text-primary)] truncate max-w-[50px] sm:max-w-[68px] text-center mt-1 font-medium transition-colors"
                          title={cat.name}
                        >
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shadcn Card Footer */}
          <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5 font-medium text-[var(--text-primary)]">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>Total Units</span>
            </div>
            <span className="font-mono text-[var(--text-primary)] font-semibold">
              {totalStockUnits.toLocaleString()} units
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

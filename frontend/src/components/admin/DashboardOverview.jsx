import React from "react";
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

  const activeBanners = safeBanners.filter((b) => b && b.isActive);
  const recentProducts = safeProducts.slice(0, 5);
  const activeServices = safeServices.filter((s) => s && s.isActive);
  const webDevServices = safeServices.filter((s) => s && s.isWebDevPackage);

  const totalInventoryValue = safeProducts.reduce(
    (acc, p) => acc + (p?.indicativePrice || 0) * (p?.stock || 1),
    0
  );

  return (
    <div className="flex flex-col gap-7">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
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
            {safeProducts.filter((p) => p && p.isAvailable).length} in stock
          </div>
        </div>

        {/* Metric 2: Categories */}
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

        {/* Metric 3: Web Dev Plans */}
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

        {/* Metric 4: IT Capabilities */}
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

        {/* Metric 5: Inquiries */}
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
                      onClick={() => onToggleProductAvailability(p._id)}
                      className={`badge cursor-pointer ${p.isAvailable ? "badge-success" : "badge-neutral"}`}
                    >
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="p-2.5">
                    <button
                      onClick={() => onToggleProductFeatured(p._id)}
                      className={`btn-icon btn-ghost !w-6.5 !h-6.5 ${p.featured ? "text-[var(--color-warning)]" : "text-[var(--text-muted)]"}`}
                    >
                      <Star size={14} fill={p.featured ? "currentColor" : "none"} />
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
    </div>
  );
}

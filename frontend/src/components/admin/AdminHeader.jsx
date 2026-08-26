import React from "react";
import { Plus, PackagePlus, ImagePlus, Layers, Sun, Moon, Store, Code, Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminHeader({
  activeTab,
  onOpenProductModal,
  onOpenCategoryModal,
  onOpenServiceCategoryModal,
  onOpenBannerModal,
  onOpenServiceModal,
  onOpenWebTierModal,
  onExitToStore,
  theme,
  toggleTheme,
}) {
  const { user } = useAuth();

  const getTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "shop-status":
        return "Store Availability, Operating Hours & Countdown Timer";
      case "web-tiers":
        return "Web Development Subscription Plans (3 Tiers)";
      case "services":
        return "IT Capabilities & Services Catalog (NRs.)";
      case "service-categories":
        return "Service Categories & Disciplines";
      case "products":
        return "Products & Inventory (NRs.)";
      case "categories":
        return "Product Categories & Disciplines";
      case "banners":
        return "Home Page Hero Banners";
      case "inquiries":
        return "Client Inquiries & Correspondence";
      default:
        return "Studio Management";
    }
  };

  return (
    <header className="h-16 bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-subtle)] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)] text-[0.75rem] uppercase tracking-[0.06em]">
          Admin
        </span>
        <span className="text-[var(--border-bright)] text-[0.75rem]">/</span>
        <h1 className="text-base font-bold text-[var(--text-primary)] m-0">
          {getTitle()}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleTheme}
          className="btn-icon btn-ghost"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Monochrome`}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={onExitToStore}
          className="btn btn-secondary btn-sm gap-1.5"
        >
          <Store size={14} />
          <span>Public Store</span>
        </button>

        {activeTab === "web-tiers" ? (
          <button
            onClick={() => {
              if (onOpenWebTierModal) onOpenWebTierModal();
              else if (onOpenServiceModal) onOpenServiceModal({ isWebDevPackage: true, category: "Web Development" });
            }}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Zap size={14} fill="currentColor" />
            <span>Add Web Plan</span>
          </button>
        ) : activeTab === "services" ? (
          <button
            onClick={() => {
              if (onOpenServiceModal) onOpenServiceModal({ isWebDevPackage: false });
            }}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Code size={14} />
            <span>Add IT Service</span>
          </button>
        ) : activeTab === "service-categories" ? (
          <button onClick={onOpenServiceCategoryModal} className="btn btn-primary btn-sm gap-1.5">
            <Layers size={14} />
            <span>Add Service Category</span>
          </button>
        ) : activeTab === "categories" ? (
          <button onClick={onOpenCategoryModal} className="btn btn-primary btn-sm gap-1.5">
            <Layers size={14} />
            <span>Add Category</span>
          </button>
        ) : activeTab === "banners" ? (
          <button onClick={onOpenBannerModal} className="btn btn-primary btn-sm gap-1.5">
            <ImagePlus size={14} />
            <span>Create Banner</span>
          </button>
        ) : activeTab === "shop-status" ? null : (
          <button onClick={onOpenProductModal} className="btn btn-primary btn-sm gap-1.5">
            <PackagePlus size={14} />
            <span>Add Product</span>
          </button>
        )}
      </div>
    </header>
  );
}

import React from "react";
import { Plus, PackagePlus, ImagePlus, Layers, Sun, Moon, Store, Code, Zap, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminHeader({
  activeTab,
  onOpenProductModal,
  onOpenPrintingModal,
  onOpenPrintingCategoryModal,
  onOpenCategoryModal,
  onOpenServiceCategoryModal,
  onOpenBannerModal,
  onOpenServiceModal,
  onOpenWebTierModal,
  onExitToStore,
  onToggleMobileSidebar,
  theme,
  toggleTheme,
}) {
  const { user } = useAuth();

  const getTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Dashboard Overview";
      case "shop-status":
        return "Store Availability & Operating Hours";
      case "printing":
        return "Printing Services & Custom Production (NRs.)";
      case "printing-categories":
        return "Printing Categories & Disciplines";
      case "web-tiers":
        return "Web Development Subscription Plans";
      case "services":
        return "IT Capabilities & Services (NRs.)";
      case "service-categories":
        return "Service Categories & Groups";
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

  const getMobileTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Overview";
      case "shop-status":
        return "Store Status";
      case "printing":
        return "Printing";
      case "printing-categories":
        return "Print Categories";
      case "web-tiers":
        return "Web Plans";
      case "services":
        return "IT Services";
      case "service-categories":
        return "Service Categories";
      case "products":
        return "Products";
      case "categories":
        return "Categories";
      case "banners":
        return "Banners";
      case "inquiries":
        return "Inquiries";
      default:
        return "Admin";
    }
  };

  return (
    <header className="h-16 bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-subtle)] flex items-center justify-between px-3 sm:px-6 md:px-8 sticky top-0 z-10 transition-colors duration-200">
      {/* Title & Mobile Menu Button */}
      <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="btn-icon btn-ghost md:hidden shrink-0 !w-8 !h-8 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            title="Open Menu"
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>
        )}

        <span className="text-[var(--text-muted)] text-[0.7rem] uppercase tracking-[0.06em] hidden sm:inline shrink-0 font-bold">
          Admin
        </span>
        <span className="text-[var(--border-medium)] text-[0.7rem] hidden sm:inline shrink-0">/</span>
        <h1 className="text-xs sm:text-base font-bold text-[var(--text-primary)] m-0 truncate leading-tight">
          <span className="hidden sm:inline">{getTitle()}</span>
          <span className="sm:hidden">{getMobileTitle()}</span>
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          onClick={toggleTheme}
          className="btn-icon btn-ghost !w-8 !h-8 sm:!w-9 sm:!h-9 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Monochrome`}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          onClick={onExitToStore}
          className="btn btn-secondary btn-sm gap-1.5 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-all"
          title="View Public Store"
        >
          <Store size={14} />
          <span className="hidden sm:inline">Public Store</span>
        </button>

        {activeTab === "printing" ? (
          <button onClick={onOpenPrintingModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <Plus size={14} />
            <span className="hidden sm:inline">Add Printing Service</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "printing-categories" ? (
          <button onClick={onOpenPrintingCategoryModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <Layers size={14} />
            <span className="hidden sm:inline">Add Printing Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "web-tiers" ? (
          <button
            onClick={() => {
              if (onOpenWebTierModal) onOpenWebTierModal();
              else if (onOpenServiceModal) onOpenServiceModal({ isWebDevPackage: true, category: "Web Development" });
            }}
            className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs"
          >
            <Zap size={14} fill="currentColor" />
            <span className="hidden sm:inline">Add Web Plan</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "services" ? (
          <button
            onClick={() => {
              if (onOpenServiceModal) onOpenServiceModal({ isWebDevPackage: false });
            }}
            className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs"
          >
            <Code size={14} />
            <span className="hidden sm:inline">Add IT Service</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "service-categories" ? (
          <button onClick={onOpenServiceCategoryModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <Layers size={14} />
            <span className="hidden sm:inline">Add Service Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "categories" ? (
          <button onClick={onOpenCategoryModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <Layers size={14} />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : activeTab === "banners" ? (
          <button onClick={onOpenBannerModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <ImagePlus size={14} />
            <span className="hidden sm:inline">Create Banner</span>
            <span className="sm:hidden">Banner</span>
          </button>
        ) : activeTab === "shop-status" ? null : (
          <button onClick={onOpenProductModal} className="btn btn-primary btn-sm gap-1 !px-2.5 sm:!px-3.5 !h-8 sm:!h-9 shadow-xs">
            <PackagePlus size={14} />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>
    </header>
  );
}

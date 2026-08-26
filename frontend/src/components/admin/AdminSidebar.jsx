import {
  LayoutDashboard,
  Package,
  Layers,
  Image as BannerIcon,
  MessageSquare,
  Store,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  Code,
  Zap,
  Clock,
  Sliders,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AdminSidebar({
  activeTab,
  setActiveTab,
  stats,
  categoriesCount,
  webTiersCount,
  servicesCount,
  serviceCategoriesCount = 0,
  inquiriesCount,
  shopStatus = { isOpen: true },
  isCollapsed,
  setIsCollapsed,
  isLiveBackend,
  onSeedData,
  onExitToStore,
}) {
  const { logout } = useAuth();

  const navItems = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={17} />,
    },
    {
      id: "shop-status",
      label: "Store Status & Timer",
      icon: <Clock size={17} />,
      badge: shopStatus?.isOpen ? "Open" : "Closed",
      badgeColor: shopStatus?.isOpen ? "success" : "danger",
    },
    {
      id: "web-tiers",
      label: "Web Dev Plans",
      icon: <Zap size={17} />,
      badge: webTiersCount !== undefined ? webTiersCount : 3,
      badgeColor: "success",
    },
    {
      id: "services",
      label: "IT Capabilities",
      icon: <Code size={17} />,
      badge: servicesCount || 0,
      badgeColor: "neutral",
    },
    {
      id: "service-categories",
      label: "Service Categories",
      icon: <Sliders size={17} />,
      badge: serviceCategoriesCount || 0,
      badgeColor: "neutral",
    },
    {
      id: "products",
      label: "Products",
      icon: <Package size={17} />,
      badge: stats?.products?.total || 0,
    },
    {
      id: "categories",
      label: "Product Categories",
      icon: <Layers size={17} />,
      badge: categoriesCount || 0,
    },
    {
      id: "banners",
      label: "Home Banners",
      icon: <BannerIcon size={17} />,
      badge: stats?.banners?.active ? `${stats.banners.active} live` : 0,
      badgeColor: "success",
    },
    {
      id: "inquiries",
      label: "Inquiries",
      icon: <MessageSquare size={17} />,
      badge: inquiriesCount || 0,
      badgeColor: "neutral",
    },
  ];

  return (
    <aside
      className={`bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col transition-[width] duration-200 shrink-0 z-20 relative ${
        isCollapsed ? "w-[72px]" : "w-[250px]"
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-[var(--border-subtle)] ${
          isCollapsed ? "px-4 justify-center" : "px-5 justify-between"
        }`}
      >
        <div
          onClick={() => setActiveTab("overview")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="w-7.5 h-7.5 rounded-[var(--radius-xs)] bg-white text-black flex items-center justify-center font-extrabold text-sm">
            P
          </div>
          {!isCollapsed && (
            <div>
              <div className="font-extrabold text-[0.85rem] tracking-[0.06em] uppercase">
                PIXEL PERFECT
              </div>
              <div className="text-[0.65rem] text-[var(--text-muted)] tracking-[0.05em] uppercase">
                Studio Admin
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`btn-icon btn-ghost !w-6.5 !h-6.5 ${isCollapsed ? "hidden" : "inline-flex"}`}
        >
          <ChevronLeft size={15} />
        </button>
      </div>

      {/* Navigation List */}
      <div className="p-2.5 flex-1 flex flex-col gap-1">
        {!isCollapsed && (
          <div className="text-[0.68rem] font-bold uppercase text-[var(--text-muted)] tracking-[0.08em] px-2.5 pb-2">
            Studio Management
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] border-0 cursor-pointer transition-all text-[0.825rem] text-left ${
                isCollapsed ? "py-2.5 justify-center" : "py-2.5 px-3 justify-start"
              } ${
                isActive
                  ? "bg-white text-black font-bold"
                  : "bg-transparent text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-elevated)] hover:text-white hover:bg-black"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center">{item.icon}</div>

              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge !== 0 && (
                    <span
                      className={`badge ${isActive ? "badge-dark" : "badge-neutral"} text-[0.65rem] px-1.5 py-0.5`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Storefront actions */}
        <div className="mt-auto flex flex-col gap-1.5">
          <button
            onClick={onExitToStore}
            className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] text-[var(--text-primary)] cursor-pointer text-[0.78rem] font-semibold hover:bg-[var(--bg-elevated)] transition-colors ${
              isCollapsed ? "py-2.5 justify-center" : "py-2.5 px-3 justify-start"
            }`}
            title="Public Storefront"
          >
            <Store size={15} />
            {!isCollapsed && <span>View Public Store</span>}
          </button>

          <button
            onClick={onSeedData}
            className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-transparent text-[var(--text-muted)] cursor-pointer text-[0.75rem] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors ${
              isCollapsed ? "py-2 justify-center" : "py-2 px-3 justify-start"
            }`}
            title="Reset / Seed Curated Data"
          >
            <Sparkles size={14} />
            {!isCollapsed && <span>Reset Sample Data (NRs.)</span>}
          </button>

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-transparent text-[var(--color-danger)] cursor-pointer text-[0.78rem] font-semibold hover:bg-[var(--color-danger-bg)] transition-colors ${
              isCollapsed ? "py-2 justify-center" : "py-2 px-3 justify-start"
            }`}
            title="Logout"
          >
            <LogOut size={15} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Backend indicator */}
      <div
        className={`border-t border-[var(--border-subtle)] flex items-center gap-2 bg-[var(--bg-app)] ${
          isCollapsed ? "p-2.5 justify-center" : "py-3 px-4 justify-start"
        }`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isLiveBackend ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"
          }`}
        />
        {!isCollapsed && (
          <div className="text-[0.68rem] text-[var(--text-muted)]">
            {isLiveBackend ? "Database: Connected" : "Local Sandbox Mode"}
          </div>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="btn-icon btn-ghost absolute top-4.5 -right-3 !w-5.5 !h-5.5 rounded-full bg-[var(--bg-elevated)] z-30"
        >
          <ChevronRight size={13} />
        </button>
      )}
    </aside>
  );
}

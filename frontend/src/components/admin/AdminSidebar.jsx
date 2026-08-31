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
  Printer,
  X,
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
  printingServicesCount = 0,
  printingCategoriesCount = 0,
  promoBannersCount = 0,
  inquiriesCount,
  shopStatus = { isOpen: true },
  isCollapsed,
  setIsCollapsed,
  isLiveBackend,
  onExitToStore,
  mobileSidebarOpen = false,
  setMobileSidebarOpen,
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
      badge: shopStatus?.status === "partial" ? "Partial" : shopStatus?.isOpen ? "Open" : "Closed",
      badgeColor: shopStatus?.status === "partial" ? "info" : shopStatus?.isOpen ? "success" : "danger",
    },
    {
      id: "printing",
      label: "Printing Services",
      icon: <Printer size={17} />,
      badge: printingServicesCount || 0,
      badgeColor: "success",
    },
    {
      id: "printing-categories",
      label: "Printing Categories",
      icon: <Sliders size={17} />,
      badge: printingCategoriesCount || 0,
      badgeColor: "neutral",
    },
    {
      id: "web-tiers",
      label: "Web Dev Plans",
      icon: <Zap size={17} />,
      badge: webTiersCount !== undefined ? webTiersCount : 0,
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
      label: "Home Hero Banners",
      icon: <BannerIcon size={17} />,
      badge: stats?.banners?.active ? `${stats.banners.active} live` : 0,
      badgeColor: "success",
    },
    {
      id: "promos",
      label: "Promo & Offer Strips",
      icon: <Sparkles size={17} />,
      badge: promoBannersCount || 0,
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

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (setMobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col z-50 md:z-20 transition-all duration-200 shrink-0 ${
          /* Mobile Drawer: fixed overlay */
          mobileSidebarOpen
            ? "fixed inset-y-0 left-0 w-[270px] max-w-[85vw] shadow-2xl flex md:relative md:shadow-none"
            : "fixed inset-y-0 -left-full md:left-auto md:relative hidden md:flex"
        } ${
          /* Desktop Width */
          isCollapsed ? "md:w-[72px]" : "md:w-[250px]"
        }`}
      >
        {/* Brand Header */}
        <div
          className={`h-16 flex items-center border-b border-[var(--border-subtle)] ${
            isCollapsed ? "px-4 justify-center" : "px-4 sm:px-5 justify-between"
          }`}
        >
          <div
            onClick={() => handleNavClick("overview")}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <div className="w-7.5 h-7.5 rounded-[var(--radius-xs)] bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              P
            </div>
            {!isCollapsed && (
              <div className="min-w-0 truncate">
                <div className="font-extrabold text-[0.825rem] sm:text-[0.85rem] tracking-[0.06em] uppercase truncate text-[var(--text-primary)]">
                  PIXEL PERFECT
                </div>
                <div className="text-[0.625rem] sm:text-[0.65rem] text-[var(--text-muted)] tracking-[0.05em] uppercase truncate">
                  Studio Admin
                </div>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`btn-icon btn-ghost !w-6.5 !h-6.5 hidden md:inline-flex text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] ${isCollapsed ? "hidden" : ""}`}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft size={15} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen && setMobileSidebarOpen(false)}
            className="btn-icon btn-ghost md:hidden !w-7 !h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
            title="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation List */}
        <div className="p-2.5 flex-1 flex flex-col gap-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="text-[0.68rem] font-bold uppercase text-[var(--text-muted)] tracking-[0.08em] px-2.5 pb-2 truncate">
              Studio Management
            </div>
          )}

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] border-0 cursor-pointer transition-all text-[0.825rem] text-left ${
                  isCollapsed ? "py-2.5 justify-center" : "py-2.5 px-3 justify-start"
                } ${
                  isActive
                    ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-bold shadow-xs"
                    : "bg-transparent text-[var(--text-secondary)] font-medium hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center shrink-0">{item.icon}</div>

                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge !== 0 && (
                      <span
                        className={`badge ${
                          isActive
                            ? "bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                            : item.badgeColor === "danger"
                            ? "badge-danger"
                            : item.badgeColor === "info"
                            ? "bg-blue-500/20 text-blue-400"
                            : item.badgeColor === "success"
                            ? "badge-success"
                            : "badge-neutral"
                        } text-[0.65rem] px-1.5 py-0.5 shrink-0 font-bold`}
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
          <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => {
                if (setMobileSidebarOpen) setMobileSidebarOpen(false);
                onExitToStore();
              }}
              className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-card)] text-[var(--text-primary)] cursor-pointer text-[0.78rem] font-semibold hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-all ${
                isCollapsed ? "py-2.5 justify-center" : "py-2.5 px-3 justify-start"
              }`}
              title="Public Storefront"
            >
              <Store size={15} className="shrink-0" />
              {!isCollapsed && <span className="truncate">View Public Store</span>}
            </button>

            <button
              onClick={() => {
                if (setMobileSidebarOpen) setMobileSidebarOpen(false);
                logout();
              }}
              className={`w-full flex items-center gap-2.5 rounded-[var(--radius-sm)] bg-transparent text-[var(--color-danger)] cursor-pointer text-[0.78rem] font-semibold hover:bg-[var(--color-danger-bg)] transition-colors ${
                isCollapsed ? "py-2 justify-center" : "py-2 px-3 justify-start"
              }`}
              title="Logout"
            >
              <LogOut size={15} className="shrink-0" />
              {!isCollapsed && <span className="truncate">Logout</span>}
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
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isLiveBackend ? "bg-[var(--color-success)]" : "bg-[var(--color-warning)]"
            }`}
          />
          {!isCollapsed && (
            <div className="text-[0.68rem] text-[var(--text-muted)] truncate">
              {isLiveBackend ? "Database: Connected" : "Local Sandbox Mode"}
            </div>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="btn-icon btn-ghost absolute top-4.5 -right-3 !w-5.5 !h-5.5 rounded-full bg-[var(--bg-elevated)] z-30 hidden md:inline-flex"
            title="Expand sidebar"
          >
            <ChevronRight size={13} />
          </button>
        )}
      </aside>
    </>
  );
}

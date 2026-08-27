import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Search,
  ArrowRight,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function Navbar({
  activePage,
  setActivePage,
  theme,
  toggleTheme,
  products = [],
  onViewProduct,
  onSearchSubmit,
  shopStatus = { isOpen: true },
  isStatusLoading = false,
  onOpenShopClosedModal,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [timerText, setTimerText] = useState("");

  const statusPopoverRef = useRef(null);

  // Real-time ticking for navbar timer chip
  useEffect(() => {
    if (!shopStatus?.timerEnabled || !shopStatus?.timerTarget) {
      setTimerText("");
      return;
    }

    const updateTimer = () => {
      const targetTime = new Date(shopStatus.timerTarget).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimerText("Soon");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimerText(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimerText(`${hours}h ${minutes}m`);
      } else {
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimerText(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [shopStatus?.timerEnabled, shopStatus?.timerTarget]);

  // Click outside status popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusPopoverRef.current && !statusPopoverRef.current.contains(e.target)) {
        setShowStatusPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchContainerRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  // Filter matching products for live preview
  const searchResults = searchQuery.trim()
    ? products
        .filter((p) => {
          const q = searchQuery.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchCategory = p.category?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          return matchName || matchCategory || matchDesc;
        })
        .slice(0, 5)
    : [];

  // Focus mobile input when mobile search is opened
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  // Global keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        desktopInputRef.current?.focus();
        setMobileSearchOpen(true);
      } else if (e.key === "Escape") {
        setIsSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setIsSearchFocused(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectResult = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    }
    setSearchQuery("");
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
    } else {
      setActivePage("products");
    }
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-subtle)] transition-all">
      <div className="storefront-container h-[72px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick("home")}
          className="cursor-pointer flex flex-col shrink-0 min-w-0"
        >
          <span className="text-[0.8rem] sm:text-[1.15rem] font-extrabold tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[var(--text-primary)] leading-tight">
            PIXEL PERFECT
          </span>
          <span className="text-[0.55rem] sm:text-[0.625rem] font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-[var(--text-muted)] mt-0.5 hidden sm:inline">
            Stationery, Studio & IT
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 shrink-0">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`bg-transparent border-none text-[0.825rem] uppercase tracking-[0.04em] cursor-pointer py-1 relative transition-colors ${
                  isActive
                    ? "font-bold text-[var(--text-primary)]"
                    : "font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[var(--text-primary)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Search Bar with Live Suggestions Dropdown */}
        <div
          ref={searchContainerRef}
          className="hidden md:flex relative flex-1 max-w-55 mx-2"
        >
          <form onSubmit={handleSearchFormSubmit} className="w-full relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
            />
            <input
              ref={desktopInputRef}
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="form-input !pl-8.5 !pr-13 text-[0.8rem] py-1.5 bg-[var(--bg-input)] rounded-full border border-[var(--border-subtle)] focus:border-[var(--border-bright)] transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-0.5"
              >
                <X size={13} />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.625rem] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] pointer-events-none">
                ⌘K
              </kbd>
            )}
          </form>

          {/* Live Search Results Dropdown (Desktop) */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] overflow-hidden z-50 animate-[scaleUp_0.15s_ease-out]">
              <div className="p-2 border-b border-[var(--border-subtle)] flex justify-between items-center text-[0.68rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider px-3">
                <span>Matching Artifacts</span>
                <span>{searchResults.length} Results</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-[var(--text-muted)] text-[0.825rem]">
                  No items found for "{searchQuery}"
                </div>
              ) : (
                <div className="flex flex-col max-h-[340px] overflow-y-auto divide-y divide-[var(--border-subtle)]">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectResult(product)}
                      className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      {product.images?.[0] ? (
                        <img
                          src={getOptimizedImageUrl(product.images[0], { width: 100 })}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-10 h-10 rounded-[var(--radius-xs)] object-cover bg-black shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-[var(--radius-xs)] bg-[var(--bg-app)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                          <Package size={16} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.825rem] font-bold text-[var(--text-primary)] truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="badge badge-neutral text-[0.6rem]">
                            {product.category}
                          </span>
                          <span className="font-mono text-[0.75rem] text-[var(--text-secondary)] font-semibold">
                            NRs. {Number(product.indicativePrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={13} className="text-[var(--text-muted)] shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {/* View All in Catalog Link */}
              <button
                onClick={handleSearchFormSubmit}
                className="w-full py-2.5 px-3 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] text-[0.75rem] font-bold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>View all results for "{searchQuery}"</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Shop Status, Phone inquiry, Search trigger (Mobile), Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Live Shop Status Indicator Pill or Loader */}
          {isStatusLoading || !shopStatus ? (
            <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-medium border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] animate-pulse">
              <Loader2 size={11} className="animate-spin text-[var(--text-muted)] shrink-0" />
              <span className="hidden sm:inline text-[0.7rem]">Status...</span>
              <span className="sm:hidden text-[0.65rem]">...</span>
            </div>
          ) : (
            <div className="relative" ref={statusPopoverRef}>
              <button
                onClick={() => {
                  if (!shopStatus?.isOpen) {
                    if (onOpenShopClosedModal) onOpenShopClosedModal();
                  } else {
                    setShowStatusPopover(!showStatusPopover);
                  }
                }}
                className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold border transition-all cursor-pointer ${
                  shopStatus?.isOpen
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
                }`}
                title={
                  shopStatus?.isOpen
                    ? "Store is currently open • Click for operating hours"
                    : "Store is currently closed • Click to view reopen timer"
                }
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      shopStatus?.isOpen ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      shopStatus?.isOpen ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </span>

                <span className="hidden sm:inline">{shopStatus?.isOpen ? "Shop Open" : "Shop Closed"}</span>
                <span className="sm:hidden">{shopStatus?.isOpen ? "Open" : "Closed"}</span>

                {/* Countdown text if closed & timer set */}
                {!shopStatus?.isOpen && timerText && (
                  <span className="text-[0.625rem] sm:text-[0.675rem] font-mono font-normal opacity-90 border-l border-red-500/30 pl-1 sm:pl-1.5 flex items-center gap-0.5">
                    <Clock size={10} />
                    <span>{timerText}</span>
                  </span>
                )}
              </button>

              {/* Popover on click for Open store info (responsive on mobile & desktop) */}
              {showStatusPopover && shopStatus?.isOpen && (
                <div className="fixed top-[68px] left-3 right-3 max-w-[320px] ml-auto sm:ml-0 sm:max-w-none sm:left-auto sm:right-0 sm:absolute sm:top-full mt-2 sm:w-72 p-3.5 bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] z-50 animate-[scaleUp_0.15s_ease-out]">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Storefront Live & Operating
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
                    {shopStatus?.openMessage ||
                      "We are currently open and taking orders and consulting inquiries."}
                  </p>
                  <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[0.7rem] text-[var(--text-muted)]">
                    <span>Inquiries Active</span>
                    <span className="font-mono text-emerald-400">● 100% Online</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <a
            href="tel:+9779808950275"
            className="hidden xl:inline-flex items-center gap-1.5 text-[0.775rem] font-semibold text-[var(--text-secondary)] tracking-[0.02em] hover:text-[var(--text-primary)]"
          >
            <Phone size={13} />
            <span className="font-mono">+977 9808950275</span>
          </a>

          {/* Mobile Search Button Toggle */}
          <button
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              setMobileMenuOpen(false);
            }}
            className="btn-icon btn-ghost md:!hidden inline-flex"
            title="Search Catalog"
            aria-label="Search"
          >
            <Search size={17} />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="btn-icon btn-ghost"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Monochrome`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
            }}
            className="btn-icon btn-ghost lg:!hidden inline-flex"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Expansion Bar (Slides right under topbar) */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-medium)] p-3 animate-[fadeIn_0.2s_ease-out]">
          <form onSubmit={handleSearchFormSubmit} className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search notebooks, pens, leather objects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input !pl-9.5 !pr-9 text-[0.875rem] py-2 bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)]"
            />
            <button
              type="button"
              onClick={() => {
                if (searchQuery) setSearchQuery("");
                else setMobileSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-1"
            >
              <X size={16} />
            </button>
          </form>

          {/* Live Mobile Search Results */}
          {searchQuery.trim() && (
            <div className="mt-2.5 bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] overflow-hidden max-h-[280px] overflow-y-auto divide-y divide-[var(--border-subtle)]">
              {searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                  No artifacts match "{searchQuery}"
                </div>
              ) : (
                <>
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectResult(product)}
                      className="p-2.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-card)]"
                    >
                      {product.images?.[0] ? (
                        <img
                          src={getOptimizedImageUrl(product.images[0], { width: 100 })}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-9 h-9 rounded-[var(--radius-xs)] object-cover bg-black shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-[var(--bg-app)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                          <Package size={14} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-[0.8rem] font-bold text-[var(--text-primary)] truncate">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="badge badge-neutral text-[0.55rem]">
                            {product.category}
                          </span>
                          <span className="font-mono text-[0.7rem] text-[var(--text-secondary)] font-semibold">
                            NRs. {Number(product.indicativePrice).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={12} className="text-[var(--text-muted)] shrink-0" />
                    </div>
                  ))}
                  <button
                    onClick={handleSearchFormSubmit}
                    className="w-full py-2.5 px-3 bg-[var(--bg-card)] text-[0.75rem] font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 border-0 cursor-pointer"
                  >
                    <span>View all results for "{searchQuery}"</span>
                    <ArrowRight size={12} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border-medium)] px-4 sm:px-6 py-5 flex flex-col gap-3.5 animate-[fadeIn_0.2s_ease-out]">
          {/* Mobile status banner in drawer */}
          {isStatusLoading || !shopStatus ? (
            <div className="p-3 rounded-[var(--radius-sm)] flex items-center gap-2.5 border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-muted)] animate-pulse">
              <Loader2 size={13} className="animate-spin text-[var(--text-muted)] shrink-0" />
              <span className="text-xs font-medium">Checking atelier status...</span>
            </div>
          ) : (
            <div
              onClick={() => {
                if (!shopStatus?.isOpen && onOpenShopClosedModal) {
                  onOpenShopClosedModal();
                  setMobileMenuOpen(false);
                }
              }}
              className={`p-3 rounded-[var(--radius-sm)] flex items-center justify-between cursor-pointer border ${
                shopStatus?.isOpen
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/15 border-red-500/40 text-red-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    shopStatus?.isOpen ? "bg-emerald-500" : "bg-red-500 animate-ping"
                  }`}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {shopStatus?.isOpen ? "Shop is Open" : "Shop is Currently Closed"}
                </span>
              </div>
              {!shopStatus?.isOpen && timerText && (
                <span className="text-xs font-mono font-bold bg-black/30 px-2 py-0.5 rounded">
                  {timerText}
                </span>
              )}
            </div>
          )}

          {/* Drawer Search Input */}
          <form onSubmit={handleSearchFormSubmit} className="relative mb-2">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input !pl-8.5 text-sm py-2 bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
            />
          </form>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`bg-transparent border-none text-left text-base uppercase tracking-[0.05em] py-2 cursor-pointer ${
                activePage === link.id
                  ? "font-bold text-[var(--text-primary)]"
                  : "font-medium text-[var(--text-secondary)]"
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:+9779808950275"
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]"
          >
            <Phone size={14} />
            <span>Call Atelier: +977 9808950275</span>
          </a>
        </div>
      )}
    </header>
  );
}


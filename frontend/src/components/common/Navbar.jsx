import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  Info,
} from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  onStatusAutoClose,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [timerText, setTimerText] = useState("");

  const headerRef = useRef(null);
  const statusPopoverRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // GSAP Dynamic Navbar: Scroll down -> hides, Scroll up -> shows smoothly at any position
  useEffect(() => {
    if (!headerRef.current) return;

    let lastScrollY = window.scrollY;
    let isHidden = false;

    // Reset initial state to visible
    gsap.set(headerRef.current, { yPercent: 0 });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;

      // Keep open if menu or search or status popover is open
      if (mobileMenuOpen || isSearchOpen || showStatusPopover) {
        if (isHidden) {
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          isHidden = false;
        }
        lastScrollY = currentScrollY;
        return;
      }

      // 1. When at top of page (scrollY <= 15): always show
      if (currentScrollY <= 15) {
        if (isHidden) {
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
          isHidden = false;
        }
      }
      // 2. When scrolling DOWN (delta > 3 and past top): HIDE
      else if (delta > 3 && currentScrollY > 30) {
        if (!isHidden) {
          gsap.to(headerRef.current, {
            yPercent: -100,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          isHidden = true;
        }
      }
      // 3. When scrolling UP (delta < -3): SHOW at ANY position on page (including bottom!)
      else if (delta < -3) {
        if (isHidden) {
          gsap.to(headerRef.current, {
            yPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          isHidden = false;
        }
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      gsap.killTweensOf(headerRef.current);
    };
  }, [mobileMenuOpen, isSearchOpen, showStatusPopover]);

  // Real-time ticking for navbar timer chip (Kathmandu Timezone NPT / UTC+05:45)
  useEffect(() => {
    if (!shopStatus?.timerEnabled || !shopStatus?.timerTarget) {
      setTimerText("");
      return;
    }

    const parseTargetDate = (dateStr) => {
      if (!dateStr) return 0;
      if (typeof dateStr === "string" && dateStr.includes("T") && !dateStr.includes("+") && !dateStr.endsWith("Z")) {
        const withSecs = dateStr.length === 16 ? `${dateStr}:00` : dateStr;
        return new Date(`${withSecs}+05:45`).getTime();
      }
      return new Date(dateStr).getTime();
    };

    const updateTimer = () => {
      const targetTime = parseTargetDate(shopStatus.timerTarget);
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimerText("");
        // Dynamically auto-close if shop is currently open/partial and timer ends
        if (
          shopStatus?.status === "open" ||
          shopStatus?.status === "partial" ||
          shopStatus?.isOpen !== false ||
          shopStatus?.timerAction === "close"
        ) {
          if (onStatusAutoClose) {
            onStatusAutoClose();
          }
        }
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
  }, [shopStatus?.timerEnabled, shopStatus?.timerTarget, shopStatus?.status, shopStatus?.isOpen, onStatusAutoClose]);

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

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "printing", label: "Printing" },
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

  // Focus search input when search bar is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isSearchOpen]);

  // Global keyboard shortcut (⌘K or Ctrl+K) to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
        setShowStatusPopover(false);
        setMobileMenuOpen(false);
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
        !searchContainerRef.current.contains(e.target) &&
        !e.target.closest('button[aria-label="Search"]')
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectResult = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    }
    setSearchQuery("");
    setIsSearchOpen(false);
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
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] w-full bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-subtle)] will-change-transform shadow-xs"
      >
        <div className="storefront-container h-[72px] flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick("home")}
          className="cursor-pointer flex flex-col shrink-0 min-w-0 group"
        >
          <span className="text-[0.8rem] sm:text-[1.15rem] font-extrabold tracking-[0.06em] sm:tracking-[0.08em] uppercase text-[var(--text-primary)] leading-tight group-hover:opacity-85 transition-opacity">
            PIXEL PERFECT
          </span>
          <span className="text-[0.55rem] sm:text-[0.625rem] font-medium tracking-[0.12em] sm:tracking-[0.15em] uppercase text-[var(--text-muted)] mt-0.5 hidden sm:inline group-hover:text-[var(--text-secondary)] transition-colors">
            Stationery, Studio & IT
          </span>
        </div>

        {/* Desktop Navigation Links with Dynamic Light/Dark Hover */}
        <nav className="hidden lg:flex items-center gap-1.5 shrink-0">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`border-none text-[0.825rem] uppercase tracking-[0.04em] cursor-pointer px-3.5 py-1.5 rounded-[var(--radius-sm)] relative transition-all duration-200 ${
                  isActive
                    ? "font-bold text-[var(--text-primary)] bg-[var(--bg-elevated)] shadow-xs"
                    : "font-medium text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[var(--text-primary)] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Side - Shop Status, Phone inquiry, Search trigger, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
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
                onClick={() => setShowStatusPopover(!showStatusPopover)}
                className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[0.7rem] sm:text-[0.75rem] font-bold border transition-all cursor-pointer ${
                  shopStatus?.status === "partial"
                    ? "bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25"
                    : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                    ? "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                }`}
                title={
                  shopStatus?.status === "partial"
                    ? "Some services limited / unavailable • Click for schedule & details"
                    : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                    ? "Store is currently closed • Click to view reopen timer"
                    : "Store is currently open • Click for operating hours & schedule"
                }
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      shopStatus?.status === "partial"
                        ? "bg-blue-400"
                        : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                        ? "bg-red-400"
                        : "bg-emerald-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      shopStatus?.status === "partial"
                        ? "bg-blue-400"
                        : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    }`}
                  />
                </span>

                {shopStatus?.status === "partial" ? (
                  <>
                    <span className="hidden sm:inline">Partial Services</span>
                    <span className="sm:hidden">Partial</span>
                  </>
                ) : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen) ? (
                  <>
                    <span className="hidden sm:inline">Shop Closed</span>
                    <span className="sm:hidden">Closed</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Shop Open</span>
                    <span className="sm:hidden">Open</span>
                  </>
                )}

                {/* Countdown text chip if timer set (Shown for Open, Partial, and Closed) */}
                {timerText && (
                  <span
                    className={`text-[0.625rem] sm:text-[0.675rem] font-mono font-normal opacity-90 border-l pl-1 sm:pl-1.5 flex items-center gap-0.5 ${
                      shopStatus?.status === "partial"
                        ? "border-blue-500/40 text-blue-300"
                        : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                        ? "border-red-500/30 text-red-300"
                        : "border-emerald-500/30 text-emerald-300"
                    }`}
                  >
                    <Clock size={10} />
                    <span>{timerText}</span>
                  </span>
                )}
              </button>

              {/* Popover on click for Open / Partial / Closed store info */}
              {showStatusPopover && (
                <div className="fixed top-[68px] left-3 right-3 max-w-[320px] ml-auto sm:ml-0 sm:max-w-none sm:left-auto sm:right-0 sm:absolute sm:top-full mt-2 sm:w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] z-50 animate-[scaleUp_0.15s_ease-out]">
                  {shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen) ? (
                    <>
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                          {shopStatus?.closedTitle || shopStatus?.title || "Store Currently Closed"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
                        {shopStatus?.closedMessage ||
                          "We are currently closed for off-hours / maintenance. You can still explore our catalog and submit project inquiries or WhatsApp messages."}
                      </p>
                      {timerText && (
                        <div className="mt-2.5 p-2 rounded bg-red-500/10 border border-red-500/25 flex items-center justify-between text-[0.7rem]">
                          <span className="text-red-300 flex items-center gap-1 font-semibold">
                            <Clock size={11} />
                            <span>{shopStatus?.timerLabel || "Reopening In:"}</span>
                          </span>
                          <span className="font-mono font-bold text-red-400">{timerText}</span>
                        </div>
                      )}
                      <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[0.7rem] text-[var(--text-muted)]">
                        <span>Storefront Status</span>
                        <span className="font-mono text-red-400">● Offline / Inquiries Queued</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowStatusPopover(false);
                          if (onOpenShopClosedModal) onOpenShopClosedModal();
                        }}
                        className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-white bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/30 cursor-pointer transition-colors"
                      >
                        View Full Notice & Contacts
                      </button>
                    </>
                  ) : shopStatus?.status === "partial" ? (
                    <>
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                          {shopStatus?.partialTitle || "Partial Availability Update"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
                        {shopStatus?.partialMessage ||
                          "Some particular services are currently unavailable or on schedule, while our catalog and other services remain operational."}
                      </p>
                      {timerText && (
                        <div className="mt-2.5 p-2 rounded bg-blue-500/10 border border-blue-500/25 flex items-center justify-between text-[0.7rem]">
                          <span className="text-blue-300 flex items-center gap-1 font-semibold">
                            <Clock size={11} />
                            <span>{shopStatus?.timerLabel || "Next Window:"}</span>
                          </span>
                          <span className="font-mono font-bold text-blue-400">{timerText}</span>
                        </div>
                      )}
                      <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[0.7rem] text-[var(--text-muted)]">
                        <span>Storefront Status</span>
                        <span className="font-mono text-blue-400">● Selected Services Active</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowStatusPopover(false);
                          if (onOpenShopClosedModal) onOpenShopClosedModal();
                        }}
                        className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-white bg-blue-500/20 hover:bg-blue-500/30 rounded border border-blue-500/30 cursor-pointer transition-colors"
                      >
                        View Schedule Notice & Details
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[var(--border-subtle)]">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                          {shopStatus?.openTitle || "Storefront Live & Operating"}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
                        {shopStatus?.openMessage ||
                          "We are currently open and taking orders and consulting inquiries."}
                      </p>
                      {timerText && (
                        <div className="mt-2.5 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-[0.7rem]">
                          <span className="text-emerald-300 flex items-center gap-1 font-semibold">
                            <Clock size={11} />
                            <span>{shopStatus?.timerLabel || "Open For Next:"}</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-400">{timerText}</span>
                        </div>
                      )}
                      <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[0.7rem] text-[var(--text-muted)]">
                        <span>Inquiries Active</span>
                        <span className="font-mono text-emerald-400">● 100% Online</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowStatusPopover(false);
                          if (onOpenShopClosedModal) onOpenShopClosedModal();
                        }}
                        className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-white bg-emerald-500/20 hover:bg-emerald-500/30 rounded border border-emerald-500/30 cursor-pointer transition-colors"
                      >
                        View Operating Notice
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          <a
            href="tel:+9779808950275"
            className="hidden xl:inline-flex items-center gap-1.5 text-[0.775rem] font-semibold text-[var(--text-secondary)] tracking-[0.02em] hover:text-[var(--text-primary)] px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--bg-elevated)] transition-all"
          >
            <Phone size={13} />
            <span className="font-mono">+977 9808950275</span>
          </a>

          {/* Universal Search Trigger Button (Desktop & Mobile) */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setMobileMenuOpen(false);
            }}
            className={`btn-icon transition-colors ${
              isSearchOpen
                ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                : "btn-ghost"
            }`}
            title="Search Products & Services (⌘K)"
            aria-label="Search"
          >
            <Search size={16} />
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
              setIsSearchOpen(false);
            }}
            className="btn-icon btn-ghost lg:!hidden inline-flex"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Universal Search Expansion Bar (Slides right under topbar for all screens) */}
      {isSearchOpen && (
        <div
          ref={searchContainerRef}
          className="bg-[var(--bg-card)]/98 backdrop-blur-md border-b border-[var(--border-medium)] p-3 sm:p-4 shadow-2xl animate-[fadeIn_0.15s_ease-out] z-50 relative"
        >
          <div className="storefront-container max-w-[760px] mx-auto">
            <form onSubmit={handleSearchFormSubmit} className="relative flex items-center">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, stationery, custom prints, IT disciplines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input !pl-10 !pr-20 text-xs sm:text-sm py-2.5 bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-medium)] focus:border-[var(--border-bright)] w-full transition-colors"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="btn-icon btn-ghost !w-6 !h-6 text-[var(--text-muted)] hover:text-white"
                    title="Clear search text"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-block text-[0.625rem] font-mono text-[var(--text-muted)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] pointer-events-none">
                    ESC
                  </kbd>
                )}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="btn-icon btn-ghost !w-7 !h-7 text-[var(--text-muted)] hover:text-white"
                  title="Close search"
                >
                  <X size={16} />
                </button>
              </div>
            </form>

            {/* Live Search Results Dropdown */}
            {searchQuery.trim() && (
              <div className="mt-2.5 bg-[var(--bg-elevated)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] overflow-hidden max-h-[320px] overflow-y-auto divide-y divide-[var(--border-subtle)] shadow-xl">
                {searchResults.length === 0 ? (
                  <div className="p-5 text-center text-xs text-[var(--text-muted)]">
                    No products match "{searchQuery}"
                  </div>
                ) : (
                  <>
                    <div className="p-2.5 px-3.5 border-b border-[var(--border-subtle)] flex justify-between items-center text-[0.65rem] text-[var(--text-muted)] font-semibold uppercase tracking-wider bg-[var(--bg-card)]">
                      <span>Matching Catalog Items</span>
                      <span>{searchResults.length} Results</span>
                    </div>
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => handleSelectResult(product)}
                        className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[var(--bg-card)] transition-colors"
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
                          <div className="text-xs sm:text-[0.825rem] font-bold text-[var(--text-primary)] truncate">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="badge badge-neutral text-[0.55rem]">
                              {product.category}
                            </span>
                            {product.discountPrice && Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.indicativePrice) ? (
                              <div className="flex items-center gap-1.5 font-mono text-[0.75rem]">
                                <span className="text-emerald-400 font-bold">
                                  NRs. {Number(product.discountPrice).toLocaleString()}
                                </span>
                                <span className="text-[var(--text-muted)] line-through text-[0.65rem]">
                                  NRs. {Number(product.indicativePrice).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="font-mono text-[0.75rem] text-[var(--text-secondary)] font-semibold">
                                NRs. {Number(product.indicativePrice).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight size={14} className="text-[var(--text-muted)] shrink-0" />
                      </div>
                    ))}
                    <button
                      onClick={handleSearchFormSubmit}
                      className="w-full py-2.5 px-3 bg-[var(--bg-card)] border-t border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>View all results for "{searchQuery}"</span>
                      <ArrowRight size={12} />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[var(--bg-card)] border-b border-[var(--border-medium)] px-4 sm:px-6 py-5 flex flex-col gap-2.5 animate-[fadeIn_0.2s_ease-out]">
          {/* Mobile status banner in drawer */}
          {isStatusLoading || !shopStatus ? (
            <div className="p-3 rounded-[var(--radius-sm)] flex items-center gap-2.5 border border-[var(--border-subtle)] bg-[var(--bg-input)] text-[var(--text-muted)] animate-pulse mb-1">
              <Loader2 size={13} className="animate-spin text-[var(--text-muted)] shrink-0" />
              <span className="text-xs font-medium">Checking shop status...</span>
            </div>
          ) : (
            <div
              onClick={() => {
                if (!shopStatus?.isOpen && onOpenShopClosedModal) {
                  onOpenShopClosedModal();
                  setMobileMenuOpen(false);
                }
              }}
              className={`p-3 rounded-[var(--radius-sm)] flex items-center justify-between cursor-pointer border mb-1 ${
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
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input !pl-8.5 text-sm py-2 bg-[var(--bg-input)] rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
            />
          </form>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`border-none text-left text-sm uppercase tracking-[0.05em] px-3.5 py-2.5 rounded-[var(--radius-sm)] transition-all cursor-pointer ${
                  activePage === link.id
                    ? "font-bold text-[var(--text-primary)] bg-[var(--bg-elevated)]"
                    : "font-medium text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <a
            href="tel:+9779808950275"
            className="flex items-center gap-2 text-sm text-[var(--text-secondary)] pt-3 mt-1 border-t border-[var(--border-subtle)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Phone size={14} />
            <span>Call Us: +977 9808950275</span>
          </a>
        </div>
      )}
    </header>

    {/* Fixed Navbar Space Placeholder to prevent layout jump */}
    <div className="h-[72px] w-full shrink-0" aria-hidden="true" />
  </>
  );
}


import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Home,
  ShoppingBag,
  Printer,
  Layers,
  BookOpen,
  Info,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  MapPin,
  Sun,
  Moon,
  Phone,
  Mail,
  Search,
  ArrowRight,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Loader2,
  Download,
  User,
  LogOut,
  Shield,
} from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { usePWA } from "../../context/PWAContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Helper to extract first name before space instead of showing email address
const getUserFirstName = (userData) => {
  if (!userData) return "User";
  const name = (userData.fullName || userData.name || "").trim();
  if (name) {
    return name.split(/\s+/)[0];
  }
  if (userData.email) {
    const localPart = userData.email.split("@")[0] || "";
    const prefix = localPart.split(/[._\s-]/)[0];
    if (prefix) {
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return localPart;
  }
  return "User";
};

export function Navbar({
  activePage,
  setActivePage,
  theme,
  toggleTheme,
  products = [],
  categories = [],
  printingServices = [],
  printingCategories = [],
  services = [],
  serviceCategories = [],
  onSelectCategory,
  onViewProduct,
  onSearchSubmit,
  shopStatus = { isOpen: true },
  isStatusLoading = false,
  onOpenShopClosedModal,
  onStatusAutoClose,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuDrawerOpen, setIsMenuDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusPopover, setShowStatusPopover] = useState(false);
  const [timerText, setTimerText] = useState("");
  const [hoveredNav, setHoveredNav] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { isInstalled, installApp } = usePWA();
  const { user, isAuthenticated, logout } = useAuth();
  const { openCart, totalItems } = useCart();

  const headerRef = useRef(null);
  const statusPopoverRef = useRef(null);
  const desktopStatusPopoverRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const userMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (id) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredNav(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

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

      // Keep open if search or status popover is open
      if (isSearchOpen || showStatusPopover) {
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
  }, [isSearchOpen, showStatusPopover]);

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
      const isOutsideMobile = !statusPopoverRef.current || !statusPopoverRef.current.contains(e.target);
      const isOutsideDesktop = !desktopStatusPopoverRef.current || !desktopStatusPopoverRef.current.contains(e.target);
      if (isOutsideMobile && isOutsideDesktop) {
        setShowStatusPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { id: "home", label: "Home", icon: Home },
    { id: "products", label: "Products", icon: ShoppingBag },
    { id: "printing", label: "Printing", icon: Printer },
    { id: "services", label: "Services", icon: Layers },
    { id: "blogs", label: "Blogs", icon: BookOpen },
    { id: "about", label: "About", icon: Info },
    { id: "contact", label: "Contact", icon: MessageSquare },
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
        setIsMenuDrawerOpen(false);
        setHoveredNav(null);
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

  const navigate = useNavigate();

  const handleNavClick = (id) => {
    setHoveredNav(null);
    if (id === "products" && onSelectCategory) {
      onSelectCategory("All");
    }
    if (setActivePage) setActivePage(id);
    if (id === "home") navigate("/");
    else navigate(`/${id}`);
    setIsMenuDrawerOpen(false);
    setIsSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoriesForNav = (navId) => {
    if (navId === "products") {
      const uniqueNames = Array.from(
        new Set([
          ...(categories || []).map((c) => (typeof c === "string" ? c : c?.name)).filter(Boolean),
          ...(products || []).map((p) => p.category).filter(Boolean),
        ])
      );
      const names =
        uniqueNames.length > 0
          ? uniqueNames
          : ["Notebooks", "Pens & Writing", "Desk Accessories", "Fine Paper", "Art Supplies"];

      return names
        .map((name, idx) => ({
          id: name || idx,
          name,
          count: (products || []).filter((p) => p.category === name).length,
        }))
        .sort((a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name));
    }

    if (navId === "printing") {
      const uniqueNames = Array.from(
        new Set([
          ...(printingCategories || []).map((c) => (typeof c === "string" ? c : c?.name)).filter(Boolean),
          ...(printingServices || []).map((s) => s.category).filter(Boolean),
        ])
      );
      const names =
        uniqueNames.length > 0
          ? uniqueNames
          : [
              "Fine Art Prints",
              "Architectural CAD",
              "Corporate Stationery",
              "Bookbinding",
              "Custom Packaging",
              "Stickers & Labels",
            ];

      return names
        .map((name, idx) => ({
          id: name || idx,
          name,
          count: (printingServices || []).filter((s) => s.category === name && s.isAvailable !== false).length,
        }))
        .sort((a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name));
    }

    if (navId === "services") {
      const uniqueNames = Array.from(
        new Set([
          ...(serviceCategories || []).map((c) => (typeof c === "string" ? c : c?.name)).filter(Boolean),
          ...(services || []).map((s) => s.category).filter(Boolean),
        ])
      );
      const names =
        uniqueNames.length > 0
          ? uniqueNames
          : [
              "Web Development",
              "Mobile Applications",
              "UI/UX Design Systems",
              "Cloud & DevOps",
              "Cybersecurity",
              "AI & Automation",
            ];

      return names
        .map((name, idx) => {
          let count = 0;
          if (name === "Web Development") {
            count = (services || []).filter(
              (s) => (s.isWebDevPackage || s.category === "Web Development") && s.isActive !== false
            ).length;
          } else {
            count = (services || []).filter((s) => s.category === name && s.isActive !== false).length;
          }
          return {
            id: name || idx,
            name,
            count,
          };
        })
        .sort((a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name));
    }

    return [];
  };

  const handleAllClick = (navId) => {
    setHoveredNav(null);
    if (navId === "products") {
      if (onSelectCategory) onSelectCategory("All");
      if (setActivePage) setActivePage("products");
      navigate("/products");
    } else if (navId === "printing") {
      if (setActivePage) setActivePage("printing");
      navigate("/printing");
    } else if (navId === "services") {
      if (setActivePage) setActivePage("services");
      navigate("/services");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (navId, catName) => {
    setHoveredNav(null);
    if (navId === "products") {
      if (onSelectCategory) onSelectCategory(catName);
      if (setActivePage) setActivePage("products");
      navigate(`/products?category=${encodeURIComponent(catName)}`);
      setTimeout(() => {
        const el = document.getElementById("catalog-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else if (navId === "printing") {
      if (setActivePage) setActivePage("printing");
      navigate(`/printing?category=${encodeURIComponent(catName)}`);
      setTimeout(() => {
        const el =
          document.getElementById("printing-catalog-section") ||
          document.getElementById("printing-catalog-grid");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else if (navId === "services") {
      if (setActivePage) setActivePage("services");
      navigate(`/services?category=${encodeURIComponent(catName)}`);
      setTimeout(() => {
        const targetId = catName === "Web Development" ? "web-tier-pricing" : "other-it-services";
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleSelectResult = (product) => {
    if (onViewProduct) {
      onViewProduct(product);
    }
    navigate(`/products/${product.slug || product._id}`);
    setSearchQuery("");
    setIsSearchOpen(false);
    setIsMenuDrawerOpen(false);
  };

  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
    } else {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      if (setActivePage) setActivePage("products");
    }
    setIsSearchOpen(false);
    setIsMenuDrawerOpen(false);
  };

  const renderStatusPopoverContent = () => {
    if (shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)) {
      return (
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
            className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-red-600 dark:text-red-200 bg-red-500/15 hover:bg-red-500/25 rounded border border-red-500/30 cursor-pointer transition-colors"
          >
            View Full Notice & Contacts
          </button>
        </>
      );
    }

    if (shopStatus?.status === "partial") {
      return (
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
            className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-blue-600 dark:text-blue-200 bg-blue-500/15 hover:bg-blue-500/25 rounded border border-blue-500/30 cursor-pointer transition-colors"
          >
            View Schedule Notice & Details
          </button>
        </>
      );
    }

    return (
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
          className="w-full mt-3 py-1.5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/25 rounded border border-emerald-500/30 cursor-pointer transition-colors"
        >
          View Operating Notice
        </button>
      </>
    );
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] w-full max-w-full overflow-x-clip bg-[var(--bg-topbar)] backdrop-blur-md border-b border-[var(--border-subtle)] will-change-transform shadow-xs pt-[env(safe-area-inset-top,0px)]"
      >
        {/* Top Sub-Nav (Contact on Left, Status and Social Icons on Right) */}
        <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/90 antialiased">
          <div className="storefront-container h-[32px] sm:h-[34px] flex items-center justify-between px-3 sm:px-4 md:px-6">
            {/* Left: Contact Number */}
            <div className="flex items-center justify-start shrink-0 h-full">
              <a
                href="tel:+9779808950275"
                className="inline-flex items-center gap-1.5 text-[0.72rem] sm:text-[0.75rem] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors leading-none"
                title="Call +977 9808950275"
              >
                <Phone size={12} className="shrink-0 text-[#ea580c] dark:text-[#ff7828]" />
                <span className="font-mono tracking-tight leading-none self-center">+977 9808950275</span>
              </a>
            </div>

            {/* Right: Shop Status & Social Icons */}
            <div className="flex items-center justify-end gap-2 sm:gap-2.5 lg:gap-3 shrink-0 h-full">
              {/* Shop Status & Timer (Both Mobile and Desktop) */}
              <div
                className="flex items-center h-full"
                ref={(el) => {
                  desktopStatusPopoverRef.current = el;
                  statusPopoverRef.current = el;
                }}
              >
                <div className="relative flex items-center">
                  {isStatusLoading || !shopStatus ? (
                    <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[0.68rem] sm:text-[0.72rem] font-medium border border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-muted)] animate-pulse leading-none">
                      <Loader2 size={11} className="animate-spin text-[var(--text-muted)] shrink-0" />
                      <span className="leading-none">Status...</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowStatusPopover(!showStatusPopover)}
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[0.68rem] sm:text-[0.72rem] lg:text-[0.75rem] font-semibold border transition-all cursor-pointer leading-none ${
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
                      <span className="relative flex items-center justify-center h-1.5 w-1.5 shrink-0">
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
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                            shopStatus?.status === "partial"
                              ? "bg-blue-400"
                              : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                              ? "bg-red-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      </span>

                      <span className="leading-none">
                        {shopStatus?.status === "partial"
                          ? "Partial"
                          : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                          ? "Closed"
                          : "Open"}
                      </span>

                      {/* Countdown text chip if timer set */}
                      {timerText && (
                        <span
                          className={`text-[0.65rem] sm:text-[0.72rem] font-mono font-normal opacity-90 border-l pl-1.5 hidden xs:flex items-center gap-1 leading-none ${
                            shopStatus?.status === "partial"
                              ? "border-blue-500/40 text-blue-300"
                              : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                              ? "border-red-500/30 text-red-300"
                              : "border-emerald-500/30 text-emerald-300"
                          }`}
                        >
                          <Clock size={10.5} className="shrink-0" />
                          <span className="leading-none">
                            <span className="hidden sm:inline">
                              {shopStatus?.timerLabel ? `${shopStatus.timerLabel}: ` : ""}
                            </span>
                            {timerText}
                          </span>
                        </span>
                      )}
                    </button>
                  )}

                  {/* Popover on click for Open / Partial / Closed store info */}
                  {showStatusPopover && (
                    <div className="fixed top-[38px] left-3 right-3 max-w-[320px] ml-auto sm:ml-0 sm:max-w-none sm:left-auto sm:right-0 sm:absolute sm:top-full mt-2 sm:w-80 p-4 bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] z-50 animate-[scaleUp_0.15s_ease-out]">
                      {renderStatusPopoverContent()}
                    </div>
                  )}
                </div>
              </div>

              <span className="w-px h-3 bg-[var(--border-medium)] shrink-0 self-center block" />

              {/* WhatsApp */}
              <a
                href="https://wa.me/9779808950275?text=Hello%20Pixel%20Perfect,%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[#25D366] transition-colors flex items-center justify-center p-0.5 shrink-0 self-center hover:scale-110 active:scale-95 transition-transform"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 block">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>

              <span className="w-1 h-1 rounded-full bg-[var(--border-medium)] shrink-0 self-center block" />

              {/* Instagram */}
              <a
                href="https://www.instagram.com/perfect_pixel300/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[#E4405F] transition-colors flex items-center justify-center p-0.5 shrink-0 self-center hover:scale-110 active:scale-95 transition-transform"
                title="Follow on Instagram"
                aria-label="Follow on Instagram"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 block">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <span className="w-1 h-1 rounded-full bg-[var(--border-medium)] shrink-0 self-center block" />

              {/* Facebook */}
              <a
                href="https://www.facebook.com/pixelperfectstationery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[#1877F2] transition-colors flex items-center justify-center p-0.5 shrink-0 self-center hover:scale-110 active:scale-95 transition-transform"
                title="Follow on Facebook"
                aria-label="Follow on Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 block">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="storefront-container h-[64px] sm:h-[72px] flex items-center justify-between gap-1 sm:gap-2 lg:gap-2.5 px-2.5 sm:px-4 md:px-6 min-w-0">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick("home")}
          className="cursor-pointer flex flex-col shrink-0 group select-none"
        >
          <span className="text-[0.8rem] xs:text-[0.85rem] sm:text-[0.95rem] xl:text-[1.1rem] font-extrabold tracking-[0.04em] sm:tracking-[0.06em] uppercase text-[var(--text-primary)] leading-tight group-hover:opacity-85 transition-opacity">
            PIXEL PERFECT
          </span>
          <span className="text-[0.525rem] sm:text-[0.575rem] font-medium tracking-[0.12em] uppercase text-[var(--text-muted)] mt-0.5 hidden sm:inline group-hover:text-[var(--text-secondary)] transition-colors">
            Stationery, Studio & IT
          </span>
        </div>

        {/* Desktop Navigation Links with Responsive Scaling & Category Dropdowns */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0">
          {navLinks.map((link) => {
            const isActive =
              activePage === link.id ||
              (link.id === "products" && activePage === "product-detail") ||
              (link.id === "blogs" && activePage === "blog-detail");
            const hasDropdown = ["products", "printing", "services"].includes(link.id);
            const isHovered = hoveredNav === link.id;

            return (
              <div
                key={link.id}
                className="relative"
                onMouseEnter={() => hasDropdown && handleMouseEnter(link.id)}
                onMouseLeave={() => hasDropdown && handleMouseLeave()}
              >
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`border-none text-[0.72rem] xl:text-[0.78rem] 2xl:text-[0.825rem] uppercase tracking-[0.01em] xl:tracking-[0.03em] cursor-pointer px-1.5 xl:px-2.5 2xl:px-3 py-1.5 rounded-[var(--radius-sm)] relative transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    isActive
                      ? "font-bold text-[var(--text-primary)] bg-[var(--bg-elevated)] shadow-xs"
                      : isHovered
                      ? "font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)]"
                      : "font-medium text-[var(--text-secondary)] bg-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                  }`}
                  aria-haspopup={hasDropdown ? "true" : undefined}
                  aria-expanded={hasDropdown ? isHovered : undefined}
                >
                  <span>{link.label}</span>
                  {hasDropdown && (
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 opacity-60 ${
                        isHovered ? "rotate-180 opacity-100 text-[var(--text-primary)]" : ""
                      }`}
                    />
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 xl:left-2.5 xl:right-2.5 h-[2px] bg-[var(--text-primary)] rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu for desktop on hover */}
                {hasDropdown && isHovered && (
                  <div
                    className="absolute top-full left-0 pt-1.5 z-[120] animate-[fadeIn_0.15s_ease-out]"
                    style={{ minWidth: "220px" }}
                  >
                    <div className="bg-[var(--bg-card)]/98 backdrop-blur-md border border-[var(--border-medium)] rounded-[var(--radius-sm)] shadow-[var(--shadow-xl)] py-1.5 overflow-hidden">
                      {/* Dropdown Header / All Link */}
                      <button
                        type="button"
                        onClick={() => handleAllClick(link.id)}
                        className="w-full text-left px-3.5 py-2 flex items-center justify-between text-[0.725rem] font-bold tracking-wide uppercase text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors border-0 border-b border-[var(--border-subtle)] bg-transparent cursor-pointer group/all"
                      >
                        <span>All {link.label}</span>
                        <ArrowRight
                          size={12}
                          className="text-[var(--text-muted)] group-hover/all:translate-x-0.5 group-hover/all:text-[var(--text-primary)] transition-all"
                        />
                      </button>

                      {/* Categories List */}
                      <div className="max-h-[260px] overflow-y-auto py-1 minimal-scrollbar pr-0.5">
                        {getCategoriesForNav(link.id).map((cat) => (
                          <button
                            key={cat.id || cat.name}
                            type="button"
                            onClick={() => handleCategoryClick(link.id, cat.name)}
                            className="w-full text-left px-3.5 py-1.5 flex items-center justify-between text-[0.775rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors border-0 bg-transparent cursor-pointer group/cat"
                          >
                            <span className="truncate pr-2 group-hover/cat:translate-x-0.5 transition-transform">
                              {cat.name}
                            </span>
                            {cat.count !== undefined && cat.count > 0 && (
                              <span className="text-[0.65rem] font-mono text-[var(--text-muted)] group-hover/cat:text-[var(--text-secondary)]">
                                {cat.count}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right Side - Search trigger, Theme Toggle, Shopping Cart, User Account */}
        <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
          {/* Universal Search Trigger Button (Desktop & Mobile) */}
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
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
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Shopping Cart Button with Dynamic Badge */}
          <button
            type="button"
            onClick={openCart}
            className="btn-icon btn-ghost relative"
            title="Shopping Cart"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={16} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--text-primary)] text-[var(--bg-card)] font-mono font-black text-[0.58rem] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-[scaleUp_0.15s_ease-out]">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* User Auth: Login / Register OR User Email & Profile Menu */}
          {!isAuthenticated || !user ? (
            <button
              type="button"
              onClick={() => {
                if (setActivePage) setActivePage("login");
              }}
              className="btn btn-secondary btn-sm gap-1 sm:gap-1.5 text-xs !py-1.5 !px-2.5 sm:!px-3 font-semibold shrink-0"
              title="Sign In or Create Account"
            >
              <User size={13} />
              <span className="hidden sm:inline">Login / Register</span>
              <span className="sm:hidden">Login</span>
            </button>
          ) : (
            <div className="relative shrink-0 min-w-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1 sm:gap-1.5 py-1 px-2 sm:px-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors text-xs font-medium max-w-[95px] xs:max-w-[130px] sm:max-w-[160px] lg:max-w-[130px] xl:max-w-[190px] min-w-0"
                title={user.fullName ? `${user.fullName} (${user.email})` : user.email}
              >
                <div className="w-5 h-5 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-bold text-[0.625rem] flex items-center justify-center shrink-0 border border-[var(--border-medium)]">
                  {(getUserFirstName(user) || "U")[0].toUpperCase()}
                </div>
                <span className="truncate text-[var(--text-primary)] min-w-0">
                  {getUserFirstName(user)}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-[var(--text-muted)] shrink-0 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 p-1.5 bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-md)] shadow-[var(--shadow-xl)] z-50 animate-[scaleUp_0.15s_ease-out]">
                  <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                    <div className="text-xs font-bold truncate text-[var(--text-primary)]">
                      {user.fullName || user.name || "Member"}
                    </div>
                    <div className="text-[0.675rem] font-mono text-[var(--text-muted)] truncate">
                      {user.email}
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        if (setActivePage) setActivePage("profile");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-[var(--radius-xs)] transition-colors text-left font-medium"
                    >
                      <User size={13} />
                      <span>Manage Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openCart();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-[var(--radius-xs)] transition-colors text-left font-medium"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag size={13} />
                        <span>Shopping Cart</span>
                      </div>
                      {totalItems > 0 && (
                        <span className="text-[0.625rem] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)]">
                          {totalItems}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-[var(--border-subtle)] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-[var(--radius-xs)] transition-colors text-left font-medium"
                    >
                      <LogOut size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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
                    className="btn-icon btn-ghost !w-6 !h-6 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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
                  className="btn-icon btn-ghost !w-7 !h-7 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
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

    </header>

    {/* Fixed Navbar Space Placeholder to prevent layout jump */}
    <div className="h-[96px] sm:h-[106px] w-full shrink-0" aria-hidden="true" />

    {/* Mobile Bottom Navigation Bar (Facebook App Style: First 4 + Hamburger Menu) */}
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-lg border-t border-[var(--border-medium)] shadow-[0_-4px_24px_rgba(0,0,0,0.35)] px-1.5 pt-2.5 pb-[max(0.65rem,calc(env(safe-area-inset-bottom)+0.25rem))]"
      aria-label="Mobile Navigation"
    >
      <div className="grid grid-cols-5 items-center max-w-[500px] mx-auto">
        {navLinks.slice(0, 4).map((link) => {
          const isActive = activePage === link.id && !isMenuDrawerOpen;
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              type="button"
              onClick={() => {
                setIsMenuDrawerOpen(false);
                handleNavClick(link.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 relative transition-all duration-200 cursor-pointer ${
                isActive
                  ? theme === "dark"
                    ? "text-[#ff7828]"
                    : "text-[#ea580c]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
              aria-label={link.label}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Active top line indicator (Facebook app style with mode-specific glow) */}
              {isActive && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-[#ff7828] shadow-[0_0_12px_rgba(255,120,40,0.85)]"
                      : "bg-[#ea580c] shadow-[0_1px_4px_rgba(234,88,12,0.35)]"
                  }`}
                />
              )}

              <div
                className={`flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? theme === "dark"
                      ? "scale-110 bg-[#ff7828]/15 p-1 rounded-xl text-[#ff7828] shadow-[0_0_10px_rgba(255,120,40,0.2)]"
                      : "scale-110 bg-[#ea580c]/12 p-1 rounded-xl text-[#ea580c] shadow-xs"
                    : "p-1"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </div>

              <span
                className={`text-[0.65rem] tracking-tight truncate w-full text-center leading-none mt-1 ${
                  isActive
                    ? theme === "dark"
                      ? "font-bold text-[#ff7828]"
                      : "font-bold text-[#ea580c]"
                    : "font-medium text-[var(--text-muted)]"
                }`}
              >
                {link.label}
              </span>
            </button>
          );
        })}

        {/* 5th Tab: Hamburger / Menu button aside the 4 navigations */}
        {(() => {
          const isMenuTabActive = isMenuDrawerOpen || ["about", "contact"].includes(activePage);
          return (
            <button
              type="button"
              onClick={() => setIsMenuDrawerOpen(!isMenuDrawerOpen)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 relative transition-all duration-200 cursor-pointer ${
                isMenuTabActive
                  ? theme === "dark"
                    ? "text-[#ff7828]"
                    : "text-[#ea580c]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
              aria-label="Open More Menu"
              aria-expanded={isMenuDrawerOpen}
            >
              {isMenuTabActive && (
                <span
                  className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-8 h-[2.5px] rounded-full transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-[#ff7828] shadow-[0_0_12px_rgba(255,120,40,0.85)]"
                      : "bg-[#ea580c] shadow-[0_1px_4px_rgba(234,88,12,0.35)]"
                  }`}
                />
              )}

              <div
                className={`flex items-center justify-center transition-transform duration-200 ${
                  isMenuTabActive
                    ? theme === "dark"
                      ? "scale-110 bg-[#ff7828]/15 p-1 rounded-xl text-[#ff7828] shadow-[0_0_10px_rgba(255,120,40,0.2)]"
                      : "scale-110 bg-[#ea580c]/12 p-1 rounded-xl text-[#ea580c] shadow-xs"
                    : "p-1"
                }`}
              >
                {isMenuDrawerOpen ? (
                  <X size={20} strokeWidth={2.4} />
                ) : (
                  <Menu size={20} strokeWidth={isMenuTabActive ? 2.4 : 1.8} />
                )}
              </div>

              <span
                className={`text-[0.65rem] tracking-tight truncate w-full text-center leading-none mt-1 ${
                  isMenuTabActive
                    ? theme === "dark"
                      ? "font-bold text-[#ff7828]"
                      : "font-bold text-[#ea580c]"
                    : "font-medium text-[var(--text-muted)]"
                }`}
              >
                Menu
              </span>
            </button>
          );
        })()}
      </div>
    </nav>

    {/* Mobile Slide-Up Menu Sheet when Hamburger is opened */}
    {isMenuDrawerOpen && (
      <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end animate-[fadeIn_0.15s_ease-out]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsMenuDrawerOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-up Sheet */}
        <div className="relative bg-[var(--bg-card)] border-t border-[var(--border-medium)] rounded-t-2xl shadow-2xl max-h-[66vh] flex flex-col z-10">
          {/* Top Grab Handle */}
          <div className="w-10 h-1 bg-[var(--border-medium)] rounded-full mx-auto mt-2.5 mb-1 shrink-0" />

          {/* Sheet Header */}
          <div className="px-4 py-2.5 border-b border-[var(--border-subtle)] flex items-center justify-between shrink-0">
            <div>
              <div className="text-xs font-bold tracking-[0.08em] uppercase text-[var(--text-primary)]">
                Directory & Utilities
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsMenuDrawerOpen(false)}
              className="btn-icon btn-ghost !w-7 !h-7 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Close menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Sheet Body */}
          <div className="overflow-y-auto px-4 py-3 space-y-3.5 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] text-[var(--text-primary)]">
            {/* Section 1: Additional Navigations (About & Contact) */}
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5">
                Pages
              </div>
              <div className="space-y-1.5">
                {/* Journal & Stories */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    handleNavClick("blogs");
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border transition-all text-left cursor-pointer ${
                    activePage === "blogs" || activePage === "blog-detail"
                      ? theme === "dark"
                        ? "bg-[#ff7828]/10 border-[#ff7828]/35 text-[#ff7828]"
                        : "bg-[#ea580c]/10 border-[#ea580c]/30 text-[#ea580c]"
                      : "bg-[var(--bg-input)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        activePage === "blogs" || activePage === "blog-detail"
                          ? theme === "dark"
                            ? "bg-[#ff7828]/20 text-[#ff7828]"
                            : "bg-[#ea580c]/15 text-[#ea580c]"
                          : "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      }`}
                    >
                      <BookOpen size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${
                        activePage === "blogs" || activePage === "blog-detail"
                          ? theme === "dark"
                            ? "text-[#ff7828] font-bold"
                            : "text-[#ea580c] font-bold"
                          : "text-[var(--text-primary)]"
                      }`}>
                        Blog & Articles
                      </div>
                      <div className="text-[0.65rem] text-[var(--text-muted)] leading-tight">
                        Craftsmanship, guides & studio stories
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 ${
                    activePage === "blogs" || activePage === "blog-detail"
                      ? theme === "dark"
                        ? "text-[#ff7828]"
                        : "text-[#ea580c]"
                      : "text-[var(--text-muted)]"
                  }`} />
                </button>

                {/* About Us */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    handleNavClick("about");
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border transition-all text-left cursor-pointer ${
                    activePage === "about"
                      ? theme === "dark"
                        ? "bg-[#ff7828]/10 border-[#ff7828]/35 text-[#ff7828]"
                        : "bg-[#ea580c]/10 border-[#ea580c]/30 text-[#ea580c]"
                      : "bg-[var(--bg-input)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        activePage === "about"
                          ? theme === "dark"
                            ? "bg-[#ff7828]/20 text-[#ff7828]"
                            : "bg-[#ea580c]/15 text-[#ea580c]"
                          : "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      }`}
                    >
                      <Info size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${
                        activePage === "about"
                          ? theme === "dark"
                            ? "text-[#ff7828] font-bold"
                            : "text-[#ea580c] font-bold"
                          : "text-[var(--text-primary)]"
                      }`}>
                        About Pixel Perfect
                      </div>
                      <div className="text-[0.65rem] text-[var(--text-muted)] leading-tight">
                        Studio heritage & craft philosophy
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 ${
                    activePage === "about"
                      ? theme === "dark"
                        ? "text-[#ff7828]"
                        : "text-[#ea580c]"
                      : "text-[var(--text-muted)]"
                  }`} />
                </button>

                {/* Contact Us */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    handleNavClick("contact");
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border transition-all text-left cursor-pointer ${
                    activePage === "contact"
                      ? theme === "dark"
                        ? "bg-[#ff7828]/10 border-[#ff7828]/35 text-[#ff7828]"
                        : "bg-[#ea580c]/10 border-[#ea580c]/30 text-[#ea580c]"
                      : "bg-[var(--bg-input)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        activePage === "contact"
                          ? theme === "dark"
                            ? "bg-[#ff7828]/20 text-[#ff7828]"
                            : "bg-[#ea580c]/15 text-[#ea580c]"
                          : "bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                      }`}
                    >
                      <MessageSquare size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-semibold ${
                        activePage === "contact"
                          ? theme === "dark"
                            ? "text-[#ff7828] font-bold"
                            : "text-[#ea580c] font-bold"
                          : "text-[var(--text-primary)]"
                      }`}>
                        Contact & Studio Inquiries
                      </div>
                      <div className="text-[0.65rem] text-[var(--text-muted)] leading-tight">
                        Quotes & custom print consultation
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`shrink-0 ${
                    activePage === "contact"
                      ? theme === "dark"
                        ? "text-[#ff7828]"
                        : "text-[#ea580c]"
                      : "text-[var(--text-muted)]"
                  }`} />
                </button>

                {/* Progressive Web App Install Button (Only rendered if app is not yet installed) */}
                {!isInstalled && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      installApp();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] border border-[#ea580c]/35 dark:border-[#ff7828]/35 bg-gradient-to-r from-[#ea580c]/15 via-[#ea580c]/5 to-transparent hover:bg-[#ea580c]/20 text-left cursor-pointer transition-all shadow-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Download size={13} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          <span>Install Pixel Perfect App</span>
                          <span className="px-1.5 py-0.2 rounded-full text-[0.58rem] bg-[#ea580c] text-white font-mono font-bold">
                            PWA
                          </span>
                        </div>
                        <div className="text-[0.65rem] text-[var(--text-muted)] leading-tight">
                          Add shortcut to your home screen
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-[#ea580c] dark:text-[#ff7828] shrink-0" />
                  </button>
                )}
              </div>
            </div>

            {/* Section 2: Live Shop Status Card */}
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5">
                Store Status
              </div>
              <div
                onClick={() => {
                  setIsMenuDrawerOpen(false);
                  if (onOpenShopClosedModal) onOpenShopClosedModal();
                }}
                className={`p-2.5 rounded-[var(--radius-sm)] border cursor-pointer flex items-center justify-between ${
                  shopStatus?.status === "partial"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                    : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                    ? "bg-red-500/15 border-red-500/40 text-red-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                }`}
              >
                <div className="flex items-center gap-2">
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
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider">
                      {shopStatus?.status === "partial"
                        ? "Partial Services Active"
                        : shopStatus?.status === "closed" || (!shopStatus?.status && !shopStatus?.isOpen)
                        ? "Shop Currently Closed"
                        : "Shop Currently Open"}
                    </div>
                    <div className="text-[0.65rem] opacity-80 font-mono">
                      {timerText ? `Timer: ${timerText}` : "Mon - Sat: 9:00 AM - 7:30 PM"}
                    </div>
                  </div>
                  <ChevronRight size={14} className="opacity-70 shrink-0" />
                </div>
              </div>
            </div>

            {/* Section 3: Socials & Instant Connect Channels */}
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5 flex items-center justify-between">
                  <span>Socials & Channels</span>
                </div>
                
                {/* WhatsApp, Instagram & Facebook Social Icons Row */}
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/9779808950275?text=Hello%20Pixel%20Perfect,%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 text-center transition-all group cursor-pointer"
                    title="Chat on WhatsApp"
                  >
                    <span className="text-[#25D366] mb-1 group-hover:scale-110 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </span>
                    <span className="text-[0.68rem] font-bold text-[var(--text-primary)]">WhatsApp</span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/perfect_pixel300/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 text-center transition-all group cursor-pointer"
                    title="Follow on Instagram"
                  >
                    <span className="text-[#E4405F] mb-1 group-hover:scale-110 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                      </svg>
                    </span>
                    <span className="text-[0.68rem] font-bold text-[var(--text-primary)]">Instagram</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/pixelperfectstationery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 text-center transition-all group cursor-pointer"
                    title="Follow on Facebook"
                  >
                    <span className="text-[#1877F2] mb-1 group-hover:scale-110 transition-transform">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    <span className="text-[0.68rem] font-bold text-[var(--text-primary)]">Facebook</span>
                  </a>
                </div>

                {/* Call, Email, Location Quick Actions */}
                <div className="grid grid-cols-3 gap-1.5">
                  <a
                    href="tel:+9779808950275"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors text-center"
                  >
                    <Phone size={12} className="text-[var(--text-primary)] shrink-0" />
                    <span className="text-[0.68rem] font-semibold">Call</span>
                  </a>

                  <a
                    href="mailto:perfectpixel300@gmail.com"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors text-center"
                  >
                    <Mail size={12} className="text-[var(--text-primary)] shrink-0" />
                    <span className="text-[0.68rem] font-semibold">Email</span>
                  </a>

                  <a
                    href="https://maps.app.goo.gl/Ytvdx85tYDftR7kR8?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors text-center"
                  >
                    <MapPin size={12} className="text-[var(--text-primary)] shrink-0" />
                    <span className="text-[0.68rem] font-semibold">Map</span>
                  </a>
                </div>
              </div>

            {/* Section: Account & Cart (Mobile) */}
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5">
                Account & Cart
              </div>
              <div className="flex flex-col gap-2">
                {/* Cart Row */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuDrawerOpen(false);
                    openCart();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-[var(--text-primary)]" />
                    <span className="text-xs font-semibold">Shopping Cart</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-app)]">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </button>

                {/* User Row */}
                {isAuthenticated && user ? (
                  <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[var(--text-primary)] text-[var(--bg-card)] font-bold text-xs flex items-center justify-center shrink-0 border border-[var(--border-medium)]">
                          {(getUserFirstName(user) || "U")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate text-[var(--text-primary)]">
                            {user.fullName || user.name || getUserFirstName(user)}
                          </div>
                          <div className="text-[0.65rem] font-mono text-[var(--text-muted)] truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                        Verified
                      </span>
                    </div>

                    <div className="flex gap-1.5 pt-1 border-t border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuDrawerOpen(false);
                          if (setActivePage) setActivePage("profile");
                        }}
                        className="btn btn-secondary btn-sm flex-1 !py-1 text-xs"
                      >
                        Manage Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuDrawerOpen(false);
                          logout();
                        }}
                        className="btn btn-ghost btn-sm !py-1 text-xs text-rose-400"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuDrawerOpen(false);
                      if (setActivePage) setActivePage("login");
                    }}
                    className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[var(--text-primary)]" />
                      <span className="text-xs font-semibold">Sign In / Register</span>
                    </div>
                    <ArrowRight size={13} className="text-[var(--text-muted)]" />
                  </button>
                )}
              </div>
            </div>

            {/* Section 4: Display & Theme */}
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-1.5">
                Display & Theme
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-input)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                  <span className="text-xs font-medium">
                    Theme: <strong className="capitalize">{theme}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="btn btn-secondary !py-1 !px-2.5 text-xs"
                >
                  Switch to {theme === "dark" ? "Light" : "Dark"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}


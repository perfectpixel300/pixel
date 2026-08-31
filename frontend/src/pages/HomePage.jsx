import React, { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Feather,
  Cpu,
  Compass,
  Zap,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Code,
  Layers,
  Lock,
  Star,
  Printer,
  X,
} from "lucide-react";
import { HeroBannerCarousel } from "../components/storefront/HeroBannerCarousel";
import { DynamicPromoStrip } from "../components/storefront/DynamicPromoStrip";
import { FeaturedSection } from "../components/storefront/FeaturedSection";
import { FeaturedPrintingSection } from "../components/storefront/FeaturedPrintingSection";
import { FeaturedServicesSection } from "../components/storefront/FeaturedServicesSection";
import { CategoryGrid } from "../components/storefront/CategoryGrid";
import { ProductCard } from "../components/storefront/ProductCard";
import { PrintingCard } from "../components/storefront/PrintingCard";
import { WebTierCard } from "../components/storefront/WebTierCard";
import { CategoryDropdown } from "../components/common/CategoryDropdown";
import { getServiceIcon } from "./ServicesPage";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

export function HomePage({
  banners,
  promoBanners = [],
  products,
  printingServices = [],
  printingCategories = [],
  categories = [],
  services = [],
  onViewProduct,
  onInquireProduct,
  onInquireService,
  onInquirePrinting,
  onNavigate,
  onSelectCategory,
}) {
  const [selectedHomeCategory, setSelectedHomeCategory] = useState("All");
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [selectedPrintingDetail, setSelectedPrintingDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const [selectedPrintingCategory, setSelectedPrintingCategory] = useState("All");
  const [currentPrintingPage, setCurrentPrintingPage] = useState(1);
  const PRINTING_ITEMS_PER_PAGE = 12;

  const handleCategoryClick = (category) => {
    onSelectCategory(category);
    onNavigate("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Products with pagination for Home Page (12 products per page)
  const filteredHomeProducts = (products || []).filter((p) => {
    if (selectedHomeCategory !== "All" && p.category !== selectedHomeCategory) {
      return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredHomeProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredHomeProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("home-products-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Printing services with category filter & pagination for Home Page
  const allPrintCategories = Array.from(
    new Set([
      ...(printingCategories || []).map((c) => (typeof c === "string" ? c : c.name)),
      ...(printingServices || []).map((s) => s.category).filter(Boolean),
    ])
  );

  const availablePrintingServices = (printingServices || []).filter(
    (s) => s.isAvailable !== false
  );

  const filteredHomePrintingServices = availablePrintingServices.filter((s) => {
    if (selectedPrintingCategory !== "All" && s.category !== selectedPrintingCategory) {
      return false;
    }
    return true;
  });

  const totalPrintingPages =
    Math.ceil(filteredHomePrintingServices.length / PRINTING_ITEMS_PER_PAGE) || 1;
  const paginatedPrintingServices = filteredHomePrintingServices.slice(
    (currentPrintingPage - 1) * PRINTING_ITEMS_PER_PAGE,
    currentPrintingPage * PRINTING_ITEMS_PER_PAGE
  );

  const handlePrintingPageChange = (page) => {
    setCurrentPrintingPage(page);
    const el = document.getElementById("home-all-printing-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get the 3 Web Dev subscription tiers (ordered)
  const webDevTiers = (services || [])
    .filter((s) => s.isWebDevPackage && s.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || (a.price || 0) - (b.price || 0));

  const displayTiers = webDevTiers;

  const handleSubscribePlan = (tier) => {
    const handler = onInquireService || onInquireProduct;
    if (handler) {
      handler({
        name: `${tier.title} (Web Development Tier)`,
        indicativePrice: tier.price,
        tier: tier.packageTier,
        type: "service",
        category: "Web Development",
        description: tier.shortDescription,
      });
    }
  };

  // Get other IT services (excluding 3-tier web dev packages)
  const otherItServices = (services || [])
    .filter((s) => !s.isWebDevPackage && s.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleOpenWhatsAppTier = (tier) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect Team! I would like to subscribe to the "${tier.title}" Web Development plan (NRs. ${Number(tier.price).toLocaleString()}). Please let me know how we can get started.`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  const handleOpenWhatsAppService = (title, price) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect Team! I am interested in inquiring about your "${title}" service (Priced at NRs. ${Number(price).toLocaleString()}). Could you please share more details?`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  const handleOpenWhatsAppPrinting = (title, price, priceUnit) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect! I am interested in inquiring about your "${title}" printing service (${
        price ? `NRs. ${Number(price).toLocaleString()} ${priceUnit || ""}` : "Custom Quote"
      }). Could you please guide me on file preparation and turnaround?`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  return (
    <div>
      {/* Dynamic Database Hero Banners */}
      <HeroBannerCarousel
        banners={banners}
        onCtaClick={(link) => {
          if (link.includes("services")) onNavigate("services");
          else if (link.includes("products")) onNavigate("products");
          else if (link.includes("contact")) onNavigate("contact");
          else if (link.includes("about")) onNavigate("about");
          else onNavigate("products");
        }}
      />

      {/* Dynamic Promo, Philosophy, Offer & Advertisement Strip with Countdown Timer */}
      <DynamicPromoStrip
        promoBanners={promoBanners}
        onCtaClick={(link) => {
          if (link.includes("services")) onNavigate("services");
          else if (link.includes("printing")) onNavigate("printing");
          else if (link.includes("products")) onNavigate("products");
          else if (link.includes("contact")) onNavigate("contact");
          else if (link.includes("about")) onNavigate("about");
          else onNavigate("products");
        }}
      />

      {/* Curated Highlights Section (Featured Products) */}
      <FeaturedSection
        products={products}
        onViewDetails={onViewProduct}
        onInquire={onInquireProduct}
        onBrowseAll={() => onNavigate("products")}
      />

      {/* Spotlight Featured Printing Services Carousel */}
      <FeaturedPrintingSection
        printingServices={printingServices}
        onViewDetails={(service) => setSelectedPrintingDetail(service)}
        onInquire={(service) => {
          const handler = onInquirePrinting || onInquireProduct;
          if (handler) handler(service);
        }}
        onBrowseAll={() => {
          onNavigate("printing");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Spotlight Featured IT Services & Disciplines Carousel */}
      <FeaturedServicesSection
        services={services}
        onViewDetails={(service) => setSelectedServiceDetail(service)}
        onInquire={(service) => {
          const handler = onInquireService || onInquireProduct;
          if (handler) handler(service);
        }}
        onBrowseAll={() => {
          onNavigate("services");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Disciplines Category Grid */}
      <CategoryGrid
        categories={categories}
        onSelectCategory={handleCategoryClick}
      />

      {/* =========================================================================
          PRODUCTS SECTION WITH PAGINATION
          ========================================================================= */}
      <section id="home-products-section" className="py-22 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]">
        <div className="storefront-container">
          {/* Section Header with Category Dropdown */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                Complete Catalog
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
                All Products
              </h2>
              <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[620px]">
                Explore our full stationery collection, machined writing instruments, and desk organizers.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
              <CategoryDropdown
                categories={categories.map((cat) => ({
                  id: cat._id || cat.name,
                  name: cat.name,
                  count: products.filter((p) => p.category === cat.name).length,
                }))}
                selectedCategory={selectedHomeCategory}
                onSelectCategory={(catName) => {
                  setSelectedHomeCategory(catName);
                  setCurrentPage(1);
                }}
                totalCount={products.length}
                label="Category"
                allLabel="All Categories"
              />

              <button
                onClick={() => {
                  onNavigate("products");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-secondary gap-1.5"
              >
                <span>View Full Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* 2-Column Mobile & 4-Column Desktop Product Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="py-20 px-8 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)]">
              <Package size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
              <h3 className="text-lg font-bold">No products in this category</h3>
              <button
                onClick={() => {
                  setSelectedHomeCategory("All");
                  setCurrentPage(1);
                }}
                className="btn btn-secondary btn-sm mt-3"
              >
                View All Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={onViewProduct}
                  onInquire={onInquireProduct}
                />
              ))}
            </div>
          )}

          {/* Clean Minimal Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-muted)] font-mono order-2 sm:order-1">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredHomeProducts.length)} of{" "}
                {filteredHomeProducts.length} items
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`btn btn-sm btn-secondary gap-1 !px-3 ${
                    currentPage === 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:!bg-white hover:!text-black"
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNumber = idx + 1;
                    const isActive = currentPage === pageNumber;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-8 h-8 rounded-[var(--radius-xs)] text-xs font-mono font-bold flex items-center justify-center transition-all ${
                          isActive
                            ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm"
                            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input-focus)]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className={`btn btn-sm btn-secondary gap-1 !px-3 ${
                    currentPage >= totalPages
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:!bg-[var(--btn-primary-bg)] hover:!text-[var(--btn-primary-text)]"
                  }`}
                  aria-label="Next Page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          ALL PRINTING & DOCUMENT SERVICES SECTION BELOW ALL PRODUCTS
          ========================================================================= */}
      {availablePrintingServices.length > 0 && (
        <section id="home-all-printing-section" className="py-22 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
          <div className="storefront-container">
            {/* Section Header with Category Dropdown */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Complete Print Catalog
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
                  All Printing & Document Services
                </h2>
                <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[620px]">
                  Explore fine art prints, architectural CAD blueprints, corporate stationery, hardcover bookbinding, and custom packaging.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap self-start md:self-auto">
                <CategoryDropdown
                  categories={allPrintCategories.map((cat) => ({
                    id: cat,
                    name: cat,
                    count: availablePrintingServices.filter((s) => s.category === cat).length,
                  }))}
                  selectedCategory={selectedPrintingCategory}
                  onSelectCategory={(catName) => {
                    setSelectedPrintingCategory(catName);
                    setCurrentPrintingPage(1);
                  }}
                  totalCount={availablePrintingServices.length}
                  label="Category"
                  allLabel="All Categories"
                />

                <button
                  onClick={() => {
                    onNavigate("printing");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="btn btn-secondary gap-1.5"
                >
                  <span>View Full Print Catalog</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Printing Services Grid */}
            {paginatedPrintingServices.length === 0 ? (
              <div className="py-20 px-8 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)]">
                <Printer size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
                <h3 className="text-lg font-bold">No printing services in this category</h3>
                <button
                  onClick={() => {
                    setSelectedPrintingCategory("All");
                    setCurrentPrintingPage(1);
                  }}
                  className="btn btn-secondary btn-sm mt-3"
                >
                  View All Printing Services
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
                {paginatedPrintingServices.map((service) => (
                  <PrintingCard
                    key={service._id}
                    service={service}
                    onViewDetails={(s) => setSelectedPrintingDetail(s)}
                    onInquire={(s) => {
                      const handler = onInquirePrinting || onInquireProduct;
                      if (handler) handler(s);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPrintingPages > 1 && (
              <div className="mt-12 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-[var(--text-muted)] font-mono order-2 sm:order-1">
                  Showing {(currentPrintingPage - 1) * PRINTING_ITEMS_PER_PAGE + 1}–
                  {Math.min(
                    currentPrintingPage * PRINTING_ITEMS_PER_PAGE,
                    filteredHomePrintingServices.length
                  )}{" "}
                  of {filteredHomePrintingServices.length} printing services
                </span>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => handlePrintingPageChange(currentPrintingPage - 1)}
                    disabled={currentPrintingPage === 1}
                    className={`btn btn-sm btn-secondary gap-1 !px-3 ${
                      currentPrintingPage === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:!bg-white hover:!text-black"
                    }`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={14} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPrintingPages }).map((_, idx) => {
                      const pageNumber = idx + 1;
                      const isActive = currentPrintingPage === pageNumber;
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePrintingPageChange(pageNumber)}
                          className={`w-8 h-8 rounded-[var(--radius-xs)] text-xs font-mono font-bold flex items-center justify-center transition-all ${
                            isActive
                              ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] shadow-sm"
                              : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input-focus)]"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePrintingPageChange(currentPrintingPage + 1)}
                    disabled={currentPrintingPage >= totalPrintingPages}
                    className={`btn btn-sm btn-secondary gap-1 !px-3 ${
                      currentPrintingPage >= totalPrintingPages
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:!bg-[var(--btn-primary-bg)] hover:!text-[var(--btn-primary-text)]"
                    }`}
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          FEATURED IT SERVICES BELOW THE PRODUCTS SECTION
          3 TIER SUBSCRIPTION / PLAN EXPERIENCE (EDITABLE BY ADMIN)
          ========================================================================= */}
      {displayTiers.length > 0 && (
        <section id="featured-web-services" className="py-24 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-app)] to-[var(--bg-secondary)] border-b border-[var(--border-subtle)] relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="storefront-container relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-extrabold text-[0.675rem] uppercase tracking-[0.14em] mb-4">
              <Zap size={13} fill="currentColor" />
              <span>Flagship IT Service & Engineering</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.04em] text-[var(--text-primary)] leading-[1.15]">
              Subscribe & Launch: 3-Tier Web Development Plans
            </h2>

            <p className="text-[0.95rem] sm:text-[1.05rem] text-[var(--text-secondary)] leading-relaxed mt-4">
              Choose your ideal web engineering tier with transparent investment in Nepali Rupees (NRs.).
              Each tier is engineered with modern full-stack performance, custom deliverables, and dedicated SLA support.
            </p>
          </div>

          {/* 3 Symmetrical Tier Subscription Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-14">
            {displayTiers.map((tier) => (
              <WebTierCard
                key={tier._id}
                tier={tier}
                onSubscribe={handleSubscribePlan}
                onWhatsApp={(title, price) => handleOpenWhatsAppTier(tier)}
              />
            ))}
          </div>

          {/* Bottom Trust & Assurance Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] m-0">
                  100% Code Ownership
                </h4>
                <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5 m-0">
                  Full IP and repository transfer upon completion.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center shrink-0 font-bold">
                <Code size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] m-0">
                  Modern MERN Engineering
                </h4>
                <p className="text-[0.75rem] text-[var(--text-muted)] mt-0.5 m-0">
                  React, Node.js, MongoDB & Tailwind CSS architecture.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-end gap-3">
              <button
                onClick={() => {
                  onNavigate("services");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-secondary btn-sm gap-1.5 !rounded-full"
              >
                <span>Explore All IT Capabilities</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>
      )}


      {/* =========================================================================
          OTHER IT DISCIPLINES & CAPABILITIES SECTION AT THE BOTTOM
          ========================================================================= */}
      {otherItServices.length > 0 && (
        <section id="it-disciplines-section" className="py-22 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]">
          <div className="storefront-container">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Specialized Engineering
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
                  Other IT Disciplines & Capabilities
                </h2>
                <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[620px]">
                  Explore our non-web software engineering practices: mobile applications, UI/UX design systems, cloud architecture, cybersecurity, and AI automation.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate("services");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="btn btn-secondary gap-1.5 self-start md:self-auto"
              >
                <span>Explore All Services</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Grid of Other IT Services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherItServices.map((service) => {
                const regPrice = Number(service.price) || 0;
                const discPrice = Number(service.discountPrice) || 0;
                const hasDiscount = Boolean(discPrice > 0 && discPrice < regPrice);
                const discountPercent = hasDiscount
                  ? Math.round(((regPrice - discPrice) / regPrice) * 100)
                  : 0;
                const activePrice = hasDiscount ? discPrice : regPrice;

                return (
                  <div
                    key={service._id}
                    className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] rounded-[var(--radius-md)] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-[var(--shadow-md)] group"
                  >
                    {/* Top image or banner if available */}
                    {service.bannerImage && (
                      <div className="h-36 relative overflow-hidden bg-[var(--bg-sidebar)]">
                        <img
                          src={getOptimizedImageUrl(service.bannerImage, { width: 800 })}
                          alt={service.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          <span className="badge badge-dark text-[0.625rem]">
                            {service.category}
                          </span>
                          {hasDiscount && (
                            <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] px-1.5 py-0.5 shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        {service.isFeatured && (
                          <div className="absolute top-3 right-3">
                            <span className="badge badge-white text-[0.6rem] gap-1">
                              <Star size={10} fill="currentColor" />
                              <span>Featured</span>
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Body Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3">
                      {!service.bannerImage && (
                        <div className="flex justify-between items-center">
                          <div className="w-9 h-9 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] text-[var(--text-primary)] flex items-center justify-center">
                            {getServiceIcon(service.icon, 18)}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {hasDiscount && (
                              <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] px-1.5 py-0.5 shadow-sm">
                                {discountPercent}% OFF
                              </span>
                            )}
                            <span className="badge badge-neutral text-[0.625rem]">
                              {service.category}
                            </span>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] m-0 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed mt-2 line-clamp-2">
                          {service.shortDescription}
                        </p>
                      </div>

                      {/* Pricing in NPr & Delivery Time */}
                      <div className="pt-2 flex justify-between items-baseline border-t border-[var(--border-subtle)] mt-auto">
                        <div>
                          <span className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider block">
                            {service.priceType === "hourly"
                              ? "Hourly Rate"
                              : service.priceType === "fixed"
                              ? "Fixed Investment"
                              : "Starting From"}
                          </span>
                          <div className="flex items-baseline gap-1.5">
                            <span className={`font-mono text-base font-bold ${hasDiscount ? "text-emerald-400" : "text-[var(--text-primary)]"}`}>
                              NRs. {activePrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                                NRs. {regPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider block">
                            Timeline
                          </span>
                          <span className="text-xs text-[var(--text-secondary)] font-mono">
                            {service.deliveryTime || "1-2 Weeks"}
                          </span>
                        </div>
                      </div>

                      {/* Features Snippet (Top 3) */}
                      {service.features && service.features.length > 0 && (
                        <div className="flex flex-col gap-1.5 pt-2">
                          {service.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                              <CheckCircle2 size={12} className="text-white shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]">
                        <button
                          onClick={() => setSelectedServiceDetail(service)}
                          className="btn btn-secondary btn-sm text-[0.75rem]"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            if (onInquireService) {
                              onInquireService({
                                name: service.title,
                                indicativePrice: activePrice,
                                type: "service",
                                category: service.category,
                                description: service.shortDescription || service.description,
                              });
                            }
                          }}
                          className="btn btn-primary btn-sm text-[0.75rem]"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Ending Action Strip */}
      <section className="py-20 text-center bg-[var(--bg-app)]">
        <div className="storefront-container max-w-[680px] mx-auto">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em]">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2.5 leading-relaxed">
            Browse our stationery and desk accessories or connect with our team for custom software and IT services.
          </p>
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            <button onClick={() => onNavigate("products")} className="btn btn-primary gap-1.5">
              <span>Explore Products</span>
              <ArrowRight size={14} />
            </button>
            <button onClick={() => onNavigate("services")} className="btn btn-secondary gap-1.5">
              <span>View IT Services</span>
              <ArrowRight size={14} />
            </button>
            <button onClick={() => onNavigate("contact")} className="btn btn-ghost">
              Contact Studio
            </button>
          </div>
        </div>
      </section>

      {/* Service Detail Modal (Full Scope Popup) */}
      {selectedServiceDetail && (
        <div className="modal-overlay" onClick={() => setSelectedServiceDetail(null)}>
          <div
            className="modal-card max-w-[680px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[var(--bg-elevated)] flex items-center justify-center">
                  {getServiceIcon(selectedServiceDetail.icon, 16)}
                </div>
                <div>
                  <h3 className="text-base font-bold m-0">{selectedServiceDetail.title}</h3>
                  <span className="badge badge-neutral text-[0.6rem] mt-0.5">
                    {selectedServiceDetail.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedServiceDetail(null)}
                className="btn-icon btn-ghost"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body flex flex-col gap-5">
              {selectedServiceDetail.bannerImage && (
                <img
                  src={selectedServiceDetail.bannerImage}
                  alt={selectedServiceDetail.title}
                  className="w-full h-44 object-cover rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
                />
              )}

              {/* Price & Timeline Bar */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Investment
                  </span>
                  {selectedServiceDetail.discountPrice &&
                  Number(selectedServiceDetail.discountPrice) > 0 &&
                  Number(selectedServiceDetail.discountPrice) < Number(selectedServiceDetail.price) ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl font-extrabold text-emerald-400">
                        NRs. {Number(selectedServiceDetail.discountPrice).toLocaleString()}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                        NRs. {Number(selectedServiceDetail.price).toLocaleString()}
                      </span>
                      <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.6rem] px-1.5 py-0.2 shadow-sm">
                        {Math.round(
                          ((Number(selectedServiceDetail.price) - Number(selectedServiceDetail.discountPrice)) /
                            Number(selectedServiceDetail.price)) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xl font-extrabold text-[var(--text-primary)]">
                      NRs. {Number(selectedServiceDetail.price).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Estimated Delivery
                  </span>
                  <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold">
                    {selectedServiceDetail.deliveryTime || "1-2 Weeks"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Detailed Overview
                </h4>
                <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed m-0 whitespace-pre-line">
                  {selectedServiceDetail.description || selectedServiceDetail.shortDescription}
                </p>
              </div>

              {/* Deliverables List */}
              {selectedServiceDetail.features && selectedServiceDetail.features.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Scope of Deliverables
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedServiceDetail.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded bg-[var(--bg-elevated)] text-xs text-[var(--text-primary)]"
                      >
                        <CheckCircle2 size={13} className="text-white shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {selectedServiceDetail.technologies && selectedServiceDetail.technologies.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Technology & Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServiceDetail.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[0.7rem] font-mono px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={() => handleOpenWhatsAppService(selectedServiceDetail.title, selectedServiceDetail.price)}
                className="btn btn-secondary btn-sm gap-1.5"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => {
                  const s = selectedServiceDetail;
                  setSelectedServiceDetail(null);
                  if (onInquireService) {
                    onInquireService({
                      name: s.title,
                      indicativePrice: s.price,
                      type: "service",
                      category: s.category,
                      description: s.shortDescription || s.description,
                    });
                  }
                }}
                className="btn btn-primary btn-sm gap-1.5"
              >
                <span>Inquire Service Now</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printing Service Detail Full Modal */}
      {selectedPrintingDetail && (
        <div className="modal-overlay" onClick={() => setSelectedPrintingDetail(null)}>
          <div className="modal-card max-w-[680px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[var(--bg-elevated)] flex items-center justify-center">
                  <Printer size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold m-0">{selectedPrintingDetail.name}</h3>
                  <span className="badge badge-neutral text-[0.6rem] mt-0.5">
                    {selectedPrintingDetail.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrintingDetail(null)}
                className="btn-icon btn-ghost"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body flex flex-col gap-5">
              {selectedPrintingDetail.images && selectedPrintingDetail.images[0] && (
                <img
                  src={getOptimizedImageUrl(selectedPrintingDetail.images[0], { width: 800 })}
                  alt={selectedPrintingDetail.name}
                  className="w-full h-48 object-cover rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
                />
              )}

              {/* Price & Turnaround Bar */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Investment ({selectedPrintingDetail.priceUnit || "per piece"})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-extrabold text-[var(--text-primary)]">
                      NRs.{" "}
                      {(
                        selectedPrintingDetail.discountPrice && Number(selectedPrintingDetail.discountPrice) > 0
                          ? Number(selectedPrintingDetail.discountPrice)
                          : Number(selectedPrintingDetail.indicativePrice)
                      ).toLocaleString()}
                    </span>
                    {selectedPrintingDetail.discountPrice && Number(selectedPrintingDetail.discountPrice) > 0 && (
                      <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                        NRs. {Number(selectedPrintingDetail.indicativePrice).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Production Timeline
                  </span>
                  <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold flex items-center gap-1">
                    <Clock size={12} />
                    <span>{selectedPrintingDetail.turnaroundTime || "24-48 Hours"}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Detailed Overview
                </h4>
                <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed m-0 whitespace-pre-line">
                  {selectedPrintingDetail.description || selectedPrintingDetail.shortDescription}
                </p>
              </div>

              {/* Paper & Finish Options */}
              {selectedPrintingDetail.paperOptions && selectedPrintingDetail.paperOptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Available Substrates & Paper Media
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPrintingDetail.paperOptions.map((paper, idx) => (
                      <span
                        key={idx}
                        className="text-[0.725rem] px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      >
                        {paper}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPrintingDetail.finishOptions && selectedPrintingDetail.finishOptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Finishing & Embellishment Options
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPrintingDetail.finishOptions.map((finish, idx) => (
                      <span
                        key={idx}
                        className="text-[0.725rem] px-2.5 py-1 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications Table */}
              {selectedPrintingDetail.specs && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedPrintingDetail.specs.paperGsm && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Weight / GSM:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedPrintingDetail.specs.paperGsm}</span>
                      </div>
                    )}
                    {selectedPrintingDetail.specs.printTechnology && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Technology:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedPrintingDetail.specs.printTechnology}</span>
                      </div>
                    )}
                    {selectedPrintingDetail.specs.maxResolution && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Resolution:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedPrintingDetail.specs.maxResolution}</span>
                      </div>
                    )}
                    {selectedPrintingDetail.specs.binding && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Binding / Finish:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedPrintingDetail.specs.binding}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() =>
                  handleOpenWhatsAppPrinting(
                    selectedPrintingDetail.name,
                    selectedPrintingDetail.discountPrice || selectedPrintingDetail.indicativePrice,
                    selectedPrintingDetail.priceUnit
                  )
                }
                className="btn btn-secondary btn-sm gap-1.5"
              >
                <MessageCircle size={14} />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => {
                  const s = selectedPrintingDetail;
                  setSelectedPrintingDetail(null);
                  const handler = onInquirePrinting || onInquireProduct;
                  if (handler) {
                    handler({
                      name: s.name,
                      indicativePrice:
                        s.discountPrice && Number(s.discountPrice) > 0
                          ? Number(s.discountPrice)
                          : Number(s.indicativePrice),
                      type: "service",
                      category: s.category || "Printing Service",
                      description: s.shortDescription || s.description,
                    });
                  }
                }}
                className="btn btn-primary btn-sm gap-1.5"
              >
                <span>Inquire Service Now</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

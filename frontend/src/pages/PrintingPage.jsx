import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Printer,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  X,
  MessageCircle,
  ShieldCheck,
  Layers,
  FileText,
  Palette,
  Compass,
  Star,
  Info,
  ChevronLeft,
  ChevronRight,
  Share2,
} from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { CategoryDropdown } from "../components/common/CategoryDropdown";
import { PrintingCard } from "../components/storefront/PrintingCard";
import { ShareModal } from "../components/common/ShareModal";
import { api } from "../services/api";

export function PrintingPage({
  printingServices = [],
  printingCategories = [],
  initialPrintingSlugOrId: propPrintingIdOrSlug,
  onInquirePrinting,
  onNavigate,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const printingIdOrSlug = propPrintingIdOrSlug || params?.idOrSlug || params?.slug || params?.id;

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [sharePrintingModalOpen, setSharePrintingModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Sync printing service detail from URL
  useEffect(() => {
    if (printingIdOrSlug) {
      const found = (printingServices || []).find(
        (s) => s._id === printingIdOrSlug || s.slug === printingIdOrSlug
      );
      if (found) {
        setSelectedServiceDetail(found);
      } else {
        let isMounted = true;
        api.getPrintingServiceById(printingIdOrSlug).then((res) => {
          if (isMounted && res && (res.printingService || res.service)) {
            setSelectedServiceDetail(res.printingService || res.service);
          }
        }).catch(() => {});
        return () => {
          isMounted = false;
        };
      }
    }
  }, [printingIdOrSlug, printingServices]);

  const handleCloseDetail = () => {
    setSelectedServiceDetail(null);
    if (printingIdOrSlug) {
      navigate("/printing", { replace: true });
    }
  };

  const handleViewPrinting = (service) => {
    setSelectedServiceDetail(service);
    navigate(`/printing/${service.slug || service._id}`);
  };

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  // Derive unique categories dynamically
  const allCategories = Array.from(
    new Set([
      ...(printingCategories || []).map((c) => (typeof c === "string" ? c : c.name)),
      ...printingServices.map((s) => s.category).filter(Boolean),
    ])
  );

  const filteredServices = printingServices.filter((s) => {
    if (!s.isAvailable && s.isAvailable !== undefined) return false;

    // Category filter
    if (selectedCategory !== "All" && s.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = s.name?.toLowerCase().includes(q);
      const matchDesc = s.description?.toLowerCase().includes(q) || s.shortDescription?.toLowerCase().includes(q);
      const matchCat = s.category?.toLowerCase().includes(q);
      const matchPaper = s.paperOptions?.some((p) => p.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchPaper) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE) || 1;
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById("printing-catalog-grid");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const handleOpenWhatsApp = (title, price, priceUnit) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect! I am interested in inquiring about your "${title}" printing service (${price ? `NRs. ${Number(price).toLocaleString()} ${priceUnit || ""}` : "Custom Quote"}). Could you please guide me on file preparation and turnaround?`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  const handleInquire = (service) => {
    if (onInquirePrinting) {
      onInquirePrinting({
        name: service.name,
        indicativePrice: service.discountPrice && Number(service.discountPrice) > 0 ? service.discountPrice : service.indicativePrice,
        type: "service",
        category: service.category || "Printing Service",
        description: `Inquiry for ${service.name} (${service.priceUnit || "per page"}). Estimated turnaround: ${service.turnaroundTime || "24-48 Hours"}.`,
      });
    }
  };

  return (
    <div className="py-14 sm:py-18 pb-28">
      <div className="storefront-container">
        {/* =========================================================================
            HEADER INTRO SECTION
            ========================================================================= */}
        <div className="text-center max-w-[840px] mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[0.725rem] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)] mb-4">
            <Printer size={14} />
            <span>Commercial & Custom Printing Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.12] text-[var(--text-primary)]">
            Professional Printing & Production
          </h1>

          <p className="text-[0.975rem] sm:text-[1.075rem] text-[var(--text-secondary)] leading-relaxed mt-4 max-w-[720px] mx-auto">
            High-resolution photo prints, architectural blueprints, hardcover bookbinding, document copies,
            and custom packaging in Nepal.
          </p>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[var(--border-subtle)] text-left">
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Media</span>
              <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">100% Cotton Rag & Munken</span>
            </div>
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Inks</span>
              <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">12-Color Lucia PRO Pigment</span>
            </div>
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Turnaround</span>
              <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">Same-Day & 24h Options</span>
            </div>
            <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider block">Longevity</span>
              <span className="text-xs font-bold text-[var(--text-primary)] mt-0.5 block">100+ Year Museum Archival</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FILTERING & SEARCH TOOLBAR
            ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--border-subtle)] pb-6">
          <div>
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Print Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] mt-1 text-[var(--text-primary)]">
              Explore Printing Capabilities
            </h2>
            <p className="text-[0.875rem] text-[var(--text-secondary)] mt-1 max-w-[560px]">
              Select a category or search by print media, resolution, paper type, or application.
            </p>
          </div>

          {/* Search & Category Dropdown */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative w-full sm:w-64">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                placeholder="Search photo prints, blueprints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input !pl-8.5 !pr-8 text-xs py-2 bg-[var(--bg-input)] rounded-[var(--radius-xs)] border border-[var(--border-subtle)] focus:border-[var(--border-bright)]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <CategoryDropdown
              categories={allCategories.map((cat) => ({
                id: cat,
                name: cat,
                count: printingServices.filter((s) => s.category === cat && s.isAvailable !== false).length,
              }))}
              selectedCategory={selectedCategory}
              onSelectCategory={(catName) => setSelectedCategory(catName)}
              totalCount={printingServices.filter((s) => s.isAvailable !== false).length}
              label="Discipline"
              allLabel="All Categories"
            />
          </div>
        </div>

        {/* =========================================================================
            PRINTING SERVICES GRID
            ========================================================================= */}
        <div id="printing-catalog-grid">
          {filteredServices.length === 0 ? (
            <div className="p-18 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)]">
              <Printer size={36} className="text-[var(--text-muted)] mb-3 mx-auto" />
              <h3 className="text-lg font-bold">No printing services found</h3>
              <p className="text-[var(--text-muted)] text-[0.85rem] mt-1">
                Try selecting a different category or resetting your search filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="btn btn-secondary btn-sm mt-4"
              >
                View All Services
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
                {paginatedServices.map((service) => (
                  <PrintingCard
                    key={service._id}
                    service={service}
                    onViewDetails={(s) => handleViewPrinting(s)}
                    onInquire={(s) => handleInquire(s)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-[var(--border-subtle)]">
                  <span className="text-xs sm:text-sm text-[var(--text-muted)] order-2 sm:order-1">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)} of{" "}
                    <strong className="text-[var(--text-primary)]">{filteredServices.length}</strong> printing services
                  </span>

                  <div className="flex items-center gap-1.5 order-1 sm:order-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`btn-icon btn-secondary !w-9 !h-9 !rounded-full ${
                        currentPage === 1
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)]"
                      }`}
                      aria-label="Previous Page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNumber = idx + 1;
                      const isActive = currentPage === pageNumber;

                      // Compress long pagination lists
                      if (
                        totalPages > 7 &&
                        pageNumber !== 1 &&
                        pageNumber !== totalPages &&
                        Math.abs(pageNumber - currentPage) > 1
                      ) {
                        if (pageNumber === 2 || pageNumber === totalPages - 1) {
                          return (
                            <span key={pageNumber} className="text-[var(--text-muted)] px-1">
                              …
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`!w-9 !h-9 !rounded-full font-mono text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                            isActive
                              ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-bg)] shadow-sm"
                              : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-medium)] hover:bg-[var(--bg-input-focus)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className={`btn-icon btn-secondary !w-9 !h-9 !rounded-full ${
                        currentPage >= totalPages
                          ? "opacity-30 cursor-not-allowed"
                          : "cursor-pointer hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)]"
                      }`}
                      aria-label="Next Page"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* =========================================================================
            TECHNICAL PRINT & MATERIAL SPECIFICATION GUIDE
            ========================================================================= */}
        <section className="mt-24 p-8 sm:p-12 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Material Integrity & Archival Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] mt-1 text-[var(--text-primary)]">
              Printing Specifications & Quality Standards
            </h2>
            <p className="text-[0.875rem] text-[var(--text-secondary)] mt-2">
              Every print is crafted with high-quality paper, premium inks, and calibrated color workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <Layers size={17} />
              </div>
              <h4 className="text-sm font-bold m-0">Swedish Munken & Cotton Rag</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                120 to 310 GSM archival substrates free of optical brightening agents (OBAs) to prevent yellowing.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <Palette size={17} />
              </div>
              <h4 className="text-sm font-bold m-0">12-Color Pigment Lucia PRO</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Micro-encapsulated pigment inks offering extreme color gamut, deep dMax blacks, and 100+ year longevity.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <Sparkles size={17} />
              </div>
              <h4 className="text-sm font-bold m-0">Metallic Foil & Blind Deboss</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Cast-brass heated dies stamping metallic foils (Gold, Silver, Copper, Holographic) with tactile depth.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
                <ShieldCheck size={17} />
              </div>
              <h4 className="text-sm font-bold m-0">Calibrated ICC Color Proofs</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Spectrophotometer color calibration ensuring that what you see on your monitor matches the final print.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CUSTOM CONSULTATION / FILE UPLOAD CTA
            ========================================================================= */}
        <div className="mt-20 text-center max-w-[680px] mx-auto p-8 sm:p-10 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)]">
          <h3 className="text-xl sm:text-2xl font-extrabold">Need Custom Sizing or Bulk Production?</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Have ready-to-print artwork, custom packaging templates, or large architectural blueprints? Talk directly with our master printers.
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => {
                if (onInquirePrinting) {
                  onInquirePrinting({
                    name: "Custom Print Order & File Review",
                    type: "service",
                    description: "Bespoke print run, custom paper stock inquiry, or file proofing consultation.",
                  });
                }
              }}
              className="btn btn-primary gap-2"
            >
              <span>Submit Print Inquiry</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleOpenWhatsApp("Custom Print Consultation", 0, "")}
              className="btn btn-secondary gap-2"
            >
              <MessageCircle size={15} />
              <span>WhatsApp: +977 9808950275</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SERVICE DETAIL FULL MODAL
          ========================================================================= */}
      {selectedServiceDetail && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-card max-w-[680px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[var(--bg-elevated)] flex items-center justify-center">
                  <Printer size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold m-0">{selectedServiceDetail.name}</h3>
                  <span className="badge badge-neutral text-[0.6rem] mt-0.5">
                    {selectedServiceDetail.category || "Printing Service"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSharePrintingModalOpen(true);
                  }}
                  className="btn btn-sm gap-1.5 !px-3 !py-1.5 bg-orange-500/15 border border-orange-500/40 hover:border-orange-400 text-orange-400 hover:text-orange-300 font-bold text-xs rounded-full transition-all shadow-xs"
                  title="Share this printing service"
                >
                  <Share2 size={13} className="text-orange-500" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleCloseDetail}
                  className="btn-icon btn-ghost"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="modal-body flex flex-col gap-5">
              {selectedServiceDetail.images && selectedServiceDetail.images[0] && (
                <img
                  src={getOptimizedImageUrl(selectedServiceDetail.images[0], { width: 800 })}
                  alt={selectedServiceDetail.name}
                  className="w-full h-48 object-cover rounded-[var(--radius-sm)] border border-[var(--border-subtle)]"
                />
              )}

              {/* Price & Turnaround Bar */}
              <div className="p-3.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Investment ({selectedServiceDetail.priceUnit || "per piece"})
                  </span>
                  {selectedServiceDetail.discountPrice &&
                  Number(selectedServiceDetail.discountPrice) > 0 &&
                  Number(selectedServiceDetail.discountPrice) < Number(selectedServiceDetail.indicativePrice) ? (
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-mono text-xl font-extrabold text-emerald-400">
                        NRs. {Number(selectedServiceDetail.discountPrice).toLocaleString()}
                      </span>
                      <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                        NRs. {Number(selectedServiceDetail.indicativePrice).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-xl font-extrabold text-[var(--text-primary)]">
                      NRs. {Number(selectedServiceDetail.indicativePrice).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[0.65rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                    Production Timeline
                  </span>
                  <span className="text-xs font-mono text-[var(--text-secondary)] font-semibold flex items-center gap-1">
                    <Clock size={12} />
                    <span>{selectedServiceDetail.turnaroundTime || "24-48 Hours"}</span>
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

              {/* Paper & Finish Options */}
              {selectedServiceDetail.paperOptions && selectedServiceDetail.paperOptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Available Substrates & Paper Media
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServiceDetail.paperOptions.map((paper, idx) => (
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

              {selectedServiceDetail.finishOptions && selectedServiceDetail.finishOptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Finishing & Embellishment Options
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServiceDetail.finishOptions.map((finish, idx) => (
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
              {selectedServiceDetail.specs && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedServiceDetail.specs.paperGsm && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Weight / GSM:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedServiceDetail.specs.paperGsm}</span>
                      </div>
                    )}
                    {selectedServiceDetail.specs.printTechnology && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Technology:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedServiceDetail.specs.printTechnology}</span>
                      </div>
                    )}
                    {selectedServiceDetail.specs.maxResolution && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Resolution:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedServiceDetail.specs.maxResolution}</span>
                      </div>
                    )}
                    {selectedServiceDetail.specs.binding && (
                      <div className="p-2 rounded bg-[var(--bg-elevated)] flex justify-between">
                        <span className="text-[var(--text-muted)]">Binding / Finish:</span>
                        <span className="font-semibold text-[var(--text-primary)]">{selectedServiceDetail.specs.binding}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSharePrintingModalOpen(true);
                  }}
                  className="btn btn-sm gap-2 !px-3.5 !py-2 bg-orange-500/15 border border-orange-500/40 hover:border-orange-400 text-orange-400 hover:text-orange-300 font-bold transition-all shadow-xs"
                  title="Share this printing service"
                >
                  <Share2 size={14} className="text-orange-500" />
                  <span>Share Specs</span>
                </button>
                <button
                  onClick={() =>
                    handleOpenWhatsApp(
                      selectedServiceDetail.name,
                      selectedServiceDetail.discountPrice || selectedServiceDetail.indicativePrice,
                      selectedServiceDetail.priceUnit
                    )
                  }
                  className="btn btn-secondary btn-sm gap-1.5"
                >
                  <MessageCircle size={14} />
                  <span>WhatsApp</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const s = selectedServiceDetail;
                  handleCloseDetail();
                  handleInquire(s);
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

      {/* Printing Service Share Modal */}
      {selectedServiceDetail && (
        <ShareModal
          isOpen={sharePrintingModalOpen}
          onClose={() => setSharePrintingModalOpen(false)}
          title={selectedServiceDetail.name}
          url={`/printing/${selectedServiceDetail.slug || selectedServiceDetail._id}`}
          description={selectedServiceDetail.shortDescription || selectedServiceDetail.description}
          image={selectedServiceDetail.images && selectedServiceDetail.images.length > 0 ? selectedServiceDetail.images[0] : ""}
          price={selectedServiceDetail.discountPrice || selectedServiceDetail.indicativePrice}
          category={selectedServiceDetail.category || "Printing Service"}
        />
      )}
    </div>
  );
}

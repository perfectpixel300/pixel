import React, { useState } from "react";
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
} from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";

const DEFAULT_PRINTING_CATEGORIES = [
  "Fine Art & Giclée",
  "Technical & CAD",
  "Document & Bookbinding",
  "Large Format & Signage",
  "Commercial & Corporate",
  "Packaging & Labels",
];

export function PrintingPage({
  printingServices = [],
  onInquirePrinting,
  onNavigate,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);

  // Derive unique categories
  const allCategories = Array.from(
    new Set([
      ...DEFAULT_PRINTING_CATEGORIES,
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

  const handleOpenWhatsApp = (title, price, priceUnit) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect Atelier! I am interested in inquiring about your "${title}" printing service (${price ? `NRs. ${Number(price).toLocaleString()} ${priceUnit || ""}` : "Custom Quote"}). Could you please guide me on file preparation and turnaround?`
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
        description: `Inquiry for ${service.name} (${service.priceUnit || "per piece"}). Estimated turnaround: ${service.turnaroundTime || "24-48 Hours"}.`,
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
            <span>Fine Art & Commercial Printing Atelier</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] leading-[1.12] text-[var(--text-primary)]">
            Precision Printmaking & Archival Production
          </h1>

          <p className="text-[0.975rem] sm:text-[1.075rem] text-[var(--text-secondary)] leading-relaxed mt-4 max-w-[720px] mx-auto">
            Museum-grade 12-color giclée reproductions, precision CAD architectural blueprints, heated foil-stamped
            hardcover binding, and luxury packaging — engineered with tactile permanence in Nepal.
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
              Select a discipline or search by print media, resolution, paper GSM, or application.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search giclée, blueprints, foil, boxes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-9.5 !pr-8 text-xs py-2.5 bg-[var(--bg-input)] rounded-full border border-[var(--border-subtle)] focus:border-[var(--border-bright)]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-10 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`btn btn-sm !rounded-full whitespace-nowrap ${
              selectedCategory === "All" ? "btn-primary" : "btn-secondary"
            }`}
          >
            All Services ({printingServices.length})
          </button>

          {allCategories.map((cat) => {
            const count = printingServices.filter((s) => s.category === cat && s.isAvailable !== false).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm !rounded-full whitespace-nowrap ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span>{cat}</span>
                <span className="opacity-65 text-[0.675rem]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            PRINTING SERVICES GRID
            ========================================================================= */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredServices.map((service) => {
              const rawImg = service.images && service.images[0] ? service.images[0] : "";
              const img = getOptimizedImageUrl(rawImg, { width: 800 });
              const hasDiscount =
                service.discountPrice &&
                Number(service.discountPrice) > 0 &&
                Number(service.discountPrice) < Number(service.indicativePrice);
              const activePrice = hasDiscount ? Number(service.discountPrice) : Number(service.indicativePrice);

              return (
                <div
                  key={service._id}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[var(--shadow-xl)] group"
                >
                  {/* Top Image Preview with Badges */}
                  <div className="h-52 relative overflow-hidden bg-[var(--bg-sidebar)] flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={service.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <Printer size={40} className="text-[var(--text-muted)] opacity-30" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/30 to-transparent opacity-80" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                      <span className="badge badge-dark text-[0.625rem] bg-black/80 backdrop-blur-xs">
                        {service.category}
                      </span>
                      {hasDiscount && (
                        <span className="badge badge-emerald bg-emerald-500 text-white text-[0.6rem] font-bold">
                          SPECIAL
                        </span>
                      )}
                    </div>

                    {service.featured && (
                      <div className="absolute top-3 right-3">
                        <span className="badge badge-white text-[0.6rem] gap-1 shadow-sm">
                          <Star size={10} fill="currentColor" />
                          <span>Featured</span>
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[0.65rem] px-2.5 py-1 rounded-[var(--radius-xs)] font-mono flex items-center gap-1.5 border border-white/10">
                      <Clock size={11} />
                      <span>{service.turnaroundTime || "24-48 Hours"}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 gap-3.5">
                    <div>
                      <h3 className="text-lg font-extrabold text-[var(--text-primary)] m-0 tracking-tight leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed mt-2 line-clamp-2">
                        {service.shortDescription || service.description}
                      </p>
                    </div>

                    {/* Price & Unit Block */}
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-baseline justify-between mt-auto">
                      <div>
                        <span className="text-[0.625rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                          Investment ({service.priceUnit || "per piece"})
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="font-mono text-xl font-extrabold text-[var(--text-primary)]">
                            NRs. {activePrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                              NRs. {Number(service.indicativePrice).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {service.minOrderQuantity && service.minOrderQuantity > 1 && (
                        <div className="text-right">
                          <span className="text-[0.625rem] text-[var(--text-muted)] uppercase font-bold tracking-wider block">
                            Min Order
                          </span>
                          <span className="text-xs font-mono font-semibold text-[var(--text-secondary)]">
                            {service.minOrderQuantity} units
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Paper & Specs Snippet */}
                    {service.specs && (service.specs.paperGsm || service.specs.printTechnology) && (
                      <div className="flex flex-col gap-1 text-xs text-[var(--text-muted)] font-mono border-t border-[var(--border-subtle)] pt-2.5">
                        {service.specs.paperGsm && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Layers size={12} className="shrink-0 text-[var(--text-primary)]" />
                            <span className="truncate">{service.specs.paperGsm}</span>
                          </div>
                        )}
                        {service.specs.printTechnology && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Printer size={12} className="shrink-0 text-[var(--text-primary)]" />
                            <span className="truncate">{service.specs.printTechnology}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                      <button
                        onClick={() => setSelectedServiceDetail(service)}
                        className="btn btn-secondary btn-sm text-[0.75rem]"
                      >
                        View Specs
                      </button>
                      <button
                        onClick={() => handleInquire(service)}
                        className="btn btn-primary btn-sm text-[0.75rem] gap-1"
                      >
                        <span>Inquire</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            TECHNICAL PRINT & MATERIAL SPECIFICATION GUIDE
            ========================================================================= */}
        <section className="mt-24 p-8 sm:p-12 rounded-[var(--radius-lg)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
          <div className="text-center max-w-[680px] mx-auto mb-12">
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Material Integrity & Archival Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] mt-1 text-[var(--text-primary)]">
              Atelier Printmaking Specifications
            </h2>
            <p className="text-[0.875rem] text-[var(--text-secondary)] mt-2">
              Every print is crafted with acid-free substrates, pigment chemistry, and calibrated color workflows.
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
        <div className="modal-overlay" onClick={() => setSelectedServiceDetail(null)}>
          <div className="modal-card max-w-[680px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[var(--bg-elevated)] flex items-center justify-center">
                  <Printer size={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold m-0">{selectedServiceDetail.name}</h3>
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
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xl font-extrabold text-[var(--text-primary)]">
                      NRs.{" "}
                      {(
                        selectedServiceDetail.discountPrice && Number(selectedServiceDetail.discountPrice) > 0
                          ? Number(selectedServiceDetail.discountPrice)
                          : Number(selectedServiceDetail.indicativePrice)
                      ).toLocaleString()}
                    </span>
                    {selectedServiceDetail.discountPrice && Number(selectedServiceDetail.discountPrice) > 0 && (
                      <span className="font-mono text-xs text-[var(--text-muted)] line-through">
                        NRs. {Number(selectedServiceDetail.indicativePrice).toLocaleString()}
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

            <div className="modal-footer">
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

              <button
                onClick={() => {
                  const s = selectedServiceDetail;
                  setSelectedServiceDetail(null);
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
    </div>
  );
}

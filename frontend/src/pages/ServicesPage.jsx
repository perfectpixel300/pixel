import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Code,
  Globe,
  Smartphone,
  Shield,
  Cloud,
  Bot,
  Palette,
  Terminal,
  Layers,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Search,
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Server,
  Star,
  ShieldCheck,
  Printer,
  Info,
  Share2,
} from "lucide-react";
import { CategoryDropdown } from "../components/common/CategoryDropdown";
import { WebTierCard } from "../components/storefront/WebTierCard";
import { DynamicPromoStrip } from "../components/storefront/DynamicPromoStrip";
import { ShareModal } from "../components/common/ShareModal";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { api } from "../services/api";

// Helper to map icon string to Lucide React component
export const getServiceIcon = (iconName, size = 20, className = "") => {
  switch (iconName?.toLowerCase()) {
    case "globe":
      return <Globe size={size} className={className} />;
    case "smartphone":
    case "mobile":
      return <Smartphone size={size} className={className} />;
    case "palette":
    case "design":
      return <Palette size={size} className={className} />;
    case "cloud":
    case "devops":
      return <Cloud size={size} className={className} />;
    case "shield":
    case "security":
      return <Shield size={size} className={className} />;
    case "bot":
    case "ai":
      return <Bot size={size} className={className} />;
    case "terminal":
    case "consulting":
      return <Terminal size={size} className={className} />;
    case "layers":
      return <Layers size={size} className={className} />;
    case "cpu":
      return <Cpu size={size} className={className} />;
    case "lock":
      return <Lock size={size} className={className} />;
    case "server":
      return <Server size={size} className={className} />;
    case "printer":
      return <Printer size={size} className={className} />;
    case "code":
    default:
      return <Code size={size} className={className} />;
  }
};

export function ServicesPage({
  services = [],
  printingServices = [],
  serviceCategories = [],
  promoBanners = [],
  initialServiceSlugOrId: propServiceIdOrSlug,
  onInquireService,
  onInquirePrinting,
  onNavigate,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceIdOrSlug = propServiceIdOrSlug || params?.idOrSlug || params?.slug || params?.id;

  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(() => categoryFromUrl || "All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceDetail, setSelectedServiceDetail] = useState(null);
  const [shareServiceModalOpen, setShareServiceModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Sync category from URL query parameter
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery) {
      if (catQuery === "Web Development") {
        setSelectedCategory("All");
        const el = document.getElementById("web-tier-pricing");
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        }
      } else {
        setSelectedCategory(catQuery);
        const el = document.getElementById("other-it-services");
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        }
      }
    } else if (!searchParams.has("category") && selectedCategory !== "All" && !serviceIdOrSlug) {
      setSelectedCategory("All");
    }
  }, [searchParams, serviceIdOrSlug]);

  // Sync service detail from URL
  useEffect(() => {
    if (serviceIdOrSlug) {
      const found = (services || []).find(
        (s) => s._id === serviceIdOrSlug || s.slug === serviceIdOrSlug
      );
      if (found) {
        setSelectedServiceDetail(found);
      } else {
        let isMounted = true;
        api.getServiceById(serviceIdOrSlug).then((res) => {
          if (isMounted && res && res.service) {
            setSelectedServiceDetail(res.service);
          }
        }).catch(() => {});
        return () => {
          isMounted = false;
        };
      }
    }
  }, [serviceIdOrSlug, services]);

  const handleCloseDetail = () => {
    setSelectedServiceDetail(null);
    if (serviceIdOrSlug) {
      navigate("/services", { replace: true });
    }
  };

  const handleViewService = (service) => {
    setSelectedServiceDetail(service);
    navigate(`/services/${service.slug || service._id}`);
  };

  // 1. Extract ONLY Web Dev 3-tier packages (Kept apart from other IT services)
  const webDevPackages = (services || [])
    .filter((s) => s.isWebDevPackage && s.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || (a.price || 0) - (b.price || 0));

  // 2. Filter ONLY Other general IT services dynamically
  const itCategories = Array.from(
    new Set([
      ...(serviceCategories || []).map((c) => (typeof c === "string" ? c : c.name)),
      ...(services || []).map((s) => s.category).filter(Boolean),
    ])
  ).filter((c) => c !== "Web Development");

  const otherItServices = services.filter((s) => {
    if (s.isWebDevPackage || !s.isActive) return false;

    // Category filter
    if (selectedCategory !== "All" && s.category !== selectedCategory) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = s.title?.toLowerCase().includes(q);
      const matchDesc = s.shortDescription?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
      const matchCat = s.category?.toLowerCase().includes(q);
      const matchTech = s.technologies?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCat && !matchTech) return false;
    }

    return true;
  });

  const faqs = [
    {
      q: "How are project milestones and payments structured in Nepali Rupees (NRs.)?",
      a: "Our standard engagement begins with an initial 40% discovery and design deposit in NRs., 30% upon beta demo review, and the remaining 30% upon final security verification, domain handover, and production deployment. We accept local bank transfers, eSewa, Khalti, and international credit cards.",
    },
    {
      q: "Can I customize the features of the 3 Web Development packages?",
      a: "Absolutely! The Starter, Professional, and Enterprise packages serve as foundational baselines. During our discovery call, we tailor features, custom API integrations, multi-language support, and payment gateways to your exact business specifications.",
    },
    {
      q: "Do you provide source code ownership and technical documentation?",
      a: "Yes. Full intellectual property and source code ownership are transferred to your organization upon project completion, along with architecture diagrams, API documentation, and admin handover sessions.",
    },
    {
      q: "What post-launch maintenance and SLA support do you provide?",
      a: "All web development packages include complimentary post-launch support (1 to 6 months depending on package). We also offer monthly retainer packages covering 24/7 uptime monitoring, automated cloud backups, security patches, and on-demand feature iterations.",
    },
  ];

  const handleSubscribePlan = (pkg) => {
    if (onInquireService) {
      onInquireService({
        name: `${pkg.title} (Web Development Plan)`,
        indicativePrice: pkg.price,
        tier: pkg.packageTier,
        type: "service",
        category: "Web Development",
        description: pkg.shortDescription,
      });
    }
  };

  const handleOpenWhatsApp = (title, price) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect Team! I am interested in inquiring about your "${title}" service (Priced at NRs. ${Number(price).toLocaleString()}). Could you please share more details?`
    );
    window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
  };

  return (
    <div>
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

      <div className="py-14 sm:py-18 pb-28">
        <div className="storefront-container">
        {/* =========================================================================
            HEADER INTRO SECTION
            ========================================================================= */}
        <div className="text-center max-w-[820px] mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[0.725rem] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)] mb-4">
            <Sparkles size={13} />
            <span>Digital Engineering & IT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] leading-[1.15] text-[var(--text-primary)]">
            High-Performance IT Services & Custom Web Solutions
          </h1>

          <p className="text-[0.975rem] sm:text-[1.05rem] text-[var(--text-secondary)] leading-relaxed mt-4">
            From modern responsive web applications and full-stack MERN platforms to cloud DevOps,
            cybersecurity audits, and mobile apps — engineered with precision in Nepal for ambitious global brands.
          </p>

          <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
            <a
              href="#web-development-plans"
              className="btn btn-primary btn-sm gap-1.5 !rounded-full px-5 py-2.5"
            >
              <span>Featured Web Development Plans</span>
              <ArrowRight size={14} />
            </a>
            <a
              href="#other-it-services"
              className="btn btn-secondary btn-sm !rounded-full px-5 py-2.5"
            >
              Other IT Capabilities
            </a>
          </div>
        </div>

        {/* =========================================================================
            1. FEATURED WEB DEVELOPMENT 3-TIER SUBSCRIPTION / PLANS SECTION
            (KEPT DISTINCT AND APART AT THE TOP)
            ========================================================================= */}
        <section id="web-development-plans" className="mb-24 scroll-mt-24">
          <div className="relative rounded-[var(--radius-lg)] border-2 border-white/20 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-secondary)] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[var(--shadow-xl)]">
            {/* Ambient background decoration */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            {/* Spotlight Header */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-black font-extrabold text-[0.675rem] uppercase tracking-wider mb-3">
                  <Zap size={13} fill="currentColor" />
                  <span>Flagship 3-Tier Web Architecture</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-tight text-[var(--text-primary)]">
                  Subscribe & Launch: Custom Web Development Plans
                </h2>
                <p className="text-[0.925rem] text-[var(--text-secondary)] mt-2 max-w-[660px]">
                  Choose from our 3 transparent, outcome-oriented web tiers priced in Nepali Rupees (NRs.).
                  Engineered with React, Next.js, Node.js, Tailwind CSS, and Nepali payment integrations.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleOpenWhatsApp("Custom Web Development", 55000)}
                  className="btn btn-secondary btn-sm gap-2 !rounded-full"
                >
                  <MessageCircle size={15} />
                  <span>Quick WhatsApp Call</span>
                </button>
              </div>
            </div>

            {/* 3 Symmetrical Categories / Tiers Pricing Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10 relative z-10 items-stretch">
              {webDevPackages.map((pkg) => (
                <WebTierCard
                  key={pkg._id}
                  tier={pkg}
                  onSubscribe={handleSubscribePlan}
                  onWhatsApp={(title, price) => handleOpenWhatsApp(title, price)}
                />
              ))}
            </div>

            {/* Custom Scope Footer Banner */}
            <div className="mt-10 p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold shrink-0">
                  <Code size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold m-0">Need a Bespoke Architecture or Custom Web Service?</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 m-0">
                    We architect custom multi-tenant platforms, APIs, and microservices tailored for unique engineering requirements.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onInquireService) {
                    onInquireService({
                      name: "Custom Enterprise Web Architecture",
                      indicativePrice: 150000,
                      type: "service",
                      category: "Web Development",
                      description: "Bespoke engineering consultation for custom platform.",
                    });
                  }
                }}
                className="btn btn-secondary btn-sm whitespace-nowrap"
              >
                Request Custom Quote
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. OTHER IT DISCIPLINES & SERVICES DIRECTORY
            (KEPT DISTINCT AND APART FROM THE 3 WEB DEV TIERS)
            ========================================================================= */}
        <section id="other-it-services" className="scroll-mt-24 mb-24">
          {/* Section Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-[var(--border-subtle)] pb-6">
            <div>
              <span className="text-[0.725rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Specialized Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] mt-1 text-[var(--text-primary)]">
                Other IT Disciplines & Capabilities
              </h2>
              <p className="text-[0.875rem] text-[var(--text-secondary)] mt-1 max-w-[560px]">
                Explore our non-web software engineering practices: mobile applications, UI/UX design systems, cloud architecture, cybersecurity, and AI automation.
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
                  placeholder="Search mobile, cloud, AI, security..."
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
                categories={itCategories.map((cat) => ({
                  id: cat,
                  name: cat,
                  count: services.filter((s) => s.category === cat && !s.isWebDevPackage && s.isActive).length,
                }))}
                selectedCategory={selectedCategory}
                onSelectCategory={(catName) => setSelectedCategory(catName)}
                totalCount={services.filter((s) => !s.isWebDevPackage && s.isActive).length}
                label="IT Discipline"
                allLabel="All IT Disciplines"
              />
            </div>
          </div>

          {/* Other IT Services Grid */}
          {otherItServices.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)]">
              <Terminal size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
              <h3 className="text-base font-bold">No IT services match your filter</h3>
              <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
                Try selecting a different category or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                }}
                className="btn btn-secondary btn-sm mt-4"
              >
Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherItServices.map((service) => {
                const hasDiscount =
                  service.discountPrice &&
                  Number(service.discountPrice) > 0 &&
                  Number(service.discountPrice) < Number(service.price);
                const discountPercent = hasDiscount
                  ? Math.round(((Number(service.price) - Number(service.discountPrice)) / Number(service.price)) * 100)
                  : 0;
                const activePrice = hasDiscount ? Number(service.discountPrice) : Number(service.price);

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
                                NRs. {Number(service.price).toLocaleString()}
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
                          onClick={() => handleViewService(service)}
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
                                category: service.category || "IT Service",
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
          )}
        </section>

        {/* =========================================================================
            HOW WE ENGAGE / ENGINEERING PROCESS
            ========================================================================= */}
        <section className="py-16 border-t border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-[var(--radius-lg)] p-8 sm:p-12 mb-24">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              Workflow & SLA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] mt-1 text-[var(--text-primary)]">
              Our 4-Phase Delivery Process
            </h2>
            <p className="text-[0.875rem] text-[var(--text-secondary)] mt-2">
              Iterative, transparent, and structured around your project deadlines and business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">01</span>
              <h4 className="text-sm font-bold m-0">Discovery & Spec</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Detailed architecture analysis, user journey wireframing, and milestone scoping in NRs.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">02</span>
              <h4 className="text-sm font-bold m-0">Sprint Engineering</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Clean full-stack implementation with React, Node.js, and CI/CD automated test builds.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">03</span>
              <h4 className="text-sm font-bold m-0">QA & Security Audit</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Rigorous cross-device testing, payment gateway validation (eSewa/Khalti), and OWASP security audit.
              </p>
            </div>

            <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col gap-2">
              <span className="font-mono text-2xl font-extrabold text-white">04</span>
              <h4 className="text-sm font-bold m-0">Launch & SLA Support</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0">
                Zero-downtime production deployment, SSL certificate hardening, and ongoing maintenance SLA.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            FAQS ACCORDION
            ========================================================================= */}
        <section className="max-w-[760px] mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Everything you need to know about our IT contracting and web development delivery.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 flex justify-between items-center bg-transparent border-0 text-[var(--text-primary)] font-semibold text-[0.875rem] text-left cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-[var(--text-secondary)] text-[0.825rem] leading-relaxed border-t border-[var(--border-subtle)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            BOTTOM CTA BANNER
            ========================================================================= */}
        <div className="text-center max-w-[640px] mx-auto p-8 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)]">
          <h3 className="text-xl sm:text-2xl font-extrabold">Ready to Architect Your Digital Solution?</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2">
            Schedule a technical consultation with our engineering leads to review your requirements and obtain a detailed proposal.
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <button
              onClick={() => {
                if (onInquireService) {
                  onInquireService({
                    name: "General IT & Web Consulting",
                    type: "service",
                    description: "Initial discovery and technical consultation.",
                  });
                }
              }}
              className="btn btn-primary gap-2"
            >
              <span>Submit Project Inquiry</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleOpenWhatsApp("General IT Project Consultation", 0)}
              className="btn btn-secondary gap-2"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Us: +977 9808950275</span>
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* =========================================================================
          SERVICE DETAIL MODAL (FULL SCOPE VIEW)
          ========================================================================= */}
      {selectedServiceDetail && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
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
                onClick={handleCloseDetail}
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

              {/* Scope of Deliverables */}
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

              {/* Tech Stack */}
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
            <div className="modal-footer flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareServiceModalOpen(true);
                  }}
                  className="btn btn-sm gap-2 !px-3.5 !py-2 bg-emerald-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-bold transition-all shadow-xs"
                  title="Share with Friends"
                >
                  <Share2 size={14} className="text-emerald-400" />
                  <span>Share with Friends</span>
                </button>
                <button
                  onClick={() => handleOpenWhatsApp(selectedServiceDetail.title, selectedServiceDetail.price)}
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
                  handleSubscribePlan(s);
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

      {/* Service Detail Share Modal */}
      {selectedServiceDetail && (
        <ShareModal
          isOpen={shareServiceModalOpen}
          onClose={() => setShareServiceModalOpen(false)}
          title={selectedServiceDetail.title}
          url={`/services/${selectedServiceDetail.slug || selectedServiceDetail._id}`}
          description={selectedServiceDetail.shortDescription || selectedServiceDetail.description}
          image={selectedServiceDetail.bannerImage || ""}
          price={selectedServiceDetail.price}
          category={selectedServiceDetail.category}
        />
      )}
    </div>
  );
}

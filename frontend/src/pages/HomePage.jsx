import React from "react";
import {
  ArrowRight,
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
} from "lucide-react";
import { HeroBannerCarousel } from "../components/storefront/HeroBannerCarousel";
import { FeaturedSection } from "../components/storefront/FeaturedSection";
import { CategoryGrid } from "../components/storefront/CategoryGrid";

export function HomePage({
  banners,
  products,
  categories = [],
  services = [],
  onViewProduct,
  onInquireProduct,
  onInquireService,
  onNavigate,
  onSelectCategory,
}) {
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
    onNavigate("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get the 3 Web Dev subscription tiers (ordered)
  const webDevTiers = services
    .filter((s) => s.isWebDevPackage && s.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || (a.price || 0) - (b.price || 0));

  // Fallback default tiers if services haven't loaded yet
  const displayTiers =
    webDevTiers.length > 0
      ? webDevTiers
      : [
          {
            _id: "default-starter",
            title: "Starter Web Presence",
            packageTier: "starter",
            tierBadge: "Essential Tier",
            price: 25000,
            deliveryTime: "5-7 Days",
            shortDescription: "High-converting modern responsive web presence for businesses, portfolios, and startups.",
            features: [
              "Up to 5 Custom Responsive Pages",
              "Mobile-First Tailwind Design",
              "Contact Form & WhatsApp Integration",
              "On-Page SEO & Speed Optimization",
              "Domain & Cloudflare SSL Setup",
              "1 Month Complimentary Support",
            ],
            technologies: ["React", "Vite", "Tailwind CSS", "Vercel"],
          },
          {
            _id: "default-pro",
            title: "Professional Full-Stack App",
            packageTier: "professional",
            tierBadge: "Most Popular",
            price: 55000,
            deliveryTime: "2-3 Weeks",
            shortDescription: "Custom MERN stack application with admin dashboard, authentication, and Nepali payment gateway.",
            features: [
              "Complete MERN Stack Architecture",
              "Role-Based Authentication (JWT)",
              "Custom Admin Dashboard & CMS",
              "eSewa & Khalti Payment Integration",
              "MongoDB Database Modeling & Indexing",
              "RESTful API & Cloudinary Asset Storage",
              "3 Months Dedicated SLA Support",
            ],
            technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind"],
          },
          {
            _id: "default-enterprise",
            title: "Enterprise SaaS Platform",
            packageTier: "enterprise",
            tierBadge: "Enterprise Grade",
            price: 120000,
            deliveryTime: "4-6 Weeks",
            shortDescription: "Scalable multi-tenant enterprise system, microservices, advanced analytics, and cloud infrastructure.",
            features: [
              "Multi-Tenant SaaS Architecture",
              "Advanced Analytics & Real-Time Reporting",
              "High-Concurrency Performance Tuning",
              "AWS / DigitalOcean Cloud Architecture",
              "Docker Containerization & CI/CD Pipeline",
              "OWASP Security & Penetration Hardening",
              "6 Months 24/7 Priority Support & SLA",
            ],
            technologies: ["React", "Node.js", "MongoDB", "Redis", "AWS", "Docker"],
          },
        ];

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

  const handleOpenWhatsAppTier = (tier) => {
    const text = encodeURIComponent(
      `Hello Pixel Perfect Team! I would like to subscribe to the "${tier.title}" Web Development plan (NRs. ${Number(tier.price).toLocaleString()}). Please let me know how we can get started.`
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

      {/* Atelier Philosophy Banner */}
      <section className="py-18 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="storefront-container text-center max-w-[800px] mx-auto">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Atelier Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight mt-2.5 tracking-[-0.03em]">
            "Friction for the mind. Tactile permanence in a fleeting digital world."
          </h2>
          <p className="text-[0.95rem] text-[var(--text-secondary)] leading-relaxed mt-4">
            Pixel Perfect designs and produces archival stationery, precision-machined solid brass writing instruments,
            and vegetable-tanned leather desk objects for deep focus and contemplative ritual.
          </p>
        </div>
      </section>

      {/* Curated Highlights Section */}
      <FeaturedSection
        products={products}
        onViewDetails={onViewProduct}
        onInquire={onInquireProduct}
        onBrowseAll={() => onNavigate("products")}
      />

      {/* Disciplines Category Grid */}
      <CategoryGrid
        categories={categories}
        onSelectCategory={handleCategoryClick}
      />

      {/* Craftsmanship Spotlight */}
      {/* <section className="py-22 border-b border-[var(--border-subtle)]">
        <div className="storefront-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Materials & Provenance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em] leading-tight">
                Archival Paper. Machined Metals. Hand-Finished Leather.
              </h2>
              <p className="text-[0.95rem] text-[var(--text-secondary)] leading-relaxed mt-3.5">
                We refuse synthetic fillers and temporary coatings. Our notebooks utilize 120gsm Swedish Munken paper
                engineered to eliminate fountain pen bleed-through while keeping pages feather-light.
              </p>

              <div className="flex flex-col gap-4 mt-8">
                <div className="flex gap-3.5 items-start">
                  <Feather size={20} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[0.95rem] font-bold m-0">Swedish Munken Paper</h4>
                    <p className="text-[0.825rem] text-[var(--text-muted)] mt-1">
                      FSC-certified archival stock with lay-flat Smyth sewn binding for an uninterrupted 180° spread.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <Cpu size={20} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[0.95rem] font-bold m-0">Micron Precision CNC Machining</h4>
                    <p className="text-[0.825rem] text-[var(--text-muted)] mt-1">
                      Solid raw brass and titanium turned to tolerances under 0.01mm for flawless balance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <Compass size={20} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[0.95rem] font-bold m-0">Tuscan Vegetable-Tanned Leather</h4>
                    <p className="text-[0.825rem] text-[var(--text-muted)] mt-1">
                      Natural bark and plant tannin cured hides that develop a rich, personal patina over years of use.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] overflow-hidden h-[480px] border border-[var(--border-subtle)]">
              <img
                src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1200&auto=format&fit=crop"
                alt="Precision Brass Pen Workshop"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* =========================================================================
          FEATURED WEB SERVICES AT THE LAST IN THE HOME PAGE
          3 TIER SUBSCRIPTION / PLAN EXPERIENCE (EDITABLE BY ADMIN)
          ========================================================================= */}
      <section id="featured-web-services" className="py-24 bg-gradient-to-b from-[var(--bg-secondary)] via-[var(--bg-app)] to-[var(--bg-secondary)] border-b border-[var(--border-subtle)] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="storefront-container relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-black font-extrabold text-[0.675rem] uppercase tracking-[0.14em] mb-4">
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

          {/* 3 Tier Subscription Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-14">
            {displayTiers.map((tier) => {
              const isPro = tier.packageTier === "professional";
              const isEnterprise = tier.packageTier === "enterprise";

              return (
                <div
                  key={tier._id}
                  className={`relative rounded-[var(--radius-lg)] flex flex-col p-6 sm:p-8 transition-all duration-300 ${
                    isPro
                      ? "bg-[var(--bg-elevated)] border-2 border-white shadow-[0_0_35px_rgba(255,255,255,0.12)] lg:scale-[1.02] lg:-translate-y-3 z-10"
                      : "bg-[var(--bg-card)] border border-[var(--border-medium)] hover:border-[var(--border-bright)]"
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex justify-between items-center gap-2 mb-4">
                    <span
                      className={`badge text-[0.675rem] px-3 py-1 ${
                        isPro
                          ? "badge-white font-extrabold shadow-sm"
                          : isEnterprise
                          ? "bg-white/15 text-white font-bold"
                          : "badge-neutral"
                      }`}
                    >
                      {tier.tierBadge || (isPro ? "Most Popular Plan" : isEnterprise ? "Enterprise Tier" : "Starter Plan")}
                    </span>

                    <div className="flex items-center gap-1.5 text-[0.725rem] text-[var(--text-muted)] font-mono">
                      <Clock size={13} />
                      <span>{tier.deliveryTime || "1-2 Weeks"}</span>
                    </div>
                  </div>

                  {/* Title & Short Tagline */}
                  <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)] m-0">
                    {tier.title}
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed mt-2 min-h-[46px]">
                    {tier.shortDescription}
                  </p>

                  {/* Pricing Display in NPr */}
                  <div className="my-6 p-4 rounded-[var(--radius-md)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col">
                    <span className="text-[0.675rem] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                      {tier.priceType === "hourly" ? "Hourly Rate" : "Transparent Investment"}
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        NRs. {Number(tier.price).toLocaleString()}
                      </span>
                      <span className="text-[0.75rem] text-[var(--text-muted)] font-mono">
                        NPR
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist (Each Tier's own features) */}
                  <div className="flex-1 flex flex-col gap-3 mb-8">
                    <span className="text-[0.725rem] uppercase font-bold tracking-[0.1em] text-[var(--text-muted)] flex items-center gap-1.5">
                      <Sparkles size={12} />
                      <span>Included Features & Capabilities:</span>
                    </span>

                    {tier.features && tier.features.length > 0 ? (
                      tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-[0.825rem] text-[var(--text-primary)]">
                          <CheckCircle2
                            size={16}
                            className={`shrink-0 mt-0.5 ${
                              isPro ? "text-white" : "text-[var(--text-secondary)]"
                            }`}
                          />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[var(--text-muted)]">Full-stack digital deliverables included</div>
                    )}
                  </div>

                  {/* Tech Stack Pills */}
                  {tier.technologies && tier.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6 pt-3 border-t border-[var(--border-subtle)]">
                      {tier.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[0.675rem] font-mono px-2.5 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-secondary)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <button
                      onClick={() => handleSubscribePlan(tier)}
                      className={`btn w-full py-3.5 gap-2 font-bold text-[0.875rem] !rounded-[var(--radius-sm)] ${
                        isPro ? "btn-primary shadow-lg" : "btn-secondary hover:!bg-white hover:!text-black"
                      }`}
                    >
                      <span>Subscribe to This Plan</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      onClick={() => handleOpenWhatsAppTier(tier)}
                      className="btn btn-ghost btn-sm text-[0.75rem] text-[var(--text-muted)] hover:text-white flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle size={13} />
                      <span>Inquire via WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Trust & Assurance Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 font-bold">
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
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shrink-0 font-bold">
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


      {/* OTHER ID SERVICES SECTION  */}
      

      {/* Ending Action Strip */}
      <section className="py-20 text-center bg-[var(--bg-app)]">
        <div className="storefront-container max-w-[680px] mx-auto">
          <h2 className="text-3xl font-extrabold tracking-[-0.03em]">
            Begin Your Analog & Digital Journey
          </h2>
          <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2.5 leading-relaxed">
            Explore our curated analog stationery catalog or partner with our engineering atelier for custom digital software.
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
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Printer,
  Package,
  Truck,
  RotateCcw,
  Scale,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function TermsPage({ onNavigate }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("section-1");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "section-1",
        "section-2",
        "section-3",
        "section-4",
        "section-5",
        "section-6",
        "section-7",
        "section-8",
        "section-9",
        "section-10",
        "section-11",
        "section-12",
      ];
      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const navItems = [
    { id: "section-1", title: "1. Introduction & Acceptance" },
    { id: "section-2", title: "2. Stationery & Catalog Products" },
    { id: "section-3", title: "3. Custom Printing Services" },
    { id: "section-4", title: "4. Web & Digital Services" },
    { id: "section-5", title: "5. Account Registration" },
    { id: "section-6", title: "6. Pricing, Currency & Quotes" },
    { id: "section-7", title: "7. Delivery Across Nepal" },
    { id: "section-8", title: "8. Returns & Cancellations" },
    { id: "section-9", title: "9. Intellectual Property" },
    { id: "section-10", title: "10. User Code of Conduct" },
    { id: "section-11", title: "11. Limitation of Liability" },
    { id: "section-12", title: "12. Governing Law & Contact" },
  ];

  return (
    <div className="pt-6 sm:pt-10 pb-24 text-[var(--text-primary)]">
      <div className="storefront-container max-w-[1140px]">
        {/* Breadcrumb & Top Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => (onNavigate ? onNavigate("home") : navigate("/"))}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer flex items-center gap-1"
            >
              Home
            </button>
            <ChevronRight size={13} className="text-[var(--text-dim)]" />
            <span className="text-[var(--text-secondary)] font-medium">Legal</span>
            <ChevronRight size={13} className="text-[var(--text-dim)]" />
            <span className="text-[var(--text-primary)] font-semibold">Terms &amp; Conditions</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-xs"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => (onNavigate ? onNavigate("privacy") : navigate("/privacy"))}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <span>View Privacy Policy</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Hero / Header */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[0.7rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3.5">
              <Scale size={13} className="text-[var(--text-primary)]" />
              <span>Pixel Perfect Agreement</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mb-4">
              Terms &amp; Conditions
            </h1>
            
            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6">
              Welcome to Pixel Perfect. These Terms and Conditions govern your access to our online platform, purchase of stationery and analog tools, custom printing production, and commissioned digital design and IT services.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--text-muted)] font-mono border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--text-primary)]" />
                <span>Effective Date: September 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[var(--text-primary)]" />
                <span>Jurisdiction: Lalitpur, Nepal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Version 2.4 (Verified)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Package size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Curated Selection</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Quality stationery, writing instruments, and curated desk tools sourced from verified suppliers.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Printer size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Print Verification</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Client-approved proofs determine production. High-fidelity color grading and strict print QA checks.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Truck size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Nepal Fulfillment</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Reliable dispatch across Kathmandu Valley and all 7 provinces with accurate landmark tracking.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <RotateCcw size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Fair Returns</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Unopened standard items eligible for return within designated windows. Defective prints replaced promptly.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sticky TOC + Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Sticky Table of Contents */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 shadow-sm">
              <div className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] mb-3 pb-2 border-b border-[var(--border-subtle)] flex items-center justify-between">
                <span>Table of Contents</span>
                <span className="text-[0.65rem] font-mono">12 Sections</span>
              </div>
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left px-3 py-2 rounded-[var(--radius-sm)] text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isActive
                          ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border-l-2 border-white pl-2.5 shadow-xs"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {isActive && <ChevronRight size={13} className="shrink-0 ml-1 text-white" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Support Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 text-xs text-[var(--text-secondary)] space-y-3">
              <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Need Clarification?</span>
              </h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                If you have questions regarding bespoke printing volumes or custom web engineering contracts, contact our studio team directly.
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <a
                  href="https://wa.me/9779808950275?text=Hello%20Pixel%20Perfect,%20I%20have%20a%20question%20about%20your%20terms."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-[var(--text-primary)] hover:underline font-mono text-[0.75rem]"
                >
                  <Phone size={13} />
                  <span>WhatsApp: +977 9808950275</span>
                </a>
                <a
                  href="mailto:perfectpixel300@gmail.com"
                  className="flex items-center gap-2 text-[var(--text-primary)] hover:underline font-mono text-[0.75rem]"
                >
                  <Mail size={13} />
                  <span>perfectpixel300@gmail.com</span>
                </a>
              </div>
            </div>
          </aside>

          {/* Right Column: Detailed Clauses */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-sm text-[var(--text-secondary)]">
            
            {/* 1. Introduction */}
            <section id="section-1" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 01
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  1. Introduction &amp; Acceptance of Terms
                </h2>
              </div>
              <p>
                These Terms and Conditions (“Terms”) govern the relationship between you (“Customer”, “User”, or “Client”) and <strong>Pixel Perfect</strong> (“we”, “us”, or “our”), an independent stationery retail store, custom printing provider, and digital solutions studio registered and operating from Mahalaxmi-08, Devistha 44708, Lalitpur, Nepal.
              </p>
              <p>
                By accessing or using our website, establishing a user account, initiating an inquiry, placing an order for stationery or custom prints, or contracting our digital design and development services, you confirm that you have read, understood, and unconditionally agreed to be bound by these Terms.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-1">
                <span className="font-semibold text-[var(--text-primary)] block">Note for Minors:</span>
                If you are under 18 years of age, you may browse our catalog only with the involvement, consent, and supervision of a parent or legal guardian who agrees to these Terms.
              </div>
            </section>

            {/* 2. Stationery, Catalog Products & Retail Goods */}
            <section id="section-2" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 02
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  2. Stationery, Catalog Products &amp; Retail Goods
                </h2>
              </div>
              <p>
                Pixel Perfect retails and curates fine paper goods, writing instruments, leather folios, and desk accessories sourced from verified suppliers, with select specialized items assembled or finished in-house. We strive to provide accurate descriptions and high-quality selections.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Material Characteristics:</strong> Products incorporating natural leather, brass, and wood may exhibit natural grain, subtle patina, or slight color variations inherent to the natural materials.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Stock &amp; Availability:</strong> Products in our catalog are subject to supplier stock and availability. We reserve the right to limit order quantities per customer if inventory is constrained.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Product Specifications:</strong> Paper weights (GSM), binding formats, dimensions, and specifications are described based on manufacturer data and catalog listings.
                </li>
              </ul>
            </section>

            {/* 3. Custom Printing Services */}
            <section id="section-3" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 03
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  3. Custom Printing &amp; Bespoke Merchandise
                </h2>
              </div>
              <p>
                Our studio provides comprehensive printing services including business stationery, flyers, brochures, custom t-shirts, mugs, photo frames, vinyl stickers, and branded merchandise.
              </p>
              
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  3.1 Artwork Submissions &amp; Intellectual Property
                </h3>
                <p>
                  You warrant that you own or have obtained all necessary licenses, copyrights, and permissions for any graphics, logos, photographs, or text submitted to Pixel Perfect for custom printing. You agree to indemnify Pixel Perfect against any legal claims, copyright infringements, or damages arising from materials you provide.
                </p>

                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  3.2 Proof Approvals &amp; Color Accuracy
                </h3>
                <p>
                  Prior to full-scale printing or custom execution, digital proofs or sample photos are shared via email or WhatsApp. Once you approve a proof (explicitly in writing), production commences. Digital screens (RGB) render colors differently than physical CMYK ink on substrates; minor hue shifts within standard industry tolerances are normal.
                </p>

                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  3.3 Right of Refusal
                </h3>
                <p>
                  Pixel Perfect reserves the right to decline any printing order containing defamatory, hate speech, explicit unlawful material, or unauthorized counterfeit trademarks violating the laws of Nepal.
                </p>
              </div>
            </section>

            {/* 4. Web & Digital Services */}
            <section id="section-4" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 04
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  4. Digital, UI/UX &amp; Web Development Services
                </h2>
              </div>
              <p>
                In addition to printing, our digital team develops customized web platforms, portfolio systems, e-commerce storefronts, and brand design identities.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Scope of Work (SOW):</strong> All digital projects are governed by a mutually agreed proposal detailing deliverables, revision milestones, deployment targets, and technical stacks.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Revisions &amp; Scope Expansion:</strong> Revisions exceeding agreed milestone limits or supplementary feature requests will be billed at our standard studio hourly rate or via a change order.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Code &amp; Asset Handover:</strong> Full source code repositories, design tokens, and live domain transfers are released upon complete settlement of invoices.
                </li>
              </ul>
            </section>

            {/* 5. Account Registration */}
            <section id="section-5" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  5. Account Registration &amp; Security
                </h2>
              </div>
              <p>
                To utilize certain services, submit inquiries, or retain customized delivery preferences, you may register an account on our platform.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Verification:</strong> To safeguard our community against automated bot activity, all new customer registrations require email verification before account features are activated.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Accuracy:</strong> You agree to provide accurate, current, and complete personal information (including full legal name, telephone number with Nepal country prefix +977, accurate delivery street address, and landmark).
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Credential Confidentiality:</strong> You are responsible for preserving the confidentiality of your login credentials. Notify us immediately at <code>perfectpixel300@gmail.com</code> if you suspect unauthorized access.
                </li>
              </ul>
            </section>

            {/* 6. Pricing & Quotes */}
            <section id="section-6" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 06
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  6. Pricing, Currency &amp; Quotations
                </h2>
              </div>
              <p>
                All prices presented on our catalog and storefront are denominated in <strong>Nepalese Rupees (NRs. / NPR)</strong> unless explicitly stated otherwise.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <AlertCircle size={15} className="text-amber-400 shrink-0" />
                  <span>Indicative Pricing Notice:</span>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Prices listed on custom printing and large-scale web services represent indicative baseline pricing. Exact commercial quotes depend on order quantity, paper weight, finishing laminations, bespoke binding, and rush production requirements.
                </p>
              </div>
              <p>
                Custom quotes provided via official Pixel Perfect proforma invoices or verified WhatsApp correspondence remain valid for thirty (30) calendar days from issuance.
              </p>
            </section>

            {/* 7. Delivery Across Nepal */}
            <section id="section-7" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 07
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  7. Delivery, Fulfillment &amp; Logistics
                </h2>
              </div>
              <p>
                We fulfill and dispatch physical goods, framed prints, stationery, and merchandise throughout the Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur) and across all provinces in Nepal.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Kathmandu Valley Deliveries:</strong> Standard delivery within Kathmandu, Lalitpur, and Bhaktapur takes approximately 24 to 48 hours following order confirmation or custom print readiness.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Out-of-Valley Shipments:</strong> Nationwide deliveries are conducted through certified courier services. Delivery timeframes typically range from 2 to 5 business days depending on destination district accessibility.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Accuracy of Details:</strong> The customer is responsible for providing valid recipient telephone numbers and landmarks. Additional delivery charges incurred due to incorrect recipient addresses or repeated failed delivery attempts are the customer’s responsibility.
                </li>
              </ul>
            </section>

            {/* 8. Returns & Cancellations */}
            <section id="section-8" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 08
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  8. Cancellation, Returns &amp; Replacement Policy
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    A. Standard Off-the-Shelf Stationery
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Unused, undamaged stationery and desk objects in their original unopened packaging may be returned or exchanged within 7 days of delivery. The customer is responsible for courier return transit costs unless the product arrived damaged.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    B. Custom Printed Merchandise &amp; Personalized Items
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Because custom printing (business cards, photo frames, engraved pens, banners) is printed specifically according to client instructions, orders cannot be cancelled or returned once custom printing or assembly has commenced following proof approval.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">
                    C. Defective or Damaged In Transit
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    If an order arrives with printing defects or transit damage (e.g. misaligned cutting, ink bleeding, damaged frames), report it to our studio within 48 hours of receipt with clear photographic proof. We will replace or reprint the affected items promptly.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Intellectual Property */}
            <section id="section-9" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 09
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  9. Intellectual Property &amp; Trademarks
                </h2>
              </div>
              <p>
                The name “Pixel Perfect”, our studio logo, bespoke typography, graphics, website software, catalog design, photographs, and editorial articles are the proprietary property of Pixel Perfect.
              </p>
              <p>
                You may not copy, reproduce, scrape, decompile, or repurpose any part of this platform or our commercial assets without prior express written consent from Pixel Perfect management.
              </p>
            </section>

            {/* 10. Prohibited Activities */}
            <section id="section-10" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 10
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  10. User Conduct &amp; Prohibited Activities
                </h2>
              </div>
              <p>While using our website and services, you agree never to:</p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>Submit fraudulent inquiries, fake orders, or unauthorized payment claims.</li>
                <li>Transmit malicious software, exploits, automated scripts, or crawler attacks aimed at our servers or API infrastructure.</li>
                <li>Harass, intimidate, or use abusive language toward our studio staff, support personnel, or logistics representatives.</li>
                <li>Attempt to bypass account security, email verification mechanisms, or tamper with another customer’s account data.</li>
              </ul>
              <p className="text-xs text-[var(--text-muted)]">
                Violations may result in immediate suspension of account privileges and referral to civil authorities.
              </p>
            </section>

            {/* 11. Limitation of Liability */}
            <section id="section-11" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 11
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  11. Disclaimers &amp; Limitation of Liability
                </h2>
              </div>
              <p>
                To the maximum extent permitted by applicable laws of Nepal, Pixel Perfect provides products and services “as is” and “as available” without warranties of any kind, whether express or implied. As a retailer of stationery goods produced by third-party manufacturers, Pixel Perfect passes through any applicable manufacturer warranties where available, but does not independently warrant manufactured products beyond catalog descriptions and our designated return policy.
              </p>
              <p>
                In no event shall Pixel Perfect, its founders, directors, or contractors be liable for any indirect, incidental, special, or consequential damages (including lost profits or business disruption) arising out of the use or inability to use our products or digital platforms. Our total liability for any claim shall not exceed the amount actually paid by you for the specific item or service in question.
              </p>
            </section>

            {/* 12. Governing Law & Contact */}
            <section id="section-12" className="scroll-mt-28 space-y-6">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Section 12
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  12. Governing Law, Dispute Resolution &amp; Contact
                </h2>
              </div>
              <p>
                These Terms are constructed and governed exclusively in accordance with the laws of <strong>Nepal</strong>. Any disputes arising out of or related to these Terms shall be settled through amicable good-faith discussions, or failing that, through the competent courts having jurisdiction in Lalitpur or Kathmandu, Nepal.
              </p>

              {/* Studio Contact Card */}
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
                  Studio Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Studio Address</span>
                    <span className="text-[var(--text-primary)] block font-sans">
                      Mahalaxmi-08, Devistha 44708, Lalitpur, Nepal
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Electronic Inquiries</span>
                    <a href="mailto:perfectpixel300@gmail.com" className="text-[var(--text-primary)] hover:underline block">
                      perfectpixel300@gmail.com
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Direct Phone &amp; WhatsApp</span>
                    <a href="tel:+9779808950275" className="text-[var(--text-primary)] hover:underline block">
                      +977 9808950275
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Executive Lead</span>
                    <span className="text-[var(--text-primary)] block font-sans">
                      Bikash Shrestha (+977 9845991878)
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer navigation between legal pages */}
              <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => (onNavigate ? onNavigate("home") : navigate("/"))}
                  className="btn btn-secondary text-xs px-4 py-2.5 font-semibold gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Return to Home</span>
                </button>
                <button
                  onClick={() => (onNavigate ? onNavigate("privacy") : navigate("/privacy"))}
                  className="btn btn-primary text-xs px-5 py-2.5 font-bold gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>Continue to Privacy Policy</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

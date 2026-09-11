import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ShieldCheck,
  Lock,
  Printer,
  Trash2,
  Server,
  KeyRound,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Mail,
  MapPin,
} from "lucide-react";

export function PrivacyPage({ onNavigate }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("privacy-1");

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "privacy-1",
        "privacy-2",
        "privacy-3",
        "privacy-4",
        "privacy-5",
        "privacy-6",
        "privacy-7",
        "privacy-8",
        "privacy-9",
        "privacy-10",
        "privacy-11",
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
    { id: "privacy-1", title: "1. Privacy Philosophy" },
    { id: "privacy-2", title: "2. Information We Collect" },
    { id: "privacy-3", title: "3. How We Use Data" },
    { id: "privacy-4", title: "4. Third Parties & Couriers" },
    { id: "privacy-5", title: "5. Security & Encryption" },
    { id: "privacy-6", title: "6. Account Deletion & Rights" },
    { id: "privacy-7", title: "7. Cookies & Local Storage" },
    { id: "privacy-8", title: "8. Data Retention Policies" },
    { id: "privacy-9", title: "9. Children's Privacy" },
    { id: "privacy-10", title: "10. Policy Updates" },
    { id: "privacy-11", title: "11. Contact Privacy Officer" },
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
            <span className="text-[var(--text-primary)] font-semibold">Privacy Policy</span>
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
              onClick={() => (onNavigate ? onNavigate("terms") : navigate("/terms"))}
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-xs"
            >
              <span>View Terms &amp; Conditions</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Hero / Header */}
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-[var(--radius-lg)] p-6 sm:p-10 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-full)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[0.7rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-3.5">
              <Shield size={13} className="text-[var(--text-primary)]" />
              <span>Data Protection &amp; Confidentiality</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mb-4">
              Privacy Policy
            </h1>

            <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-6">
              At Pixel Perfect, we believe privacy and customer trust are essential. This policy provides complete transparency on how your information is safeguarded, how our Nepal delivery logistics operate, and your complete rights to your personal data.
            </p>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[var(--text-muted)] font-mono border-t border-[var(--border-subtle)] pt-4">
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--text-primary)]" />
                <span>Last Updated: September 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero Data Selling Commitment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <KeyRound size={14} className="text-[var(--text-primary)]" />
                <span>Bcrypt + TLS Encryption</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Highlights Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Lock size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Never Sold</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                We never monetize, rent, broker, or sell customer emails, phone numbers, or inquiries to third parties.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <MapPin size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Delivery Use Only</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Addresses and landmarks are shared solely with verified Nepal logistics couriers to reach your doorstep.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Server size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Modern Encryption</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Passwords hashed with salted bcrypt rounds. Data in flight is secured with high-grade TLS 1.3 encryption.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center mb-3">
              <Trash2 size={16} className="text-[var(--text-primary)]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Right to Erasure</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Our user portal contains an automated account deletion feature with a transparent grace and cancellation window.
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
                <span>Privacy Navigation</span>
                <span className="text-[0.65rem] font-mono">11 Clauses</span>
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

            {/* Privacy Guarantee Note */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 text-xs text-[var(--text-secondary)] space-y-3">
              <h4 className="font-bold text-[var(--text-primary)] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Our Privacy Promise</span>
              </h4>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We provide quality tools for creative and professional work, not surveillance. You control your profile, addresses, and account existence at all times.
              </p>
              <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <a
                  href="mailto:perfectpixel300@gmail.com?subject=Privacy%20Inquiry"
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

            {/* 1. Privacy Philosophy */}
            <section id="privacy-1" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 01
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  1. Privacy Philosophy &amp; Scope
                </h2>
              </div>
              <p>
                Pixel Perfect operates an independent stationery retail store, digital printing service, and IT solutions studio based in <strong>Mahalaxmi-08, Lalitpur, Nepal</strong>.
              </p>
              <p>
                We treat customer data with high diligence and respect. We only collect the minimal personal information essential to process inquiries, fulfill retail orders, execute custom printing requests, and safely deliver parcels across Nepal.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="privacy-2" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 02
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  2. Information We Collect
                </h2>
              </div>
              <p>We collect information you explicitly provide when interacting with our platform:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Account &amp; Auth Credentials
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Email address, full name, encrypted password hash, and email activation token status.
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Contact &amp; Phone Numbers
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Primary and optional secondary contact numbers with international country prefixes (+977 Nepal default).
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Nepal Delivery Addresses
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Province (1 through 7), District, Municipality/City, Street Address, and Notable Nearby Landmark.
                  </p>
                </div>

                <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="font-bold text-[var(--text-primary)] uppercase tracking-wider block">
                    Order Inquiries &amp; Artwork
                  </span>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Product specifications, uploaded vector or raster artwork files, custom engraving instructions, and quote requests.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. How We Use Data */}
            <section id="privacy-3" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 03
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  3. How We Use Your Information
                </h2>
              </div>
              <p>Your information is used strictly for legitimate operational purposes:</p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Fulfillment &amp; Order Processing:</strong> To prepare your order, coordinate printing specs, review digital proofs, and dispatch parcels to your address.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Customer Communication:</strong> To reach you regarding inquiry quotes, order status updates, delivery schedules, and WhatsApp customer service.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Account Integrity &amp; Security:</strong> To verify your email address, safeguard account access via JSON Web Tokens (JWT), and prevent automated spam or fraudulent abuse.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Storefront Experience:</strong> To store your localized preferences, such as your dark/light theme choice and shopping cart state.
                </li>
              </ul>
            </section>

            {/* 4. Third Parties & Couriers */}
            <section id="privacy-4" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 04
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  4. Third-Party Sharing &amp; Courier Logistics
                </h2>
              </div>
              <p>
                Pixel Perfect does not sell, trade, or monetize personal information. We only share necessary data under strict contractual guidelines with:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Nepal Courier Partners:</strong> Your name, delivery address, nearby landmark, and telephone number are shared with authorized courier personnel (such as Nepal Post, Pathao Parcel, or certified regional logistics partners) exclusively to complete the physical delivery of your order.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Secure Cloud Infrastructure:</strong> We utilize Cloudinary for encrypted media storage (images and artwork proofs) and MongoDB Atlas for database persistence.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Legal Mandates:</strong> We may disclose information if required to comply with a valid court order, subpoena, or law enforcement request issued under the prevailing laws of Nepal.
                </li>
              </ul>
            </section>

            {/* 5. Security & Encryption */}
            <section id="privacy-5" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 05
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  5. Data Security, Hashing &amp; Storage
                </h2>
              </div>
              <p>
                We implement comprehensive technical and organizational safeguards to protect your personal information:
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                    <KeyRound size={15} className="text-emerald-400" />
                    <span>Salted Password Hashing</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    Passwords are never stored in plain text. They are hashed using industry-standard <code>bcryptjs</code> with strong salting rounds before ever reaching database storage. Not even Pixel Perfect administrators can view your plain-text password.
                  </p>
                </div>

                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[var(--text-primary)]">
                    <Lock size={15} className="text-emerald-400" />
                    <span>Transport Layer Security (TLS)</span>
                  </div>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    All communications between your browser and our servers are encrypted via HTTPS / TLS 1.3, ensuring protection against eavesdropping or man-in-the-middle attacks.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Account Deletion & Rights */}
            <section id="privacy-6" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 06
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  6. Your Privacy Rights &amp; In-App Account Deletion
                </h2>
              </div>
              <p>
                We believe you should maintain absolute sovereignty over your digital footprint. As a registered customer, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                <li>
                  <strong className="text-[var(--text-primary)]">Access &amp; Rectification:</strong> Review and update your profile name, delivery coordinates, secondary contact numbers, and birthday directly from your Customer Profile settings at any time.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">In-App Account Deletion:</strong> You can initiate a self-service account deletion directly inside your profile settings. When requested, a grace period is provided during which you may safely cancel the request if you change your mind.
                </li>
                <li>
                  <strong className="text-[var(--text-primary)]">Data Erasure:</strong> Upon final confirmation of account deletion, your personal records, contact details, and authentication hashes are permanently purged from active databases.
                </li>
              </ul>
            </section>

            {/* 7. Cookies & Local Storage */}
            <section id="privacy-7" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 07
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  7. Cookies, Local Storage &amp; PWA Caching
                </h2>
              </div>
              <p>
                We minimize tracking technologies. We do not use third-party behavioral advertising cookies or cross-site ad retargeting pixels.
              </p>
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] space-y-2">
                <span className="font-semibold text-[var(--text-primary)] block">Essential Local Storage Keys:</span>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[0.75rem]">
                  <li><code>pixel_theme</code>: Stores your preference for Dark or Light mode.</li>
                  <li><code>pixel_customer_token</code>: Authenticated session token stored securely to maintain your login state.</li>
                  <li><code>pixel_cart</code>: Retains your selected stationery items in local memory.</li>
                  <li><code>pixel_status_modal_dismissed</code>: Remembers when you close the shop status modal.</li>
                </ul>
              </div>
            </section>

            {/* 8. Retention */}
            <section id="privacy-8" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 08
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  8. Data Retention Policies
                </h2>
              </div>
              <p>
                We retain your personal data for as long as your customer account remains active or as needed to provide you with ongoing services and order history. Inactive accounts that have never completed verification may be automatically pruned after 90 days.
              </p>
              <p>
                Commercial invoices and accounting transaction records are preserved in secure archives in accordance with statutory accounting and tax compliance requirements under Nepal law.
              </p>
            </section>

            {/* 9. Children's Privacy */}
            <section id="privacy-9" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 09
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  9. Children's Online Privacy Protection
                </h2>
              </div>
              <p>
                Our services and commercial products are designed for adults, designers, students, and professionals capable of entering into binding contracts. We do not knowingly collect personal data from children under the age of 16 without parental consent. If we become aware that personal information of a child under 16 has been collected without verified parental authorization, we will promptly delete it.
              </p>
            </section>

            {/* 10. Updates */}
            <section id="privacy-10" className="scroll-mt-28 space-y-4">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 10
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  10. Amendments &amp; Policy Updates
                </h2>
              </div>
              <p>
                We may periodically update this Privacy Policy to reflect modifications in our operational workflow, service categories, or applicable statutory laws of Nepal. When changes are made, the revised version will be published here with an updated effective date. We encourage customers to review this document periodically.
              </p>
            </section>

            {/* 11. Contact Privacy Lead */}
            <section id="privacy-11" className="scroll-mt-28 space-y-6">
              <div className="border-b border-[var(--border-subtle)] pb-3">
                <span className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Clause 11
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] mt-1">
                  11. Contact Our Privacy &amp; Data Protection Lead
                </h2>
              </div>
              <p>
                If you have questions, inquiries, or grievances regarding how your data is handled, please reach out to our privacy officer:
              </p>

              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-6 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--text-primary)]">
                  Privacy Inquiries &amp; Rights Requests
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Designated Officer</span>
                    <span className="text-[var(--text-primary)] block font-sans">
                      Ramesh Shrestha (QA &amp; Executive Lead)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Direct Privacy Email</span>
                    <a href="mailto:perfectpixel300@gmail.com?subject=Privacy%20Inquiry" className="text-[var(--text-primary)] hover:underline block">
                      perfectpixel300@gmail.com
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Studio Phone / WhatsApp</span>
                    <a href="tel:+9779808950275" className="text-[var(--text-primary)] hover:underline block">
                      +977 9808950275
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[var(--text-muted)] block">Studio Location</span>
                    <span className="text-[var(--text-primary)] block font-sans">
                      Mahalaxmi-08, Devistha 44708, Lalitpur, Nepal
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer navigation between legal pages */}
              <div className="pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => (onNavigate ? onNavigate("terms") : navigate("/terms"))}
                  className="btn btn-secondary text-xs px-4 py-2.5 font-semibold gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Review Terms &amp; Conditions</span>
                </button>
                <button
                  onClick={() => (onNavigate ? onNavigate("home") : navigate("/"))}
                  className="btn btn-primary text-xs px-5 py-2.5 font-bold gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <span>Return to Store</span>
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

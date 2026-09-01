import React from "react";
import { ArrowRight } from "lucide-react";

const DEFAULT_ABOUT = {
  badge: "About Us",
  title: "The Pixel Perfect Story",
  subtitle: "Crafting premium stationery, desk accessories, and modern technology solutions.",
  heroImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1400&auto=format&fit=crop",
  heroImageAlt: "Pixel Perfect Workshop",
  storyParagraphs: [
    "Pixel Perfect was founded in response to the ephemeral nature of modern digital workflows. While screens facilitate speed, they often rob our thinking of friction—the deliberate, contemplative resistance that allows deep ideas to take shape.",
    "We set out to engineer stationery that feels substantial in the hand and endures for generations. From the tactile snap of our raw brass pens to the smooth, ink-receptive fiber of Swedish Munken paper, every material is selected for its sensory feedback and archival durability.",
    "Our workshop operates in small, deliberate batches. We work closely with master papermakers in Sweden, CNC machinists in Bavaria, and traditional leather artisans in Florence to bring each design to life without compromise.",
  ],
  tenetsHeading: "Our Four Tenets",
  tenets: [
    {
      number: "01",
      title: "Material Honesty",
      description: "Solid brass without artificial coatings. 100% cotton rags without chemical bleaching. Pure materials that age with dignity.",
    },
    {
      number: "02",
      title: "Micron Precision",
      description: "CNC turning tolerances down to 0.01mm ensure perfect balance, effortless cap threading, and flawless ink cartridge seating.",
    },
    {
      number: "03",
      title: "Lay-Flat Binding",
      description: "Every notebook uses authentic Smyth sewn binding that opens 180 degrees completely flat, respecting both left and right-handed writers.",
    },
    {
      number: "04",
      title: "Lifelong Support",
      description: "Refillable standard international fountain pen cartridges and modular replacement parts for all desk objects.",
    },
  ],
  ctaHeading: "Experience The Analog Difference",
  ctaDescription: "Explore our curated range of notebooks, machined writing instruments, and desk objects.",
  ctaButtonText: "Explore The Collection",
  ctaButtonLink: "products",
};

export function AboutPage({ onNavigate, aboutData }) {
  const data = {
    badge: aboutData?.badge || DEFAULT_ABOUT.badge,
    title: aboutData?.title || DEFAULT_ABOUT.title,
    subtitle: aboutData?.subtitle || DEFAULT_ABOUT.subtitle,
    heroImage: aboutData?.heroImage || DEFAULT_ABOUT.heroImage,
    heroImageAlt: aboutData?.heroImageAlt || DEFAULT_ABOUT.heroImageAlt,
    storyParagraphs:
      aboutData?.storyParagraphs && aboutData.storyParagraphs.length > 0
        ? aboutData.storyParagraphs
        : DEFAULT_ABOUT.storyParagraphs,
    tenetsHeading: aboutData?.tenetsHeading || DEFAULT_ABOUT.tenetsHeading,
    tenets:
      aboutData?.tenets && aboutData.tenets.length > 0
        ? aboutData.tenets
        : DEFAULT_ABOUT.tenets,
    ctaHeading: aboutData?.ctaHeading || DEFAULT_ABOUT.ctaHeading,
    ctaDescription: aboutData?.ctaDescription || DEFAULT_ABOUT.ctaDescription,
    ctaButtonText: aboutData?.ctaButtonText || DEFAULT_ABOUT.ctaButtonText,
    ctaButtonLink: aboutData?.ctaButtonLink || DEFAULT_ABOUT.ctaButtonLink,
  };

  const handleCtaClick = () => {
    if (onNavigate) {
      onNavigate(data.ctaButtonLink || "products");
    }
  };

  return (
    <div className="py-16 pb-24">
      <div className="storefront-container max-w-[960px]">
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            {data.badge}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-2 tracking-[-0.03em]">
            {data.title}
          </h1>
          {data.subtitle && (
            <p className="text-[var(--text-secondary)] text-base sm:text-lg mt-3 max-w-[680px] mx-auto leading-relaxed">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Hero Image */}
        {data.heroImage && (
          <div className="rounded-[var(--radius-lg)] overflow-hidden h-[340px] sm:h-[420px] mb-16 border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm">
            <img
              src={data.heroImage}
              alt={data.heroImageAlt || data.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = DEFAULT_ABOUT.heroImage;
              }}
            />
          </div>
        )}

        {/* Story Paragraphs */}
        {data.storyParagraphs && data.storyParagraphs.length > 0 && (
          <div className="flex flex-col gap-7 text-base leading-loose text-[var(--text-secondary)] mb-18">
            {data.storyParagraphs.map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Core Pillars / Tenets */}
        {data.tenets && data.tenets.length > 0 && (
          <div className="mb-18">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] mb-8">
              {data.tenetsHeading}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {data.tenets.map((tenet, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-7 rounded-[var(--radius-md)] hover:border-[var(--border-medium)] transition-colors shadow-xs"
                >
                  <div className="text-xl font-extrabold font-mono mb-2 text-[#ea580c] dark:text-[#ff7828]">
                    {tenet.number || String(idx + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-base font-bold m-0 mb-1.5 text-[var(--text-primary)]">
                    {tenet.title}
                  </h3>
                  <p className="text-[0.825rem] text-[var(--text-muted)] leading-relaxed m-0">
                    {tenet.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action (CTA) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-lg)] p-10 sm:p-12 text-center flex flex-col items-center gap-3.5 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-extrabold m-0 tracking-tight text-[var(--text-primary)]">
            {data.ctaHeading}
          </h2>
          {data.ctaDescription && (
            <p className="text-[var(--text-secondary)] text-sm max-w-[500px]">
              {data.ctaDescription}
            </p>
          )}
          <button
            onClick={handleCtaClick}
            className="btn btn-primary gap-2 mt-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <span>{data.ctaButtonText || "Explore The Collection"}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

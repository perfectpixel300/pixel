import React from "react";
import { ArrowRight, ExternalLink, ArrowUpRight } from "lucide-react";

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
  teamHeading: "Our Team",
  teamSubheading: "",
  team: [],
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
    teamHeading: aboutData?.teamHeading || DEFAULT_ABOUT.teamHeading,
    teamSubheading:
      aboutData?.teamSubheading !== undefined
        ? aboutData.teamSubheading
        : DEFAULT_ABOUT.teamSubheading,
    team: Array.isArray(aboutData?.team) ? aboutData.team : [],
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

        {/* Our Team Section - Editorial / Magazine Style */}
        {data.team && data.team.length > 0 && (
          <div className="mb-24">
            {/* Editorial Masthead / Header */}
            <div className="border-t border-b border-[var(--border-subtle)] py-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#ff7828]" />
                  <span className="text-[0.7rem] uppercase tracking-[0.25em] font-bold text-[#ea580c] dark:text-[#ff7828]">
                    {data.badge || "The Atelier"}
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[var(--text-primary)] m-0">
                  {data.teamHeading}
                </h2>
              </div>
              {data.teamSubheading && (
                <p className="text-[var(--text-secondary)] text-sm max-w-[420px] font-sans leading-relaxed md:text-right m-0">
                  {data.teamSubheading}
                </p>
              )}
            </div>

            {/* Editorial Plates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {data.team.map((member, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col"
                >
                  {/* Editorial Plate Index Header */}
                  <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] text-[0.7rem] font-mono tracking-widest text-[var(--text-muted)] mb-3">
                    <span>N° 0{idx + 1}</span>
                    <span className="uppercase tracking-[0.2em] text-[0.65rem]">
                      [ PORTRAIT ]
                    </span>
                  </div>

                  {/* Photograph Frame (Magazine Plate) */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border-subtle)] group-hover:border-[var(--text-primary)] transition-colors duration-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top filter grayscale contrast-[1.08] brightness-[0.98] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      onError={(e) => {
                        e.target.src = "/pixelperfect.png";
                      }}
                    />

                    {/* Subtle Magazine Plate Corner Tag */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono tracking-widest uppercase">
                      ISSUE // 0{idx + 1}
                    </div>

                    {/* Subtle Gradient overlay for cinematic depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-40 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Editorial Caption & Typography Block */}
                  <div className="pt-4 flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[0.68rem] uppercase tracking-[0.22em] font-semibold text-[#ea580c] dark:text-[#ff7828] block mb-1">
                        {member.position}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif font-medium tracking-tight text-[var(--text-primary)] group-hover:italic transition-all duration-300 m-0">
                        {member.name}
                      </h3>
                    </div>

                    {/* Editorial Link / Credit */}
                    {member.portfolioLink && member.portfolioLink.trim() && (
                      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                        <a
                          href={
                            member.portfolioLink.startsWith("http://") || member.portfolioLink.startsWith("https://")
                              ? member.portfolioLink
                              : `https://${member.portfolioLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[0.72rem] uppercase tracking-[0.18em] font-semibold text-[var(--text-secondary)] hover:text-[#ea580c] dark:hover:text-[#ff7828] transition-colors group/link"
                        >
                          <span>Selected Folio</span>
                          <ArrowUpRight
                            size={13}
                            className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                          />
                        </a>
                      </div>
                    )}
                  </div>
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

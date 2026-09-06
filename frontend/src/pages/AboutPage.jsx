import React, { useState, useMemo, useRef } from "react";
import { ArrowRight, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
  teamSubheading: "Makers, engineers, and designers dedicated to precision craftsmanship.",
  team: [
    {
      name: "Bikash Shrestha",
      position: "Designer, Founder & Manager",
      image: "https://bikashshrestha01.com.np/assets/img/my-profile-img.svg",
      portfolioLink: "https://bikashshrestha01.com.np/",
      description: "Directs visual brand strategy, product design systems, and holistic atelier operations.",
    },
    {
      name: "Ramesh Shrestha",
      position: "QA Developer & CEO",
      image: "https://media.licdn.com/dms/image/v2/D5603AQFlv5Lq-7vOzw/profile-displayphoto-scale_200_200/B56Z8t3f20G8Ac-/0/1783180954994?e=2147483647&v=beta&t=CGs6dHFVIw41gFgK5y3JWkTpME0hTXGx4mdzFayRl5s",
      portfolioLink: "https://np.linkedin.com/in/ramesh-shrestha-327655273",
      description: "Steers executive technical strategy, continuous quality assurance, and engineering integrity.",
    },
    {
      name: "Saksham Shrestha",
      position: "Developer",
      image: "https://www.sakshamstha.com.np/saksham.jpg",
      portfolioLink: "https://www.sakshamstha.com.np/",
      description: "Architects responsive full-stack web platforms and bespoke interactive digital experiences.",
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
    teamHeading: aboutData?.teamHeading || DEFAULT_ABOUT.teamHeading,
    teamSubheading:
      aboutData?.teamSubheading !== undefined
        ? aboutData.teamSubheading
        : DEFAULT_ABOUT.teamSubheading,
    team:
      Array.isArray(aboutData?.team) && aboutData.team.length > 0
        ? aboutData.team
        : DEFAULT_ABOUT.team,
    ctaHeading: aboutData?.ctaHeading || DEFAULT_ABOUT.ctaHeading,
    ctaDescription: aboutData?.ctaDescription || DEFAULT_ABOUT.ctaDescription,
    ctaButtonText: aboutData?.ctaButtonText || DEFAULT_ABOUT.ctaButtonText,
    ctaButtonLink: aboutData?.ctaButtonLink || DEFAULT_ABOUT.ctaButtonLink,
  };

  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const bigCardRef = useRef(null);

  const MEMBERS_PER_PAGE = 6; // 3 cols x 2 rows
  const teamList = data.team;
  const totalPages = Math.max(1, Math.ceil(teamList.length / MEMBERS_PER_PAGE));

  const safeIndex =
    selectedMemberIndex >= 0 && selectedMemberIndex < teamList.length
      ? selectedMemberIndex
      : 0;
  const activeMember = teamList[safeIndex] || teamList[0];

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * MEMBERS_PER_PAGE;
    return teamList.slice(start, start + MEMBERS_PER_PAGE);
  }, [teamList, currentPage]);

  const handleSelectMember = (originalIndex) => {
    setSelectedMemberIndex(originalIndex);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      bigCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleCtaClick = () => {
    if (onNavigate) {
      onNavigate(data.ctaButtonLink || "products");
    }
  };

  return (
    <div className="py-16 pb-24">
      <div className="storefront-container max-w-[1120px]">
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

        {/* Our Team Section - Spotlight & Roster with Dynamic Pagination */}
        {data.team && data.team.length > 0 && (
          <div className="mb-24">
            {/* Editorial Masthead / Header */}
            <div className="border-t border-b border-[var(--border-subtle)] py-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
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

            {/* Split Team Showcase: Primary Card Left + 3x2 Grid Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* PRIMARY SPOTLIGHT CARD (LEFT) */}
              <div
                ref={bigCardRef}
                className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-medium)] p-5 sm:p-6 shadow-sm overflow-hidden"
              >
                {/* Editorial Plate Index Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border-subtle)] text-[0.7rem] font-mono tracking-widest text-[var(--text-muted)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#ff7828] animate-pulse" />
                    <span className="font-bold text-[var(--text-primary)]">
                      N° {String(safeIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="uppercase tracking-[0.2em] text-[0.65rem] px-2 py-0.5 rounded-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-semibold text-[#ea580c] dark:text-[#ff7828]">
                    [ SPOTLIGHT ]
                  </span>
                </div>

                {/* Photograph Frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] mb-5">
                  <img
                    key={activeMember.image || activeMember.name}
                    src={activeMember.image}
                    alt={activeMember.name}
                    className="w-full h-full object-cover object-top contrast-[1.05] transition-all duration-700 ease-out"
                    onError={(e) => {
                      e.target.src = "/pixelperfect.png";
                    }}
                  />

                  {/* Corner tag */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono tracking-widest uppercase rounded-xs">
                    TEAM // 0{safeIndex + 1}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono tracking-wider uppercase rounded-xs">
                    ATELIER MEMBER
                  </div>
                </div>

                {/* Info Block */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[0.72rem] uppercase tracking-[0.24em] font-bold text-[#ea580c] dark:text-[#ff7828] block mb-1">
                      {activeMember.position}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[var(--text-primary)] m-0 mb-3">
                      {activeMember.name}
                    </h3>

                    {/* Short Description */}
                    {activeMember.description ? (
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed italic m-0 mb-5 p-3.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)]/60 border-l-2 border-[#ea580c] dark:border-[#ff7828]">
                        "{activeMember.description}"
                      </p>
                    ) : (
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed italic m-0 mb-5">
                        Crafting deliberate, contemplative solutions with micron precision and sensory materials at Pixel Perfect.
                      </p>
                    )}
                  </div>

                  {/* Portfolio Link */}
                  {activeMember.portfolioLink && activeMember.portfolioLink.trim() && (
                    <div className="pt-4 border-t border-[var(--border-subtle)]">
                      <a
                        href={
                          activeMember.portfolioLink.startsWith("http://") || activeMember.portfolioLink.startsWith("https://")
                            ? activeMember.portfolioLink
                            : `https://${activeMember.portfolioLink}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm w-full gap-2 text-xs uppercase tracking-wider font-semibold justify-center py-2.5 hover:border-white transition-colors"
                      >
                        <span>View Selected Folio</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* MEMBERS GRID (RIGHT: 3 COLS x 2 ROWS) + DYNAMIC PAGINATION */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                {/* Grid Header / Helper */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)] text-[0.725rem] text-[var(--text-muted)] font-mono">
                  <span>TEAM ROSTER ({teamList.length} TOTAL)</span>
                  <span className="hidden sm:inline text-[0.675rem] uppercase tracking-wider text-[var(--text-secondary)]">
                    Click member to view in spotlight
                  </span>
                </div>

                {/* 3 Columns x 2 Rows Grid (Max 6 members per page) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {paginatedMembers.map((member, idx) => {
                    const originalIdx = (currentPage - 1) * MEMBERS_PER_PAGE + idx;
                    const isSelected = safeIndex === originalIdx;

                    return (
                      <button
                        type="button"
                        key={originalIdx}
                        onClick={() => handleSelectMember(originalIdx)}
                        className={`group relative text-left p-2 sm:p-2.5 rounded-[var(--radius-sm)] border transition-all duration-300 flex flex-col cursor-pointer ${
                          isSelected
                            ? "bg-[var(--bg-elevated)] border-[#ea580c] dark:border-[#ff7828] ring-1 ring-[#ea580c] dark:ring-[#ff7828] shadow-sm"
                            : "bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] hover:bg-[var(--bg-elevated)]/60"
                        }`}
                      >
                        {/* Member Photo Frame */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] mb-2 border border-[var(--border-subtle)]">
                          <img
                            src={member.image}
                            alt={member.name}
                            className={`w-full h-full object-cover object-top transition-all duration-500 ease-out ${
                              isSelected
                                ? "grayscale-0 scale-105"
                                : "grayscale contrast-[1.06] group-hover:grayscale-0 group-hover:scale-105"
                            }`}
                            onError={(e) => {
                              e.target.src = "/pixelperfect.png";
                            }}
                          />

                          {/* Member Index Badge */}
                          <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono tracking-wider uppercase rounded-xs">
                            {String(originalIdx + 1).padStart(2, "0")}
                          </div>

                          {/* Active Indicator */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ea580c] dark:bg-[#ff7828] ring-2 ring-black" />
                          )}
                        </div>

                        {/* Name Only */}
                        <div className="min-w-0 px-0.5">
                          <h4 className="text-xs sm:text-[0.8rem] font-serif font-medium text-[var(--text-primary)] truncate m-0 group-hover:text-white transition-colors">
                            {member.name}
                          </h4>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Pagination Controls */}
                <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs font-mono text-[var(--text-muted)]">
                    Showing {(currentPage - 1) * MEMBERS_PER_PAGE + 1}–{Math.min(currentPage * MEMBERS_PER_PAGE, teamList.length)} of {teamList.length} members
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className="btn-icon btn-secondary !w-8 !h-8 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Previous Page"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    <div className="flex items-center gap-1 font-mono text-xs">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-[var(--radius-xs)] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                            currentPage === page
                              ? "bg-white text-black dark:bg-white dark:text-black font-extrabold"
                              : "text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-elevated)]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="btn-icon btn-secondary !w-8 !h-8 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="Next Page"
                      aria-label="Next Page"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
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

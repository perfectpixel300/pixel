import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, Sparkles, ArrowRight, MessageCircle, Share2 } from "lucide-react";
import { ShareModal } from "../common/ShareModal";

export function WebTierCard({
  tier,
  onSubscribe,
  onWhatsApp,
}) {
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!tier) return null;

  const isPro = tier.packageTier === "professional";
  const isEnterprise = tier.packageTier === "enterprise";
  const regPrice = Number(tier.price) || 0;
  const discPrice = Number(tier.discountPrice) || 0;
  const hasDiscount = Boolean(discPrice > 0 && discPrice < regPrice);
  const discountPercent = hasDiscount
    ? Math.round(((regPrice - discPrice) / regPrice) * 100)
    : 0;
  const activePrice = hasDiscount ? discPrice : regPrice;

  const handleWhatsAppClick = () => {
    if (onWhatsApp) {
      onWhatsApp(tier.title, activePrice);
    } else {
      const text = encodeURIComponent(
        `Hello Pixel Perfect Team! I would like to subscribe to the "${tier.title}" Web Development plan (NRs. ${activePrice.toLocaleString()}). Please let me know how we can get started.`
      );
      window.open(`https://wa.me/9779808950275?text=${text}`, "_blank");
    }
  };

  return (
    <div
      className={`relative rounded-[var(--radius-lg)] flex flex-col p-6 sm:p-8 h-full transition-all duration-300 ${
        isPro
          ? "bg-[var(--bg-elevated)] border-2 border-[var(--text-primary)] shadow-[var(--shadow-xl)]"
          : "bg-[var(--bg-card)] border border-[var(--border-medium)] hover:border-[var(--border-bright)] shadow-sm"
      }`}
    >
      {/* Top Tier Badge & Delivery Timeline (Symmetrical Header) */}
      <div className="flex justify-between items-center gap-2 h-7 mb-4">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`badge text-[0.675rem] px-3 py-1 ${
              isPro
                ? "badge-white font-extrabold shadow-sm"
                : isEnterprise
                ? "bg-[var(--btn-primary-bg)]/15 text-[var(--text-primary)] font-bold border border-[var(--border-medium)]"
                : "badge-neutral font-semibold"
            }`}
          >
            {tier.tierBadge || (isPro ? "Most Popular Plan" : isEnterprise ? "Enterprise Tier" : "Starter Plan")}
          </span>
          {hasDiscount && (
            <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.65rem] px-2 py-0.5 shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[0.725rem] text-[var(--text-muted)] font-mono">
          <Clock size={13} />
          <span>{tier.deliveryTime || "1-2 Weeks"}</span>
        </div>
      </div>

      {/* Title & Symmetrical Tagline */}
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight m-0 text-[var(--text-primary)] leading-tight">
          {tier.title}
        </h3>
        <p className="text-[0.825rem] sm:text-[0.85rem] text-[var(--text-secondary)] leading-relaxed mt-2 line-clamp-2 h-[42px] m-0">
          {tier.shortDescription}
        </p>
      </div>

      {/* Symmetrical Price Block in NRs. */}
      <div className="my-5 p-4 rounded-[var(--radius-md)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex flex-col justify-center">
        <span className="text-[0.675rem] uppercase font-bold tracking-wider text-[var(--text-muted)]">
          {tier.priceType === "starting_at" ? "Starting From" : tier.priceType === "hourly" ? "Hourly Rate" : "Package Investment"}
        </span>
        <div className="flex items-baseline gap-2 mt-1 flex-wrap">
          <span className={`font-mono text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight whitespace-nowrap ${hasDiscount ? "text-emerald-400" : "text-[var(--text-primary)]"}`}>
            NRs. {activePrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="font-mono text-sm sm:text-base text-[var(--text-muted)] line-through whitespace-nowrap">
              NRs. {regPrice.toLocaleString()}
            </span>
          )}
          <span className="text-[0.75rem] text-[var(--text-muted)] font-mono whitespace-nowrap">
            NPR
          </span>
        </div>
      </div>

      {/* Features Checklist */}
      <div className="flex-1 flex flex-col gap-2.5 mb-6">
        <span className="text-[0.725rem] uppercase font-bold tracking-[0.1em] text-[var(--text-muted)] flex items-center gap-1.5 mb-1">
          <Sparkles size={12} className="text-[var(--text-primary)]" />
          <span>Included Deliverables & Features:</span>
        </span>
        <div className="flex flex-col gap-2.5 flex-1">
          {tier.features && tier.features.length > 0 ? (
            tier.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-[0.825rem] text-[var(--text-primary)]">
                <CheckCircle2
                  size={15}
                  className="shrink-0 mt-0.5 text-[var(--text-primary)] opacity-90"
                />
                <span className="leading-snug">{feat}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-[var(--text-muted)]">Full-stack custom features included</div>
          )}
        </div>
      </div>

      {/* Symmetrical Tech Stack Badges */}
      <div className="min-h-[38px] flex flex-wrap items-center gap-1.5 pt-3 mb-5 border-t border-[var(--border-subtle)]">
        {tier.technologies && tier.technologies.length > 0 ? (
          tier.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="text-[0.675rem] font-mono px-2.5 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
            >
              {tech}
            </span>
          ))
        ) : (
          <span className="text-[0.675rem] font-mono text-[var(--text-muted)]">MERN Stack Architecture</span>
        )}
      </div>

      {/* Action Buttons Anchored to Bottom */}
      <div className="flex flex-col gap-2.5 mt-auto pt-2">
        <button
          onClick={(e) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            if (onSubscribe) {
              onSubscribe(tier);
            } else {
              navigate("/services#web-development-plans");
            }
          }}
          className={`btn w-full py-3.5 gap-2 font-bold text-[0.875rem] !rounded-[var(--radius-sm)] transition-all ${
            isPro
              ? "btn-primary shadow-md hover:shadow-lg"
              : "btn-secondary hover:!bg-[var(--btn-primary-bg)] hover:!text-[var(--btn-primary-text)]"
          }`}
        >
          <span>Subscribe to This Plan</span>
          <ArrowRight size={15} />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleWhatsAppClick}
            className="btn btn-secondary btn-sm text-[0.75rem] font-semibold flex items-center justify-center gap-1.5"
          >
            <MessageCircle size={13} />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            className="btn btn-sm text-[0.75rem] font-bold bg-orange-500/15 border border-orange-500/40 hover:border-orange-400 text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1.5 transition-all shadow-xs"
            title="Share this plan"
          >
            <Share2 size={13} className="text-orange-500" />
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* Web Tier Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={`${tier.title} - Web Development Plan`}
        url="/services#web-development-plans"
        description={tier.shortDescription || tier.description}
        price={activePrice}
        category="Web Development"
      />
    </div>
  );
}

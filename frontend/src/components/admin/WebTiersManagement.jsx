import React from "react";
import {
  Zap,
  Edit2,
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Code,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function WebTiersManagement({
  services = [],
  onOpenCreateModal,
  onEditService,
  onDeleteService,
  onToggleActive,
  onToggleFeatured,
  onExitToStore,
}) {
  // Extract only Web Dev packages
  const webDevPackages = services
    .filter((s) => s.isWebDevPackage)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || (a.price || 0) - (b.price || 0));

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-black font-extrabold text-[0.65rem] uppercase tracking-wider mb-2">
            <Zap size={12} fill="currentColor" />
            <span>3-Tier Subscription Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold m-0 text-[var(--text-primary)]">
            Web Development 3-Tier Plans & Subscriptions
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-[650px] m-0">
            Configure the 3 flagship web packages featured across the Home Page and Services Page.
            Customize deliverables, pricing in Nepali Rupees (NRs.), turnarounds, and highlight badges.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onOpenCreateModal({ isWebDevPackage: true, category: "Web Development" })}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus size={13} />
            <span>Add / Create Web Tier</span>
          </button>
        </div>
      </div>

      {/* 3 Tier Subscription Cards Grid */}
      {webDevPackages.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)] bg-[var(--bg-card)]">
          <Zap size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
          <h3 className="text-base font-bold">No Web Development Tiers Configured</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Create your Starter, Professional, and Enterprise packages to display them on the storefront.
          </p>
          <button
            onClick={() => onOpenCreateModal({ isWebDevPackage: true, category: "Web Development" })}
            className="btn btn-primary btn-sm mt-4 gap-1.5"
          >
            <Plus size={13} />
            <span>Create First Web Tier</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {webDevPackages.map((pkg, idx) => {
            const isPro = pkg.packageTier === "professional";
            const isEnterprise = pkg.packageTier === "enterprise";

            const hasDiscount =
              pkg.discountPrice &&
              Number(pkg.discountPrice) > 0 &&
              Number(pkg.discountPrice) < Number(pkg.price);
            const discountPercent = hasDiscount
              ? Math.round(((Number(pkg.price) - Number(pkg.discountPrice)) / Number(pkg.price)) * 100)
              : 0;
            const activePrice = hasDiscount ? Number(pkg.discountPrice) : Number(pkg.price);
            const cost = Number(pkg.costPrice || 0);
            const profit = activePrice - cost;

            return (
              <div
                key={pkg._id}
                className={`relative rounded-[var(--radius-lg)] flex flex-col p-6 sm:p-7 h-full transition-all ${
                  isPro
                    ? "bg-[var(--bg-elevated)] border-2 border-[var(--text-primary)] shadow-lg"
                    : "bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--border-bright)]"
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-center gap-2 h-7 mb-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`badge text-[0.65rem] px-2.5 py-1 ${
                        isPro
                          ? "badge-white font-extrabold"
                          : isEnterprise
                          ? "bg-[var(--btn-primary-bg)]/15 text-[var(--text-primary)] font-bold border border-[var(--border-medium)]"
                          : "badge-neutral font-semibold"
                      }`}
                    >
                      {pkg.tierBadge || (isPro ? "Most Popular" : isEnterprise ? "Enterprise Grade" : "Starter Plan")}
                    </span>
                    {hasDiscount && (
                      <span className="badge bg-emerald-500 text-white font-mono font-bold text-[0.65rem] px-2 py-0.5">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onToggleActive(pkg._id)}
                    className={`badge cursor-pointer transition-colors ${pkg.isActive ? "badge-success" : "badge-neutral"}`}
                    title="Click to toggle live storefront visibility"
                  >
                    {pkg.isActive ? "● Live on Site" : "Hidden / Inactive"}
                  </button>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[var(--text-primary)] m-0 leading-tight">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1.5 line-clamp-2 h-[36px] m-0">
                    {pkg.shortDescription}
                  </p>
                </div>

                {/* Price Display in NRs. */}
                <div className="my-4 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">
                      Package Investment
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`font-mono text-xl font-extrabold ${hasDiscount ? "text-emerald-400" : "text-[var(--text-primary)]"}`}>
                        NRs. {activePrice.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs font-mono text-[var(--text-muted)] line-through">
                          NRs. {Number(pkg.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] block">
                      Turnaround
                    </span>
                    <span className="font-mono text-xs text-[var(--text-secondary)] flex items-center gap-1 justify-end">
                      <Clock size={11} />
                      <span>{pkg.deliveryTime || "1-2 Weeks"}</span>
                    </span>
                  </div>
                </div>

                {/* Checklist Features */}
                <div className="flex-1 flex flex-col gap-2 mb-6">
                  <div className="text-[0.7rem] uppercase font-bold text-[var(--text-muted)] flex items-center gap-1 mb-1">
                    <Sparkles size={11} className="text-[var(--text-primary)]" />
                    <span>Deliverables Checklist ({pkg.features?.length || 0})</span>
                  </div>

                  <div className="flex flex-col gap-2 flex-1">
                    {pkg.features && pkg.features.length > 0 ? (
                      pkg.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs text-[var(--text-primary)]">
                          <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-[var(--text-primary)] opacity-90" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-[var(--text-muted)]">No feature bullets configured</div>
                    )}
                  </div>
                </div>

                {/* Tech Stack */}
                {pkg.technologies && pkg.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5 pt-3 border-t border-[var(--border-subtle)]">
                    {pkg.technologies.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[0.65rem] font-mono px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-secondary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-3 border-t border-[var(--border-subtle)] mt-auto">
                  <button
                    onClick={() => onEditService(pkg)}
                    className="btn btn-primary btn-sm flex-1 gap-1.5 text-xs"
                  >
                    <Edit2 size={12} />
                    <span>Edit Plan & Features</span>
                  </button>

                  <button
                    onClick={() => onDeleteService(pkg)}
                    className="btn-icon btn-secondary !w-8 !h-8 text-[var(--color-danger)]"
                    title="Delete tier"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  Clock,
  Flame,
  Tag,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function PromoManagement({
  promoBanners = [],
  onOpenCreateModal,
  onEditPromo,
  onDeletePromo,
  onToggleActive,
  onReorderPromos,
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const sorted = [...promoBanners].sort((a, b) => (a.order || 0) - (b.order || 0));
  const activePromos = sorted.filter((p) => p.isActive);
  const currentPromo = activePromos.length > 0 ? activePromos[activeSlideIndex % activePromos.length] : sorted[0];

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const reordered = [...sorted];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    onReorderPromos(reordered.map((p, i) => ({ id: p._id, order: i + 1 })));
  };

  const handleMoveDown = (index) => {
    if (index === sorted.length - 1) return;
    const reordered = [...sorted];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    onReorderPromos(reordered.map((p, i) => ({ id: p._id, order: i + 1 })));
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Promo Strips, Philosophy & Timer Offers</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Manage dynamic announcement strips, philosophy quotes, flash sale countdown timers, and image advertisements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="badge badge-success">{activePromos.length} Live</span>
          <span className="badge badge-neutral">{sorted.length - activePromos.length} Drafts</span>
          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={14} />
            <span>Create Promo Strip</span>
          </button>
        </div>
      </div>

      {/* Live Simulator */}
      {currentPromo && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Eye size={15} />
              <span className="text-[0.825rem] font-bold">Storefront Strip Simulator</span>
            </div>

            {activePromos.length > 1 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--text-muted)] font-mono">
                  {activeSlideIndex + 1} / {activePromos.length}
                </span>
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : activePromos.length - 1))}
                  className="btn-icon btn-secondary !w-7 !h-7"
                >
                  <ArrowUp size={13} className="-rotate-90" />
                </button>
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev < activePromos.length - 1 ? prev + 1 : 0))}
                  className="btn-icon btn-secondary !w-7 !h-7"
                >
                  <ArrowDown size={13} className="-rotate-90" />
                </button>
              </div>
            )}
          </div>

          {/* Simulator Visual Box */}
          <div className="p-6 sm:p-8 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col lg:flex-row items-center justify-between gap-6">
            <div
              className={`flex-1 flex flex-col gap-2.5 ${
                currentPromo.alignment === "center"
                  ? "text-center items-center"
                  : currentPromo.alignment === "right"
                  ? "text-right items-end ml-auto"
                  : "text-left items-start"
              }`}
            >
              {currentPromo.badge && (
                <span className="badge badge-white text-[0.65rem] px-2 py-0.5 font-bold">
                  {currentPromo.badge}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] m-0 leading-tight">
                {currentPromo.title}
              </h3>
              {currentPromo.subtitle && (
                <p className="text-sm text-[var(--text-secondary)] m-0 max-w-[600px] leading-relaxed">
                  {currentPromo.subtitle}
                </p>
              )}
              {currentPromo.hasTimer && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[var(--bg-card)] border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
                    <Clock size={12} />
                    <span>{currentPromo.timerTitle || "Ends in"}: 02d 18h 45m 12s</span>
                  </div>
                </div>
              )}
              {currentPromo.ctaText && (
                <span className="btn btn-primary btn-sm text-xs px-4 py-1.5 mt-2">
                  {currentPromo.ctaText}
                </span>
              )}
            </div>

            {currentPromo.imageUrl && (
              <div className="w-full sm:w-[220px] lg:w-[260px] shrink-0 rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-app)]">
                <img
                  src={getOptimizedImageUrl(currentPromo.imageUrl, { width: 400 })}
                  alt={currentPromo.title}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promos Table List */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border-subtle)] flex justify-between items-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Configured Strips & Offers ({sorted.length})
          </span>
        </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)]">
            <Sparkles size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-semibold m-0">No promo strips created yet</p>
            <p className="text-xs mt-1">Default design philosophy quote is active on the storefront.</p>
            <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm mt-4 gap-1.5">
              <Plus size={13} />
              <span>Create First Strip</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-subtle)]">
            {sorted.map((promo, index) => (
              <div
                key={promo._id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[var(--bg-elevated)] transition-colors"
              >
                {/* Reorder Buttons & Image */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sorted.length - 1}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown size={12} />
                    </button>
                  </div>

                  {promo.imageUrl ? (
                    <img
                      src={getOptimizedImageUrl(promo.imageUrl, { width: 100 })}
                      alt=""
                      className="w-14 h-11 object-cover rounded border border-[var(--border-subtle)] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-11 rounded bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
                      <Sparkles size={16} />
                    </div>
                  )}

                  {/* Title & Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="badge badge-neutral text-[0.625rem]">{promo.badge || "Philosophy"}</span>
                      <span className="badge badge-dark text-[0.625rem] capitalize">{promo.style || "philosophy"}</span>
                      {promo.hasTimer && (
                        <span className="badge bg-amber-500/20 text-amber-400 text-[0.625rem] flex items-center gap-1">
                          <Clock size={10} />
                          <span>Timer Active</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] m-0 mt-1 truncate max-w-[360px] sm:max-w-[420px]">
                      {promo.title}
                    </h4>
                    {promo.subtitle && (
                      <p className="text-xs text-[var(--text-secondary)] m-0 truncate max-w-[360px] sm:max-w-[420px]">
                        {promo.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => onToggleActive(promo._id)}
                    className={`badge cursor-pointer border-0 ${
                      promo.isActive ? "badge-success" : "badge-neutral"
                    }`}
                  >
                    {promo.isActive ? "Live" : "Draft"}
                  </button>

                  <button
                    onClick={() => onEditPromo(promo)}
                    className="btn-icon btn-secondary !w-8 !h-8"
                    title="Edit strip"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => onDeletePromo(promo)}
                    className="btn-icon btn-ghost text-[var(--color-danger)] !w-8 !h-8"
                    title="Delete strip"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

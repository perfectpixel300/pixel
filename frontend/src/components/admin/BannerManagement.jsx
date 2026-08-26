import React, { useState } from "react";
import {
  Image as BannerIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  ExternalLink,
} from "lucide-react";

export function BannerManagement({
  banners,
  onOpenCreateModal,
  onEditBanner,
  onDeleteBanner,
  onToggleActive,
  onReorderBanners,
}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [device, setDevice] = useState("desktop");

  const sorted = [...banners].sort((a, b) => (a.order || 0) - (b.order || 0));
  const activeBanners = sorted.filter((b) => b.isActive);
  const currentBanner = activeBanners.length > 0 ? activeBanners[activeSlideIndex % activeBanners.length] : sorted[0];

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const reordered = [...sorted];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    onReorderBanners(reordered.map((b, i) => ({ id: b._id, order: i + 1 })));
  };

  const handleMoveDown = (index) => {
    if (index === sorted.length - 1) return;
    const reordered = [...sorted];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    onReorderBanners(reordered.map((b, i) => ({ id: b._id, order: i + 1 })));
  };

  return (
    <div className="flex flex-col gap-7">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Home Page Hero Banners</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Control the high-impact hero banners displaying across the storefront
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="badge badge-success">{activeBanners.length} Live</span>
          <span className="badge badge-neutral">{sorted.length - activeBanners.length} Drafts</span>
          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={14} />
            <span>Create Banner</span>
          </button>
        </div>
      </div>

      {/* Live Simulator */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Eye size={15} />
            <span className="text-[0.825rem] font-bold">Storefront Hero Simulator</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex bg-[var(--bg-input)] rounded-[var(--radius-xs)]">
              <button
                onClick={() => setDevice("desktop")}
                className={`btn-icon !w-7 !h-7 ${device === "desktop" ? "btn-primary" : "btn-ghost"}`}
              >
                <Monitor size={13} />
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`btn-icon !w-7 !h-7 ${device === "mobile" ? "btn-primary" : "btn-ghost"}`}
              >
                <Smartphone size={13} />
              </button>
            </div>

            {activeBanners.length > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : activeBanners.length - 1))}
                  className="btn-icon btn-secondary !w-7 !h-7"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev + 1) % activeBanners.length)}
                  className="btn-icon btn-secondary !w-7 !h-7"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {currentBanner ? (
          <div
            className={`rounded-[var(--radius-sm)] relative overflow-hidden bg-cover bg-center flex items-center transition-all duration-300 border border-[var(--border-medium)] ${
              device === "mobile" ? "w-[340px] mx-auto h-[280px] p-6" : "w-full h-[240px] p-10"
            }`}
            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0,0,0,${(currentBanner.overlayDarkness || 50) / 100})` }}
            />
            <div
              className={`relative z-[2] ${
                device === "mobile" ? "max-w-full" : "max-w-[540px]"
              } ${
                currentBanner.alignment === "center"
                  ? "text-center mx-auto"
                  : currentBanner.alignment === "right"
                  ? "text-right ml-auto mr-0"
                  : "text-left mr-auto ml-0"
              }`}
            >
              {currentBanner.badge && (
                <span className="badge badge-white text-[0.625rem] mb-2">
                  {currentBanner.badge}
                </span>
              )}
              <h3
                className={`text-white font-extrabold my-0.5 mb-1.5 leading-tight ${
                  device === "mobile" ? "text-lg" : "text-2xl"
                }`}
              >
                {currentBanner.title}
              </h3>
              {currentBanner.subtitle && (
                <p className="text-white/85 text-[0.8rem] mb-3.5 leading-relaxed">
                  {currentBanner.subtitle}
                </p>
              )}
              <button type="button" className="btn btn-primary btn-sm gap-1 text-[0.75rem]">
                <span>{currentBanner.ctaText || "Explore"}</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center text-[var(--text-muted)]">
            No banners available.
          </div>
        )}
      </div>

      {/* Banner Order List */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[0.95rem] font-bold">Banner Ordering & Rotation</h3>

        {sorted.map((banner, idx) => (
          <div
            key={banner._id}
            className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] py-3 px-4.5 flex items-center justify-between gap-3.5"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(idx)}
                  disabled={idx === 0}
                  className={`btn-icon btn-ghost !w-5.5 !h-5.5 ${idx === 0 ? "opacity-30" : "opacity-100"}`}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => handleMoveDown(idx)}
                  disabled={idx === sorted.length - 1}
                  className={`btn-icon btn-ghost !w-5.5 !h-5.5 ${idx === sorted.length - 1 ? "opacity-30" : "opacity-100"}`}
                >
                  <ArrowDown size={12} />
                </button>
              </div>

              <span className="badge badge-dark !w-6 !h-6 justify-center">
                #{idx + 1}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 min-w-0">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-17.5 h-11 rounded-[var(--radius-xs)] object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[0.875rem] font-bold m-0 truncate">
                    {banner.title}
                  </h4>
                  {banner.badge && <span className="badge badge-neutral text-[0.6rem]">{banner.badge}</span>}
                </div>
                <div className="text-[0.725rem] text-[var(--text-muted)] mt-0.5 truncate">
                  CTA: "{banner.ctaText}" → {banner.ctaLink}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleActive(banner._id)}
                className={`badge cursor-pointer ${banner.isActive ? "badge-success" : "badge-neutral"}`}
              >
                {banner.isActive ? "Live" : "Draft"}
              </button>

              <div className="flex gap-1">
                <button onClick={() => onEditBanner(banner)} className="btn-icon btn-secondary !w-7.5 !h-7.5">
                  <Edit2 size={12} />
                </button>
                <button onClick={() => onDeleteBanner(banner)} className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

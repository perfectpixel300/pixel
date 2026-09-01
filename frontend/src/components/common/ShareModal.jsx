import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Check,
  Copy,
  Share2,
  ExternalLink,
  Link2,
} from "lucide-react";

export function ShareModal({
  isOpen,
  onClose,
  title = "Pixel Perfect",
  url = typeof window !== "undefined" ? window.location.href : "",
  description = "",
  image = "",
  price = null,
  category = "",
}) {
  const [copied, setCopied] = useState(false);
  const [copiedPlatform, setCopiedPlatform] = useState("");

  if (!isOpen) return null;

  const fullUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
    ? `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`
    : url;

  const shareText = price
    ? `Check out "${title}" (NRs. ${Number(price).toLocaleString()}) on Pixel Perfect!`
    : `Check out "${title}" on Pixel Perfect!`;

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n${fullUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleFacebookShare = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleInstagramShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedPlatform("instagram");
      setTimeout(() => setCopiedPlatform(""), 3000);
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || shareText,
          url: fullUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  const modalContent = (
    <div
      className="modal-overlay !z-[99999] fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="modal-card bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-lg)] shadow-2xl max-w-[460px] w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative !z-[100000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)]">
              <Share2 size={15} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0 leading-tight">Share This Item</h3>
              <p className="text-[0.7rem] text-[var(--text-muted)] m-0 mt-0.5">
                Share via messaging apps or copy the direct link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon btn-ghost text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Item Preview Snippet */}
        <div className="p-5 space-y-4">
          <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-3">
            {image ? (
              <img
                src={image}
                alt={title}
                className="w-12 h-12 rounded-[var(--radius-sm)] object-cover bg-black shrink-0 border border-[var(--border-subtle)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] flex items-center justify-center shrink-0 border border-[var(--border-subtle)] text-[var(--text-muted)]">
                <Link2 size={20} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate m-0">
                {title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {category && (
                  <span className="text-[0.65rem] font-mono text-[var(--text-muted)] uppercase">
                    {category}
                  </span>
                )}
                {price !== null && price !== undefined && Number(price) > 0 && (
                  <span className="text-[0.7rem] font-mono font-bold text-emerald-400">
                    NRs. {Number(price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Share Channels Grid */}
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <span className="text-[0.7rem] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                WhatsApp
              </span>
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagramShare}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#E4405F] hover:bg-[#E4405F]/10 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#E4405F]/15 text-[#E4405F] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <span className="text-[0.7rem] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                Instagram
              </span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[#1877F2] hover:bg-[#1877F2]/10 transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-[0.7rem] font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                Facebook
              </span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                copied
                  ? "bg-emerald-500/20 text-emerald-400 scale-110"
                  : "bg-[var(--bg-card)] text-[var(--text-primary)] group-hover:scale-110"
              }`}>
                {copied ? <Check size={20} /> : <Copy size={18} />}
              </div>
              <span className={`text-[0.7rem] font-medium transition-colors ${
                copied ? "text-emerald-400 font-bold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
              }`}>
                {copied ? "Copied!" : "Copy Link"}
              </span>
            </button>
          </div>

          {/* Instagram notification toast message */}
          {copiedPlatform === "instagram" && (
            <div className="p-2.5 rounded-[var(--radius-sm)] bg-[#E4405F]/15 border border-[#E4405F]/30 text-[#E4405F] text-xs flex items-center gap-2 animate-in fade-in">
              <Check size={14} className="shrink-0" />
              <span>Link copied! Opening Instagram to paste in your story or message.</span>
            </div>
          )}

          {/* Copyable Link Input Box */}
          <div className="pt-2">
            <label className="text-[0.68rem] uppercase font-bold tracking-wider text-[var(--text-muted)] block mb-1.5">
              Direct Link
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="bg-transparent border-none text-xs text-[var(--text-secondary)] font-mono flex-1 outline-none truncate"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={handleCopyLink}
                className={`btn btn-sm text-xs gap-1 py-1.5 px-3 transition-all ${
                  copied ? "btn-primary !bg-emerald-500 !border-emerald-500 text-white" : "btn-secondary"
                }`}
              >
                {copied ? (
                  <>
                    <Check size={12} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Native Share Trigger (if supported) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <button
              onClick={handleNativeShare}
              className="btn btn-ghost w-full py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center gap-1.5"
            >
              <ExternalLink size={13} />
              <span>More sharing options (System Share)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document !== "undefined" && document.body) {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}

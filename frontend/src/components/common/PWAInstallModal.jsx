import React from "react";
import {
  Download,
  X,
  Sparkles,
  Smartphone,
  Zap,
  Layers,
  Share2,
  PlusSquare,
  CheckCircle,
} from "lucide-react";
import { usePWA } from "../../context/PWAContext";

export function PWAInstallModal() {
  const {
    showFirstVisitModal,
    dismissFirstVisitModal,
    installApp,
    isInstalled,
    showIOSInstructions,
    setShowIOSInstructions,
  } = usePWA();

  // If already installed, never render anything
  if (isInstalled) return null;

  return (
    <>
      {/* 1. First-Visit Install Modal */}
      {showFirstVisitModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-medium)] w-full max-w-md rounded-[var(--radius-xl)] shadow-2xl overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with App Banner */}
            <div className="relative p-6 pb-4 text-center bg-gradient-to-b from-[#ea580c]/10 to-transparent border-b border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={dismissFirstVisitModal}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1.5 rounded-full hover:bg-[var(--bg-elevated)] cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-2xl bg-black border border-[var(--border-medium)] p-2 shadow-lg mx-auto flex items-center justify-center overflow-hidden">
                  <img
                    src="/pixelperfect.png"
                    alt="Pixel Perfect App Icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#ea580c] text-white flex items-center justify-center shadow-md">
                  <Sparkles size={12} />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ea580c]/15 text-[#ea580c] dark:text-[#ff7828] text-[0.68rem] font-bold font-mono tracking-wider uppercase mb-1.5">
                <span>Progressive Web App</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                Install Pixel Perfect
              </h2>

              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-xs mx-auto">
                Add to your home screen for instant full-screen access, smoother browsing, and offline catalog support.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="p-6 pt-4 space-y-2.5">
              <div className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-[#ea580c]/10 text-[#ea580c] dark:text-[#ff7828] flex items-center justify-center shrink-0">
                  <Zap size={14} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--text-primary)]">Lightning-Fast Launch</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">Opens directly like a native app from your home screen</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Smartphone size={14} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--text-primary)]">Standalone Fullscreen</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">No browser bars for an immersive shopping experience</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Layers size={14} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[var(--text-primary)]">Zero App Store Wait</div>
                  <div className="text-[0.68rem] text-[var(--text-muted)]">Requires no heavy download or store account</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={dismissFirstVisitModal}
                  className="btn btn-secondary !py-2.5 text-xs font-semibold cursor-pointer w-full"
                >
                  Cancel / Not Now
                </button>

                <button
                  type="button"
                  onClick={installApp}
                  className="btn btn-primary !py-2.5 text-xs font-bold gap-2 cursor-pointer w-full shadow-md shadow-orange-500/20"
                >
                  <Download size={15} />
                  <span>Install App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. iOS Safari Installation Guidance Modal */}
      {showIOSInstructions && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-[var(--bg-card)] border border-[var(--border-medium)] w-full max-w-sm rounded-[var(--radius-xl)] shadow-2xl p-6 text-center space-y-4 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ea580c]/15 text-[#ea580c] dark:text-[#ff7828] flex items-center justify-center mx-auto">
              <Smartphone size={24} />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Install on iOS Safari
              </h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Follow these 2 simple steps to add Pixel Perfect to your iPhone/iPad home screen:
              </p>
            </div>

            <div className="space-y-2.5 text-left text-xs bg-[var(--bg-elevated)] p-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#ea580c] text-white text-[0.68rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span>Tap the <strong>Share</strong> button (</span>
                  <Share2 size={13} className="inline mx-1 text-[#ea580c]" />
                  <span>) at the bottom of Safari.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#ea580c] text-white text-[0.68rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong> (</span>
                  <PlusSquare size={13} className="inline mx-1 text-[#ea580c]" />
                  <span>).</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[0.68rem] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span>Tap <strong>"Add"</strong> in the top-right corner to finish.</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSInstructions(false)}
              className="btn btn-primary w-full !py-2.5 text-xs font-bold cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

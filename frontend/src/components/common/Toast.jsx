import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[2000] flex items-center gap-2.5 px-4 py-3 bg-[var(--bg-elevated)] border border-[var(--border-medium)] rounded-[var(--radius-sm)] shadow-[var(--shadow-xl)] text-[var(--text-primary)] text-[0.825rem] max-w-[calc(100vw-2rem)] sm:max-w-[400px] animate-[scaleUp_0.2s_ease-out]"
    >
      {toast.type === "error" ? (
        <AlertCircle size={17} className="text-[var(--color-danger)] shrink-0" />
      ) : toast.type === "info" ? (
        <Info size={17} className="text-white shrink-0" />
      ) : (
        <CheckCircle2 size={17} className="text-[var(--color-success)] shrink-0" />
      )}

      <span className="flex-1 font-semibold">{toast.message}</span>
      <button
        onClick={onClose}
        className="bg-transparent border-0 text-[var(--text-muted)] cursor-pointer p-0.5 hover:text-[var(--text-primary)]"
      >
        <X size={14} />
      </button>
    </div>
  );
}

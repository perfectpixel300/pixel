import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

export function DeleteConfirmModal({
  isOpen,
  title = "Confirm Deletion",
  itemName,
  type = "item",
  onConfirm,
  onCancel,
  isDeleting,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card max-w-[420px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-[var(--color-danger-bg)] text-[var(--color-danger)] flex items-center justify-center">
              <AlertTriangle size={16} />
            </div>
            <h3 className="text-[0.95rem] font-bold m-0">{title}</h3>
          </div>
          <button onClick={onCancel} className="btn-icon btn-ghost">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body p-5">
          <p className="text-[var(--text-secondary)] text-[0.85rem] leading-relaxed">
            Are you sure you want to permanently remove this {type}?
            {itemName && (
              <span className="block font-bold text-[var(--text-primary)] my-2 px-2.5 py-1.5 bg-[var(--bg-input)] rounded-[var(--radius-xs)] border border-[var(--border-subtle)]">
                "{itemName}"
              </span>
            )}
            This operation cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm gap-1.5"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={13} />
            <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

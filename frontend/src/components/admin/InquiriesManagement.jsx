import React, { useState } from "react";
import { MessageSquare, Trash2, Mail, Package } from "lucide-react";

export function InquiriesManagement({
  inquiries = [],
  onDeleteInquiry,
}) {
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const filtered = inquiries.filter((i) => {
    if (filter === "unread" && i.status !== "unread") return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Client Inquiries & Correspondence</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Messages received from the contact form and direct product order inquiries
          </p>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          >
            All Messages ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-secondary"}`}
          >
            Unread ({inquiries.filter((i) => i.status === "unread").length})
          </button>
        </div>
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)] p-16 text-center">
          <MessageSquare size={32} className="text-[var(--text-muted)] mb-2.5 mx-auto" />
          <h3 className="text-base font-bold">No inquiries recorded</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            New correspondence from the contact form will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inq) => (
            <div
              key={inq._id}
              className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 flex flex-col gap-2.5"
            >
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[0.95rem]">{inq.name}</span>
                    <span className="badge badge-neutral text-[0.65rem]">
                      {inq.email}
                    </span>
                    {inq.productTitle && (
                      <span className="badge badge-dark text-[0.65rem] flex items-center gap-1">
                        <Package size={11} />
                        <span>{inq.productTitle}</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[0.825rem] font-semibold text-[var(--text-primary)] mt-1">
                    Subject: {inq.subject}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-[0.7rem] text-[var(--text-muted)] font-mono">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onDeleteInquiry(inq)}
                    className="btn-icon btn-secondary !w-7 !h-7 text-[var(--color-danger)]"
                    title="Delete Inquiry"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="bg-[var(--bg-input)] rounded-[var(--radius-xs)] p-3 text-[0.85rem] text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {inq.message}
              </div>

              <div className="flex justify-end">
                <a
                  href={`mailto:${inq.email}?subject=${encodeURIComponent("Re: " + inq.subject)}`}
                  className="btn btn-secondary btn-sm gap-1.5 text-[0.75rem]"
                >
                  <Mail size={12} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

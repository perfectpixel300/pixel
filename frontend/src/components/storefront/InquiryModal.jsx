import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, MessageSquare, MessageCircle, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

export function InquiryModal({ isOpen, onClose, product, onSubmitted }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const atelierWhatsAppNumber = "9779845991878"; // Nepal WhatsApp hotline

  useEffect(() => {
    if (product) {
      const isService = product.type === "service" || product.packageTier;
      const itemName = product.name || product.title || "Selected Item";
      const priceStr = product.indicativePrice || product.price ? `NRs. ${Number(product.indicativePrice || product.price).toLocaleString()}` : "";

      setFormData({
        name: "",
        email: "",
        subject: `Inquiry: ${itemName}`,
        message: isService
          ? `Hello Pixel Perfect Team,\n\nI would like to inquire about your "${itemName}" service ${priceStr ? `(${priceStr})` : ""}.\nPlease share the project timeline, kickoff process, and proposal details.\n\nThank you.`
          : `Hello Pixel Perfect Atelier,\n\nI would like to inquire about purchasing "${itemName}" ${priceStr ? `(${priceStr})` : ""}. Please advise on availability and bespoke options.\n\nThank you.`,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        subject: "General Project & Studio Inquiry",
        message: "",
      });
    }
    setIsSuccess(false);
    setError("");
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Generate WhatsApp message URL
  const getWhatsAppUrl = () => {
    let text = "Hello Pixel Perfect Team,\n";
    if (product) {
      const itemName = product.name || product.title;
      const priceVal = product.indicativePrice || product.price;
      text += `I am inquiring about "${itemName}" ${priceVal ? `(Price: NRs. ${Number(priceVal).toLocaleString()})` : ""}.\nCategory: ${product.category || "General"}.\nCould you please advise on availability, scope, and next steps?`;
    } else {
      text += "I would like to ask a question regarding your products and IT web development services.";
    }
    return `https://wa.me/${atelierWhatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please complete all required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const payload = {
        ...formData,
        productTitle: product ? product.name : "",
      };
      await api.submitContact(payload);
      setIsSuccess(true);
      if (onSubmitted) onSubmitted();
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[580px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)]">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {product ? `Inquire: ${product.name}` : "Atelier Direct Inquiry"}
              </h3>
              <span className="text-[0.725rem] text-[var(--text-muted)]">
                Fast communication via WhatsApp or Direct Form
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={16} />
          </button>
        </div>

        {/* WhatsApp Fast Channel Button */}
        <div className="px-6 py-4 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
              Instant Messaging
            </span>
            <span className="text-[0.68rem] text-[var(--color-success)] font-medium">
              ● Atelier Online
            </span>
          </div>

          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary w-full py-3 gap-2 text-[0.85rem] !bg-white !text-black"
          >
            <MessageCircle size={17} />
            <span>Chat Directly on WhatsApp</span>
            <ArrowRight size={14} className="ml-auto" />
          </a>
        </div>

        {/* Web Form Section */}
        {isSuccess ? (
          <div className="py-12 px-8 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold">Inquiry Received</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-[380px]">
              Your inquiry has been recorded in the atelier ledger. Our makers will reach out to you via email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="modal-body pt-5">
              <div className="text-[0.75rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)] mb-2.5">
                Or Send an Email Inquiry
              </div>

              {error && (
                <div className="p-2.5 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-[0.8rem] mb-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Julian Wright"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="julian@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Questions *</label>
                <textarea
                  required
                  rows="3"
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm gap-1.5"
                disabled={isSubmitting}
              >
                <Send size={13} />
                <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

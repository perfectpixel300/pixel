import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle2, MessageSquare, MessageCircle, ArrowRight } from "lucide-react";
import { api } from "../../services/api";
import { CountryPhoneInput } from "../common/CountryPhoneInput";
import { validatePhoneNumber } from "../../utils/phoneValidation";
import { useAuth } from "../../context/AuthContext";

export function InquiryModal({ isOpen, onClose, product, onSubmitted }) {
  const { user } = useAuth();
  const [countryCode, setCountryCode] = useState("+977");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const supportWhatsAppNumber = "9779808950275"; // Nepal WhatsApp hotline

  useEffect(() => {
    const defaultCountry = user?.countryCode || "+977";
    const defaultPhone = user?.contactNumber || "";
    const defaultName = user?.fullName || user?.name || "";
    const defaultEmail = user?.email || "";
    setCountryCode(defaultCountry);

    if (product) {
      const isCartOrder = product.type === "order" || product.isCartOrder || (product.cartItems && product.cartItems.length > 0);
      const isService = product.type === "service" || product.packageTier;
      const itemName = product.name || product.title || "Selected Item";
      const priceStr = product.indicativePrice || product.price ? `NRs. ${Number(product.indicativePrice || product.price).toLocaleString()}` : "";

      let initialMessage = "";
      if (isCartOrder) {
        if (product.description) {
          initialMessage = product.description;
        } else if (product.cartItems && product.cartItems.length > 0) {
          const listStr = product.cartItems
            .map((item, idx) => {
              const itemPrice = Number(item.price) || 0;
              const itemTotal = itemPrice * (item.quantity || 1);
              return `${idx + 1}. ${item.name} - Quantity: ${item.quantity}, Price: NRs. ${itemPrice.toLocaleString()} (Total: NRs. ${itemTotal.toLocaleString()})`;
            })
            .join("\n");
          const totalVal = product.subtotal || product.indicativePrice || 0;
          initialMessage = `Hello Pixel Perfect Team,\n\nI would like to inquire about purchasing the following items from my cart:\n\n${listStr}\n\nTotal Price: NRs. ${Number(totalVal).toLocaleString()}\n\nPlease advise on product availability, delivery timeframe, and payment options.\n\nThank you.`;
        } else {
          initialMessage = `Hello Pixel Perfect Team,\n\nI would like to inquire about purchasing items from my cart ${priceStr ? `(Total: ${priceStr})` : ""}.\nPlease advise on product availability, delivery timeframe, and payment options.\n\nThank you.`;
        }
      } else if (isService) {
        initialMessage = `Hello Pixel Perfect Team,\n\nI would like to inquire about your "${itemName}" service ${priceStr ? `(${priceStr})` : ""}.\nPlease share the project timeline, kickoff process, and proposal details.\n\nThank you.`;
      } else {
        initialMessage = `Hello Pixel Perfect,\n\nI would like to inquire about purchasing "${itemName}" ${priceStr ? `(${priceStr})` : ""}. Please advise on availability.\n\nThank you.`;
      }

      setFormData({
        name: defaultName,
        email: defaultEmail,
        phone: defaultPhone,
        subject: isCartOrder ? `Order Inquiry: ${itemName}` : `Inquiry: ${itemName}`,
        message: initialMessage,
      });
    } else {
      setFormData({
        name: defaultName,
        email: defaultEmail,
        phone: defaultPhone,
        subject: "General Project & Studio Inquiry",
        message: "",
      });
    }
    setIsSuccess(false);
    setError("");
  }, [product, isOpen, user]);

  if (!isOpen) return null;

  // Generate WhatsApp message URL
  const getWhatsAppUrl = () => {
    const isCartOrder = product?.type === "order" || product?.isCartOrder || (product?.cartItems && product?.cartItems.length > 0);

    let text = "";
    if (isCartOrder) {
      text = formData.message || "Hello Pixel Perfect Team,\nI would like to inquire about my cart order.";
      if (formData.name) text += `\n\nName: ${formData.name}`;
      if (formData.phone) text += `\nContact: ${countryCode} ${formData.phone}`;
      return `https://wa.me/${supportWhatsAppNumber}?text=${encodeURIComponent(text)}`;
    }

    text = "Hello Pixel Perfect Team,\n";
    if (product) {
      const itemName = product.name || product.title;
      const priceVal = product.indicativePrice || product.price;
      text += `I am inquiring about "${itemName}" ${priceVal ? `(Price: NRs. ${Number(priceVal).toLocaleString()})` : ""}.\nCategory: ${product.category || "General"}.\n`;
    } else {
      text += "I would like to ask a question regarding your products and IT web development services.\n";
    }
    if (formData.name) text += `Name: ${formData.name}\n`;
    if (formData.phone) text += `Contact: ${countryCode} ${formData.phone}\n`;
    text += "Could you please advise on availability, scope, and next steps?";
    return `https://wa.me/${supportWhatsAppNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = (formData.phone || "").trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (/\d/.test(trimmedName)) {
      setError("Name must contain only alphabetic characters, not numbers.");
      return;
    }
    if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      setError("Name must contain only alphabetic letters and spaces.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Name must be at least 2 characters long.");
      return;
    }

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Verify contact number with selected country code like in user account creation
    const phoneValidation = validatePhoneNumber(trimmedPhone, countryCode);
    if (!phoneValidation.isValid) {
      setError(`Phone Number: ${phoneValidation.message}`);
      return;
    }

    if (!trimmedMessage) {
      setError("Please enter your message or question.");
      return;
    }
    if (trimmedMessage.length < 5) {
      setError("Message must be at least 5 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const fullPhone = `${countryCode} ${phoneValidation.cleanNumber}`;
      const payload = {
        ...formData,
        name: trimmedName,
        email: trimmedEmail,
        phone: fullPhone,
        message: trimmedMessage,
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
        className="modal-card w-[calc(100%-1.5rem)] sm:w-full max-w-[580px] max-h-[92vh] flex flex-col overflow-hidden mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-[var(--radius-xs)] bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)]">
              <MessageSquare size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold m-0">
                {product ? `Inquire: ${product.name}` : "Direct Inquiry"}
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
        <div className="px-6 py-4 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] flex flex-col gap-2 shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-[0.725rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
              Instant Messaging
            </span>
            <span className="text-[0.68rem] text-[var(--color-success)] font-medium">
              ● Online
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
          <div className="py-12 px-8 text-center flex flex-col items-center gap-3 overflow-y-auto minimal-scrollbar">
            <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-lg font-bold">Inquiry Received</h3>
            <p className="text-[var(--text-secondary)] text-sm max-w-[380px]">
              Your inquiry has been recorded in the our ledger. Our makers will reach out to you via email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="modal-body pt-5 overflow-y-auto minimal-scrollbar">
              <div className="text-[0.75rem] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)] mb-2.5">
                Or Send an Email Inquiry
              </div>

              {error && (
                <div className="p-2.5 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-[0.8rem] mb-3">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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

                <div className="form-group sm:col-span-2">
                  <CountryPhoneInput
                    label="Phone Number"
                    required={true}
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    value={formData.phone}
                    onChange={(val) => setFormData({ ...formData, phone: val })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {product?.type === "order" || product?.isCartOrder ? "Cart Order Items & Inquiry Message *" : "Message / Questions *"}
                </label>
                <textarea
                  required
                  rows={product?.type === "order" || product?.isCartOrder ? 7 : 3}
                  className="form-textarea text-xs sm:text-sm leading-relaxed font-mono"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer shrink-0">
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

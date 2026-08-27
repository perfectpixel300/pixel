import React, { useState } from "react";
import { Send, CheckCircle2, MapPin, Mail, Clock, ChevronDown, ChevronUp, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [activeFaq, setActiveFaq] = useState(null);

  const atelierWhatsApp = "https://wa.me/977980895925?text=Hello%20Pixel%20Perfect%20Atelier,%20I%20would%20like%20to%20inquire%20about%20your%20stationery%20and%20bespoke%20options.";

  const faqs = [
    {
      q: "How do I place an order or inquire about purchasing?",
      a: "Since we craft in limited edition batches, you can submit an inquiry through this form or click 'Inquire' on any product page. Our studio will promptly send you direct confirmation and delivery details.",
    },
    {
      q: "Do you offer custom leather embossing or monogramming?",
      a: "Yes. For our full-grain leather journals and desk mats, we offer complimentary hot-stamp blind embossing or silver foil monogramming up to 3 initials.",
    },
    {
      q: "What fountain pen inks are compatible with your Munken notebooks?",
      a: "Our 120 GSM Munken Lynx paper is tested with pigment-based, iron gall, and dye-based fountain pen inks including Iroshizuku, Diamine, and Sailor with zero feathering or bleed-through.",
    },
    {
      q: "What are your international shipping timeframes?",
      a: "Standard European dispatch is 2-4 business days. International express to North America and Asia typically arrives in 4-6 business days via carbon-neutral DHL Express.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
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

    if (!trimmedMessage) {
      setError("Please enter your message.");
      return;
    }
    if (trimmedMessage.length < 5) {
      setError("Message must be at least 5 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await api.submitContact({
        name: trimmedName,
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to submit message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 pb-24">
      <div className="storefront-container">
        {/* Header */}
        <div className="mb-14 max-w-[640px]">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Correspondence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
            Contact us
          </h1>
          <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2">
            Whether you have questions regarding bespoke embossing, wholesale inquiries, or catalog items, we welcome your correspondence.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-14 items-start mb-20">
          {/* Form */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 sm:p-9">
            <h3 className="text-lg font-bold mb-6">
              Send a Direct Message
            </h3>

            {isSuccess ? (
              <div className="py-10 px-4 text-center flex flex-col items-center gap-2.5">
                <div className="w-11 h-11 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] flex items-center justify-center">
                  <CheckCircle2 size={22} />
                </div>
                <h4 className="text-base font-bold">Correspondence Dispatched</h4>
                <p className="text-[var(--text-secondary)] text-[0.85rem] max-w-[340px]">
                  Your message has been safely logged in our records. We typically respond within 24 hours.
                </p>
                <button onClick={() => setIsSuccess(false)} className="btn btn-secondary btn-sm mt-2">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="p-2.5 bg-[var(--color-danger-bg)] text-[var(--color-danger)] rounded-[var(--radius-sm)] text-[0.8rem] mb-3.5">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bespoke order inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    required
                    rows="5"
                    className="form-textarea"
                    placeholder="Detail your inquiry, quantities, or customization wishes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-3 gap-1.5"
                >
                  <Send size={14} />
                  <span>{isSubmitting ? "Sending Correspondence..." : "Send Message"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Atelier Info & WhatsApp Quick Chat */}
          <div className="flex flex-col gap-6">
            {/* WhatsApp Quick Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-medium)] rounded-[var(--radius-lg)] p-7 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <h3 className="text-base font-bold m-0">
                  Instant WhatsApp Contact
                </h3>
              </div>
              <p className="text-[0.825rem] text-[var(--text-muted)] leading-normal m-0">
                Prefer instant messaging? Chat directly with our Stockholm atelier team for real-time inventory checks and bespoke custom requests.
              </p>
              <a
                href={atelierWhatsApp}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary py-3 px-5 text-[0.825rem] gap-2 mt-1"
              >
                <MessageCircle size={15} />
                <span>Open WhatsApp Chat</span>
                <ArrowRight size={13} className="ml-auto" />
              </a>
            </div>

            {/* Studio Info Details */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8 flex flex-col gap-6">
              <h3 className="text-base font-bold m-0">
                Studio Contact & Address
              </h3>

              <div className="flex gap-3 items-start">
                <Phone size={18} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Telephone Hotline</div>
                  <a href="tel:+977980895925" className="text-[0.85rem] text-[var(--text-secondary)] font-mono hover:text-[var(--text-primary)]">
                    +977 980895925
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Mail size={18} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Direct Email</div>
                  <a href="mailto:pixelperfect300@gmail.com" className="text-[0.85rem] text-[var(--text-secondary)] font-mono hover:text-[var(--text-primary)]">
                    pixelperfect300@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin size={18} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">PixelPerfect Stationery</div>
                  <div className="text-[0.8rem] text-[var(--text-muted)] mt-0.5">
                    Mahalaxmi 8, Devisthan, Lalitpur, Nepal
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock size={18} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm">Visiting Hours</div>
                  <div className="text-[0.8rem] text-[var(--text-muted)] mt-0.5">
                    Everyday: 7:00 – 20:00 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-8 tracking-[-0.02em]">
            Frequently Asked Questions
          </h2>

          <div className="flex flex-col gap-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 flex justify-between items-center bg-transparent border-0 text-[var(--text-primary)] font-semibold text-sm text-left cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-[var(--text-secondary)] text-[0.85rem] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

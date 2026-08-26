import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { CATEGORIES } from "../../data/mockData";

export function Footer({ setActivePage }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (page) => {
    setActivePage(page);
    scrollToTop();
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] mt-auto pt-18 pb-10">
      <div className="storefront-container">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand & Atelier Mission */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[1.1rem] font-extrabold tracking-[0.08em] uppercase">
              PIXEL PERFECT
            </span>
            <p className="text-[0.85rem] text-[var(--text-muted)] leading-relaxed max-w-[320px]">
              An independent stationery atelier dedicated to tactile objects of contemplation,
              precision-machined brass writing tools, and archival Swedish Munken paper.
            </p>

            {/* Social Media Links with clean SVGs */}
            <div className="flex items-center gap-2.5 mt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/perfect_pixel300/"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary !w-8 !h-8"
                title="Follow on Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/9808950275?text=Hello%20Pixel%20Perfect%20Atelier"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary !w-8 !h-8"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em]">
              Navigation
            </span>
            <span onClick={() => handleNav("home")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Home Studio
            </span>
            <span onClick={() => handleNav("products")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              All Products Catalog
            </span>
            <span onClick={() => handleNav("services")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              IT & Web Development Services
            </span>
            <span onClick={() => handleNav("about")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              The Atelier Philosophy
            </span>
            <span onClick={() => handleNav("contact")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Contact & Inquiries
            </span>
          </div>

          {/* Col 3: Disciplines */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em]">
              Disciplines
            </span>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <span
                key={cat}
                onClick={() => handleNav("products")}
                className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Col 4: Contact & Phone Numbers */}
          <div className="flex flex-col gap-3">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em]">
              Direct Contact & Numbers
            </span>

            <div className="flex flex-col gap-2 text-[0.825rem] text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--text-primary)] shrink-0" />
                <a href="tel:+977 9808950275" className="text-inherit font-mono font-semibold hover:text-[var(--text-primary)]">
                  +977 9808950275 (Studio Number)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-[var(--text-primary)] shrink-0" />
                <a href="tel:+977 9808950275" className="text-inherit font-mono font-semibold hover:text-[var(--text-primary)]">
                  +977 9845991878 (Bikash Shrestha)
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MessageCircle size={14} className="text-[var(--text-primary)] shrink-0" />
                <a
                  href="https://wa.me/9808950275?text=Hello%20Pixel%20Perfect%20Atelier"
                  target="_blank"
                  rel="noreferrer"
                  className="text-inherit font-mono hover:text-[var(--text-primary)]"
                >
                  WhatsApp: +977 9808950275
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={14} className="text-[var(--text-primary)] shrink-0" />
                <a href="mailto:pixelperfect300@gmail.com" className="text-inherit font-mono hover:text-[var(--text-primary)]">
                  perfectpixel300@gmail.com
                </a>
              </div>

              <div className="flex items-start gap-2 mt-0.5">
                <MapPin size={14} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
                <span className="text-[0.78rem] text-[var(--text-muted)]">
                  J9RH+MP3 Mahalaxmi-08, Devistha 44708
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="border-t border-[var(--border-subtle)] pt-7 flex items-center justify-between flex-wrap gap-3 text-[0.75rem] text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} PIXEL PERFECT. All rights reserved. Precision analog tools.
          </div>

          <div className="flex items-center gap-4">
            
            <button
              onClick={scrollToTop}
              className="bg-transparent border-0 text-[var(--text-muted)] cursor-pointer text-[0.75rem] hover:text-[var(--text-primary)]"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

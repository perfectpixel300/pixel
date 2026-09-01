import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";

export function Footer({ setActivePage, categories = [] }) {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (page) => {
    if (setActivePage) setActivePage(page);
    if (page === "home") navigate("/");
    else navigate(`/${page}`);
    scrollToTop();
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] mt-auto pt-18 pb-24 lg:pb-10">
      <div className="storefront-container">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Mission */}
          <div className="flex flex-col gap-3.5">
            <span className="text-[1.1rem] font-extrabold tracking-[0.08em] uppercase">
              PIXEL PERFECT
            </span>
            <p className="text-[0.85rem] text-[var(--text-muted)] leading-relaxed max-w-[320px]">
              An independent studio dedicated to quality stationery, precision writing tools,
              custom printing, and modern digital services.
            </p>

            {/* Social Media Links with clean SVGs */}
            <div className="flex items-center gap-2.5 mt-1">
              {/* WhatsApp */}
              <a
                href="https://wa.me/9779808950275?text=Hello%20Pixel%20Perfect"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary !w-8 !h-8 hover:text-[#25D366] transition-colors"
                title="Chat on WhatsApp"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/perfect_pixel300/"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary !w-8 !h-8 hover:text-[#E4405F] transition-colors"
                title="Follow on Instagram"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/pixelperfectstationery"
                target="_blank"
                rel="noreferrer"
                className="btn-icon btn-secondary !w-8 !h-8 hover:text-[#1877F2] transition-colors"
                title="Follow on Facebook"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.08em]">
              Navigation
            </span>
            <span onClick={() => handleNav("home")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Home
            </span>
            <span onClick={() => handleNav("products")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              All Products
            </span>
            <span onClick={() => handleNav("printing")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Printing Services
            </span>
            <span onClick={() => handleNav("services")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              IT & Web Development Services
            </span>
            <span onClick={() => handleNav("blogs")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Blog & Articles
            </span>
            <span onClick={() => handleNav("about")} className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              About Us
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
            {(categories.length > 0
              ? categories.slice(0, 5).map((c) => (typeof c === "string" ? c : c.name))
              : ["Notebooks", "Pens & Writing", "Desk Accessories", "Fine Paper", "Art Supplies"]
            ).map((catName) => (
              <span
                key={catName}
                onClick={() => {
                  navigate(`/products?category=${encodeURIComponent(catName)}`);
                  scrollToTop();
                }}
                className="cursor-pointer text-[0.85rem] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {catName}
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
                  href="https://wa.me/9808950275?text=Hello%20Pixel%20Perfect"
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
                <a
                  href="https://maps.app.goo.gl/Ytvdx85tYDftR7kR8?g_st=ac"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.78rem] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  J9RH+MP3 Mahalaxmi-08, Devistha 44708
                </a>
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

import React, { useState } from "react";
import { ArrowLeft, MessageSquare, MessageCircle, ShieldCheck, Check } from "lucide-react";

export function ProductDetailPage({
  product,
  onBack,
  onInquire,
}) {
  const images = product?.images && product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000"];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const atelierWhatsAppNumber = "+9779808950275";
  const whatsAppText = `Hello Pixel Perfect,\nI am inquiring about "${product.name}" (Price: NRs. ${Number(product.indicativePrice).toLocaleString()}). Please advise on availability and bespoke options.`;
  const whatsAppUrl = `https://wa.me/${atelierWhatsAppNumber}?text=${encodeURIComponent(whatsAppText)}`;

  return (
    <div className="py-12 pb-24">
      <div className="storefront-container">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="btn btn-ghost btn-sm gap-1.5 mb-8 pl-0 hover:pl-1 transition-all"
        >
          <ArrowLeft size={15} />
          <span>Back to Collection</span>
        </button>

        {/* Product Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3.5">
            {/* Main Image */}
            <div className="rounded-[var(--radius-md)] overflow-hidden h-[360px] sm:h-[460px] lg:h-auto bg-[#050505] border border-[var(--border-subtle)]">
              <img
                src={images[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-18 h-18 rounded-[var(--radius-sm)] overflow-hidden cursor-pointer shrink-0 transition-all duration-200 ${
                      activeImgIndex === idx ? "opacity-100 scale-105" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Specs */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex gap-2 mb-2.5 flex-wrap">
                <span className="badge badge-dark">{product.category}</span>
                <span className={`badge ${product.isAvailable ? "badge-success" : "badge-neutral"}`}>
                  {product.isAvailable ? "Available" : "Out of Stock"}
                </span>
                {product.featured && <span className="badge badge-white">Featured Object</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight m-0 mb-2 capitalize">
                {product.name}
              </h1>

              <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                NRs. {Number(product.indicativePrice).toLocaleString()}
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-[var(--border-subtle)] pt-5">
              <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2">
                Craftsmanship & Description
              </h4>
              <p className="text-[var(--text-secondary)] text-[0.925rem] leading-relaxed m-0">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Table */}
            {product.specs && (
              <div className="border-t border-[var(--border-subtle)] pt-5">
                <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
                  Material Specifications
                </h4>
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-subtle)]">
                  {product.specs.paperGsm && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Paper Stock</span>
                      <span className="font-semibold">{product.specs.paperGsm}</span>
                    </div>
                  )}
                  {product.specs.binding && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Binding / Construction</span>
                      <span className="font-semibold">{product.specs.binding}</span>
                    </div>
                  )}
                  {product.specs.color && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Color & Finish</span>
                      <span className="font-semibold">{product.specs.color}</span>
                    </div>
                  )}
                  {product.specs.dimensions && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Dimensions</span>
                      <span className="font-semibold">{product.specs.dimensions}</span>
                    </div>
                  )}
                  {product.specs.origin && (
                    <div className="flex justify-between px-3.5 py-2.5 text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Provenance</span>
                      <span className="font-semibold">{product.specs.origin}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Direct Inquiry & WhatsApp Action Buttons */}
            <div className="pt-4 flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary py-3.5 text-sm gap-2"
                >
                  <MessageCircle size={17} />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => onInquire(product)}
                  className="btn btn-secondary py-3.5 text-sm gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Send Web Inquiry</span>
                </button>
              </div>

              <div className="text-[0.75rem] text-[var(--text-muted)] text-center">
                Direct consultation with our master craftspeople • Limited edition batches
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

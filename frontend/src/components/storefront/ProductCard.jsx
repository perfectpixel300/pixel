import React from "react";
import { MessageSquare, ArrowUpRight } from "lucide-react";

export function ProductCard({ product, onViewDetails, onInquire }) {
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800";

  return (
    <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col transition-all duration-300 border border-[var(--border-subtle)] hover:shadow-xl group">
      {/* Image Container with zoom */}
      <div
        onClick={() => onViewDetails(product)}
        className="h-[280px] relative overflow-hidden cursor-pointer bg-[#050505]"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <span className="badge badge-dark backdrop-blur-sm">
            {product.category}
          </span>
          {product.featured && <span className="badge badge-white">Featured</span>}
        </div>

        {/* Quick View Hover overlay indicator */}
        <div className="absolute bottom-3 right-3 w-7.5 h-7.5 rounded-full bg-black/75 text-white flex items-center justify-center">
          <ArrowUpRight size={15} />
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2.5">
          <h3
            onClick={() => onViewDetails(product)}
            className="text-base font-bold m-0 leading-snug cursor-pointer hover:text-zinc-500 transition-colors capitalize"
          >
            {product.name}
          </h3>
          <span className="font-bold font-mono text-[0.95rem] whitespace-nowrap text-[var(--text-primary)]">
            NRs. {Number(product.indicativePrice).toLocaleString()}
          </span>
        </div>

        <p className="text-[0.8rem] text-[var(--text-secondary)] leading-relaxed m-0 line-clamp-2 min-h-[38px]">
          {product.description}
        </p>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-[var(--border-subtle)]">
          <span
            className={`text-[0.725rem] font-semibold ${
              product.isAvailable ? "text-[var(--color-success)]" : "text-[var(--text-muted)]"
            }`}
          >
            ● {product.isAvailable ? "Available" : "Out of Stock"}
          </span>

          <div className="flex gap-1.5">
            <button
              onClick={() => onInquire(product)}
              className="btn btn-secondary btn-sm gap-1 text-[0.725rem]"
              title="Inquire about this piece"
            >
              <MessageSquare size={12} />
              <span>Inquire</span>
            </button>
            <button
              onClick={() => onViewDetails(product)}
              className="btn btn-primary btn-sm text-[0.725rem]"
            >
              Specs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

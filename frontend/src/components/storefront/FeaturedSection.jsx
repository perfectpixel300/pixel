import React from "react";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

export function FeaturedSection({ products, onViewDetails, onInquire, onBrowseAll }) {
  const featuredProducts = products.filter((p) => p.featured);
  const displayItems = featuredProducts.length > 0 ? featuredProducts.slice(0, 3) : products.slice(0, 3);

  return (
    <section className="py-20 border-b border-[var(--border-subtle)]">
      <div className="storefront-container">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Spotlight
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
              Featured Artifacts
            </h2>
            <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2">
              Select objects highlighted for exceptional material purity and thoughtful engineering.
            </p>
          </div>

          <button onClick={onBrowseAll} className="btn btn-secondary gap-1.5">
            <span>View All Products</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {displayItems.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onViewDetails={onViewDetails}
              onInquire={onInquire}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function CategoryGrid({ categories = [], onSelectCategory }) {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    navigate(`/products?category=${encodeURIComponent(catName)}`);
  };

  return (
    <section className="py-22 border-b border-[var(--border-subtle)]">
      <div className="storefront-container">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-[600px] mx-auto">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
            Curated Categories
          </h2>
          <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2">
            Explore our specialized collections categorized by type.
          </p>
        </div>

        {/* Categories Grid - 2 cols on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id || cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className="h-40 sm:h-56 md:h-[260px] relative rounded-[var(--radius-md)] overflow-hidden cursor-pointer border border-[var(--border-subtle)] bg-[var(--bg-card)] group"
            >
              {/* Background Image */}
              {cat.imageUrl ? (
                <img
                  src={getOptimizedImageUrl(cat.imageUrl, { width: 800 })}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1c1c1e] to-[#0a0a0b] flex items-center justify-center">
                  <Layers size={32} className="text-white/20 sm:size-10" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3.5 sm:p-7 flex flex-col justify-end">
                <div>
                  <h3 className="text-sm sm:text-xl font-extrabold text-white m-0 mb-0.5 sm:mb-1.5 line-clamp-1">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[0.7rem] sm:text-[0.8rem] text-white/75 leading-tight sm:leading-snug m-0 line-clamp-1 sm:line-clamp-2 hidden xs:block">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 text-white text-[0.65rem] sm:text-[0.775rem] font-bold uppercase tracking-[0.06em] mt-1.5 sm:mt-3">
                  <span>Explore</span>
                  <ArrowRight size={11} className="sm:size-[13px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

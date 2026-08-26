import React from "react";
import { ArrowRight } from "lucide-react";
import { initialMockCategories } from "../../data/mockData";

export function CategoryGrid({ categories = [], onSelectCategory }) {
  const displayCategories = categories.length > 0 ? categories : initialMockCategories;

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
            Explore our specialized atelier collections categorized by function and craft.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((cat) => (
            <div
              key={cat._id || cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="h-[260px] relative rounded-[var(--radius-md)] overflow-hidden cursor-pointer border border-[var(--border-subtle)] group"
            >
              {/* Background Image */}
              <img
                src={cat.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 p-7 flex flex-col justify-end">
                <div>
                  <h3 className="text-xl font-extrabold text-white m-0 mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-[0.8rem] text-white/75 leading-snug m-0">
                    {cat.description || "Archival tools and artisan supplies."}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-white text-[0.775rem] font-bold uppercase tracking-[0.06em] mt-3">
                  <span>Explore Discipline</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

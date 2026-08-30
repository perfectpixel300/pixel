import React, { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, Package, X } from "lucide-react";
import { ProductCard } from "../components/storefront/ProductCard";

export function ProductsPage({
  products,
  categories = [],
  selectedCategory,
  setSelectedCategory,
  onViewProduct,
  onInquireProduct,
  searchTerm: externalSearchTerm,
  setSearchTerm: setExternalSearchTerm,
}) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = setExternalSearchTerm || setInternalSearchTerm;

  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);

  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      const isAvailable = product.isAvailable && (product.stock === undefined || Number(product.stock) > 0);
      if (availabilityOnly && !isAvailable) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(q);
        const matchDesc = product.description?.toLowerCase().includes(q);
        const matchCat = product.category?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchCat) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return (a.indicativePrice || 0) - (b.indicativePrice || 0);
      if (sortBy === "price_desc") return (b.indicativePrice || 0) - (a.indicativePrice || 0);
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="py-16 pb-24">
      <div className="storefront-container">
        {/* Page Header */}
        <div className="mb-12">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1.5 tracking-[-0.03em]">
            The Complete Collection
          </h1>
          <p className="text-[var(--text-secondary)] text-[0.95rem] mt-2 max-w-[600px]">
            Explore handcrafted notebooks, solid brass instruments, desk organizers, and fine cotton papers.
          </p>
        </div>

        {/* Category Pills Bar */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`btn btn-sm !rounded-full ${
              selectedCategory === "All" ? "btn-primary" : "btn-secondary"
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat._id || cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`btn btn-sm !rounded-full whitespace-nowrap ${
                  isSelected ? "btn-primary" : "btn-secondary"
                }`}
              >
                <span>{cat.name}</span>
                <span className="opacity-70 text-[0.7rem]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3.5 mb-10">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Search by keyword or material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-9 !pr-8 text-[0.825rem]"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-[0.8rem] text-[var(--text-secondary)] cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="accent-white"
              />
              <span>In Stock Only</span>
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select !w-auto text-[0.8rem] py-2 px-3"
            >
              <option value="createdAt_desc">Latest Additions</option>
              <option value="price_asc">Price: Low to High (NRs.)</option>
              <option value="price_desc">Price: High to Low (NRs.)</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Search Active Indicator */}
        {searchTerm.trim() && (
          <div className="mb-6 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <span>Showing results matching:</span>
            <span className="font-bold text-[var(--text-primary)] bg-[var(--bg-elevated)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
              "{searchTerm}"
            </span>
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-[var(--text-muted)] hover:text-white underline cursor-pointer bg-transparent border-0 ml-1"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 px-8 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-lg)]">
            <Package size={32} className="text-[var(--text-muted)] mb-3 mx-auto" />
            <h3 className="text-lg font-bold">No items match your criteria</h3>
            <p className="text-[var(--text-muted)] text-[0.85rem] mt-1.5">
              Try adjusting your category selection or search keywords.
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="btn btn-secondary btn-sm mt-3"
              >
                Clear Search Filter
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={onViewProduct}
                onInquire={onInquireProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

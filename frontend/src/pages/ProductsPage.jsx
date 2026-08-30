import React, { useState, useEffect } from "react";
import { Search, Filter, SlidersHorizontal, Package, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "../components/storefront/ProductCard";
import { CategoryDropdown } from "../components/common/CategoryDropdown";

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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, availabilityOnly, sortBy]);

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
      const getEffectivePrice = (p) =>
        p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.indicativePrice)
          ? Number(p.discountPrice)
          : Number(p.indicativePrice) || 0;

      if (sortBy === "price_asc") return getEffectivePrice(a) - getEffectivePrice(b);
      if (sortBy === "price_desc") return getEffectivePrice(b) - getEffectivePrice(a);
      if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name_desc") return (b.name || "").localeCompare(a.name || "");
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        {/* Filter Controls Bar */}
        <div className="flex justify-between items-center flex-wrap gap-3.5 mb-8 pb-6 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto flex-1">
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

            {/* Minimal Category Dropdown */}
            <CategoryDropdown
              categories={categories.map((cat) => ({
                id: cat._id || cat.name,
                name: cat.name,
                count: products.filter((p) => p.category === cat.name).length,
              }))}
              selectedCategory={selectedCategory}
              onSelectCategory={(catName) => {
                setSelectedCategory(catName);
                setCurrentPage(1);
              }}
              totalCount={products.length}
              label="Category"
              allLabel="All Categories"
            />
          </div>

          {/* Right Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 text-[0.8rem] text-[var(--text-secondary)] cursor-pointer select-none">
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
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer bg-transparent border-0 ml-1"
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
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={onViewProduct}
                  onInquire={onInquireProduct}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-[var(--border-subtle)]">
                <span className="text-xs sm:text-sm text-[var(--text-muted)] order-2 sm:order-1">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{" "}
                  <strong className="text-[var(--text-primary)]">{filteredProducts.length}</strong> products
                </span>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`btn-icon btn-secondary !w-9 !h-9 !rounded-full ${
                      currentPage === 1
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)]"
                    }`}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNumber = idx + 1;
                    const isActive = currentPage === pageNumber;

                    // Compress long pagination lists
                    if (
                      totalPages > 7 &&
                      pageNumber !== 1 &&
                      pageNumber !== totalPages &&
                      Math.abs(pageNumber - currentPage) > 1
                    ) {
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <span key={pageNumber} className="text-[var(--text-muted)] px-1">
                            …
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`!w-9 !h-9 !rounded-full font-mono text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                          isActive
                            ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-bg)] shadow-sm"
                            : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-medium)] hover:bg-[var(--bg-input-focus)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className={`btn-icon btn-secondary !w-9 !h-9 !rounded-full ${
                      currentPage >= totalPages
                        ? "opacity-30 cursor-not-allowed"
                        : "cursor-pointer hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)]"
                    }`}
                    aria-label="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

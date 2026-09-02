import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X, Search, Filter } from "lucide-react";

/**
 * CategoryDropdown - A minimal, modern dropdown filter for categories across storefront and admin
 */
export function CategoryDropdown({
  categories = [],
  selectedCategory = "All",
  onSelectCategory,
  totalCount,
  label = "Category",
  allLabel = "All Categories",
  className = "",
  size = "md", // 'sm' | 'md'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Normalize categories into standard array of objects: { id, name, count }
  const normalizedCategories = categories.map((cat, idx) => {
    if (typeof cat === "string") {
      return { id: cat, name: cat, count: undefined };
    }
    return {
      id: cat._id || cat.id || cat.name || idx,
      name: cat.name || "",
      count: cat.count !== undefined ? cat.count : undefined,
    };
  });

  // Filter categories by search if search term exists
  const filteredCategories = normalizedCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Close on outside click and Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onSelectCategory) {
      onSelectCategory("All");
    }
  };

  const isAll = selectedCategory === "All" || !selectedCategory;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-2.5 rounded-[var(--radius-xs)] border transition-all duration-200 cursor-pointer ${
          size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-[0.825rem]"
        } ${
          !isAll
            ? "bg-[var(--bg-card)] border-[var(--border-bright)] text-[var(--text-primary)] shadow-xs font-semibold"
            : "bg-[var(--bg-input)] border-[var(--border-subtle)] hover:border-[var(--border-medium)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <Filter size={size === "sm" ? 12 : 14} className={!isAll ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"} />
          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            {isAll ? allLabel : selectedCategory}
          </span>
          {isAll && totalCount !== undefined && (
            <span className="text-[0.7rem] px-1.5 py-0.2 rounded-full bg-[var(--bg-app)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-mono">
              {totalCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {!isAll && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              title="Clear category filter"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={size === "sm" ? 12 : 14}
            className={`text-[var(--text-muted)] transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[var(--text-primary)]" : ""
            }`}
          />
        </div>
      </button>

      {/* Floating Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-64 sm:w-72 rounded-[var(--radius-sm)] bg-[var(--bg-card)] border border-[var(--border-medium)] shadow-[var(--shadow-xl)] z-50 overflow-hidden animate-[fadeIn_0.15s_ease-out] backdrop-blur-md">
          {/* Header search if > 4 categories */}
          {normalizedCategories.length > 4 && (
            <div className="p-2 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]">
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}s...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input !pl-7.5 !py-1 text-xs bg-[var(--bg-card)] border-[var(--border-subtle)] rounded-[var(--radius-xs)] w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-transparent border-0 cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* List Options */}
          <div className="max-h-60 overflow-y-auto py-1 text-xs minimal-scrollbar pr-0.5">
            {/* "All" option */}
            {!searchTerm && (
              <button
                type="button"
                onClick={() => handleSelect("All")}
                className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors border-0 bg-transparent cursor-pointer ${
                  isAll
                    ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-app)] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isAll ? "text-[var(--text-primary)]" : "opacity-0"}`}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span>{allLabel}</span>
                </div>
                {totalCount !== undefined && (
                  <span className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                    {totalCount}
                  </span>
                )}
              </button>
            )}

            {filteredCategories.length === 0 ? (
              <div className="px-3 py-4 text-center text-[var(--text-muted)] text-xs">
                No {label.toLowerCase()} matches "{searchTerm}"
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors border-0 bg-transparent cursor-pointer ${
                      isSelected
                        ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-app)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isSelected ? "text-[var(--text-primary)]" : "opacity-0"}`}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="truncate max-w-[170px]">{cat.name}</span>
                    </div>
                    {cat.count !== undefined && (
                      <span className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

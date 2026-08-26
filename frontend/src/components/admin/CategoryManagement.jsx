import React, { useState } from "react";
import { Plus, Edit2, Trash2, Layers, Search, Package } from "lucide-react";

export function CategoryManagement({
  categories,
  onOpenCreateModal,
  onEditCategory,
  onDeleteCategory,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = categories.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Product Categories</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Add, rename, customize, and manage stationery disciplines and groups
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-50">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="text"
              placeholder="Filter categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input !pl-8 text-xs py-2 px-2.5"
            />
          </div>

          <button onClick={onOpenCreateModal} className="btn btn-primary btn-sm gap-1.5">
            <Plus size={14} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)]">
          <Layers size={28} className="text-[var(--text-muted)] mb-2 mx-auto" />
          <h3 className="text-base font-bold">No categories found</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            Create your first discipline or clear the search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="bg-[var(--bg-card)] rounded-[var(--radius-md)] overflow-hidden flex flex-col border border-[var(--border-subtle)]"
            >
              {/* Cover Image Banner */}
              <div
                className="h-28 relative bg-cover bg-center"
                style={{ backgroundImage: `url(${cat.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800"})` }}
              >
                <div className="absolute inset-0 bg-black/55 p-3 flex flex-col justify-between">
                  <span className="badge badge-white self-start text-[0.625rem]">
                    /{cat.slug}
                  </span>
                  <div className="text-white text-lg font-extrabold">
                    {cat.name}
                  </div>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-4.5 flex flex-col gap-2.5 flex-1">
                <p className="text-[0.825rem] text-[var(--text-secondary)] leading-relaxed m-0 min-h-[36px]">
                  {cat.description || "Archival curated tools and artisan supplies."}
                </p>

                <div className="mt-auto pt-2.5 border-t border-[var(--border-subtle)] flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[0.775rem] text-[var(--text-muted)]">
                    <Package size={13} />
                    <span>{cat.productCount !== undefined ? cat.productCount : 0} items</span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditCategory(cat)}
                      className="btn-icon btn-secondary !w-7.5 !h-7.5"
                      title="Edit Category"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat)}
                      className="btn-icon btn-secondary !w-7.5 !h-7.5 text-[var(--color-danger)]"
                      title="Delete Category"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

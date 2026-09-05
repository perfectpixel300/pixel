import React, { useState } from "react";
import { Star, Trash2, Search, Package, Mail, User, Calendar, MessageSquare, Filter } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export function ReviewManagement({
  reviews = [],
  onDeleteReview,
  isLoading = false,
}) {
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = reviews.filter((rev) => {
    if (ratingFilter !== "all" && Number(ratingFilter) !== rev.rating) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const name = `${rev.firstName || ""} ${rev.lastName || ""}`.toLowerCase();
      const contact = (rev.emailOrContact || "").toLowerCase();
      const comment = (rev.comment || "").toLowerCase();
      const prodName = (rev.product?.name || "").toLowerCase();
      return (
        name.includes(q) ||
        contact.includes(q) ||
        comment.includes(q) ||
        prodName.includes(q)
      );
    }
    return true;
  });

  const totalCount = reviews.length;
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const avgRating =
    totalCount > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / totalCount).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-extrabold m-0">Customer Reviews & Ratings</h2>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5 mb-0">
            Ratings and feedback submitted by storefront customers on catalog products
          </p>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center justify-between">
          <div>
            <div className="text-[0.675rem] uppercase font-bold text-[var(--text-muted)]">
              Total Reviews
            </div>
            <div className="text-2xl font-black font-mono mt-0.5">{totalCount}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--bg-app)] border border-[var(--border-subtle)] flex items-center justify-center text-amber-400">
            <MessageSquare size={16} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center justify-between">
          <div>
            <div className="text-[0.675rem] uppercase font-bold text-[var(--text-muted)]">
              Average Rating
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-0.5 flex items-center gap-1.5">
              <span>{avgRating}</span>
              <Star size={16} fill="currentColor" />
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Star size={16} fill="currentColor" />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 flex items-center justify-between">
          <div>
            <div className="text-[0.675rem] uppercase font-bold text-[var(--text-muted)]">
              5-Star Feedbacks
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
              {fiveStarCount}
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Star size={16} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Toolbar (Search & Filter) */}
      <div className="bg-[var(--bg-card)] rounded-[var(--radius-md)] p-3.5 flex items-center justify-between flex-wrap gap-3 border border-[var(--border-subtle)]">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            placeholder="Search by reviewer, unmasked email, product, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input text-xs pl-8.5 py-1.5 w-full"
          />
        </div>

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[0.7rem] text-[var(--text-muted)] flex items-center gap-1 mr-1">
            <Filter size={12} />
            <span>Rating:</span>
          </span>
          {["all", "5", "4", "3", "2", "1"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRatingFilter(r)}
              className={`btn btn-sm text-[0.7rem] !py-1 !px-2.5 ${
                ratingFilter === r ? "btn-primary" : "btn-secondary"
              }`}
            >
              {r === "all" ? "All" : `${r} ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-[var(--text-muted)] font-mono">
          Loading customer reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-dashed border-[var(--border-medium)] rounded-[var(--radius-md)] p-16 text-center">
          <Star size={32} className="text-[var(--text-muted)] mb-2.5 mx-auto opacity-40" />
          <h3 className="text-base font-bold">No customer reviews found</h3>
          <p className="text-[var(--text-muted)] text-[0.825rem] mt-1">
            {search || ratingFilter !== "all"
              ? "No reviews match your filter parameters."
              : "When customers submit reviews on product detail pages, they will appear here."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((rev) => {
            const reviewerName = [rev.firstName, rev.lastName].filter(Boolean).join(" ");
            const rawProductImg =
              rev.product?.images && rev.product.images.length > 0
                ? rev.product.images[0]
                : "";
            const productImg = rawProductImg
              ? getOptimizedImageUrl(rawProductImg, { width: 120, height: 120 })
              : "";
            const formattedDate = new Date(rev.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={rev._id}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-4 sm:p-5 flex flex-col gap-3.5 transition-all hover:border-[var(--border-medium)]"
              >
                {/* Review Top Row: Product & Reviewer & Actions */}
                <div className="flex justify-between items-start flex-wrap gap-3">
                  {/* Product Info */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <div className="w-11 h-11 rounded-[var(--radius-xs)] bg-zinc-900 border border-[var(--border-subtle)] overflow-hidden shrink-0 flex items-center justify-center">
                      {productImg ? (
                        <img
                          src={productImg}
                          alt={rev.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package size={18} className="text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-[0.675rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        {rev.product?.category || "Product"}
                      </div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">
                        {rev.product?.name || "Deleted Product"}
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars & Timestamp */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-[var(--radius-xs)] text-amber-400">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={
                              rev.rating >= star
                                ? "fill-amber-400 text-amber-400"
                                : "text-zinc-600"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold font-mono ml-1">{rev.rating}.0</span>
                    </div>

                    <span className="text-[0.7rem] text-[var(--text-muted)] font-mono hidden sm:inline">
                      {formattedDate}
                    </span>

                    {/* Delete Action Button */}
                    <button
                      type="button"
                      onClick={() => onDeleteReview && onDeleteReview(rev)}
                      className="btn-icon btn-ghost !w-8 !h-8 text-[var(--color-danger)] hover:bg-rose-500/10 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Reviewer Details (Plain Real Email for Admin) */}
                <div className="flex items-center gap-2 flex-wrap text-xs bg-[var(--bg-elevated)] p-2.5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)]">
                  <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                    <User size={13} className="text-[var(--text-muted)]" />
                    <span>{reviewerName}</span>
                  </span>

                  <span className="text-[var(--border-medium)]">•</span>

                  <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold" title="Unmasked contact info (admin-only)">
                    <Mail size={13} className="text-emerald-400" />
                    <span>{rev.emailOrContact}</span>
                  </span>

                  <span className="text-[var(--border-medium)]">•</span>

                  <span className="text-[0.675rem] text-[var(--text-muted)] flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{formattedDate}</span>
                  </span>
                </div>

                {/* Review Comment Text */}
                <div className="text-xs sm:text-[0.85rem] text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-app)] p-3.5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)]">
                  &ldquo;{rev.comment}&rdquo;
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { Star, X, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

const RATING_LABELS = {
  1: "1 - Poor experience",
  2: "2 - Fair / Needs improvement",
  3: "3 - Average / Meets expectations",
  4: "4 - Very good / Highly satisfied",
  5: "5 - Outstanding / Exceptional quality",
};

export function ReviewModal({ isOpen, onClose, product, onReviewSubmitted }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailOrContact: "",
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName.trim()) {
      setError("Please provide your first name.");
      return;
    }

    if (!formData.emailOrContact.trim()) {
      setError("Please provide your email address or contact number.");
      return;
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setError("Please select a star rating between 1 and 5.");
      return;
    }

    if (!formData.comment.trim()) {
      setError("Please write a short review description.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.submitReview({
        productId: product?._id,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailOrContact: formData.emailOrContact.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
      });

      setSuccess(true);
      if (onReviewSubmitted) {
        onReviewSubmitted(res.review);
      }

      setTimeout(() => {
        setSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          emailOrContact: "",
          rating: 5,
          comment: "",
        });
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card max-w-[540px] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-xs)] bg-amber-400/15 text-amber-400 flex items-center justify-center font-bold">
              <Star size={16} fill="currentColor" />
            </div>
            <div>
              <h2 className="modal-title text-base sm:text-lg">Write a Review</h2>
              <p className="text-[0.725rem] text-[var(--text-muted)] truncate max-w-[280px] sm:max-w-[360px] m-0">
                {product?.name || "Product Catalog Piece"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon btn-ghost !w-7 !h-7 text-[var(--text-muted)] hover:text-white"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg font-bold m-0">Review Submitted!</h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm m-0">
              Thank you for sharing your experience. A confirmation message has been dispatched to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-[var(--radius-xs)]">
                {error}
              </div>
            )}

            {/* Star Rating System */}
            <div className="flex flex-col items-center justify-center py-2 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)]">
              <div className="text-[0.7rem] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1.5">
                Select Your Rating
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || formData.rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 text-zinc-600 hover:scale-110 transition-transform bg-transparent border-0 cursor-pointer"
                      title={`${star} star`}
                    >
                      <Star
                        size={28}
                        className={
                          isFilled
                            ? "text-amber-400 fill-amber-400"
                            : "text-zinc-600"
                        }
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-[0.725rem] font-semibold text-amber-400 mt-1.5 min-h-[16px]">
                {RATING_LABELS[hoverRating || formData.rating]}
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-group !mb-0">
                <label className="form-label">
                  First Name <span className="text-[var(--color-danger)]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="form-input text-xs"
                  required
                />
              </div>

              <div className="form-group !mb-0">
                <label className="form-label">
                  Last Name <span className="text-[var(--text-muted)] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="form-input text-xs"
                />
              </div>
            </div>

            {/* Email or Contact */}
            <div className="form-group !mb-0">
              <label className="form-label">
                Email or Contact <span className="text-[var(--color-danger)]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. yourname@gmail.com or +977 9800000000"
                value={formData.emailOrContact}
                onChange={(e) => setFormData({ ...formData, emailOrContact: e.target.value })}
                className="form-input text-xs"
                required
              />
              <div className="flex items-center gap-1.5 mt-1.5 text-[0.675rem] text-[var(--text-muted)]">
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                <span>
                  Only visible to the admin. Starred (e.g. j****@****.com) for public visitors.
                </span>
              </div>
            </div>

            {/* Review Description */}
            <div className="form-group !mb-0">
              <label className="form-label">
                Review Description <span className="text-[var(--color-danger)]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Share your thoughts on the craftsmanship, material quality, dimensions, or service..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="form-textarea text-xs !min-h-[85px]"
                required
              />
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer !px-0 !pb-0 !pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-sm gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Star size={13} fill="currentColor" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

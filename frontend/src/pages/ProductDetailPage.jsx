import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, MessageCircle, Package, Loader2, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { ShareModal } from "../components/common/ShareModal";
import { SwipableImageGallery } from "../components/common/SwipableImageGallery";
import { ProductCard } from "../components/storefront/ProductCard";
import { useSmoothSwiper } from "../utils/useSmoothSwiper";
import { api } from "../services/api";

export function ProductDetailPage({
  product: initialProduct,
  productIdOrSlug: propIdOrSlug,
  products = [],
  onBack,
  onInquire,
}) {
  const params = useParams();
  const navigate = useNavigate();
  const idOrSlug = propIdOrSlug || params?.idOrSlug || params?.slug || params?.id;

  const [product, setProduct] = useState(() => {
    if (initialProduct) return initialProduct;
    if (idOrSlug && products && products.length > 0) {
      return products.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
    }
    return null;
  });

  const [loading, setLoading] = useState(!product && Boolean(idOrSlug));
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Filter products in the same category excluding the currently viewed product
  const relatedProducts = useMemo(() => {
    if (!product || !products || products.length === 0) return [];
    return products.filter(
      (p) =>
        p &&
        p.category === product.category &&
        p._id !== product._id &&
        p.slug !== product.slug
    );
  }, [products, product]);

  const {
    currentIndex,
    itemsPerView,
    maxIndex,
    handlePrev,
    handleNext,
    trackStyle,
    sliderProps,
    totalDots,
    activeDotIndex,
    handleDotClick,
  } = useSmoothSwiper({ itemCount: relatedProducts.length, defaultItemsPerView: 4 });

  const handleViewRelatedProduct = (selectedProd) => {
    setProduct(selectedProd);
    navigate(`/products/${selectedProd.slug || selectedProd._id}`);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
      return;
    }

    if (idOrSlug) {
      const found = (products || []).find((p) => p._id === idOrSlug || p.slug === idOrSlug);
      if (found) {
        setProduct(found);
        setLoading(false);
        return;
      }

      let isMounted = true;
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await api.getProductById(idOrSlug);
          if (isMounted && res && res.product) {
            setProduct(res.product);
          }
        } catch (err) {
          console.error("Failed to load product detail:", err);
        } finally {
          if (isMounted) setLoading(false);
        }
      };

      fetchProduct();
      return () => {
        isMounted = false;
      };
    }
  }, [idOrSlug, initialProduct, products]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [product]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/products");
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center storefront-container">
        <div className="w-8 h-8 border-2 border-[var(--text-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[var(--text-muted)] font-mono">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center storefront-container max-w-lg">
        <Package size={40} className="text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">
          The requested product piece may have been moved or is currently unavailable.
        </p>
        <button onClick={handleBack} className="btn btn-primary gap-2">
          <ArrowLeft size={14} />
          <span>Back to Collection</span>
        </button>
      </div>
    );
  }

  const images =
    product?.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : (product?.imageUrl ? [product.imageUrl] : []);

  const regPrice = Number(product.indicativePrice || product.price) || 0;
  const discPrice = Number(product.discountPrice) || 0;
  const hasDiscount = Boolean(discPrice > 0 && regPrice > 0 && discPrice < regPrice);
  const effectivePrice = hasDiscount ? discPrice : regPrice;
  const discountPercent = hasDiscount
    ? Math.round(((regPrice - discPrice) / regPrice) * 100)
    : 0;

  const supportWhatsAppNumber = "+9779808950275";
  const whatsAppText = `Hello Pixel Perfect,\nI am inquiring about "${product.name}" (Price: NRs. ${effectivePrice.toLocaleString()}). Please advise on availability.`;
  const whatsAppUrl = `https://wa.me/${supportWhatsAppNumber}?text=${encodeURIComponent(whatsAppText)}`;
  const mainImage = images[0] || product?.imageUrl || "";

  const normalizedSpecs = useMemo(() => {
    const raw = product?.specs;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((s) => {
          if (!s) return null;
          if (typeof s === "string") {
            const trimmed = s.trim();
            if (!trimmed) return null;
            const colonIdx = trimmed.indexOf(":");
            if (colonIdx > -1) {
              return {
                label: trimmed.slice(0, colonIdx).trim() || "Specification",
                value: trimmed.slice(colonIdx + 1).trim() || trimmed,
              };
            }
            return { label: "Specification", value: trimmed };
          }
          const label = (s.label || s.key || s.name || "").trim();
          const value = (s.value || s.val || "").trim();
          if (!label && !value) return null;
          return { label: label || "Specification", value: value || label };
        })
        .filter(Boolean);
    }
    if (typeof raw === "object") {
      const legacyKeyMap = {
        paperGsm: "Paper Stock",
        binding: "Binding / Construction",
        color: "Color & Finish",
        dimensions: "Dimensions",
        origin: "Provenance",
      };
      const list = [];
      for (const [key, val] of Object.entries(raw)) {
        if (val && typeof val === "string" && val.trim()) {
          list.push({
            label:
              legacyKeyMap[key] ||
              key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim(),
            value: val.trim(),
          });
        }
      }
      return list;
    }
    return [];
  }, [product?.specs]);

  return (
    <div className="py-12 pb-24">
      <div className="storefront-container">
        {/* Back navigation & Share Top Bar */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={handleBack}
            className="btn btn-ghost btn-sm gap-1.5 pl-0 hover:pl-1 transition-all"
          >
            <ArrowLeft size={15} />
            <span>Back to Collection</span>
          </button>

          <button
            onClick={() => setShareModalOpen(true)}
            className="btn btn-sm gap-2 !px-3.5 !py-2 bg-emerald-500/15 border border-emerald-500/35 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 font-bold shadow-xs transition-all rounded-full group"
            title="Share with Friends"
          >
            <Share2 size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Share with Friends</span>
          </button>
        </div>

        {/* Product Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-start">
          {/* Left Column: Swipable Image Gallery */}
          <div>
            <SwipableImageGallery
              images={images}
              alt={product.name}
              heightClass="aspect-square w-full"
              thumbnailSize="w-16 h-16 sm:w-18 sm:h-18"
            />
          </div>

          {/* Right Column: Product Info & Specs */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex gap-2 mb-2.5 flex-wrap items-center">
                <span className="badge badge-dark">{product.category}</span>
                <span
                  className={`badge ${
                    product.isAvailable && (product.stock === undefined || Number(product.stock) > 0)
                      ? "badge-success"
                      : "badge-neutral"
                  }`}
                >
                  {product.isAvailable && (product.stock === undefined || Number(product.stock) > 0)
                    ? "Available"
                    : "Out of Stock"}
                </span>
                {hasDiscount && (
                  <span className="badge bg-emerald-500 text-white font-mono font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.featured && <span className="badge badge-white">Featured Object</span>}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight m-0 mb-2 capitalize">
                {product.name}
              </h1>

              {hasDiscount ? (
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">
                    NRs. {effectivePrice.toLocaleString()}
                  </span>
                  <span className="text-lg font-mono text-[var(--text-muted)] line-through">
                    NRs. {Number(product.indicativePrice).toLocaleString()}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-bold font-mono text-[var(--text-primary)]">
                  NRs. {Number(product.indicativePrice).toLocaleString()}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-[var(--border-subtle)] pt-5">
              <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-2">
                Craftsmanship & Description
              </h4>
              <p className="text-[var(--text-secondary)] text-[0.925rem] leading-relaxed m-0">
                {product.description}
              </p>
            </div>

            {/* Technical Specifications Table */}
            {normalizedSpecs.length > 0 && (
              <div className="border-t border-[var(--border-subtle)] pt-5">
                <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
                  Material Specifications
                </h4>
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-subtle)]">
                  {normalizedSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className={`flex justify-between px-3.5 py-2.5 text-[0.825rem] ${
                        idx < normalizedSpecs.length - 1 ? "border-b border-[var(--border-subtle)]" : ""
                      }`}
                    >
                      <span className="text-[var(--text-muted)]">{spec.label || "Specification"}</span>
                      <span className="font-semibold text-right">{spec.value || spec.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Inquiry & WhatsApp Action Buttons */}
            <div className="pt-4 flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary py-3.5 text-sm gap-2"
                >
                  <MessageCircle size={17} />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => onInquire(product)}
                  className="btn btn-secondary py-3.5 text-sm gap-2"
                >
                  <MessageSquare size={16} />
                  <span>Send Web Inquiry</span>
                </button>
              </div>

              <button
                onClick={() => setShareModalOpen(true)}
                className="btn w-full py-3.5 text-xs sm:text-sm font-bold gap-2.5 bg-emerald-500/15 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 rounded-[var(--radius-sm)] transition-all shadow-xs hover:shadow-sm"
                title="Share with Friends"
              >
                <Share2 size={16} className="text-emerald-400" />
                <span>Share with Friends</span>
              </button>

              <div className="text-[0.75rem] text-[var(--text-muted)] text-center">
                Pure. Simple. Limited.
              </div>
            </div>
          </div>
        </div>

        {/* Products You May Like (Same Category Products) */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 sm:mt-24 pt-12 sm:pt-16 border-t border-[var(--border-subtle)]">
            {/* Section Header */}
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
              <div>
                <span className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  More in {product.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-[-0.03em]">
                  Products You May Like
                </h2>
              </div>

              {/* Swiper Arrow Buttons (Only when items exceed itemsPerView) */}
              {relatedProducts.length > itemsPerView && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                      currentIndex === 0
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-md"
                    }`}
                    aria-label="Previous product"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex >= maxIndex}
                    className={`w-9 h-9 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] text-[var(--text-primary)] flex items-center justify-center transition-all ${
                      currentIndex >= maxIndex
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-[var(--btn-primary-bg)] hover:text-[var(--btn-primary-text)] hover:border-transparent cursor-pointer shadow-md"
                    }`}
                    aria-label="Next product"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* If items fit, show responsive grid; if too many items, smooth swiper */}
            {relatedProducts.length > itemsPerView ? (
              <div {...sliderProps}>
                <div className="overflow-hidden -mx-2 sm:-mx-3">
                  <div className="flex items-stretch select-none" style={trackStyle}>
                    {relatedProducts.map((relProduct) => (
                      <div
                        key={relProduct._id || relProduct.slug}
                        className="px-2 sm:px-3 shrink-0 flex flex-col pointer-events-auto"
                        style={{ width: `${100 / itemsPerView}%` }}
                      >
                        <ProductCard
                          product={relProduct}
                          onViewDetails={handleViewRelatedProduct}
                          onInquire={onInquire}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Swiper Pagination Dots */}
                {totalDots > 0 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    {Array.from({ length: totalDots }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleDotClick(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 border-none p-0 cursor-pointer ${
                          activeDotIndex === idx
                            ? "w-7 bg-[var(--text-primary)]"
                            : "w-2 bg-[var(--border-bright)] hover:bg-[var(--text-secondary)] opacity-60 hover:opacity-100"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relProduct) => (
                  <ProductCard
                    key={relProduct._id || relProduct.slug}
                    product={relProduct}
                    onViewDetails={handleViewRelatedProduct}
                    onInquire={onInquire}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={product.name}
        url={`/products/${product.slug || product._id}`}
        description={product.description}
        image={mainImage}
        price={effectivePrice}
        category={product.category}
      />
    </div>
  );
}

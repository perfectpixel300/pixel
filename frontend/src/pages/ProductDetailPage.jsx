import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, MessageCircle, Package, Loader2, Share2 } from "lucide-react";
import { getOptimizedImageUrl } from "../utils/imageOptimizer";
import { ShareModal } from "../components/common/ShareModal";
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
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [shareModalOpen, setShareModalOpen] = useState(false);

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

  const safeImgIndex = activeImgIndex < images.length ? activeImgIndex : 0;
  const mainImage = images[safeImgIndex] || "";

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
            className="btn btn-sm gap-2 !px-3.5 !py-2 bg-orange-500/15 border border-orange-500/35 hover:border-orange-400 text-orange-400 hover:text-orange-300 font-bold shadow-xs transition-all rounded-full group"
            title="Share this product"
          >
            <Share2 size={14} className="text-orange-500 group-hover:scale-110 transition-transform" />
            <span>Share Product</span>
          </button>
        </div>

        {/* Product Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-start">
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-3.5">
            {/* Main Image */}
            <div className="rounded-[var(--radius-md)] overflow-hidden h-[360px] sm:h-[460px] lg:h-auto min-h-[360px] bg-[#050505] border border-[var(--border-subtle)] flex items-center justify-center">
              {mainImage ? (
                <img
                  src={getOptimizedImageUrl(mainImage, { width: 1200 })}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] gap-2 py-20">
                  <Package size={48} className="opacity-40" />
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-60">
                    No image available
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`w-18 h-18 rounded-[var(--radius-sm)] overflow-hidden cursor-pointer shrink-0 transition-all duration-200 ${
                      safeImgIndex === idx ? "opacity-100 scale-105 ring-2 ring-white" : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={getOptimizedImageUrl(img, { width: 200 })}
                      alt={`Thumb ${idx + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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
            {product.specs && (
              <div className="border-t border-[var(--border-subtle)] pt-5">
                <h4 className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] mb-3">
                  Material Specifications
                </h4>
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-subtle)]">
                  {product.specs.paperGsm && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Paper Stock</span>
                      <span className="font-semibold">{product.specs.paperGsm}</span>
                    </div>
                  )}
                  {product.specs.binding && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Binding / Construction</span>
                      <span className="font-semibold">{product.specs.binding}</span>
                    </div>
                  )}
                  {product.specs.color && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Color & Finish</span>
                      <span className="font-semibold">{product.specs.color}</span>
                    </div>
                  )}
                  {product.specs.dimensions && (
                    <div className="flex justify-between px-3.5 py-2.5 border-b border-[var(--border-subtle)] text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Dimensions</span>
                      <span className="font-semibold">{product.specs.dimensions}</span>
                    </div>
                  )}
                  {product.specs.origin && (
                    <div className="flex justify-between px-3.5 py-2.5 text-[0.825rem]">
                      <span className="text-[var(--text-muted)]">Provenance</span>
                      <span className="font-semibold">{product.specs.origin}</span>
                    </div>
                  )}
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
                className="btn w-full py-3.5 text-xs sm:text-sm font-bold gap-2.5 bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/40 hover:border-orange-400 text-orange-400 hover:text-orange-300 rounded-[var(--radius-sm)] transition-all shadow-xs hover:shadow-sm"
                title="Share this product"
              >
                <Share2 size={16} className="text-orange-500" />
                <span>Share Piece (WhatsApp, Instagram, Link, Facebook)</span>
              </button>

              <div className="text-[0.75rem] text-[var(--text-muted)] text-center">
                Pure. Simple. Limited.
              </div>
            </div>
          </div>
        </div>
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

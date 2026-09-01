import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Check,
  Tag,
  BookOpen,
  ArrowRight,
  Video,
  Globe,
  Image as ImageIcon,
  User,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { getYouTubeEmbedUrl } from "../components/admin/BlogFormModal";
import { ShareModal } from "../components/common/ShareModal";
import { api } from "../services/api";

export function BlogDetailPage({ blog: initialBlog, blogIdOrSlug: propIdOrSlug, onNavigate, showToast }) {
  const params = useParams();
  const navigate = useNavigate();
  const blogIdOrSlug = propIdOrSlug || params?.slug || params?.idOrSlug || params?.id;
  const [blog, setBlog] = useState(initialBlog || null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(!initialBlog);
  const [shareBlogModalOpen, setShareBlogModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBlog = async () => {
      if (!blogIdOrSlug && !initialBlog) return;
      try {
        setLoading(true);
        const target = blogIdOrSlug || initialBlog?._id || initialBlog?.slug;
        const res = await api.getBlog(target);
        if (isMounted && res.success && res.blog) {
          setBlog(res.blog);
          setRelatedBlogs(res.relatedBlogs || []);
        }
      } catch (err) {
        console.error("Failed to load blog detail:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    return () => {
      isMounted = false;
    };
  }, [blogIdOrSlug, initialBlog]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    if (showToast) showToast("Article link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Read this article on Pixel Perfect: ${blog?.title}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  if (loading) {
    return (
      <div className="py-24 text-center storefront-container">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[var(--text-muted)] font-mono">Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-24 text-center storefront-container max-w-lg">
        <BookOpen size={40} className="text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
        <h2 className="text-2xl font-bold">Article Not Found</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-6">
          The requested blog article may have been moved or unpublished.
        </p>
        <button
          onClick={() => {
            if (onNavigate) onNavigate("blogs");
            navigate("/blogs");
          }}
          className="btn btn-primary gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Blogs</span>
        </button>
      </div>
    );
  }

  const template = blog.template || "editorial";
  const formattedDateTime = (() => {
    const d = new Date(blog.publishedAt || blog.createdAt || Date.now());
    if (isNaN(d.getTime())) return "";
    const dateFormatted = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeFormatted = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${dateFormatted} at ${timeFormatted}`;
  })();

  // Render Cover Media Player
  const renderMedia = () => {
    if (blog.mediaType === "photo") {
      return (
        <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm max-h-[540px]">
          <img
            src={blog.mediaUrl || blog.thumbnailUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop"}
            alt={blog.title}
            className="w-full h-full object-cover max-h-[540px]"
          />
        </div>
      );
    }

    if (blog.mediaType === "video") {
      return (
        <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)] bg-black aspect-video shadow-md">
          <video
            src={blog.mediaUrl}
            poster={blog.thumbnailUrl}
            controls
            playsInline
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    if (blog.mediaType === "youtube") {
      return (
        <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)] bg-black aspect-video shadow-md">
          <iframe
            src={getYouTubeEmbedUrl(blog.mediaUrl)}
            title={blog.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (blog.mediaType === "embed") {
      return (
        <div className="rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-subtle)] bg-black aspect-video shadow-md">
          <iframe
            src={blog.mediaUrl}
            title={blog.title}
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      );
    }

    return null;
  };

  // Convert raw markdown/text into structured paragraphs & headers
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n\n");

    return lines.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H3 Header
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            className="text-xl sm:text-2xl font-bold mt-8 mb-3 tracking-tight text-[var(--text-primary)]"
          >
            {trimmed.replace("### ", "")}
          </h3>
        );
      }

      // H2 Header
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            className="text-2xl sm:text-3xl font-extrabold mt-10 mb-4 tracking-tight text-[var(--text-primary)]"
          >
            {trimmed.replace("## ", "")}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="my-6 pl-4 border-l-4 border-[#ea580c] dark:border-[#ff7828] italic text-base sm:text-lg text-[var(--text-primary)] font-serif bg-[var(--bg-elevated)]/60 py-3 pr-4 rounded-r-[var(--radius-sm)]"
          >
            {trimmed.replace(/^>\s*"?|"?$/g, "")}
          </blockquote>
        );
      }

      // Code Block
      if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
        const codeLines = trimmed.replace(/^```[a-z]*\n?|\n?```$/g, "");
        return (
          <pre
            key={idx}
            className="my-6 p-4 rounded-[var(--radius-md)] bg-black/80 text-zinc-200 text-xs font-mono overflow-x-auto border border-[var(--border-subtle)]"
          >
            <code>{codeLines}</code>
          </pre>
        );
      }

      // Unordered list
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").filter(Boolean);
        return (
          <ul key={idx} className="my-4 space-y-2 pl-5 list-disc text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^[-*]\s+/, "")}</li>
            ))}
          </ul>
        );
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split("\n").filter(Boolean);
        return (
          <ol key={idx} className="my-4 space-y-2 pl-5 list-decimal text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s+/, "")}</li>
            ))}
          </ol>
        );
      }

      // Standard paragraph
      return (
        <p key={idx} className="text-sm sm:text-base leading-relaxed text-[var(--text-secondary)] mb-5">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="py-12 pb-24">
      {/* Top Breadcrumb & Return Nav */}
      <div className="storefront-container max-w-[920px] mb-8">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (onNavigate) onNavigate("blogs");
              navigate("/blogs");
            }}
            className="btn btn-secondary !py-1.5 !px-3 text-xs gap-1.5 cursor-pointer inline-flex items-center"
          >
            <ArrowLeft size={13} />
            <span>Back to Blogs</span>
          </button>

          {/* Action pills: Share */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShareBlogModalOpen(true)}
              className="btn btn-sm !py-1.5 !px-3.5 text-xs gap-2 cursor-pointer font-bold bg-orange-500/15 border border-orange-500/40 hover:border-orange-400 text-orange-400 hover:text-orange-300 rounded-full transition-all shadow-xs"
              title="Share this article"
            >
              <Share2 size={13} className="text-orange-500" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TEMPLATE 1: EDITORIAL ATELIER (CLASSIC MINIMALIST)
          ========================================================================= */}
      {template === "editorial" && (
        <article className="storefront-container max-w-[840px]">
          {/* Header */}
          <header className="mb-10 text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-[#ea580c] dark:text-[#ff7828]">
              <span>{blog.category}</span>
              <span>•</span>
              <span className="font-mono text-[var(--text-muted)]">{blog.readTime || "4 min read"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] leading-tight text-[var(--text-primary)] max-w-[760px] mx-auto">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-[680px] mx-auto font-serif italic">
                "{blog.excerpt}"
              </p>
            )}

            {/* Author meta row */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-[var(--text-muted)] font-mono border-t border-[var(--border-subtle)] max-w-md mx-auto">
              {blog.author?.avatar && (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span>By {blog.author?.name || "Pixel Perfect"}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {formattedDateTime}
              </span>
            </div>
          </header>

          {/* Hero Media */}
          <div className="mb-12">{renderMedia()}</div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-[var(--text-secondary)] leading-loose">
            {renderFormattedContent(blog.content)}
          </div>
        </article>
      )}

      {/* =========================================================================
          TEMPLATE 2: MODERN MAGAZINE (BOLD VISUAL GRID)
          ========================================================================= */}
      {template === "magazine" && (
        <article className="storefront-container max-w-[960px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider rounded-sm bg-[#ea580c]/15 text-[#ea580c] dark:bg-[#ff7828]/15 dark:text-[#ff7828] font-mono inline-block">
                {blog.category}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold tracking-tight leading-tight text-[var(--text-primary)]">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-[var(--text-muted)] pt-2 font-mono">
                <span>By {blog.author?.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {formattedDateTime}
                </span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>
            </div>

            <div className="lg:col-span-6">{renderMedia()}</div>
          </div>

          <hr className="border-[var(--border-subtle)] my-10" />

          {/* Content Body */}
          <div className="max-w-[780px] mx-auto text-[var(--text-secondary)] leading-loose text-base">
            {renderFormattedContent(blog.content)}
          </div>
        </article>
      )}

      {/* =========================================================================
          TEMPLATE 3: TECHNICAL JOURNAL (MONOCHROME PRECISION)
          ========================================================================= */}
      {template === "journal" && (
        <article className="storefront-container max-w-[980px]">
          {/* Header */}
          <div className="border-b border-[var(--border-medium)] pb-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[var(--text-muted)] mb-2">
              <span className="uppercase tracking-widest text-[#ea580c] dark:text-[#ff7828]">
                LOG #{blog.slug?.slice(0, 8).toUpperCase() || "ENTRY"}
              </span>
              <span>STATUS: PUBLISHED • {formattedDateTime.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-mono font-extrabold tracking-tight text-[var(--text-primary)]">
              {blog.title}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Specifications */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs space-y-3">
                <div className="text-[0.65rem] uppercase font-bold text-[var(--text-muted)] tracking-wider">
                  Metadata Spec Sheet
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.68rem]">CATEGORY:</span>
                  <span className="text-[var(--text-primary)] font-bold">{blog.category}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.68rem]">CREATED / PUBLISHED:</span>
                  <span className="text-[var(--text-primary)] font-bold">{formattedDateTime}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.68rem]">LEAD AUTHOR:</span>
                  <span className="text-[var(--text-primary)]">{blog.author?.name} ({blog.author?.role})</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.68rem]">READ DURATION:</span>
                  <span className="text-[var(--text-primary)]">{blog.readTime}</span>
                </div>
                <div>
                  <span className="text-[var(--text-muted)] block text-[0.68rem]">MEDIA FORMAT:</span>
                  <span className="text-orange-500 uppercase">{blog.mediaType}</span>
                </div>
                {blog.tags && blog.tags.length > 0 && (
                  <div>
                    <span className="text-[var(--text-muted)] block text-[0.68rem] mb-1">INDEX TAGS:</span>
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[0.65rem]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content with Hero */}
            <div className="lg:col-span-8 space-y-6">
              <div>{renderMedia()}</div>
              <div className="font-mono text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                {renderFormattedContent(blog.content)}
              </div>
            </div>
          </div>
        </article>
      )}

      {/* =========================================================================
          TEMPLATE 4: VISUAL CINEMA (IMMERSIVE VIDEO & STORYBOARD)
          ========================================================================= */}
      {template === "cinema" && (
        <article className="storefront-container max-w-[1020px]">
          {/* Edge-to-edge media banner */}
          <div className="mb-8 rounded-[var(--radius-xl)] overflow-hidden shadow-2xl border border-white/10 bg-black">
            {renderMedia()}
          </div>

          <div className="max-w-[780px] mx-auto space-y-6">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#ea580c] dark:text-[#ff7828]">
                <span className="uppercase">{blog.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {formattedDateTime}
                </span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                  {blog.excerpt}
                </p>
              )}
            </header>

            <hr className="border-[var(--border-subtle)]" />

            <div className="text-[var(--text-secondary)] leading-loose text-base">
              {renderFormattedContent(blog.content)}
            </div>
          </div>
        </article>
      )}

      {/* Author Card & Tags Section */}
      <div className="storefront-container max-w-[840px] mt-16 pt-8 border-t border-[var(--border-subtle)]">
        <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {blog.author?.avatar ? (
            <img
              src={blog.author.avatar}
              alt={blog.author.name}
              className="w-14 h-14 rounded-full object-cover border border-[var(--border-medium)] shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
              <User size={24} />
            </div>
          )}
          <div className="space-y-1">
            <div className="text-sm font-bold text-[var(--text-primary)]">
              {blog.author?.name || "Pixel Perfect Editorial"}
            </div>
            <div className="text-xs text-[#ea580c] dark:text-[#ff7828] font-mono font-medium">
              {blog.author?.role || "Studio Craftsman & Writer"}
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0 pt-1">
              Dedicated to the fine intersection of tangible physical instruments, micron manufacturing, and digital craftsmanship.
            </p>
          </div>
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-6">
            <Tag size={13} className="text-[var(--text-muted)] mr-1" />
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related Articles Section */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <div className="storefront-container max-w-[960px] mt-20 pt-10 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Continue Reading
              </span>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-0.5">
                Related Articles
              </h3>
            </div>
            <button
              onClick={() => {
                if (onNavigate) onNavigate("blogs");
                navigate("/blogs");
              }}
              className="text-xs font-semibold text-[#ea580c] dark:text-[#ff7828] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedBlogs.map((rel) => {
              const coverSrc =
                rel.thumbnailUrl ||
                (rel.mediaType === "photo" ? rel.mediaUrl : null) ||
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

              return (
                <div
                  key={rel._id}
                  onClick={() => {
                    setBlog(rel);
                    navigate(`/blogs/${rel.slug || rel._id}`);
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  }}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-medium)] transition-all cursor-pointer group shadow-xs"
                >
                  <div className="aspect-video bg-[var(--bg-elevated)] overflow-hidden relative">
                    <img
                      src={coverSrc}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[0.6rem] font-mono uppercase">
                      {rel.category}
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-xs sm:text-sm font-bold line-clamp-2 text-[var(--text-primary)] m-0 leading-snug group-hover:text-[#ea580c] dark:group-hover:text-[#ff7828] transition-colors">
                      {rel.title}
                    </h4>
                    <span className="text-[0.65rem] text-[var(--text-muted)] font-mono block">
                      {rel.readTime || "4 min read"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {blog && (
        <ShareModal
          isOpen={shareBlogModalOpen}
          onClose={() => setShareBlogModalOpen(false)}
          title={blog.title}
          url={`/blogs/${blog.slug || blog._id}`}
          description={blog.excerpt || ""}
          image={blog.thumbnailUrl || (blog.mediaType === "photo" ? blog.mediaUrl : "") || ""}
          category={blog.category}
        />
      )}
    </div>
  );
}

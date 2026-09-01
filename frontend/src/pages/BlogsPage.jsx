import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Video,
  Globe,
  Image as ImageIcon,
  SlidersHorizontal,
  Calendar,
  Mail,
  CheckCircle,
  Tag,
  Feather,
  Cpu,
  Layers,
} from "lucide-react";
import { YoutubeIcon } from "../components/admin/BlogFormModal";
import { api } from "../services/api";

export const formatBlogDateTime = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";
  const dateFormatted = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeFormatted = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateFormatted} • ${timeFormatted}`;
};

export function BlogsPage({ onSelectBlog, onNavigate }) {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(6); // 3-6 blogs per page
  const [loading, setLoading] = useState(true);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Fetch blogs from API
  const fetchBlogs = async (page = 1, cat = selectedCategory, search = searchQuery, perPage = limit) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: perPage,
        ...(cat !== "All" ? { category: cat } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      };

      const res = await api.getBlogs(params);
      setBlogs(res.blogs || []);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.total || 0);
      setCurrentPage(res.currentPage || 1);
      if (res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, selectedCategory, searchQuery, limit);
  }, [currentPage, selectedCategory, limit]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, selectedCategory, searchQuery, limit);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubscribed(true);
    setNewsletterEmail("");
  };

  // Find featured blog for spotlight header
  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];

  return (
    <div className="py-14 pb-24">
      <div className="storefront-container">
        {/* Minimal Hero Header */}
        <div className="text-center max-w-[800px] mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea580c]/10 dark:bg-[#ff7828]/10 text-[#ea580c] dark:text-[#ff7828] text-[0.75rem] font-bold font-mono tracking-wider uppercase mb-3 border border-[#ea580c]/20 dark:border-[#ff7828]/20">
            <Sparkles size={12} />
            <span>Pixel Perfect Blog</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.03em] mt-1 mb-3 text-[var(--text-primary)]">
            The Craft, Studio & Tech Blog
          </h1>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed max-w-[640px] mx-auto">
            Essays and workshop documentation exploring physical material science, archival print precision, and digital systems.
          </p>

          {/* Minimal Aesthetic Metrics / Focus Pillars Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 pt-5 border-t border-[var(--border-subtle)] text-[0.72rem] font-mono text-[var(--text-muted)]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span>Regular Studio Essays</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <Feather size={12} className="text-[var(--text-secondary)]" />
              <span>Stationery & Workshop Craft</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <Cpu size={12} className="text-[var(--text-secondary)]" />
              <span>Digital & Color Systems</span>
            </div>
          </div>
        </div>

        {/* Minimalist Studio Statement Callout */}
        <div className="max-w-[780px] mx-auto mb-12 p-4 sm:p-5 rounded-[var(--radius-md)] bg-[var(--bg-card)] border border-[var(--border-subtle)] text-center shadow-xs">
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] italic font-serif leading-relaxed m-0">
            "We believe durable tools are born where material resistance meets engineering discipline. Here we document everything we discover along the journey."
          </p>
        </div>

        {/* Spotlight Featured Article (Shown when on Page 1 without active search) */}
        {currentPage === 1 && !searchQuery && selectedCategory === "All" && featuredBlog && (
          <div
            onClick={() => onSelectBlog(featuredBlog)}
            className="mb-14 rounded-[var(--radius-xl)] bg-[var(--bg-card)] border border-[var(--border-subtle)] overflow-hidden shadow-lg hover:border-[var(--border-medium)] transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-black min-h-[300px]">
              <img
                src={
                  featuredBlog.thumbnailUrl ||
                  (featuredBlog.mediaType === "photo" ? featuredBlog.mediaUrl : null) ||
                  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop"
                }
                alt={featuredBlog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-bold font-mono">
                <Star size={12} fill="currentColor" />
                <span>Featured Spotlight</span>
              </div>

              {/* Media type icon */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-xs text-white text-[0.68rem] font-mono uppercase">
                {featuredBlog.mediaType === "photo" && <ImageIcon size={12} />}
                {featuredBlog.mediaType === "video" && <Video size={12} className="text-orange-400" />}
                {featuredBlog.mediaType === "youtube" && <YoutubeIcon size={12} className="text-red-400" />}
                {featuredBlog.mediaType === "embed" && <Globe size={12} className="text-blue-400" />}
                <span>{featuredBlog.mediaType}</span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
                  <span className="text-[#ea580c] dark:text-[#ff7828] font-bold uppercase">
                    {featuredBlog.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formatBlogDateTime(featuredBlog.publishedAt || featuredBlog.createdAt)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {featuredBlog.readTime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] group-hover:text-[#ea580c] dark:group-hover:text-[#ff7828] transition-colors leading-tight">
                  {featuredBlog.title}
                </h2>

                {featuredBlog.excerpt && (
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
                  {featuredBlog.author?.avatar && (
                    <img
                      src={featuredBlog.author.avatar}
                      alt={featuredBlog.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium text-[var(--text-primary)]">
                    {featuredBlog.author?.name}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#ea580c] dark:text-[#ff7828] group-hover:translate-x-1 transition-transform">
                  <span>Read Post</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter, Search & Per-Page Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-[#ea580c] dark:bg-[#ff7828] text-white shadow-sm"
                    : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-medium)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar & Limit Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog articles..."
                className="form-input !pl-8 !py-1.5 text-xs w-full"
              />
            </form>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="form-input !py-1.5 !px-2 text-xs !w-auto cursor-pointer"
              title="Articles per page"
            >
              <option value="3">3 per page</option>
              <option value="4">4 per page</option>
              <option value="6">6 per page</option>
            </select>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-[var(--text-muted)] font-mono">Loading blog articles...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-8">
            <BookOpen size={36} className="text-[var(--text-muted)] opacity-40 mx-auto mb-3" />
            <h3 className="text-base font-bold">No blog posts found</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Try choosing another topic category or clearing your search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => {
              const coverSrc =
                blog.thumbnailUrl ||
                (blog.mediaType === "photo" ? blog.mediaUrl : null) ||
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

              return (
                <article
                  key={blog._id}
                  onClick={() => onSelectBlog(blog)}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-medium)] hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-xs"
                >
                  <div>
                    {/* Media Thumbnail Container */}
                    <div className="relative aspect-video overflow-hidden bg-[var(--bg-elevated)]">
                      <img
                        src={coverSrc}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
                        }}
                      />

                      {/* Media Type Badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[0.625rem] font-bold font-mono">
                        {blog.mediaType === "photo" && <ImageIcon size={10} />}
                        {blog.mediaType === "video" && <Video size={10} className="text-orange-400" />}
                        {blog.mediaType === "youtube" && <YoutubeIcon size={10} className="text-red-400" />}
                        {blog.mediaType === "embed" && <Globe size={10} className="text-blue-400" />}
                        <span className="uppercase">{blog.mediaType}</span>
                      </div>

                      {/* Template indicator */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-zinc-300 text-[0.625rem] font-mono capitalize">
                        {blog.template}
                      </div>
                    </div>

                    {/* Content preview */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-1 text-[0.68rem] text-[var(--text-muted)] font-mono">
                        <span className="text-[#ea580c] dark:text-[#ff7828] font-bold uppercase">
                          {blog.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {formatBlogDateTime(blog.publishedAt || blog.createdAt)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {blog.readTime}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#ea580c] dark:group-hover:text-[#ff7828] transition-colors leading-snug line-clamp-2 m-0">
                        {blog.title}
                      </h3>

                      {blog.excerpt && (
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2 m-0">
                          {blog.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Author & Read Link */}
                  <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      {blog.author?.avatar && (
                        <img
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      )}
                      <span className="truncate max-w-[120px] font-medium">
                        {blog.author?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-[#ea580c] dark:text-[#ff7828] text-xs group-hover:translate-x-0.5 transition-transform">
                      <span>Read</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary !py-2 !px-3 text-xs gap-1 cursor-pointer disabled:opacity-30"
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-[var(--radius-sm)] text-xs font-bold cursor-pointer transition-colors ${
                  currentPage === pageNum
                    ? "bg-[#ea580c] dark:bg-[#ff7828] text-white"
                    : "bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary !py-2 !px-3 text-xs gap-1 cursor-pointer disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Minimal Newsletter / Direct Dispatches Strip */}
        <div className="mt-20 pt-10 border-t border-[var(--border-subtle)] max-w-[800px] mx-auto">
          <div className="p-8 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-medium)] text-center space-y-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[#ea580c] dark:text-[#ff7828] mx-auto">
              <Mail size={18} />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] m-0">
                Receive Studio Dispatches
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed m-0">
                Occasional long-form essays on physical manufacturing, fine art color science, and studio tools. No spam or promotional noise.
              </p>
            </div>

            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle size={14} />
                <span>You're subscribed! Thank you for following our studio writing.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="form-input !py-2 text-xs w-full"
                />
                <button
                  type="submit"
                  className="btn btn-primary !py-2 !px-5 text-xs whitespace-nowrap cursor-pointer shrink-0 w-full sm:w-auto shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Video,
  Image as ImageIcon,
  Globe,
  Sparkles,
  Calendar,
  Clock,
  ExternalLink,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { YoutubeIcon } from "./BlogFormModal";

export function BlogManagement({
  blogs = [],
  onOpenCreateModal,
  onEditBlog,
  onDeleteBlog,
  onTogglePublish,
  onToggleFeature,
  onViewLive,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'published' | 'draft' | 'featured'

  const categories = ["All", ...new Set(blogs.map((b) => b.category).filter(Boolean))];

  const filteredBlogs = blogs.filter((blog) => {
    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      blog.title?.toLowerCase().includes(q) ||
      blog.excerpt?.toLowerCase().includes(q) ||
      blog.category?.toLowerCase().includes(q) ||
      (blog.tags && blog.tags.some((t) => t.toLowerCase().includes(q)));

    // Category
    const matchCategory = selectedCategory === "All" || blog.category === selectedCategory;

    // Status filter
    let matchStatus = true;
    if (statusFilter === "published") matchStatus = blog.isPublished === true;
    if (statusFilter === "draft") matchStatus = blog.isPublished === false;
    if (statusFilter === "featured") matchStatus = blog.isFeatured === true;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Blog Articles Management
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Publish rich stories with photo, direct video, YouTube, or external player media across 4 custom design templates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="btn btn-primary !py-2 !px-4 text-xs gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus size={15} />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-4 rounded-[var(--radius-md)]">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tags, or topic..."
            className="form-input !pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-input text-xs !py-2 !w-auto"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("All")}
              className={`px-2.5 py-1 rounded-[var(--radius-xs)] font-medium cursor-pointer transition-colors ${
                statusFilter === "All"
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All ({blogs.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`px-2.5 py-1 rounded-[var(--radius-xs)] font-medium cursor-pointer transition-colors ${
                statusFilter === "published"
                  ? "bg-[var(--bg-card)] text-[#ea580c] dark:text-[#ff7828] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`px-2.5 py-1 rounded-[var(--radius-xs)] font-medium cursor-pointer transition-colors ${
                statusFilter === "draft"
                  ? "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Drafts
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("featured")}
              className={`px-2.5 py-1 rounded-[var(--radius-xs)] font-medium cursor-pointer transition-colors ${
                statusFilter === "featured"
                  ? "bg-[var(--bg-card)] text-amber-500 shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Spotlight
            </button>
          </div>
        </div>
      </div>

      {/* Blogs List */}
      {filteredBlogs.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] p-12 text-center flex flex-col items-center gap-3">
          <BookOpen size={36} className="text-[var(--text-muted)] opacity-50" />
          <h3 className="text-base font-bold m-0">No blog articles found</h3>
          <p className="text-xs text-[var(--text-muted)] max-w-sm m-0">
            {searchQuery || selectedCategory !== "All" || statusFilter !== "All"
              ? "Try adjusting your search query or filters."
              : "Start writing your first story, guide, or studio insight."}
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="btn btn-primary !py-2 !px-4 text-xs gap-1.5 mt-2 cursor-pointer"
          >
            <Plus size={14} />
            <span>Write First Article</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => {
            const isVideo = blog.mediaType === "video";
            const isYoutube = blog.mediaType === "youtube";
            const isEmbed = blog.mediaType === "embed";
            const coverSrc =
              blog.thumbnailUrl ||
              (blog.mediaType === "photo" ? blog.mediaUrl : null) ||
              "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";

            return (
              <div
                key={blog._id}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col justify-between hover:border-[var(--border-medium)] transition-all group shadow-xs"
              >
                <div>
                  {/* Media Thumbnail Container */}
                  <div className="relative aspect-video bg-[var(--bg-elevated)] overflow-hidden border-b border-[var(--border-subtle)]">
                    <img
                      src={coverSrc}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop";
                      }}
                    />

                    {/* Media Type Badge */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-white text-[0.65rem] font-bold font-mono">
                      {blog.mediaType === "photo" && <ImageIcon size={11} />}
                      {isVideo && <Video size={11} className="text-orange-400" />}
                      {isYoutube && <YoutubeIcon size={11} className="text-red-400" />}
                      {isEmbed && <Globe size={11} className="text-blue-400" />}
                      <span className="uppercase">{blog.mediaType}</span>
                    </div>

                    {/* Template Badge */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-xs text-[var(--text-primary)] text-[0.65rem] font-mono capitalize">
                      {blog.template || "editorial"}
                    </div>

                    {/* Featured / Draft pill */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                      {blog.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[0.65rem] font-bold flex items-center gap-1">
                          <Star size={10} fill="currentColor" />
                          <span>Spotlight</span>
                        </span>
                      )}
                      {!blog.isPublished && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/80 text-white text-[0.65rem] font-bold">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[0.68rem] text-[var(--text-muted)] font-mono">
                      <span className="text-[#ea580c] dark:text-[#ff7828] font-semibold uppercase">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })} • {new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {blog.readTime || "4 min"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold line-clamp-2 leading-snug text-[var(--text-primary)] m-0">
                      {blog.title}
                    </h3>

                    {blog.excerpt && (
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed m-0">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="px-4.5 py-3 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Toggle Published */}
                    <button
                      type="button"
                      onClick={() => onTogglePublish(blog._id)}
                      className={`btn-icon btn-ghost !w-7 !h-7 ${
                        blog.isPublished ? "text-emerald-400 hover:text-emerald-300" : "text-zinc-400"
                      }`}
                      title={blog.isPublished ? "Unpublish (Make Draft)" : "Publish to Storefront"}
                    >
                      {blog.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>

                    {/* Toggle Featured */}
                    <button
                      type="button"
                      onClick={() => onToggleFeature(blog._id)}
                      className={`btn-icon btn-ghost !w-7 !h-7 ${
                        blog.isFeatured ? "text-amber-400 hover:text-amber-300" : "text-zinc-400"
                      }`}
                      title={blog.isFeatured ? "Remove from Spotlight" : "Feature in Spotlight"}
                    >
                      <Star size={14} fill={blog.isFeatured ? "currentColor" : "none"} />
                    </button>

                    {/* View Live */}
                    {onViewLive && (
                      <button
                        type="button"
                        onClick={() => onViewLive(blog)}
                        className="btn-icon btn-ghost !w-7 !h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        title="View Live in Storefront"
                      >
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditBlog(blog)}
                      className="btn btn-secondary !py-1 !px-2.5 text-xs gap-1 cursor-pointer"
                    >
                      <Edit2 size={12} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteBlog(blog)}
                      className="btn-icon btn-ghost !w-7 !h-7 text-red-400 hover:text-red-300"
                      title="Delete Article"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

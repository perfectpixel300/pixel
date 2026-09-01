import React, { useState, useEffect } from "react";
import {
  X,
  Image as ImageIcon,
  Video,
  Globe,
  Upload,
  Sparkles,
  Layout,
  BookOpen,
  FileText,
  Clock,
  Calendar,
  User,
  Tag,
  CheckCircle,
  Eye,
  Play,
  Film,
  Compass,
} from "lucide-react";
import { api } from "../../services/api";

export const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TEMPLATES = [
  {
    id: "editorial",
    name: "Editorial Atelier",
    tagline: "Classic Minimalist",
    desc: "Refined serif/sans typography, generous reading margins, large centered hero media, and elegant pull quotes.",
    icon: BookOpen,
    accentColor: "border-orange-500/50 bg-orange-500/5",
  },
  {
    id: "magazine",
    name: "Modern Magazine",
    tagline: "Bold Visual Grid",
    desc: "High-contrast headings, dynamic 2-column split header, vibrant accent badges, and magazine callout boxes.",
    icon: Layout,
    accentColor: "border-blue-500/50 bg-blue-500/5",
  },
  {
    id: "journal",
    name: "Technical Journal",
    tagline: "Monochrome Precision",
    desc: "Structured metadata sidebar, monospace log stamps, engineering specs tables, and code snippet styling.",
    icon: FileText,
    accentColor: "border-emerald-500/50 bg-emerald-500/5",
  },
  {
    id: "cinema",
    name: "Visual Cinema",
    tagline: "Immersive Video & Storyboard",
    desc: "Edge-to-edge widescreen media viewport, dark cinematic atmosphere, video-centric layout, and photo stream.",
    icon: Film,
    accentColor: "border-purple-500/50 bg-purple-500/5",
  },
];

// Helper to convert YouTube URL to embed URL
export const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    if (url.includes("youtube.com/embed/")) {
      return url;
    }
  } catch {
    // Return original
  }
  return url;
};

export function BlogFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingBlog = null,
  isSubmitting = false,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Craftsmanship",
    tags: "",
    author: {
      name: "Pixel Perfect Editorial",
      role: "Lead Author",
      avatar: "",
    },
    mediaType: "photo", // 'photo' | 'video' | 'youtube' | 'embed'
    mediaUrl: "",
    thumbnailUrl: "",
    template: "editorial", // 'editorial' | 'magazine' | 'journal' | 'cinema'
    readTime: "4 min read",
    isPublished: true,
    isFeatured: false,
    publishedAt: new Date().toISOString().slice(0, 16),
  });

  const [activeTab, setActiveTab] = useState("content"); // 'content' | 'media' | 'template' | 'settings'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (editingBlog) {
      setFormData({
        _id: editingBlog._id,
        title: editingBlog.title || "",
        slug: editingBlog.slug || "",
        excerpt: editingBlog.excerpt || "",
        content: editingBlog.content || "",
        category: editingBlog.category || "Craftsmanship",
        tags: Array.isArray(editingBlog.tags) ? editingBlog.tags.join(", ") : editingBlog.tags || "",
        author: {
          name: editingBlog.author?.name || "Pixel Perfect Editorial",
          role: editingBlog.author?.role || "Lead Author",
          avatar: editingBlog.author?.avatar || "",
        },
        mediaType: editingBlog.mediaType || "photo",
        mediaUrl: editingBlog.mediaUrl || "",
        thumbnailUrl: editingBlog.thumbnailUrl || "",
        template: editingBlog.template || "editorial",
        readTime: editingBlog.readTime || "4 min read",
        isPublished: editingBlog.isPublished !== false,
        isFeatured: Boolean(editingBlog.isFeatured),
        publishedAt: editingBlog.publishedAt
          ? new Date(editingBlog.publishedAt).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: `### Introduction\n\nWrite your engaging blog opening here. Share the insights, craft behind the tools, or story behind your project.\n\n### The Process & Craftsmanship\n\nDetail the exact techniques, materials, or solutions used:\n\n- Point 1: Pure archival materials\n- Point 2: Micron level precision\n- Point 3: Dedicated execution\n\n> "Add an inspiring pull-quote from your studio or interview here."\n\n### Conclusion & Next Steps\n\nWrap up your key takeaways for your readers.`,
        category: "Craftsmanship",
        tags: "Stationery, Studio, Design",
        author: {
          name: "Pixel Perfect Editorial",
          role: "Lead Author",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
        },
        mediaType: "photo",
        mediaUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
        thumbnailUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
        template: "editorial",
        readTime: "4 min read",
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date().toISOString().slice(0, 16),
      });
    }
    setActiveTab("content");
    setUploadError("");
  }, [editingBlog, isOpen]);

  // Handle Cloudinary upload
  const handleFileUpload = async (e, field = "mediaUrl") => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError("");
      const res = await api.uploadImage(file, "blogs");
      if (res && res.url) {
        setFormData((prev) => ({
          ...prev,
          [field]: res.url,
          ...(field === "mediaUrl" && !prev.thumbnailUrl ? { thumbnailUrl: res.url } : {}),
        }));
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      alert("Please enter a blog title.");
      return;
    }
    if (!formData.content?.trim()) {
      alert("Please enter blog content.");
      return;
    }

    const payload = {
      ...formData,
      publishedAt: formData.publishedAt
        ? new Date(formData.publishedAt).toISOString()
        : new Date().toISOString(),
      tags: typeof formData.tags === "string"
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : formData.tags,
    };

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] w-full max-w-4xl rounded-[var(--radius-lg)] shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)]">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {editingBlog ? "Edit Blog Article" : "Write New Blog Article"}
              </h2>
              <p className="text-[0.7rem] text-[var(--text-muted)] font-mono">
                {formData.template.toUpperCase()} TEMPLATE • {formData.mediaType.toUpperCase()} MEDIA
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-icon btn-ghost"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-[var(--radius-sm)] border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "content"
                ? "border-[#ea580c] dark:border-[#ff7828] text-[#ea580c] dark:text-[#ff7828] bg-[var(--bg-elevated)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FileText size={14} />
            <span>1. Article Content</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-[var(--radius-sm)] border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "media"
                ? "border-[#ea580c] dark:border-[#ff7828] text-[#ea580c] dark:text-[#ff7828] bg-[var(--bg-elevated)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {formData.mediaType === "photo" && <ImageIcon size={14} />}
            {formData.mediaType === "video" && <Video size={14} />}
            {formData.mediaType === "youtube" && <YoutubeIcon size={14} />}
            {formData.mediaType === "embed" && <Globe size={14} />}
            <span>2. Cover Media ({formData.mediaType})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("template")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-[var(--radius-sm)] border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "template"
                ? "border-[#ea580c] dark:border-[#ff7828] text-[#ea580c] dark:text-[#ff7828] bg-[var(--bg-elevated)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Layout size={14} />
            <span>3. Layout Template</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-[var(--radius-sm)] border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === "settings"
                ? "border-[#ea580c] dark:border-[#ff7828] text-[#ea580c] dark:text-[#ff7828] bg-[var(--bg-elevated)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Sparkles size={14} />
            <span>4. Author & Meta</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div>
                <label className="form-label text-xs">Article Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Architecture of Paper: How Cotton & Cellulose Shape Thought"
                  className="form-input text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Craftsmanship, Printing, Workshop"
                    list="category-suggestions"
                    className="form-input text-xs"
                  />
                  <datalist id="category-suggestions">
                    <option value="Craftsmanship" />
                    <option value="Printing Technology" />
                    <option value="Workshop & Tools" />
                    <option value="Web & Design" />
                    <option value="Studio News" />
                  </datalist>
                </div>

                <div>
                  <label className="form-label text-xs">Custom URL Slug (optional)</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="form-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="form-label text-xs">Short Excerpt / Card Summary</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise 1-2 sentence preview that shows on blog listing cards..."
                  className="form-input text-xs leading-relaxed"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="form-label text-xs m-0">Article Body Content *</label>
                  <span className="text-[0.68rem] text-[var(--text-muted)] font-mono">
                    Markdown supported (### Headers, &gt; Quotes, - Lists, ``` Code)
                  </span>
                </div>
                <textarea
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article in markdown format..."
                  className="form-input text-xs font-mono leading-relaxed"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: COVER MEDIA SELECTOR */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div>
                <label className="form-label text-xs mb-2.5 block">Select Cover Media Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Photo Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "photo" })}
                    className={`p-3.5 rounded-[var(--radius-md)] border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      formData.mediaType === "photo"
                        ? "border-[#ea580c] dark:border-[#ff7828] bg-[#ea580c]/10 dark:bg-[#ff7828]/10 text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <ImageIcon size={18} className={formData.mediaType === "photo" ? "text-[#ea580c] dark:text-[#ff7828]" : ""} />
                      {formData.mediaType === "photo" && <CheckCircle size={14} className="text-[#ea580c] dark:text-[#ff7828]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">1. Photo Cover</div>
                      <div className="text-[0.68rem] text-[var(--text-muted)] mt-0.5">High-res JPG/PNG/WebP</div>
                    </div>
                  </button>

                  {/* Direct Video Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "video" })}
                    className={`p-3.5 rounded-[var(--radius-md)] border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      formData.mediaType === "video"
                        ? "border-[#ea580c] dark:border-[#ff7828] bg-[#ea580c]/10 dark:bg-[#ff7828]/10 text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Video size={18} className={formData.mediaType === "video" ? "text-[#ea580c] dark:text-[#ff7828]" : ""} />
                      {formData.mediaType === "video" && <CheckCircle size={14} className="text-[#ea580c] dark:text-[#ff7828]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">2. Direct Video</div>
                      <div className="text-[0.68rem] text-[var(--text-muted)] mt-0.5">MP4 or WebM video file</div>
                    </div>
                  </button>

                  {/* YouTube Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "youtube" })}
                    className={`p-3.5 rounded-[var(--radius-md)] border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      formData.mediaType === "youtube"
                        ? "border-[#ea580c] dark:border-[#ff7828] bg-[#ea580c]/10 dark:bg-[#ff7828]/10 text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <YoutubeIcon size={18} className={formData.mediaType === "youtube" ? "text-red-500" : ""} />
                      {formData.mediaType === "youtube" && <CheckCircle size={14} className="text-[#ea580c] dark:text-[#ff7828]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">3. YouTube</div>
                      <div className="text-[0.68rem] text-[var(--text-muted)] mt-0.5">URL or Video ID</div>
                    </div>
                  </button>

                  {/* External Embed Player Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mediaType: "embed" })}
                    className={`p-3.5 rounded-[var(--radius-md)] border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                      formData.mediaType === "embed"
                        ? "border-[#ea580c] dark:border-[#ff7828] bg-[#ea580c]/10 dark:bg-[#ff7828]/10 text-[var(--text-primary)] shadow-sm"
                        : "border-[var(--border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:border-[var(--border-medium)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Globe size={18} className={formData.mediaType === "embed" ? "text-blue-400" : ""} />
                      {formData.mediaType === "embed" && <CheckCircle size={14} className="text-[#ea580c] dark:text-[#ff7828]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">4. External Player</div>
                      <div className="text-[0.68rem] text-[var(--text-muted)] mt-0.5">Vimeo, Loom, iFrame</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on mediaType */}
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4">
                {formData.mediaType === "photo" && (
                  <div className="space-y-3">
                    <div>
                      <label className="form-label text-xs">Image Link / CDN URL</label>
                      <input
                        type="url"
                        value={formData.mediaUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mediaUrl: e.target.value,
                            thumbnailUrl: formData.thumbnailUrl || e.target.value,
                          })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="form-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="btn btn-secondary !py-2 !px-4 text-xs gap-2 cursor-pointer inline-flex items-center">
                        <Upload size={14} />
                        <span>{isUploading ? "Uploading to Cloudinary..." : "Upload Photo File"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, "mediaUrl")}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {formData.mediaType === "video" && (
                  <div className="space-y-3">
                    <div>
                      <label className="form-label text-xs">Direct MP4 or WebM Video URL</label>
                      <input
                        type="url"
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Video Thumbnail / Poster Image URL</label>
                      <input
                        type="url"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="https://example.com/poster.jpg (shown before play)"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {formData.mediaType === "youtube" && (
                  <div className="space-y-3">
                    <div>
                      <label className="form-label text-xs">YouTube Video Link</label>
                      <input
                        type="text"
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/..."
                        className="form-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Custom Card Thumbnail (Optional)</label>
                      <input
                        type="url"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... (leave blank for default)"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {formData.mediaType === "embed" && (
                  <div className="space-y-3">
                    <div>
                      <label className="form-label text-xs">External Video Player Embed URL / iFrame Source</label>
                      <input
                        type="text"
                        value={formData.mediaUrl}
                        onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                        placeholder="https://player.vimeo.com/video/123456 or embed URL"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="form-label text-xs">Listing Card Thumbnail Image</label>
                      <input
                        type="url"
                        value={formData.thumbnailUrl}
                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/... (required for card preview)"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                {uploadError && (
                  <div className="text-xs text-red-400 font-mono mt-1">{uploadError}</div>
                )}
              </div>

              {/* Live Media Preview Box */}
              <div>
                <div className="text-xs font-bold mb-2 flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <Eye size={13} />
                  <span>Live Media Player Preview</span>
                </div>
                <div className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-subtle)] bg-black/40 aspect-video flex items-center justify-center relative">
                  {formData.mediaType === "photo" && formData.mediaUrl && (
                    <img
                      src={formData.mediaUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop";
                      }}
                    />
                  )}

                  {formData.mediaType === "video" && formData.mediaUrl && (
                    <video
                      src={formData.mediaUrl}
                      poster={formData.thumbnailUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )}

                  {formData.mediaType === "youtube" && formData.mediaUrl && (
                    <iframe
                      src={getYouTubeEmbedUrl(formData.mediaUrl)}
                      title="YouTube Preview"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {formData.mediaType === "embed" && formData.mediaUrl && (
                    <iframe
                      src={formData.mediaUrl}
                      title="External Player Preview"
                      className="w-full h-full border-0"
                      allowFullScreen
                    />
                  )}

                  {!formData.mediaUrl && (
                    <div className="text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
                      <Film size={24} />
                      <span>Enter media URL to view preview</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LAYOUT TEMPLATES */}
          {activeTab === "template" && (
            <div className="space-y-4">
              <div>
                <label className="form-label text-xs mb-1">Select Article Layout & Styling Template</label>
                <p className="text-[0.75rem] text-[var(--text-muted)] mb-4">
                  Each template configures unique typographic hierarchy, hero placement, and content styling on the storefront article page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TEMPLATES.map((tmpl) => {
                  const Icon = tmpl.icon;
                  const isSelected = formData.template === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setFormData({ ...formData, template: tmpl.id })}
                      className={`p-4.5 rounded-[var(--radius-lg)] border-2 transition-all cursor-pointer relative flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-[#ea580c] dark:border-[#ff7828] bg-[var(--bg-elevated)] shadow-md"
                          : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-medium)]"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-[#ea580c] dark:bg-[#ff7828] text-white"
                                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[var(--text-primary)]">
                              {tmpl.name}
                            </div>
                            <div className="text-[0.68rem] text-[#ea580c] dark:text-[#ff7828] font-mono font-medium">
                              {tmpl.tagline}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-[0.65rem] font-bold rounded-full bg-[#ea580c]/15 text-[#ea580c] dark:bg-[#ff7828]/15 dark:text-[#ff7828]">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[0.75rem] text-[var(--text-secondary)] leading-relaxed m-0">
                        {tmpl.desc}
                      </p>

                      {/* Mini visual mockup wireframe */}
                      <div className="pt-2 border-t border-[var(--border-subtle)]">
                        <div className="p-2 rounded-sm bg-black/20 border border-[var(--border-subtle)] flex flex-col gap-1.5">
                          {tmpl.id === "editorial" && (
                            <>
                              <div className="h-1.5 w-1/3 bg-orange-500/60 rounded-xs mx-auto" />
                              <div className="h-2 w-2/3 bg-[var(--text-primary)]/40 rounded-xs mx-auto" />
                              <div className="h-6 w-full bg-[var(--border-medium)] rounded-xs" />
                              <div className="h-1 w-full bg-[var(--text-muted)]/30 rounded-xs" />
                            </>
                          )}
                          {tmpl.id === "magazine" && (
                            <div className="grid grid-cols-2 gap-1.5 items-center">
                              <div className="h-8 bg-[var(--border-medium)] rounded-xs" />
                              <div className="flex flex-col gap-1">
                                <div className="h-2 w-full bg-blue-500/60 rounded-xs" />
                                <div className="h-1 w-3/4 bg-[var(--text-muted)]/30 rounded-xs" />
                              </div>
                            </div>
                          )}
                          {tmpl.id === "journal" && (
                            <div className="grid grid-cols-3 gap-1.5">
                              <div className="h-8 bg-[var(--border-subtle)] rounded-xs flex flex-col gap-1 p-1">
                                <div className="h-1 w-full bg-emerald-500/60 rounded-xs" />
                                <div className="h-1 w-1/2 bg-[var(--text-muted)]/40 rounded-xs" />
                              </div>
                              <div className="col-span-2 h-8 bg-[var(--border-medium)] rounded-xs" />
                            </div>
                          )}
                          {tmpl.id === "cinema" && (
                            <>
                              <div className="h-10 w-full bg-purple-500/30 border border-purple-500/40 rounded-xs flex items-center justify-center">
                                <Play size={10} className="text-purple-300" />
                              </div>
                              <div className="h-1.5 w-1/2 bg-[var(--text-primary)]/50 rounded-xs" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: AUTHOR & METADATA */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              {/* Author Profile */}
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <User size={14} />
                  <span>Author Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="form-label text-xs">Author Name</label>
                    <input
                      type="text"
                      value={formData.author.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author, name: e.target.value },
                        })
                      }
                      placeholder="Pixel Perfect Editorial"
                      className="form-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="form-label text-xs">Author Role / Title</label>
                    <input
                      type="text"
                      value={formData.author.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author, role: e.target.value },
                        })
                      }
                      placeholder="e.g. Lead Craftsman, Master Colorist"
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="form-label text-xs">Author Avatar Image URL</label>
                    <input
                      type="url"
                      value={formData.author.avatar}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          author: { ...formData.author, avatar: e.target.value },
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="form-input text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Creation Date & Time, Tags & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label text-xs flex items-center gap-1">
                    <Calendar size={12} className="text-[#ea580c] dark:text-[#ff7828]" />
                    <span>Date & Time of Creation</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="form-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Estimated Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 4 min read"
                    className="form-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="form-label text-xs">Article Tags</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Craft, Paper, Design"
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Publication Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">Publish to Storefront</div>
                    <div className="text-[0.68rem] text-[var(--text-muted)]">
                      {formData.isPublished ? "Visible to public visitors" : "Saved as Draft (Admin only)"}
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">Feature as Spotlight</div>
                    <div className="text-[0.68rem] text-[var(--text-muted)]">
                      Highlight at the top of the blog page
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)] bg-[var(--bg-card)]">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary !py-2 !px-4 text-xs cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2.5">
              {activeTab !== "settings" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === "content") setActiveTab("media");
                    else if (activeTab === "media") setActiveTab("template");
                    else if (activeTab === "template") setActiveTab("settings");
                  }}
                  className="btn btn-secondary !py-2 !px-4 text-xs cursor-pointer"
                >
                  Next Step &rarr;
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary !py-2 !px-6 text-xs gap-1.5 cursor-pointer shadow-md"
              >
                <span>
                  {isSubmitting
                    ? "Saving Article..."
                    : editingBlog
                    ? "Save Changes"
                    : "Publish Article"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

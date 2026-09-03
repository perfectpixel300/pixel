import React, { useState, useEffect } from "react";
import {
  Info,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileText,
  Layers,
  ChevronUp,
  ChevronDown,
  Compass,
  Users,
} from "lucide-react";
import { api } from "../../services/api";

const DEFAULT_ABOUT_DATA = {
  badge: "About Us",
  title: "The Pixel Perfect Story",
  subtitle: "Crafting premium stationery, desk accessories, and modern technology solutions.",
  heroImage: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1400&auto=format&fit=crop",
  heroImageAlt: "Pixel Perfect Workshop",
  storyParagraphs: [
    "Pixel Perfect was founded in response to the ephemeral nature of modern digital workflows. While screens facilitate speed, they often rob our thinking of friction—the deliberate, contemplative resistance that allows deep ideas to take shape.",
    "We set out to engineer stationery that feels substantial in the hand and endures for generations. From the tactile snap of our raw brass pens to the smooth, ink-receptive fiber of Swedish Munken paper, every material is selected for its sensory feedback and archival durability.",
    "Our workshop operates in small, deliberate batches. We work closely with master papermakers in Sweden, CNC machinists in Bavaria, and traditional leather artisans in Florence to bring each design to life without compromise.",
  ],
  tenetsHeading: "Our Four Tenets",
  tenets: [
    {
      number: "01",
      title: "Material Honesty",
      description:
        "Solid brass without artificial coatings. 100% cotton rags without chemical bleaching. Pure materials that age with dignity.",
    },
    {
      number: "02",
      title: "Micron Precision",
      description:
        "CNC turning tolerances down to 0.01mm ensure perfect balance, effortless cap threading, and flawless ink cartridge seating.",
    },
    {
      number: "03",
      title: "Lay-Flat Binding",
      description:
        "Every notebook uses authentic Smyth sewn binding that opens 180 degrees completely flat, respecting both left and right-handed writers.",
    },
    {
      number: "04",
      title: "Lifelong Support",
      description:
        "Refillable standard international fountain pen cartridges and modular replacement parts for all desk objects.",
    },
  ],
  teamHeading: "Our Team",
  teamSubheading: "",
  team: [],
  ctaHeading: "Experience The Analog Difference",
  ctaDescription: "Explore our curated range of notebooks, machined writing instruments, and desk objects.",
  ctaButtonText: "Explore The Collection",
  ctaButtonLink: "products",
};

export function AboutManagement({ aboutData, onUpdateAbout, showToast }) {
  const [formData, setFormData] = useState(aboutData || DEFAULT_ABOUT_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingMemberIdx, setUploadingMemberIdx] = useState(null);

  useEffect(() => {
    if (aboutData) {
      setFormData({
        badge: aboutData.badge || DEFAULT_ABOUT_DATA.badge,
        title: aboutData.title || DEFAULT_ABOUT_DATA.title,
        subtitle: aboutData.subtitle || DEFAULT_ABOUT_DATA.subtitle,
        heroImage: aboutData.heroImage || DEFAULT_ABOUT_DATA.heroImage,
        heroImageAlt: aboutData.heroImageAlt || DEFAULT_ABOUT_DATA.heroImageAlt,
        storyParagraphs:
          aboutData.storyParagraphs && aboutData.storyParagraphs.length > 0
            ? aboutData.storyParagraphs
            : DEFAULT_ABOUT_DATA.storyParagraphs,
        tenetsHeading: aboutData.tenetsHeading || DEFAULT_ABOUT_DATA.tenetsHeading,
        tenets:
          aboutData.tenets && aboutData.tenets.length > 0
            ? aboutData.tenets
            : DEFAULT_ABOUT_DATA.tenets,
        teamHeading: aboutData.teamHeading || DEFAULT_ABOUT_DATA.teamHeading,
        teamSubheading:
          aboutData.teamSubheading !== undefined
            ? aboutData.teamSubheading
            : DEFAULT_ABOUT_DATA.teamSubheading,
        team:
          aboutData.team && Array.isArray(aboutData.team)
            ? aboutData.team
            : DEFAULT_ABOUT_DATA.team,
        ctaHeading: aboutData.ctaHeading || DEFAULT_ABOUT_DATA.ctaHeading,
        ctaDescription: aboutData.ctaDescription || DEFAULT_ABOUT_DATA.ctaDescription,
        ctaButtonText: aboutData.ctaButtonText || DEFAULT_ABOUT_DATA.ctaButtonText,
        ctaButtonLink: aboutData.ctaButtonLink || DEFAULT_ABOUT_DATA.ctaButtonLink,
      });
    }
  }, [aboutData]);

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await api.uploadImage(file, "about");
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, heroImage: res.url }));
        if (showToast) showToast("Hero image uploaded successfully!");
      }
    } catch (err) {
      if (showToast) showToast(err.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Story Paragraphs handlers
  const handleParagraphChange = (index, value) => {
    const updated = [...formData.storyParagraphs];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, storyParagraphs: updated }));
  };

  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      storyParagraphs: [...prev.storyParagraphs, ""],
    }));
  };

  const handleRemoveParagraph = (index) => {
    if (formData.storyParagraphs.length <= 1) {
      if (showToast) showToast("You must have at least one story paragraph.", "error");
      return;
    }
    const updated = formData.storyParagraphs.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, storyParagraphs: updated }));
  };

  const handleMoveParagraph = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formData.storyParagraphs.length) return;
    const updated = [...formData.storyParagraphs];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, storyParagraphs: updated }));
  };

  // Tenets / Pillars handlers
  const handleTenetChange = (index, field, value) => {
    const updated = [...formData.tenets];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, tenets: updated }));
  };

  const handleAddTenet = () => {
    const nextNum = String(formData.tenets.length + 1).padStart(2, "0");
    setFormData((prev) => ({
      ...prev,
      tenets: [
        ...prev.tenets,
        {
          number: nextNum,
          title: "New Studio Tenet",
          description: "Describe the craft principle, engineering standard, or material detail.",
        },
      ],
    }));
  };

  const handleRemoveTenet = (index) => {
    if (formData.tenets.length <= 1) {
      if (showToast) showToast("You must have at least one tenet.", "error");
      return;
    }
    const updated = formData.tenets.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, tenets: updated }));
  };

  const handleMoveTenet = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= formData.tenets.length) return;
    const updated = [...formData.tenets];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, tenets: updated }));
  };

  // Team Members handlers
  const handleMemberChange = (index, field, value) => {
    const updated = [...(formData.team || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, team: updated }));
  };

  const handleAddMember = () => {
    setFormData((prev) => ({
      ...prev,
      team: [
        ...(prev.team || []),
        {
          name: "",
          position: "",
          image: "",
          portfolioLink: "",
        },
      ],
    }));
  };

  const handleRemoveMember = (index) => {
    const updated = (formData.team || []).filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, team: updated }));
  };

  const handleMoveMember = (index, direction) => {
    const team = formData.team || [];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= team.length) return;
    const updated = [...team];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFormData((prev) => ({ ...prev, team: updated }));
  };

  const handleMemberImageUpload = async (index, file) => {
    if (!file) return;
    try {
      setUploadingMemberIdx(index);
      const res = await api.uploadImage(file, "team");
      if (res && res.url) {
        handleMemberChange(index, "image", res.url);
        if (showToast) showToast("Team member photo uploaded successfully!");
      }
    } catch (err) {
      if (showToast) showToast(err.message || "Failed to upload photo", "error");
    } finally {
      setUploadingMemberIdx(null);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all fields on this form to the studio defaults?")) {
      setFormData(DEFAULT_ABOUT_DATA);
      if (showToast) showToast("Reset to studio defaults. Click Save to persist.", "info");
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      if (showToast) showToast("Page title cannot be empty.", "error");
      return;
    }

    if (formData.team && formData.team.length > 0) {
      for (let i = 0; i < formData.team.length; i++) {
        const member = formData.team[i];
        if (!member.name?.trim()) {
          if (showToast) showToast(`Team member #${i + 1}: Name is required.`, "error");
          return;
        }
        if (!member.position?.trim()) {
          if (showToast) showToast(`Team member #${i + 1}: Position is required.`, "error");
          return;
        }
        if (!member.image?.trim()) {
          if (showToast) showToast(`Team member #${i + 1}: Image is required.`, "error");
          return;
        }
      }
    }

    try {
      setIsSaving(true);
      if (onUpdateAbout) {
        await onUpdateAbout(formData);
      } else {
        await api.updateAbout(formData);
      }
      if (showToast) showToast("About page updated successfully!");
    } catch (err) {
      if (showToast) showToast(err.message || "Failed to update About page", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-medium)] flex items-center justify-center text-[var(--text-primary)] shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              About Page Content Management
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
              Customize the brand story, hero photography, foundational tenets, team members, and bottom CTA banner.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary !py-2 !px-3.5 text-xs gap-1.5 cursor-pointer"
            title="Reset to default content"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn btn-primary !py-2 !px-5 text-xs gap-1.5 cursor-pointer"
          >
            <Save size={14} />
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Header & Hero Imagery */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Sparkles size={16} className="text-[#ea580c] dark:text-[#ff7828]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              1. Header & Hero Photography
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label text-xs">Top Category Badge</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. About Us"
                className="form-input text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label text-xs">Main Page Headline</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. The Pixel Perfect Story"
                className="form-input text-xs font-bold"
                required
              />
            </div>

            <div className="md:col-span-3">
              <label className="form-label text-xs">Subtitle / Intro Statement</label>
              <textarea
                rows={2}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Crafting premium stationery, desk accessories, and modern technology solutions."
                className="form-input text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Hero Image Controls & Live Preview */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <label className="form-label text-xs mb-2">Hero Workshop Photo</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-3">
                <div>
                  <span className="text-[0.7rem] text-[var(--text-muted)] block mb-1">
                    Image URL or Cloudinary CDN link
                  </span>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    placeholder="https://..."
                    className="form-input text-xs font-mono"
                  />
                </div>

                <div>
                  <span className="text-[0.7rem] text-[var(--text-muted)] block mb-1">
                    Image Alt Description
                  </span>
                  <input
                    type="text"
                    value={formData.heroImageAlt}
                    onChange={(e) => setFormData({ ...formData, heroImageAlt: e.target.value })}
                    placeholder="Pixel Perfect Workshop"
                    className="form-input text-xs"
                  />
                </div>

                <div>
                  <label className="btn btn-secondary !py-2 !px-4 text-xs gap-2 cursor-pointer inline-flex items-center">
                    <Upload size={14} />
                    <span>{isUploading ? "Uploading..." : "Upload New Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preview Box */}
              <div className="relative rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-medium)] h-44 bg-[var(--bg-elevated)] flex items-center justify-center">
                {formData.heroImage ? (
                  <img
                    src={formData.heroImage}
                    alt={formData.heroImageAlt || "Hero preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = DEFAULT_ABOUT_DATA.heroImage;
                    }}
                  />
                ) : (
                  <div className="text-[var(--text-muted)] text-xs flex flex-col items-center gap-1.5">
                    <ImageIcon size={24} />
                    <span>No image specified</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-black/70 text-white text-[0.65rem] font-mono backdrop-blur-xs">
                  Hero Preview
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Brand Story Paragraphs */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[#ea580c] dark:text-[#ff7828]" />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                2. Brand Story Paragraphs ({formData.storyParagraphs.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddParagraph}
              className="btn btn-secondary !py-1.5 !px-3 text-xs gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Paragraph</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.storyParagraphs.map((paragraph, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                  <span>Paragraph #{idx + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveParagraph(idx, -1)}
                      disabled={idx === 0}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveParagraph(idx, 1)}
                      disabled={idx === formData.storyParagraphs.length - 1}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="btn-icon btn-ghost !w-6 !h-6 text-red-400 hover:text-red-300 ml-1"
                      title="Delete paragraph"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={paragraph}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  placeholder="Enter story text..."
                  className="form-input text-xs leading-relaxed"
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Core Tenets & Pillars */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#ea580c] dark:text-[#ff7828]" />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider">
                  3. Foundational Tenets / Pillars
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddTenet}
                className="btn btn-secondary !py-1.5 !px-3 text-xs gap-1.5 cursor-pointer"
              >
                <Plus size={13} />
                <span>Add Tenet</span>
              </button>
            </div>
          </div>

          <div>
            <label className="form-label text-xs">Section Heading</label>
            <input
              type="text"
              value={formData.tenetsHeading}
              onChange={(e) => setFormData({ ...formData, tenetsHeading: e.target.value })}
              placeholder="e.g. Our Four Tenets"
              className="form-input text-xs mb-4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.tenets.map((tenet, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[var(--text-muted)]">
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={tenet.number}
                      onChange={(e) => handleTenetChange(idx, "number", e.target.value)}
                      placeholder="01"
                      className="form-input !py-1 !px-2 w-14 text-xs font-mono font-bold text-center"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveTenet(idx, -1)}
                      disabled={idx === 0}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move left/up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveTenet(idx, 1)}
                      disabled={idx === formData.tenets.length - 1}
                      className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                      title="Move right/down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTenet(idx)}
                      className="btn-icon btn-ghost !w-6 !h-6 text-red-400 hover:text-red-300 ml-1"
                      title="Delete tenet"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={tenet.title}
                    onChange={(e) => handleTenetChange(idx, "title", e.target.value)}
                    placeholder="Tenet Title (e.g. Material Honesty)"
                    className="form-input text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={tenet.description}
                    onChange={(e) => handleTenetChange(idx, "description", e.target.value)}
                    placeholder="Detail the principle and standards..."
                    className="form-input text-xs leading-relaxed"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Our Team */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-[#ea580c] dark:text-[#ff7828]" />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                4. Team Members ({formData.team?.length || 0})
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              className="btn btn-secondary !py-1.5 !px-3 text-xs gap-1.5 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Team Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-xs">Section Heading</label>
              <input
                type="text"
                value={formData.teamHeading || ""}
                onChange={(e) => setFormData({ ...formData, teamHeading: e.target.value })}
                placeholder="e.g. Our Team"
                className="form-input text-xs"
              />
            </div>
            <div>
              <label className="form-label text-xs">Section Subheading</label>
              <input
                type="text"
                value={formData.teamSubheading || ""}
                onChange={(e) => setFormData({ ...formData, teamSubheading: e.target.value })}
                placeholder="e.g. The dedicated craftsmen, designers, and innovators behind Pixel Perfect."
                className="form-input text-xs"
              />
            </div>
          </div>

          {(!formData.team || formData.team.length === 0) ? (
            <div className="p-8 text-center border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-md)] text-[var(--text-muted)] text-xs">
              No team members added yet. Click &ldquo;Add Team Member&rdquo; above to add one.
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {formData.team.map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                    <span className="font-bold text-[var(--text-primary)]">
                      Team Member #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveMember(idx, -1)}
                        disabled={idx === 0}
                        className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                        title="Move up"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMember(idx, 1)}
                        disabled={idx === formData.team.length - 1}
                        className="btn-icon btn-ghost !w-6 !h-6 disabled:opacity-20"
                        title="Move down"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="btn-icon btn-ghost !w-6 !h-6 text-red-400 hover:text-red-300 ml-1"
                        title="Delete member"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* Member Details */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="form-label text-xs">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleMemberChange(idx, "name", e.target.value)}
                            placeholder="e.g. Marcus Vance"
                            className="form-input text-xs font-bold"
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label text-xs">
                            Position / Role <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={member.position}
                            onChange={(e) => handleMemberChange(idx, "position", e.target.value)}
                            placeholder="e.g. Founder & Lead Craftsman"
                            className="form-input text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="form-label text-xs">
                          Portfolio Link <span className="text-[var(--text-muted)] font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={member.portfolioLink || ""}
                          onChange={(e) => handleMemberChange(idx, "portfolioLink", e.target.value)}
                          placeholder="e.g. https://portfolio.com or https://github.com/..."
                          className="form-input text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="form-label text-xs">
                          Photo URL <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={member.image}
                            onChange={(e) => handleMemberChange(idx, "image", e.target.value)}
                            placeholder="https://images.unsplash.com/... or uploaded photo link"
                            className="form-input text-xs font-mono flex-1"
                            required
                          />
                          <label className="btn btn-secondary !py-1.5 !px-3 text-xs gap-1.5 cursor-pointer shrink-0 inline-flex items-center">
                            <Upload size={13} />
                            <span>{uploadingMemberIdx === idx ? "Uploading..." : "Upload"}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const f = e.target.files[0];
                                if (f) handleMemberImageUpload(idx, f);
                                e.target.value = "";
                              }}
                              disabled={uploadingMemberIdx === idx}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Member Photo Preview */}
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[0.7rem] text-[var(--text-muted)] block mb-1.5 self-start">
                        Photo Preview
                      </span>
                      <div className="w-full aspect-square max-w-[130px] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border-medium)] bg-[var(--bg-card)] flex items-center justify-center relative shadow-xs">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name || "Preview"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";
                            }}
                          />
                        ) : (
                          <div className="text-[var(--text-muted)] text-[0.7rem] flex flex-col items-center gap-1 p-2 text-center">
                            <ImageIcon size={20} />
                            <span>No photo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Bottom Call-to-Action (CTA) */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] p-6 rounded-[var(--radius-lg)] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-subtle)]">
            <Compass size={16} className="text-[#ea580c] dark:text-[#ff7828]" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              5. Bottom Call-To-Action (CTA) Banner
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="form-label text-xs">CTA Headline</label>
              <input
                type="text"
                value={formData.ctaHeading}
                onChange={(e) => setFormData({ ...formData, ctaHeading: e.target.value })}
                placeholder="Experience The Analog Difference"
                className="form-input text-xs font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label text-xs">CTA Description</label>
              <textarea
                rows={2}
                value={formData.ctaDescription}
                onChange={(e) => setFormData({ ...formData, ctaDescription: e.target.value })}
                placeholder="Explore our curated range of notebooks, machined writing instruments, and desk objects."
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Button Text</label>
              <input
                type="text"
                value={formData.ctaButtonText}
                onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                placeholder="Explore The Collection"
                className="form-input text-xs"
              />
            </div>

            <div>
              <label className="form-label text-xs">Button Target Page</label>
              <select
                value={formData.ctaButtonLink}
                onChange={(e) => setFormData({ ...formData, ctaButtonLink: e.target.value })}
                className="form-input text-xs"
              >
                <option value="products">Products Page</option>
                <option value="printing">Printing Page</option>
                <option value="services">Services Page</option>
                <option value="contact">Contact Page</option>
                <option value="home">Home Page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="btn btn-secondary !py-2.5 !px-5 text-xs gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary !py-2.5 !px-7 text-xs gap-2 cursor-pointer shadow-md"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving About Page..." : "Save About Page"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

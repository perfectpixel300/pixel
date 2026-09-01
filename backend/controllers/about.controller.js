const About = require("../models/about.model");

// Helper to get or auto-initialize the singleton About page content
const getOrCreateAbout = async () => {
  let about = await About.findOne();
  if (!about) {
    about = await About.create({
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
          description: "Solid brass without artificial coatings. 100% cotton rags without chemical bleaching. Pure materials that age with dignity.",
        },
        {
          number: "02",
          title: "Micron Precision",
          description: "CNC turning tolerances down to 0.01mm ensure perfect balance, effortless cap threading, and flawless ink cartridge seating.",
        },
        {
          number: "03",
          title: "Lay-Flat Binding",
          description: "Every notebook uses authentic Smyth sewn binding that opens 180 degrees completely flat, respecting both left and right-handed writers.",
        },
        {
          number: "04",
          title: "Lifelong Support",
          description: "Refillable standard international fountain pen cartridges and modular replacement parts for all desk objects.",
        },
      ],
      ctaHeading: "Experience The Analog Difference",
      ctaDescription: "Explore our curated range of notebooks, machined writing instruments, and desk objects.",
      ctaButtonText: "Explore The Collection",
      ctaButtonLink: "products",
      updatedBy: "Admin",
    });
  }
  return about;
};

// @desc    Get About page content (Public)
// @route   GET /api/about
exports.getAbout = async (req, res) => {
  try {
    const about = await getOrCreateAbout();
    res.status(200).json({
      success: true,
      about,
    });
  } catch (error) {
    console.error("Error in getAbout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve About page data",
      error: error.message,
    });
  }
};

// @desc    Update About page content (Admin Protected)
// @route   PUT /api/about
exports.updateAbout = async (req, res) => {
  try {
    const {
      badge,
      title,
      subtitle,
      heroImage,
      heroImageAlt,
      storyParagraphs,
      tenetsHeading,
      tenets,
      ctaHeading,
      ctaDescription,
      ctaButtonText,
      ctaButtonLink,
    } = req.body;

    let about = await getOrCreateAbout();

    if (badge !== undefined) about.badge = badge.trim();
    if (title !== undefined) about.title = title.trim();
    if (subtitle !== undefined) about.subtitle = subtitle.trim();
    if (heroImage !== undefined) about.heroImage = heroImage.trim();
    if (heroImageAlt !== undefined) about.heroImageAlt = heroImageAlt.trim();

    if (storyParagraphs !== undefined && Array.isArray(storyParagraphs)) {
      about.storyParagraphs = storyParagraphs.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean);
    }

    if (tenetsHeading !== undefined) about.tenetsHeading = tenetsHeading.trim();

    if (tenets !== undefined && Array.isArray(tenets)) {
      about.tenets = tenets
        .filter((t) => t && t.title && t.description)
        .map((t, idx) => ({
          number: t.number?.trim() || String(idx + 1).padStart(2, "0"),
          title: t.title.trim(),
          description: t.description.trim(),
        }));
    }

    if (ctaHeading !== undefined) about.ctaHeading = ctaHeading.trim();
    if (ctaDescription !== undefined) about.ctaDescription = ctaDescription.trim();
    if (ctaButtonText !== undefined) about.ctaButtonText = ctaButtonText.trim();
    if (ctaButtonLink !== undefined) about.ctaButtonLink = ctaButtonLink.trim();

    about.updatedBy = req.user?.username || req.user?.email || "Admin";

    await about.save();

    res.status(200).json({
      success: true,
      message: "About page updated successfully",
      about,
    });
  } catch (error) {
    console.error("Error in updateAbout:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update About page data",
      error: error.message,
    });
  }
};

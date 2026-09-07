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
      teamHeading: "Our Team",
      teamSubheading: "The dedicated craftsmen, designers, and innovators behind Pixel Perfect.",
      team: [
        {
          name: "Bikash Shrestha",
          position: "Designer, Founder & Manager",
          image: "https://bikashshrestha01.com.np/assets/img/my-profile-img.svg",
          portfolioLink: "https://bikashshrestha01.com.np/",
          description: "Directs visual brand strategy, product design systems, and holistic atelier operations.",
        },
        {
          name: "Ramesh Shrestha",
          position: "QA Developer & CEO",
          image: "https://scontent.fktm8-1.fna.fbcdn.net/v/t51.82787-15/669861636_18369986179207519_4582259281304280521_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHqZmrOwa3f2y8rGFPVQyw6yO9BsCZeJqTI70GwJl4mpNtLnmF3Xq7hEckfCzXKxsXytji4Frt7ofePAOBvc3bM&_nc_ohc=Q1mmjMkwMjAQ7kNvwGBMsQj&_nc_oc=Ado-1o8tyeJkp8ojRhCiLdQBWEz1_q_Am-J2qJgu1rZ-DSAZbpKHeRbLjgUztsshNIoOnDAqEhtlpaHidEltNGQN&_nc_zt=23&_nc_ht=scontent.fktm8-1.fna&_nc_gid=P-sxWd5BekzycgixCWKZPA&_nc_ss=7b2a8&oh=00_AQIw1_815NsR9JLPXAeiKY4i_Q70pS0vPsxY7Ckyr5x1TA&oe=6AA38E7F",
          portfolioLink: "https://np.linkedin.com/in/ramesh-shrestha-327655273",
          description: "Steers executive technical strategy, continuous quality assurance, and engineering integrity.",
        },
        {
          name: "Saksham Shrestha",
          position: "Developer",
          image: "https://www.sakshamstha.com.np/saksham.jpg",
          portfolioLink: "https://www.sakshamstha.com.np/",
          description: "Architects responsive full-stack web platforms and bespoke interactive digital experiences.",
        },
        {
          name: "Rohan Maharjan",
          position: "Photographer",
          image: "https://scontent.fktm8-1.fna.fbcdn.net/v/t39.30808-6/469894180_18285559288240369_4058052152381755037_n.jpg?stp=dst-jpg_tt6&cstp=mx1440x1800&ctp=s1440x1800&_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeHEx8bBQnD_72oEWHMtJBcB9i0rVjEn2u32LStWMSfa7U0tyiPomjbmCCmG2Xmc17TLIQ1ztO4zuJnkdpkzdyAz&_nc_ohc=15Cm3ukE3iYQ7kNvwGKFZ9P&_nc_oc=AdrP5Ji9MjBO-C1_hajG8IAxa30eSK7HYwB4K3TpY6x7b7hWPcIe85QqCfDTQNmq_Jsq5qb_eSqXCVloPKbFIMZh&_nc_zt=23&_nc_ht=scontent.fktm8-1.fna&_nc_gid=Z2aP16EyUu7m2Px9m7tLWA&_nc_ss=7b2a8&oh=00_AQJYDvcrdioN0jDZasZxb9ErU01Ikgm8JdOX4rcodRrDKQ&oe=6AA37B14",
          portfolioLink: "",
          description: "Specializes in high-precision product photography, visual storytelling, and studio media production.",
        },
      ],
      ctaHeading: "Experience The Analog Difference",
      ctaDescription: "Explore our curated range of notebooks, machined writing instruments, and desk objects.",
      ctaButtonText: "Explore The Collection",
      ctaButtonLink: "products",
      updatedBy: "Admin",
    });
  } else if (!about.team) {
    about.team = [];
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
      teamHeading,
      teamSubheading,
      team,
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

    if (teamHeading !== undefined) about.teamHeading = teamHeading.trim();
    if (teamSubheading !== undefined) about.teamSubheading = teamSubheading.trim();

    if (team !== undefined && Array.isArray(team)) {
      for (let i = 0; i < team.length; i++) {
        const member = team[i];
        if (!member || !member.name || !member.name.trim()) {
          return res.status(400).json({
            success: false,
            message: `Team member #${i + 1} requires a name.`,
          });
        }
        if (!member.position || !member.position.trim()) {
          return res.status(400).json({
            success: false,
            message: `Team member #${i + 1} requires a position.`,
          });
        }
        if (!member.image || !member.image.trim()) {
          return res.status(400).json({
            success: false,
            message: `Team member #${i + 1} requires an image.`,
          });
        }
      }

      about.team = team.map((m) => ({
        name: m.name ? m.name.trim() : "",
        position: m.position ? m.position.trim() : "",
        image: m.image ? m.image.trim() : "",
        portfolioLink: m.portfolioLink ? m.portfolioLink.trim() : "",
        description: m.description ? m.description.trim() : "",
      }));
      about.markModified("team");
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

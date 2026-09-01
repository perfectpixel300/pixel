const mongoose = require("mongoose");

const tenetSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      trim: true,
      default: "01",
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      trim: true,
      default: "About Us",
    },
    title: {
      type: String,
      trim: true,
      default: "The Pixel Perfect Story",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "Crafting premium stationery, desk accessories, and modern technology solutions.",
    },
    heroImage: {
      type: String,
      trim: true,
      default: "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1400&auto=format&fit=crop",
    },
    heroImageAlt: {
      type: String,
      trim: true,
      default: "Pixel Perfect Workshop",
    },
    storyParagraphs: {
      type: [String],
      default: [
        "Pixel Perfect was founded in response to the ephemeral nature of modern digital workflows. While screens facilitate speed, they often rob our thinking of friction—the deliberate, contemplative resistance that allows deep ideas to take shape.",
        "We set out to engineer stationery that feels substantial in the hand and endures for generations. From the tactile snap of our raw brass pens to the smooth, ink-receptive fiber of Swedish Munken paper, every material is selected for its sensory feedback and archival durability.",
        "Our workshop operates in small, deliberate batches. We work closely with master papermakers in Sweden, CNC machinists in Bavaria, and traditional leather artisans in Florence to bring each design to life without compromise.",
      ],
    },
    tenetsHeading: {
      type: String,
      trim: true,
      default: "Our Four Tenets",
    },
    tenets: {
      type: [tenetSchema],
      default: [
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
    },
    ctaHeading: {
      type: String,
      trim: true,
      default: "Experience The Analog Difference",
    },
    ctaDescription: {
      type: String,
      trim: true,
      default: "Explore our curated range of notebooks, machined writing instruments, and desk objects.",
    },
    ctaButtonText: {
      type: String,
      trim: true,
      default: "Explore The Collection",
    },
    ctaButtonLink: {
      type: String,
      trim: true,
      default: "products",
    },
    updatedBy: {
      type: String,
      trim: true,
      default: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);

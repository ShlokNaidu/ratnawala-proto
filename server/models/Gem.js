const mongoose = require('mongoose');

const gemSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  nameHindi: { type: String },
  planet: { type: String },
  planetSymbol: { type: String },
  zodiac: [String],

  // UI
  accentColor: { type: String },
  accentColorLight: { type: String },

  // Stone properties
  color: [String],
  transparency: { type: String },
  mines: [String],
  qualities: [String],
  weightRange: {
    min: { type: Number },
    max: { type: Number },
  },
  hardness: { type: Number },
  family: { type: String },

  // Content
  description: { type: String },
  astrologicalBenefits: [String],
  whoShouldWear: { type: String },
  bestMetal: { type: String },
  wearingFinger: { type: String },

  // Images
  images: [{ url: String, publicId: String }],

  // Pricing
  pricePerCarat: {
    min: { type: Number },
    max: { type: Number },
  },

  // Flags
  featured: { type: Boolean, default: false },
  isNavRatan: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gem', gemSchema);

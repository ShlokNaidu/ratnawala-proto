const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  // Customer info
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  // Gem interest
  gemSlug: { type: String, required: true },
  gemName: { type: String },
  mine: { type: String },
  quality: { type: String },
  weight: { type: Number },
  budget: { type: Number },
  purpose: { type: String, enum: ['astrological', 'ornamental', 'collection', 'gift', 'other'], default: 'astrological' },
  message: { type: String },

  // Status
  status: {
    type: String,
    enum: ['new', 'contacted', 'negotiating', 'closed_won', 'closed_lost'],
    default: 'new',
  },

  // Admin notes
  adminNotes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Source
  source: { type: String, enum: ['website', 'whatsapp', 'call', 'walk_in'], default: 'website' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

enquirySchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Enquiry', enquirySchema);

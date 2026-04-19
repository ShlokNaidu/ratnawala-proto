const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enquiry: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },

  // Stone details
  gemSlug: { type: String, required: true },
  gemName: { type: String, required: true },
  mine: { type: String },
  quality: { type: String },
  weight: { type: Number }, // carats
  pricePerCarat: { type: Number },
  totalAmount: { type: Number, required: true },

  // Customer
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String },

  // Shipping
  shippingAddress: {
    line1: String, line2: String,
    city: String, state: String,
    pincode: String, country: { type: String, default: 'India' },
  },

  // Payment
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['razorpay', 'bank_transfer', 'cash', 'upi'] },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },

  // Fulfillment
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed',
  },
  trackingNumber: { type: String },
  certificateNumber: { type: String },

  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);

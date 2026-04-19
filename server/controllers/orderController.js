const Razorpay = require('razorpay');
const crypto   = require('crypto');
const Order    = require('../models/Order');
const Enquiry  = require('../models/Enquiry');

// Razorpay instance (only used when keys are set)
const getRazorpay = () => {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('your_')) return null;
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
};

// @route  POST /api/orders  [Admin — direct create]
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user?.id });
    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('createOrder error:', err.message);
    return res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/orders/from-enquiry/:enquiryId  [Admin only]
// Converts a closed enquiry into an order record.
exports.convertEnquiryToOrder = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.enquiryId);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });

    // Check not already converted
    const existing = await Order.findOne({ enquiry: enquiry._id });
    if (existing) return res.status(409).json({ success: false, message: 'Order already exists for this enquiry', order: existing });

    const {
      agreedAmount,
      paymentMethod = 'cash',
      notes = '',
      shippingAddress = {},
    } = req.body;

    if (!agreedAmount || agreedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'agreedAmount is required and must be > 0' });
    }

    const order = await Order.create({
      enquiry:       enquiry._id,
      gemSlug:       enquiry.gemSlug,
      gemName:       enquiry.gemName,
      mine:          enquiry.mine,
      quality:       enquiry.quality,
      weight:        enquiry.weight,
      totalAmount:   agreedAmount,
      customerName:  enquiry.name,
      customerPhone: enquiry.phone,
      customerEmail: enquiry.email,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'paid' : 'pending',
      orderStatus:   'confirmed',
      notes,
      shippingAddress,
    });

    // Mark enquiry as won
    await Enquiry.findByIdAndUpdate(enquiry._id, {
      status: 'closed_won',
      adminNotes: (enquiry.adminNotes ? enquiry.adminNotes + '\n' : '') +
                  `Order ${order._id} created on ${new Date().toLocaleString('en-IN')}.`,
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('convertEnquiryToOrder error:', err.message);
    return res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/orders  [Admin only]
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('user', 'name email')
      .populate('enquiry', 'name phone');

    return res.json({ success: true, total, page: Number(page), orders });
  } catch (err) {
    console.error('getOrders error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/orders/my  [Auth required]
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/orders/:id  [Admin only]
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    return res.json({ success: true, order });
  } catch (err) {
    console.error('updateOrder error:', err.message);
    return res.status(err.name === 'ValidationError' ? 400 : 500).json({ success: false, message: err.message });
  }
};

// ── Razorpay payment flow ─────────────────────────────────────────────────────

// @route  POST /api/orders/razorpay/create
exports.createRazorpayOrder = async (req, res) => {
  try {
    const rzp = getRazorpay();
    if (!rzp) return res.status(503).json({ success: false, message: 'Razorpay not configured' });
    const { amount, currency = 'INR', receipt } = req.body;
    const rzpOrder = await rzp.orders.create({ amount: amount * 100, currency, receipt });
    return res.json({ success: true, order: rzpOrder });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/orders/razorpay/verify
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const rzp = getRazorpay();
    if (!rzp) return res.status(503).json({ success: false, message: 'Razorpay not configured' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      orderStatus: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    }, { new: true });

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

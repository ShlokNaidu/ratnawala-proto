const Enquiry  = require('../models/Enquiry');
const { sendEnquiryNotification } = require('../utils/mailer');

// @route  POST /api/enquiries  (public)
exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    // Fire email notification — never let it crash the response
    sendEnquiryNotification(enquiry).catch(err =>
      console.error('Email notification failed (SMTP not configured?):', err.message)
    );

    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully', enquiry });
  } catch (err) {
    console.error('createEnquiry error:', err.message);
    // Mongoose validation errors → 400, everything else → 500
    const status = err.name === 'ValidationError' ? 400 : 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

// @route  GET /api/enquiries  [Admin/Sub-admin]
exports.getEnquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedTo', 'name email');

    return res.json({ success: true, total, page: Number(page), enquiries });
  } catch (err) {
    console.error('getEnquiries error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/enquiries/:id  [Admin/Sub-admin]
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('assignedTo', 'name email');
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    return res.json({ success: true, enquiry });
  } catch (err) {
    console.error('getEnquiryById error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/enquiries/:id  [Admin/Sub-admin]
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    return res.json({ success: true, enquiry });
  } catch (err) {
    console.error('updateEnquiry error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

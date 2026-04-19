const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// @route  POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, phone, password });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// @route  POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  res.json({
    success: true,
    token: generateToken(user._id),
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'name slug accentColor');
  res.json({ success: true, user });
};

// @route  PUT /api/auth/wishlist/:gemId
exports.toggleWishlist = async (req, res) => {
  const user = await User.findById(req.user.id);
  const { gemId } = req.params;
  const idx = user.wishlist.indexOf(gemId);
  if (idx === -1) {
    user.wishlist.push(gemId);
  } else {
    user.wishlist.splice(idx, 1);
  }
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
};

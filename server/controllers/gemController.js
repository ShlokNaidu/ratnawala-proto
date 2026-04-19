const Gem = require('../models/Gem');

// @route  GET /api/gems
exports.getGems = async (req, res) => {
  const { planet, isNavRatan, featured, q } = req.query;
  const filter = { isActive: true };

  if (planet) filter.planet = new RegExp(planet, 'i');
  if (isNavRatan) filter.isNavRatan = isNavRatan === 'true';
  if (featured) filter.featured = featured === 'true';
  if (q) filter.$or = [
    { name: new RegExp(q, 'i') },
    { nameHindi: new RegExp(q, 'i') },
    { family: new RegExp(q, 'i') },
  ];

  const gems = await Gem.find(filter).select('-__v');
  res.json({ success: true, count: gems.length, gems });
};

// @route  GET /api/gems/:slug
exports.getGemBySlug = async (req, res) => {
  const gem = await Gem.findOne({ slug: req.params.slug, isActive: true });
  if (!gem) return res.status(404).json({ success: false, message: 'Gemstone not found' });
  res.json({ success: true, gem });
};

// @route  POST /api/gems  [Admin only]
exports.createGem = async (req, res) => {
  const gem = await Gem.create(req.body);
  res.status(201).json({ success: true, gem });
};

// @route  PUT /api/gems/:id  [Admin only]
exports.updateGem = async (req, res) => {
  const gem = await Gem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!gem) return res.status(404).json({ success: false, message: 'Gem not found' });
  res.json({ success: true, gem });
};

// @route  DELETE /api/gems/:id  [Admin only]
exports.deleteGem = async (req, res) => {
  const gem = await Gem.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!gem) return res.status(404).json({ success: false, message: 'Gem not found' });
  res.json({ success: true, message: 'Gem deactivated' });
};

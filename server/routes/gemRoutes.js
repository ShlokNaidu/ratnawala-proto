const express = require('express');
const router = express.Router();
const { getGems, getGemBySlug, createGem, updateGem, deleteGem } = require('../controllers/gemController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getGems);
router.get('/:slug', getGemBySlug);
router.post('/', protect, authorize('admin'), createGem);
router.put('/:id', protect, authorize('admin'), updateGem);
router.delete('/:id', protect, authorize('admin'), deleteGem);

module.exports = router;

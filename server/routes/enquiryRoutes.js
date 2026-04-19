const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, getEnquiryById, updateEnquiry } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', createEnquiry);                                                          // public
router.get('/', protect, authorize('admin', 'sub_admin'), getEnquiries);                 // admin
router.get('/:id', protect, authorize('admin', 'sub_admin'), getEnquiryById);            // admin
router.put('/:id', protect, authorize('admin', 'sub_admin'), updateEnquiry);             // admin

module.exports = router;

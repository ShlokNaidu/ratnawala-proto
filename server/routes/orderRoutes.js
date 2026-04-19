const express = require('express');
const router  = express.Router();
const {
  createOrder, convertEnquiryToOrder,
  getOrders, getMyOrders, updateOrder,
  createRazorpayOrder, verifyRazorpayPayment,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.post('/',                            protect, authorize('admin', 'sub_admin'), createOrder);
router.post('/from-enquiry/:enquiryId',     protect, authorize('admin', 'sub_admin'), convertEnquiryToOrder);
router.get('/',                             protect, authorize('admin', 'sub_admin'), getOrders);
router.get('/my',                           protect, getMyOrders);
router.put('/:id',                          protect, authorize('admin', 'sub_admin'), updateOrder);
router.post('/razorpay/create',             protect, createRazorpayOrder);
router.post('/razorpay/verify',             protect, verifyRazorpayPayment);

module.exports = router;

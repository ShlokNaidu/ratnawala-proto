import api from './axios';

export const getOrders = (params) =>
  api.get('/orders', { params });

export const convertEnquiryToOrder = (enquiryId, data) =>
  api.post(`/orders/from-enquiry/${enquiryId}`, data);


export const getMyOrders = () =>
  api.get('/orders/my');

export const updateOrder = (id, data) =>
  api.put(`/orders/${id}`, data);

export const createRazorpayOrder = (amount) =>
  api.post('/orders/razorpay/create', { amount });

export const verifyRazorpayPayment = (data) =>
  api.post('/orders/razorpay/verify', data);

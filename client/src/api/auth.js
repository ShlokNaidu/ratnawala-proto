import api from './axios';

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, phone, password) =>
  api.post('/auth/register', { name, email, phone, password });

export const getMe = () =>
  api.get('/auth/me');

export const toggleWishlist = (gemId) =>
  api.put(`/auth/wishlist/${gemId}`);

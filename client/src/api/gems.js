import api from './axios';

export const getGems = (params) =>
  api.get('/gems', { params });

export const getGemBySlug = (slug) =>
  api.get(`/gems/${slug}`);

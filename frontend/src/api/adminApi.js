import axios from './axios';

export const getDashboardStats = () => {
  return axios.get('/admin/dashboard');
};

export const getAllUsers = (params) => {
  return axios.get('/admin/users', { params });
};

export const getAllOrders = (params) => {
  return axios.get('/admin/orders', { params });
};

export const getAllRestaurants = (params) => {
  return axios.get('/admin/restaurants', { params });
};

export const approveRestaurant = (id, isApproved) => {
  return axios.patch(`/admin/restaurants/${id}/approve`, { isApproved });
};

export const blockUser = (id, isActive) => {
  return axios.patch(`/admin/users/${id}/block`, { isActive });
};

export const getComprehensiveAnalytics = (params) => {
  return axios.get('/admin/analytics', { params });
};
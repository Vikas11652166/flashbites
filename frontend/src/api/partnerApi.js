import axios from './axios';

// Submit partner application
export const submitPartnerApplication = async (formData) => {
  const response = await axios.post('/partners/apply', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get all partner applications (Admin)
export const getAllPartnerApplications = async (params = {}) => {
  const response = await axios.get('/partners', { params });
  return response.data;
};

// Get partner by ID (Admin)
export const getPartnerById = async (id) => {
  const response = await axios.get(`/partners/${id}`);
  return response.data;
};

// Approve partner (Admin)
export const approvePartner = async (id) => {
  const response = await axios.put(`/partners/${id}/approve`);
  return response.data;
};

// Reject partner (Admin)
export const rejectPartner = async (id, reason) => {
  const response = await axios.put(`/partners/${id}/reject`, { reason });
  return response.data;
};

// Update partner status (Admin)
export const updatePartnerStatus = async (id, status) => {
  const response = await axios.put(`/partners/${id}/status`, { status });
  return response.data;
};

// Delete partner (Admin)
export const deletePartner = async (id) => {
  const response = await axios.delete(`/partners/${id}`);
  return response.data;
};

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const loginUser    = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Properties
export const getProperties  = ()         => API.get('/properties');
export const addProperty    = (data)     => API.post('/properties', data);
export const updateProperty = (id, data) => API.put(`/properties/${id}`, data);
export const deleteProperty = (id)       => API.delete(`/properties/${id}`);

// Tenants
export const getTenants   = ()         => API.get('/tenants');
export const addTenant    = (data)     => API.post('/tenants', data);
export const updateTenant = (id, data) => API.put(`/tenants/${id}`, data);
export const deleteTenant = (id)       => API.delete(`/tenants/${id}`);

// Payments
export const getPayments = ()     => API.get('/payments');
export const addPayment  = (data) => API.post('/payments', data);
export const updatePayment = (id, data) => API.put(`/payments/${id}`, data);
export const deletePayment = (id)       => API.delete(`/payments/${id}`);

// Dashboard
export const getDashboard = () => API.get('/dashboard');

// Maintenance
export const getMaintenance    = ()         => API.get('/maintenance');
export const addMaintenance    = (data)     => API.post('/maintenance', data);
export const updateMaintenance = (id, data) => API.put(`/maintenance/${id}`, data);
export const deleteMaintenance = (id)       => API.delete(`/maintenance/${id}`);
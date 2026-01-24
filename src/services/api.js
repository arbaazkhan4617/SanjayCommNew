import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../utils/apiConfig';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) {
          // For now, we'll pass userId in headers or params
          // In production, use JWT tokens
          config.headers['X-User-Id'] = user.id.toString();
        }
      }
    } catch (error) {
      console.error('Error getting user from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// API endpoints matching backend structure
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
};

export const productAPI = {
  // Services
  getServices: () => api.get('/products/services'),
  getServiceById: (id) => api.get(`/products/services/${id}`),
  
  // Categories
  getCategoriesByService: (serviceId) => 
    api.get(`/products/services/${serviceId}/categories`),
  
  // Brands
  getBrandsByCategory: (categoryId) => 
    api.get(`/products/categories/${categoryId}/brands`),
  
  // Models
  getModelsByBrand: (brandId) => 
    api.get(`/products/brands/${brandId}/models`),
  
  // Products
  getProductByModel: (modelId) => 
    api.get(`/products/models/${modelId}/product`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getAllProducts: () => api.get('/products'),
};

export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (userId, productId, quantity = 1) => 
    api.post(`/cart/${userId}/add`, null, { 
      params: { productId, quantity } 
    }),
  updateCartItem: (userId, cartItemId, quantity) => 
    api.put(`/cart/${userId}/items/${cartItemId}`, null, { 
      params: { quantity } 
    }),
  removeFromCart: (userId, cartItemId) => 
    api.delete(`/cart/${userId}/items/${cartItemId}`),
  clearCart: (userId) => api.delete(`/cart/${userId}/clear`),
};

export const orderAPI = {
  getUserOrders: (userId) => api.get(`/orders/${userId}`),
  getOrderById: (userId, orderId) => api.get(`/orders/${userId}/${orderId}`),
  createOrder: (userId, shippingAddress, paymentMethod) => 
    api.post(`/orders/${userId}/create`, null, { 
      params: { shippingAddress, paymentMethod } 
    }),
};

export const serviceRequestAPI = {
  getUserServiceRequests: (userId) => api.get(`/service-requests/${userId}`),
  getServiceRequestById: (userId, requestId) => 
    api.get(`/service-requests/${userId}/${requestId}`),
  createServiceRequest: (data) => api.post('/service-requests/create', data),
  updateServiceRequestStatus: (requestId, status) => 
    api.put(`/service-requests/${requestId}/status`, null, { 
      params: { status } 
    }),
};

export const salesAPI = {
  login: (email, password) => api.post('/auth/sales/login', { email, password }),
  getDashboardStats: () => api.get('/sales/dashboard/stats'),
  getRevenueChart: (days = 7) => api.get('/sales/dashboard/revenue-chart', { params: { days } }),
  getOrdersChart: (days = 7) => api.get('/sales/dashboard/orders-chart', { params: { days } }),
  getServiceRequestsChart: (days = 7) => api.get('/sales/dashboard/service-requests-chart', { params: { days } }),
  getAllOrders: (status, sortBy) => api.get('/sales/orders', { params: { status, sortBy } }),
  getAllServiceRequests: (status, sortBy) => api.get('/sales/service-requests', { params: { status, sortBy } }),
  updateOrderStatus: (orderId, status) => api.put(`/sales/orders/${orderId}/status`, null, { params: { status } }),
  updateServiceRequestStatus: (requestId, status) => api.put(`/sales/service-requests/${requestId}/status`, null, { params: { status } }),
};

export const adminAPI = {
  login: (email, password) => api.post('/auth/admin/login', { email, password }),
  // Products
  getAllProducts: () => api.get('/admin/products'),
  getProductById: (id) => api.get(`/admin/products/${id}`),
  createProduct: (data) => api.post('/admin/products', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  // Models
  getAllModels: () => api.get('/admin/models'),
  createModel: (data) => api.post('/admin/models', data),
  updateModel: (id, data) => api.put(`/admin/models/${id}`, data),
  deleteModel: (id) => api.delete(`/admin/models/${id}`),
  // Brands
  getAllBrands: () => api.get('/admin/brands'),
  createBrand: (data) => api.post('/admin/brands', data),
  updateBrand: (id, data) => api.put(`/admin/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Services
  getAllServices: () => api.get('/admin/services'),
};

export default api;

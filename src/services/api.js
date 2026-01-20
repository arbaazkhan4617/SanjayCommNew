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

export default api;

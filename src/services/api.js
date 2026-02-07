import axios from 'axios';
import { Platform } from 'react-native';
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
    // Don't set Content-Type for FormData - let axios handle it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
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
  // Categories
  getCategories: () => api.get('/products/categories'),
  getCategoryById: (id) => api.get(`/products/categories/${id}`),
  
  // Sub Categories
  getSubCategoriesByCategory: (categoryId) => 
    api.get(`/products/categories/${categoryId}/sub-categories`),
  
  // Brands
  getBrandsBySubCategory: (subCategoryId) => 
    api.get(`/products/sub-categories/${subCategoryId}/brands`),
  
  // Models
  getModelsByBrand: (brandId) => 
    api.get(`/products/brands/${brandId}/models`),
  
  // Products
  getProductByModel: (modelId) => 
    api.get(`/products/models/${modelId}/product`),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getAllProducts: (params = {}) =>
    api.get('/products', { params: { page: params.page ?? 0, size: params.size ?? 8 } }),
  getNewArrivals: (size = 4) => api.get('/products/new-arrivals', { params: { size } }),
  getPopular: (size = 4) => api.get('/products/popular', { params: { size } }),
  getDeals: (params = {}) =>
    api.get('/products/deals', { params: { page: params.page ?? 0, size: params.size ?? 8 } }),
  recordProductView: (modelId) => api.post(`/products/models/${modelId}/view`),
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

export const wishlistAPI = {
  getWishlist: (userId) => api.get(`/wishlist/${userId}`),
  add: (userId, productId) => api.post(`/wishlist/${userId}/add`, null, { params: { productId } }),
  remove: (userId, productId) => api.delete(`/wishlist/${userId}/remove`, { params: { productId } }),
  contains: (userId, productId) => api.get(`/wishlist/${userId}/contains`, { params: { productId } }),
};

export const notificationAPI = {
  getNotifications: (userId, params = {}) =>
    api.get(`/notifications/${userId}`, { params: { page: params.page ?? 0, size: params.size ?? 20 } }),
  getUnreadCount: (userId) => api.get(`/notifications/${userId}/unread-count`),
  markAsRead: (notificationId, userId) =>
    api.put(`/notifications/${notificationId}/read`, null, { params: { userId } }),
  markAllAsRead: (userId) => api.put(`/notifications/${userId}/read-all`),
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
  getUsers: () => api.get('/admin/users'),
  // Image Upload
  uploadImage: async (asset) => {
    console.log('Uploading image asset:', asset);
    console.log('Asset keys:', Object.keys(asset));
    
    // Validate asset has required properties
    if (!asset || !asset.uri) {
      throw new Error('Invalid asset: missing URI');
    }
    
    // Extract file name from URI if fileName is not provided
    let fileName = asset.fileName || asset.uri.split('/').pop() || 'image.jpg';
    
    // Clean up filename - remove query parameters if any
    fileName = fileName.split('?')[0];
    
    // Ensure file name has an extension
    if (!fileName.includes('.')) {
      fileName = fileName + '.jpg';
    }
    
    // Determine MIME type from file extension or use default
    let mimeType = asset.type || 'image/jpeg';
    if (!asset.type) {
      const ext = fileName.split('.').pop().toLowerCase();
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
      };
      mimeType = mimeTypes[ext] || 'image/jpeg';
    }
    
    // Normalize URI - ensure it's in the correct format for React Native
    let fileUri = asset.uri;
    
    // Handle different URI formats
    // iOS: file:///path/to/file
    // Android: content://media/external/images/media/123 or file:///path/to/file
    // Remove file:// prefix if present, React Native FormData handles it
    if (fileUri.startsWith('file://')) {
      // Keep file:// for React Native FormData
      fileUri = fileUri;
    } else if (fileUri.startsWith('/')) {
      // If it's an absolute path, add file://
      fileUri = `file://${fileUri}`;
    }
    
    // Create FormData
    const formData = new FormData();

    // On WEB: FormData requires a File/Blob - { uri, type, name } does NOT work
    // On iOS/Android: React Native expects { uri, type, name }
    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: mimeType });
      formData.append('file', file);
    } else {
      const fileObject = {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      };
      formData.append('file', fileObject);
    }

    console.log('FormData file object:', Platform.OS === 'web' ? 'File (web)' : { uri: fileUri, type: mimeType, name: fileName });
    console.log('File URI:', fileUri);
    console.log('MIME type:', mimeType);
    console.log('File name:', fileName);
    console.log('Sending to:', `${API_BASE_URL}/admin/upload-image`);
    
    // Debug: Log FormData (note: FormData doesn't serialize well, but we can check structure)
    console.log('FormData created successfully');
    
    // Get auth headers
    let headers = {};
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.id) {
          headers['X-User-Id'] = user.id.toString();
        }
      }
    } catch (error) {
      console.error('Error getting user from storage:', error);
    }
    
    try {
      // Use axios with proper FormData configuration
      // Create a new axios instance for this request to avoid interceptor issues
      const uploadApi = axios.create({
        baseURL: API_BASE_URL,
        timeout: 60000,
        // Don't set default Content-Type - axios will set it for FormData
      });
      
      // Add headers - never set Content-Type for FormData so boundary is set correctly
      const config = {
        headers: {
          ...headers,
        },
        // Don't set Content-Type so React Native sets multipart boundary; return FormData as-is
        transformRequest: (data, headers) => {
          if (data instanceof FormData) {
            delete headers['Content-Type'];
          }
          return data;
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      };
      
      console.log('Sending FormData via axios...');
      console.log('File details:', {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      });

      const response = await uploadApi.post('/admin/upload-image', formData, config);
      
      console.log('Upload response:', response.data);
      
      // Return in axios response format for consistency
      return { data: { imageUrl: response.data.imageUrl } };
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Return error in axios format
      const uploadError = new Error(error.response?.data?.error || error.message || 'Failed to upload image');
      uploadError.response = error.response;
      throw uploadError;
    }
  },
  // Products (paginated; use response.data.content, response.data.totalElements, response.data.totalPages)
  getAllProducts: (params = {}) =>
    api.get('/admin/products', { params: { page: params.page ?? 0, size: params.size ?? 8 } }),
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
  // Sub Categories
  getAllSubCategories: () => api.get('/admin/sub-categories'),
  createSubCategory: (data) => api.post('/admin/sub-categories', data),
  updateSubCategory: (id, data) => api.put(`/admin/sub-categories/${id}`, data),
  deleteSubCategory: (id) => api.delete(`/admin/sub-categories/${id}`),
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
};

export default api;

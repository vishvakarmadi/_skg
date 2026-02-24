// API Integration Layer for SKG Enterprise
// All API calls centralized in one place

import apiClient from './client';
import type { ApiResponse, Product, Category, Order, Banner, Testimonial, GalleryItem, User, Address, CartItem, WishlistItem, Blog } from '@/types';

// ==================== AUTH API ====================
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<{ message: string; access_token: string; token_type: string; user: any }>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation?: string }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      ...data,
      password_confirmation: data.password_confirmation || data.password,
    }),

  logout: () =>
    apiClient.post<ApiResponse<void>>('/auth/logout'),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<void>>('/auth/forgot-password', { email }),

  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) =>
    apiClient.post<ApiResponse<void>>('/auth/reset-password', data),

  me: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),

  updateProfile: (data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>('/auth/profile', data),

  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    apiClient.put<ApiResponse<void>>('/auth/password', data),
};

// ==================== PRODUCTS API ====================
export const productsApi = {
  getAll: (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    type?: 'worship' | 'machinery';
    min_price?: number;
    max_price?: number;
    sort_by?: 'latest' | 'price_asc' | 'price_desc' | 'popular';
    search?: string;
    purity_certified?: boolean;
    in_stock?: boolean;
    tag?: string;
  }) =>
    apiClient.get<ApiResponse<{ data: Product[]; meta: { current_page: number; last_page: number; total: number } }>>('/products', { params }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Product>>(`/products/${slug}`),

  getFeatured: () =>
    apiClient.get<ApiResponse<Product[]>>('/products/featured'),

  getNewArrivals: () =>
    apiClient.get<ApiResponse<Product[]>>('/products/new'),

  getBestsellers: () =>
    apiClient.get<ApiResponse<Product[]>>('/products/bestsellers'),

  search: (query: string) =>
    apiClient.get<ApiResponse<Product[]>>('/products/search', { params: { q: query } }),

  addReview: (id: string, data: { rating: number; text: string }) =>
    apiClient.post<ApiResponse<Testimonial>>(`/products/${id}/reviews`, data),

  // Admin only
  create: (data: Partial<Product> | FormData) =>
    apiClient.post<ApiResponse<Product>>('/admin/products', data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    ),

  update: (id: string, data: Partial<Product> | FormData) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return apiClient.post<ApiResponse<Product>>(`/admin/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put<ApiResponse<Product>>(`/admin/products/${id}`, data);
  },

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/products/${id}`),

  uploadImage: (id: string, formData: FormData) =>
    apiClient.post<ApiResponse<{ url: string }>>(`/admin/products/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ==================== CATEGORIES API ====================
export const categoriesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Category[]>>('/categories'),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Category>>(`/categories/${slug}`),

  getProducts: (slug: string, params?: { page?: number; per_page?: number }) =>
    apiClient.get<ApiResponse<{ data: Product[]; meta: any }>>(`/categories/${slug}/products`, { params }),

  // Admin only
  // Admin only
  create: (data: Partial<Category> | FormData) =>
    apiClient.post<ApiResponse<Category>>('/admin/categories', data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    ),

  update: (id: string, data: Partial<Category> | FormData) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return apiClient.post<ApiResponse<Category>>(`/admin/categories/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
  },

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/categories/${id}`),
};

// ==================== CART API ====================
export const cartApi = {
  getAll: () =>
    apiClient.get<ApiResponse<CartItem[]>>('/cart'),

  add: (productId: string, quantity: number = 1) =>
    apiClient.post<ApiResponse<CartItem>>('/cart', { product_id: productId, quantity }),

  update: (id: string, quantity: number) =>
    apiClient.put<ApiResponse<CartItem>>(`/cart/${id}`, { quantity }),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/cart/${id}`),

  clear: () =>
    apiClient.delete<ApiResponse<void>>('/cart'),
};

// ==================== WISHLIST API ====================
export const wishlistApi = {
  getAll: () =>
    apiClient.get<ApiResponse<WishlistItem[]>>('/wishlist'),

  add: (productId: string) =>
    apiClient.post<ApiResponse<WishlistItem>>('/wishlist', { product_id: productId }),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/wishlist/${id}`),

  check: (productId: string) =>
    apiClient.get<ApiResponse<{ in_wishlist: boolean }>>(`/wishlist/check/${productId}`),
};

// ==================== ORDERS API ====================
export const ordersApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Order[]>>('/orders'),

  getByOrderNumber: (orderNumber: string) =>
    apiClient.get<ApiResponse<Order>>(`/orders/${orderNumber}`),

  create: (data: {
    shipping_address_id: string;
    billing_address_id?: string;
    payment_method: string;
    items: { product_id: string; quantity: number }[];
    from_cart?: boolean;
  }) =>
    apiClient.post<ApiResponse<Order>>('/orders', data),

  cancel: (orderNumber: string) =>
    apiClient.post<ApiResponse<void>>(`/orders/${orderNumber}/cancel`),

  track: (orderNumber: string) =>
    apiClient.get<ApiResponse<{
      order_number: string;
      status: string;
      tracking_number?: string;
      tracking_url?: string;
      shipped_at?: string;
      delivered_at?: string;
    }>>(`/orders/${orderNumber}/track`),

  // Admin only
  getAllAdmin: (params?: { status?: string; payment_status?: string; from_date?: string; to_date?: string }) =>
    apiClient.get<ApiResponse<Order[]>>('/admin/orders', { params }),

  updateStatus: (orderNumber: string, data: { status: string; tracking_number?: string; tracking_url?: string }) =>
    apiClient.put<ApiResponse<Order>>(`/admin/orders/${orderNumber}/status`, data),

  updateTracking: (orderNumber: string, data: { tracking_number: string; tracking_url?: string }) =>
    apiClient.put<ApiResponse<Order>>(`/admin/orders/${orderNumber}/tracking`, data),
};

// ==================== PAYMENT API (Cashfree) ====================
export const paymentApi = {
  initiate: (orderId: string) =>
    apiClient.post<ApiResponse<{
      payment_session_id: string;
      order_id: string;
      cf_order_id: string;
    }>>(`/payment/initiate/${orderId}`),

  getStatus: (orderId: string) =>
    apiClient.get<ApiResponse<{
      order_status: string;
      payment_status: string;
      cashfree_status: any;
    }>>(`/payment/status/${orderId}`),

  // These are handled by Cashfree callbacks/webhooks
  // callback: (orderNumber: string, data: any) => ...
  // webhook: (data: any) => ...
};

// ==================== ADDRESSES API ====================
export const addressesApi = {
  getAll: () =>
    apiClient.get<ApiResponse<Address[]>>('/addresses'),

  create: (data: Partial<Address>) =>
    apiClient.post<ApiResponse<Address>>('/addresses', data),

  update: (id: string, data: Partial<Address>) =>
    apiClient.put<ApiResponse<Address>>(`/addresses/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/addresses/${id}`),

  setDefault: (id: string) =>
    apiClient.put<ApiResponse<Address>>(`/addresses/${id}/default`),
};

// ==================== BANNERS API ====================
// ==================== BANNERS API ====================
export const bannersApi = {
  getAll: (params?: any) =>
    apiClient.get<ApiResponse<Banner[]>>('/banners', { params }),

  getByType: (type: string) =>
    apiClient.get<ApiResponse<Banner[]>>(`/banners/${type}`),

  // Admin only
  create: (data: Partial<Banner> | FormData) =>
    apiClient.post<ApiResponse<Banner>>('/admin/banners', data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    ),

  update: (id: string, data: Partial<Banner> | FormData) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return apiClient.post<ApiResponse<Banner>>(`/admin/banners/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data);
  },

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/banners/${id}`),
};

// ==================== BLOGS/STORIES API ====================
export const blogsApi = {
  getAll: (params?: { page?: number; per_page?: number; q?: string; featured?: boolean; random?: boolean; limit?: number; all?: boolean }) =>
    apiClient.get<ApiResponse<{ data: Blog[]; current_page: number; last_page: number; total: number }>>('/blogs', { params }),

  getBySlug: (slug: string) =>
    apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`),

  // Admin only
  create: (data: Partial<Blog> | FormData) =>
    apiClient.post<ApiResponse<Blog>>('/admin/blogs', data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
    ),

  update: (id: string, data: Partial<Blog> | FormData) => {
    if (data instanceof FormData) {
      // Laravel handles multipart PUT via _method POST
      data.append('_method', 'POST');
      return apiClient.post<ApiResponse<Blog>>(`/admin/blogs/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return apiClient.post<ApiResponse<Blog>>(`/admin/blogs/${id}`, data);
  },

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/blogs/${id}`),
};

// ==================== TESTIMONIALS API ====================
export const testimonialsApi = {
  getAll: (params?: { limit?: number; random?: boolean; product_type?: 'worship' | 'machinery' }) =>
    apiClient.get<ApiResponse<Testimonial[]>>('/testimonials', { params }),

  // Admin only
  create: (data: Partial<Testimonial>) =>
    apiClient.post<ApiResponse<Testimonial>>('/admin/testimonials', data),

  update: (id: string, data: Partial<Testimonial>) =>
    apiClient.put<ApiResponse<Testimonial>>(`/admin/testimonials/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/testimonials/${id}`),
};

// ==================== GALLERY API ====================
export const galleryApi = {
  getAll: () =>
    apiClient.get<ApiResponse<GalleryItem[]>>('/gallery'),

  // Admin only
  create: (data: Partial<GalleryItem>) =>
    apiClient.post<ApiResponse<GalleryItem>>('/admin/gallery', data),

  update: (id: string, data: Partial<GalleryItem>) =>
    apiClient.put<ApiResponse<GalleryItem>>(`/admin/gallery/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/gallery/${id}`),
};

// ==================== CONTACT API ====================
export const contactApi = {
  submit: (data: { name: string; email: string; phone?: string; type: string; subject: string; message: string }) =>
    apiClient.post<ApiResponse<void>>('/contact', data),

  // Admin only
  getAll: () =>
    apiClient.get<ApiResponse<any[]>>('/admin/contacts'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<any>>(`/admin/contacts/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient.put<ApiResponse<void>>(`/admin/contacts/${id}/status`, { status }),

  reply: (id: string, message: string) =>
    apiClient.post<ApiResponse<void>>(`/admin/contacts/${id}/reply`, { message }),
};

// ==================== DASHBOARD API (Admin) ====================
export const dashboardApi = {
  getStats: () =>
    apiClient.get<ApiResponse<{
      total_orders: number;
      total_revenue: number;
      total_customers: number;
      total_products: number;
      recent_orders: Order[];
      sales_chart: any[];
    }>>('/admin/dashboard/stats'),

  clearCache: () =>
    apiClient.post<ApiResponse<void>>('/admin/dashboard/clear-cache'),
};

// ==================== USERS API (Admin) ====================
export const usersApi = {
  getAll: () =>
    apiClient.get<ApiResponse<User[]>>('/admin/users'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/admin/users/${id}`),

  update: (id: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`),
};

// Export all APIs
export default {
  auth: authApi,
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  wishlist: wishlistApi,
  orders: ordersApi,
  payment: paymentApi,
  addresses: addressesApi,
  banners: bannersApi,
  blogs: blogsApi,
  testimonials: testimonialsApi,
  gallery: galleryApi,
  contact: contactApi,
  dashboard: dashboardApi,
  users: usersApi,
};

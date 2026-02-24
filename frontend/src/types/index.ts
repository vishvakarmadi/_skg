// ============================================
// SKG ENTERPRISE - TYPE DEFINITIONS
// ============================================

// Product Types
export interface Product {
  id: string;
  name: string;
  slug?: string;
  nameHi?: string;
  description: string;
  descriptionHi?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: ProductCategory;
  tags: string[];

  // Inventory
  stock: number;
  sku: string;

  // Product Type
  type: 'worship' | 'machinery';

  // For worship products
  purityFeatures?: string[];
  devotionalUse?: string;
  batchNumber?: string;
  madeOn?: string;

  // For machinery products
  productionCapacity?: string;
  technicalSpecs?: Record<string, string>;
  warranty?: string;

  // Card Style
  cardStyle: 'bhakti' | 'yantra' | 'featured' | 'compact';

  // Flags
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  purityCertified: boolean;

  // Ratings & Reviews (dynamic)
  avgRating?: number;
  reviewsCount?: number;
  testimonials?: Testimonial[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameHi: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
}

export type Category = ProductCategory;

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;

  // Items
  items: OrderItem[];

  // Pricing
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;

  // Status
  status: OrderStatus;
  paymentStatus: PaymentStatus;

  // Payment
  paymentMethod: string;
  paymentId?: string;

  // Shipping
  shippingAddress: Address;
  billingAddress: Address;

  // Tracking
  trackingNumber?: string;
  trackingUrl?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  nameHi?: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Address Type
export interface Address {
  id: string;
  userId: string;
  type: 'shipping' | 'billing';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

// Cart Types
export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
  addedAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'superadmin';
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Gallery Types
export interface GalleryItem {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  image: string;
  category: string;
  templeName?: string;
  location?: string;
  productsUsed: string[];
  createdAt: string;
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  nameHi?: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  textHi?: string;
  productId?: string;
  isVerified: boolean;
  createdAt: string;
}

// Banner Types
export interface Banner {
  id: string;
  title: string;
  titleHi?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaLink: string;
  type: 'hero' | 'festival' | 'promo' | 'machinery';
  startDate: string;
  endDate?: string;
  isActive: boolean;
  sortOrder: number;
}

// Blog/Story Types
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  isPublished: boolean;
  publishedAt?: string;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'general' | 'order' | 'bulk' | 'partnership';
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

// Filter Types
export interface ProductFilter {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'latest' | 'price_asc' | 'price_desc' | 'popular' | 'name_asc';
  search?: string;
  inStock?: boolean;
  purityCertified?: boolean;
  type?: 'worship' | 'machinery';
  tags?: string[];
}

// Cashfree Payment Types
export interface CashfreeOrder {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface CashfreePaymentResponse {
  paymentSessionId: string;
  orderId: string;
  cfOrderId: string;
}

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

// Analytics Types
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

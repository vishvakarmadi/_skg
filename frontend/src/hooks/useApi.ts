// ============================================
// useApi - Reusable data fetching hooks
// Fetches data from the SKG backend API
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { productsApi, categoriesApi, bannersApi, testimonialsApi, galleryApi, authApi, contactApi, ordersApi, addressesApi } from '@/api';
import { transformKeys, transformPaginatedResponse, transformKeysToSnake } from '@/api/transform';
import type { Product, Category, Banner, Testimonial, GalleryItem, User, Order, Address } from '@/types';

// ============================================
// Frontend Cache Utilities
// ============================================

const CACHE_PREFIX = 'skg_api_';
const CACHE_MAX_AGE = 30 * 60 * 1000; // 30 minutes in ms

function getCachedData<T>(key: string): T | null {
    try {
        const raw = sessionStorage.getItem(CACHE_PREFIX + key);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        // Check if cache is still valid
        if (Date.now() - timestamp > CACHE_MAX_AGE) {
            sessionStorage.removeItem(CACHE_PREFIX + key);
            return null;
        }
        return data as T;
    } catch {
        return null;
    }
}

function setCachedData<T>(key: string, data: T): void {
    try {
        sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
            data,
            timestamp: Date.now(),
        }));
    } catch {
        // sessionStorage full or unavailable — silently ignore
    }
}

// ============================================
// Generic hook for API calls
// ============================================

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApiCall<T>(
    apiFn: () => Promise<any>,
    transformer: (data: any) => T,
    deps: any[] = [],
    cacheKey?: string
) {
    // Try to load cached data immediately (synchronous, no loading state)
    const cachedData = cacheKey ? getCachedData<T>(cacheKey) : null;

    const [state, setState] = useState<UseApiState<T>>({
        data: cachedData,
        loading: !cachedData, // If we have cached data, don't show loading
        error: null,
    });
    const mountedRef = useRef(true);
    const fetchIdRef = useRef(0);

    const fetchData = useCallback(async () => {
        // Increment fetch ID — stale fetches will be ignored
        const id = ++fetchIdRef.current;
        // Only show loading spinner if we don't have cached data
        setState((prev) => ({ ...prev, loading: !prev.data, error: null }));
        try {
            const response = await apiFn();
            // Only update state if this is still the latest fetch and component is mounted
            if (!mountedRef.current || id !== fetchIdRef.current) return;
            const transformed = transformer(response.data);
            setState({ data: transformed, loading: false, error: null });
            // Update the cache
            if (cacheKey) {
                setCachedData(cacheKey, transformed);
            }
        } catch (err: any) {
            if (!mountedRef.current || id !== fetchIdRef.current) return;
            const message = err.response?.data?.message || err.message || 'An error occurred';
            // If we have cached data, keep showing it on error
            setState((prev) => ({
                data: prev.data,
                loading: false,
                error: prev.data ? null : message,
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    useEffect(() => {
        mountedRef.current = true;
        fetchData();
        return () => {
            mountedRef.current = false;
        };
    }, [fetchData]);

    return { ...state, refetch: fetchData };
}

// ============================================
// PRODUCT HOOKS
// ============================================

/** Fetch all products with optional filters */
export function useProducts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    type?: 'worship' | 'machinery';
    min_price?: number;
    max_price?: number;
    sort_by?: 'latest' | 'price_asc' | 'price_desc' | 'popular';
    search?: string;
    tag?: string;
}) {
    const paramStr = JSON.stringify(params || {});

    return useApiCall<{ data: Product[]; meta: any }>(
        () => productsApi.getAll(params),
        (responseData) => {
            // Backend returns { success: true, data: { current_page, data: [...], ... } }
            const paginated = responseData.data || responseData;
            return transformPaginatedResponse<Product>(paginated);
        },
        [paramStr],
        `products:${paramStr}`
    );
}

/** Fetch featured products */
export function useFeaturedProducts() {
    return useApiCall<Product[]>(
        () => productsApi.getFeatured(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((p: any) => transformKeys<Product>(p));
        },
        [],
        'products:featured'
    );
}

/** Fetch new arrival products */
export function useNewArrivals() {
    return useApiCall<Product[]>(
        () => productsApi.getNewArrivals(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((p: any) => transformKeys<Product>(p));
        },
        [],
        'products:new_arrivals'
    );
}

/** Fetch bestseller products */
export function useBestsellers() {
    return useApiCall<Product[]>(
        () => productsApi.getBestsellers(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((p: any) => transformKeys<Product>(p));
        },
        [],
        'products:bestsellers'
    );
}

/** Fetch a single product by ID */
export function useProduct(id: string) {
    return useApiCall<Product>(
        () => productsApi.getBySlug(id),
        (responseData) => {
            const item = responseData.data || responseData;
            return transformKeys<Product>(item);
        },
        [id],
        `product:${id}`
    );
}

/** Add a product review */
export function useAddReview() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submitReview = async (productId: string, data: { rating: number; text: string }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await productsApi.addReview(productId, data);
            setSuccess(true);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Failed to submit review';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { submitReview, loading, error, success, resetSuccess: () => setSuccess(false) };
}

// ============================================
// CATEGORY HOOKS
// ============================================

/** Fetch all categories */
export function useCategories() {
    return useApiCall<Category[]>(
        () => categoriesApi.getAll(),
        (responseData) => {
            // Backend may return bare array or { data: [...] }
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((c: any) => transformKeys<Category>(c));
        },
        [],
        'categories:all'
    );
}

/** Fetch products by category slug */
export function useCategoryProducts(slug: string, params?: { page?: number }) {
    const paramStr = JSON.stringify(params || {});
    return useApiCall<{ data: Product[]; meta: any }>(
        () => categoriesApi.getProducts(slug, params),
        (responseData) => {
            const paginated = responseData.data || responseData;
            return transformPaginatedResponse<Product>(paginated);
        },
        [slug, paramStr]
    );
}

// ============================================
// BANNER HOOKS
// ============================================

/** Fetch all active banners */
export function useBanners() {
    return useApiCall<Banner[]>(
        () => bannersApi.getAll(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((b: any) => transformKeys<Banner>(b));
        },
        [],
        'banners:all'
    );
}

// ============================================
// TESTIMONIAL HOOKS
// ============================================

/** Fetch all active testimonials */
export function useTestimonials(params?: { limit?: number; random?: boolean; product_type?: 'worship' | 'machinery' }) {
    const paramStr = JSON.stringify(params || {});
    return useApiCall<Testimonial[]>(
        () => testimonialsApi.getAll(params),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((t: any) => transformKeys<Testimonial>(t));
        },
        [paramStr],
        `testimonials:${paramStr}`
    );
}

// ============================================
// GALLERY HOOKS
// ============================================

/** Fetch all gallery items */
export function useGallery() {
    return useApiCall<GalleryItem[]>(
        () => galleryApi.getAll(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((g: any) => transformKeys<GalleryItem>(g));
        },
        [],
        'gallery:all'
    );
}

// ============================================
// AUTH HOOKS
// ============================================

/** Fetch current user profile */
export function useCurrentUser() {
    return useApiCall<User>(
        () => authApi.me(),
        (responseData) => {
            const user = responseData.data || responseData;
            return transformKeys<User>(user);
        },
        []
    );
}

// ============================================
// CONTACT HOOKS
// ============================================

/** Submit contact form */
export function useContactSubmit() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const submit = async (data: {
        name: string;
        email: string;
        phone?: string;
        type: string;
        subject: string;
        message: string;
    }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await contactApi.submit(data);
            setSuccess(true);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || 'Failed to send message';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error, success, resetSuccess: () => setSuccess(false) };
}

// ============================================
// ORDER HOOKS
// ============================================

/** Fetch all orders for the current user */
export function useOrders() {
    return useApiCall<Order[]>(
        () => ordersApi.getAll(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((o: any) => transformKeys<Order>(o));
        },
        []
    );
}

/** Fetch a single order by order number */
export function useOrder(orderNumber: string) {
    return useApiCall<Order>(
        () => ordersApi.getByOrderNumber(orderNumber),
        (responseData) => {
            const item = responseData.data || responseData;
            return transformKeys<Order>(item);
        },
        [orderNumber]
    );
}

/** Track order status */
export function useOrderTracking(orderNumber: string) {
    return useApiCall<{ orderNumber: string; status: string; trackingNumber?: string; trackingUrl?: string; shippedAt?: string; deliveredAt?: string }>(
        () => ordersApi.track(orderNumber),
        (responseData) => {
            const item = responseData.data || responseData;
            return transformKeys(item);
        },
        [orderNumber]
    );
}

// ============================================
// ADDRESS HOOKS
// ============================================

/** Fetch all addresses for the current user */
export function useAddresses() {
    return useApiCall<Address[]>(
        () => addressesApi.getAll(),
        (responseData) => {
            const items = responseData.data || responseData;
            return (Array.isArray(items) ? items : []).map((a: any) => transformKeys<Address>(a));
        },
        []
    );
}

/** Address mutation operations (create, update, delete, setDefault) */
export function useAddressMutations() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAddress = async (data: Partial<Address>) => {
        setLoading(true);
        setError(null);
        try {
            const payload = transformKeysToSnake(data);
            const response = await addressesApi.create(payload);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create address');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (id: string, data: Partial<Address>) => {
        setLoading(true);
        setError(null);
        try {
            const payload = transformKeysToSnake(data);
            const response = await addressesApi.update(id, payload);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update address');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await addressesApi.delete(id);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete address');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const setDefaultAddress = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await addressesApi.setDefault(id);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to set default address');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { createAddress, updateAddress, deleteAddress, setDefaultAddress, loading, error };
}

// ============================================
// PROFILE HOOKS
// ============================================

/** Update user profile */
export function useProfileUpdate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const updateProfile = async (data: Partial<User>) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await authApi.updateProfile(data);
            setSuccess(true);
            const user = response.data?.data || response.data;
            return transformKeys<User>(user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateProfile, loading, error, success };
}

/** Change password */
export function usePasswordChange() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const changePassword = async (data: { current_password: string; password: string; password_confirmation: string }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await authApi.changePassword(data);
            setSuccess(true);
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { changePassword, loading, error, success };
}

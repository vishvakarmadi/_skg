import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi, wishlistApi } from '@/api';

// ============================================
// TYPES
// ============================================

export type UIMode = 'bhakti' | 'yantra';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  nameHi?: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  isMachinery: boolean;
  /** Server-side cart item ID (if synced) */
  serverId?: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  nameHi?: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
  /** Server-side wishlist item ID (if synced) */
  serverId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sortBy: 'latest' | 'price-low' | 'price-high' | 'popular';
  searchQuery: string;
  inStockOnly: boolean;
  purityCertified: boolean;
}

// ============================================
// STORE INTERFACES
// ============================================

interface UIState {
  mode: UIMode;
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeCategory: string | null;
  scrollPosition: number;
  setMode: (mode: UIMode) => void;
  toggleMode: () => void;
  toggleDarkMode: () => void;
  toggleMobileMenu: () => void;
  toggleSearch: () => void;
  setActiveCategory: (category: string | null) => void;
  setScrollPosition: (position: number) => void;
  setSearchOpen: (open: boolean) => void;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  /** Sync local cart with server (call after login) */
  syncWithServer: () => Promise<void>;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  toggleWishlistOpen: () => void;
  setWishlistOpen: (open: boolean) => void;
  getTotalItems: () => number;
  /** Sync local wishlist with server (call after login) */
  syncWithServer: () => Promise<void>;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

interface FilterStore {
  filters: FilterState;
  setCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: FilterState['sortBy']) => void;
  setSearchQuery: (query: string) => void;
  toggleInStock: () => void;
  togglePurityCertified: () => void;
  resetFilters: () => void;
}

// ============================================
// HELPERS
// ============================================

function isAuthenticated(): boolean {
  return !!localStorage.getItem('skg-token');
}

// ============================================
// UI STORE
// ============================================

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      mode: 'bhakti',
      isDarkMode: false,
      isMobileMenuOpen: false,
      isSearchOpen: false,
      activeCategory: null,
      scrollPosition: 0,

      setMode: (mode) => {
        set({ mode });
        document.documentElement.setAttribute('data-ui-mode', mode);
      },

      toggleMode: () => {
        const newMode = get().mode === 'bhakti' ? 'yantra' : 'bhakti';
        set({ mode: newMode });
        document.documentElement.setAttribute('data-ui-mode', newMode);
      },

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setScrollPosition: (position) => set({ scrollPosition: position }),
    }),
    {
      name: 'skg-ui-store',
      partialize: (state) => ({ mode: state.mode, isDarkMode: state.isDarkMode }),
    }
  )
);

// ============================================
// CART STORE (Seva Patra) - With API Sync
// ============================================

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSyncing: false,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.productId === item.productId);

        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity;
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: newQuantity }
                : i
            ),
          });
          // Sync to server
          if (isAuthenticated() && existingItem.serverId) {
            cartApi.update(existingItem.serverId, newQuantity).catch(console.error);
          } else if (isAuthenticated()) {
            cartApi.add(item.productId, item.quantity).catch((err) => {
              console.error('Failed to sync cart add', err);
            });
          }
        } else {
          const newItem = { ...item, id: crypto.randomUUID() };
          set({ items: [...items, newItem] });
          // Sync to server
          if (isAuthenticated()) {
            cartApi.add(item.productId, item.quantity).then((res) => {
              const serverItem = res.data;
              // Update local item with server ID
              set({
                items: get().items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, serverId: (serverItem as any).id }
                    : i
                ),
              });
            }).catch(console.error);
          }
        }
      },

      removeItem: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        set({ items: get().items.filter((i) => i.productId !== productId) });
        // Sync to server
        if (isAuthenticated() && item?.serverId) {
          cartApi.remove(item.serverId).catch(console.error);
        }
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        const item = get().items.find((i) => i.productId === productId);
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
        // Sync to server
        if (isAuthenticated() && item?.serverId) {
          cartApi.update(item.serverId, quantity).catch(console.error);
        }
      },

      clearCart: () => {
        set({ items: [] });
        // Sync to server
        if (isAuthenticated()) {
          cartApi.clear().catch(console.error);
        }
      },

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setCartOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      syncWithServer: async () => {
        if (!isAuthenticated()) return;
        set({ isSyncing: true });
        try {
          const response = await cartApi.getAll();
          const serverCart: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data as any)?.data || [];

          const localItems = get().items;

          // Merge: push local-only items to server, adopt server items
          const serverProductIds = new Set(serverCart.map((s: any) => String(s.productId)));
          const localOnlyItems = localItems.filter(
            (l) => !serverProductIds.has(l.productId)
          );

          // Push local-only to server
          for (const local of localOnlyItems) {
            try {
              await cartApi.add(local.productId, local.quantity);
            } catch {
              // Product may no longer exist or other error
            }
          }

          // Re-fetch to get final state
          const finalResponse = await cartApi.getAll();
          const finalCart: any[] = Array.isArray(finalResponse.data)
            ? finalResponse.data
            : (finalResponse.data as any)?.data || [];

          const mergedItems: CartItem[] = finalCart.map((item: any) => ({
            id: crypto.randomUUID(),
            serverId: String(item.id),
            productId: String(item.productId),
            name: item.product?.name || '',
            nameHi: item.product?.nameHi || undefined,
            price: Number(item.product?.price || 0),
            quantity: Number(item.quantity),
            image: item.product?.images?.[0] || item.product?.image || '',
            category: item.product?.category?.name || '',
            isMachinery: item.product?.type === 'machinery',
          }));

          set({ items: mergedItems });
        } catch (error) {
          console.error('Cart sync failed', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'skg-cart-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// WISHLIST STORE (Puja List) - With API Sync
// ============================================

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isSyncing: false,

      addItem: (item) => {
        const items = get().items;
        if (!items.find((i) => i.productId === item.productId)) {
          const newItem = {
            ...item,
            id: crypto.randomUUID(),
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
          // Sync to server
          if (isAuthenticated()) {
            wishlistApi.add(item.productId).then((res) => {
              const serverItem = res.data;
              set({
                items: get().items.map((i) =>
                  i.productId === item.productId
                    ? { ...i, serverId: (serverItem as any).id }
                    : i
                ),
              });
            }).catch(console.error);
          }
        }
      },

      removeItem: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        set({ items: get().items.filter((i) => i.productId !== productId) });
        // Sync to server
        if (isAuthenticated() && item?.serverId) {
          wishlistApi.remove(item.serverId).catch(console.error);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      toggleWishlist: (item) => {
        if (get().isInWishlist(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      toggleWishlistOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setWishlistOpen: (open) => set({ isOpen: open }),

      getTotalItems: () => get().items.length,

      syncWithServer: async () => {
        if (!isAuthenticated()) return;
        set({ isSyncing: true });
        try {
          const response = await wishlistApi.getAll();
          const serverWishlist: any[] = Array.isArray(response.data)
            ? response.data
            : (response.data as any)?.data || [];

          const localItems = get().items;

          // Push local-only items to server
          const serverProductIds = new Set(
            serverWishlist.map((s: any) => String(s.productId))
          );
          const localOnlyItems = localItems.filter(
            (l) => !serverProductIds.has(l.productId)
          );

          for (const local of localOnlyItems) {
            try {
              await wishlistApi.add(local.productId);
            } catch {
              // Possibly already exists (409) or product deleted
            }
          }

          // Re-fetch to get final state
          const finalResponse = await wishlistApi.getAll();
          const finalWishlist: any[] = Array.isArray(finalResponse.data)
            ? finalResponse.data
            : (finalResponse.data as any)?.data || [];

          const mergedItems: WishlistItem[] = finalWishlist.map((item: any) => ({
            id: crypto.randomUUID(),
            serverId: String(item.id),
            productId: String(item.productId),
            name: item.product?.name || '',
            nameHi: item.product?.nameHi || undefined,
            price: Number(item.product?.price || 0),
            image: item.product?.images?.[0] || item.product?.image || '',
            category: item.product?.category?.name || '',
            addedAt: item.createdAt || new Date().toISOString(),
          }));

          set({ items: mergedItems });
        } catch (error) {
          console.error('Wishlist sync failed', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'skg-wishlist-store',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// AUTH STORE
// ============================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('skg-token');
        set({ user: null, isAuthenticated: false });
      },
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'skg-auth-store',
    }
  )
);

// ============================================
// FILTER STORE
// ============================================

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 50000],
  sortBy: 'latest',
  searchQuery: '',
  inStockOnly: false,
  purityCertified: false,
};

export const useFilterStore = create<FilterStore>()((set, get) => ({
  filters: { ...defaultFilters },

  setCategory: (category) => {
    const categories = get().filters.categories;
    if (!categories.includes(category)) {
      set({ filters: { ...get().filters, categories: [...categories, category] } });
    }
  },

  removeCategory: (category) => {
    set({
      filters: {
        ...get().filters,
        categories: get().filters.categories.filter((c) => c !== category),
      },
    });
  },

  setPriceRange: (range) => set({ filters: { ...get().filters, priceRange: range } }),
  setSortBy: (sort) => set({ filters: { ...get().filters, sortBy: sort } }),
  setSearchQuery: (query) => set({ filters: { ...get().filters, searchQuery: query } }),
  toggleInStock: () => set({ filters: { ...get().filters, inStockOnly: !get().filters.inStockOnly } }),
  togglePurityCertified: () => set({ filters: { ...get().filters, purityCertified: !get().filters.purityCertified } }),
  resetFilters: () => set({ filters: { ...defaultFilters } }),
}));

// ============================================
// COMBINED STORE HOOK
// ============================================

export const useStore = () => ({
  ui: useUIStore(),
  cart: useCartStore(),
  wishlist: useWishlistStore(),
  auth: useAuthStore(),
  filters: useFilterStore(),
});

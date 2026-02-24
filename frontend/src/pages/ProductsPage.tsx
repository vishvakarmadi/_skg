import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, Gift } from 'lucide-react';
import { ProductCard } from '@/components/ui-custom/ProductCard';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

import { BannerCarousel } from '@/sections/BannerCarousel';
import {
  FeaturedProducts,
  TopSellingProducts,
  LatestProducts,
  MachineryShowcase
} from '@/sections/ProductSections';
import { useProducts, useCategories } from '@/hooks/useApi';
import { GheeWicksFeature } from '@/components/ui-custom/GheeWicksFeature';

export function ProductsPage() {
  const { mode } = useUIStore();
  const { t, isHindi } = useLanguage();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const catalogRef = useRef<HTMLDivElement>(null);

  // Initialize state from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(slug || searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || 'all');

  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [page, setPage] = useState(1);

  // Debounced search — waits 400ms after user stops typing
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories from API
  const { data: apiCategories } = useCategories();

  // Build categories array with "All" option
  const categories = [
    { id: 'all', name: 'All', nameHi: 'सभी', slug: 'all' },
    ...(apiCategories || []).map((c: any) => ({
      id: c.slug || String(c.id),
      name: c.name || '',
      nameHi: c.nameHi || c.name || '',
      slug: c.slug || String(c.id),
    })),
  ];

  // Map sort params for the API
  const sortMap: Record<string, 'latest' | 'price_asc' | 'price_desc' | 'popular'> = {
    'latest': 'latest',
    'price-low': 'price_asc',
    'price-high': 'price_desc',
    'popular': 'popular',
  };

  // Fetch products from API with filters
  const { data: productsData, loading } = useProducts({
    page,
    per_page: 12,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
    max_price: priceRange[1] < 5000 ? priceRange[1] : undefined,
    sort_by: sortMap[sortBy] || 'latest',
    search: debouncedSearch || undefined,
    tag: selectedTag !== 'all' ? selectedTag : undefined,
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // Update state when URL params change
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');


    if (search !== null) setSearchQuery(search);

    // Priority: Route Param > Search Param
    if (slug) {
      setSelectedCategory(slug);
    } else if (category !== null) {
      setSelectedCategory(category);
    }

    if (sort !== null) setSortBy(sort);

    // Scroll to catalog if params exist
    if ((searchParams.size > 0 || slug) && catalogRef.current) {
      setTimeout(() => {
        catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams, slug]);

  const isBhakti = mode === 'bhakti';

  return (
    <div className={cn('min-h-screen', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      {/* Hero Banner Carousel */}
      <div className="pt-16">
        <BannerCarousel />
      </div>

      {/* Featured Selection Section */}
      <FeaturedProducts />

      {/* Main Product Catalog Section */}
      <div ref={catalogRef} className={cn('py-16 relative z-10', isBhakti ? 'bg-sacred-gradient' : 'bg-steel')}>
        {/* Section Title */}
        <div className="container mx-auto px-4 mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className={cn(
              'inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4',
              'bg-saffron/10 text-saffron'
            )}>
              <Gift className="w-4 h-4" />
              <span className={isHindi ? 'devanagari' : ''}>
                {isHindi ? 'हमारा संग्रह' : 'Our Collection'}
              </span>
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isHindi ? 'devanagari' : ''}`}>
              {isHindi ? 'संपूर्ण उत्पाद सूची' : 'Complete Product Catalog'}
            </h2>
            <p className={`text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
              {isHindi ? 'आपकी हर पूजा की जरूरत के लिए' : 'For all your worship needs'}
            </p>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? 'उत्पाद खोजें...' : 'Search products...'}
                className={cn(
                  'w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all',
                  'border focus:ring-2 focus:ring-saffron/50',
                  isBhakti ? 'bg-card border-border' : 'bg-steel-dark border-copper/30 text-white'
                )}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className={cn(
                  'px-4 py-3 pr-10 rounded-xl outline-none transition-all appearance-none cursor-pointer',
                  'border focus:ring-2 focus:ring-saffron/50',
                  isBhakti ? 'bg-card border-border' : 'bg-steel-dark border-copper/30 text-white'
                )}
              >
                <option value="latest">{isHindi ? 'नवीनतम' : 'Latest'}</option>
                <option value="price-low">{isHindi ? 'कीमत: कम से ज्यादा' : 'Price: Low to High'}</option>
                <option value="price-high">{isHindi ? 'कीमत: ज्यादा से कम' : 'Price: High to Low'}</option>
                <option value="popular">{isHindi ? 'लोकप्रिय' : 'Popular'}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl transition-colors',
                showFilters ? 'bg-saffron text-white' : 'bg-muted hover:bg-muted/80'
              )}
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">{t('common.filter')}</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  selectedCategory === cat.id
                    ? 'bg-saffron text-white shadow-md'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                )}
              >
                {isHindi ? cat.nameHi : cat.name}
              </button>
            ))}
          </div>

          {/* Pieces Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="text-sm font-medium text-muted-foreground mr-2 flex items-center">
              {isHindi ? 'पैक साइज:' : 'Pack Size:'}
            </span>
            {[
              { id: 'all', name: 'All', nameHi: 'सभी', tag: 'all' },
              { id: '30', name: '30 Pieces', nameHi: '30 पीस', tag: '30 pieces' },
              { id: '50', name: '50 Pieces', nameHi: '50 पीस', tag: '50 pieces' },
              { id: '100', name: '100 Pieces', nameHi: '100 पीस', tag: '100 pieces' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { setSelectedTag(item.tag); setPage(1); }}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                  selectedTag === item.tag
                    ? 'border-saffron bg-saffron/10 text-saffron'
                    : 'border-border bg-transparent text-muted-foreground hover:border-saffron/50'
                )}
              >
                {isHindi ? item.nameHi : item.name}
              </button>
            ))}
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'p-6 rounded-2xl mb-8 border',
                isBhakti ? 'bg-card border-border' : 'bg-steel-dark border-copper/30'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{isHindi ? 'कीमत रेंज' : 'Price Range'}</h3>
                <button
                  onClick={() => {
                    setPriceRange([0, 5000]);
                    setSelectedCategory('all');
                    setSelectedTag('all');
                    setPage(1);
                  }}
                  className="text-sm text-saffron hover:underline"
                >
                  {isHindi ? 'रीसेट' : 'Reset'}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className={cn(
                      'w-32 pl-8 pr-3 py-2 rounded-lg border outline-none focus:border-saffron',
                      isBhakti ? 'bg-background' : 'bg-steel border-copper/30 text-white'
                    )}
                    placeholder="Min"
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className={cn(
                      'w-32 pl-8 pr-3 py-2 rounded-lg border outline-none focus:border-saffron',
                      isBhakti ? 'bg-background' : 'bg-steel border-copper/30 text-white'
                    )}
                    placeholder="Max"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-muted rounded-xl mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-5 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.lastPage > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: meta.lastPage }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={cn(
                        'w-10 h-10 rounded-full text-sm font-medium transition-colors',
                        page === i + 1
                          ? 'bg-saffron text-white'
                          : 'bg-muted hover:bg-muted/80 text-foreground'
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* No Products */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
              <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50">
                <Search className="w-full h-full" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">
                {isHindi ? 'कोई उत्पाद नहीं मिला' : 'No products found'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {isHindi ? 'कृपया अलग कीवर्ड या फिल्टर का प्रयास करें' : 'Please try different keywords or filters'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                  setPriceRange([0, 5000]);
                  setPage(1);
                }}
                className="text-saffron font-medium hover:underline"
              >
                {isHindi ? 'फिल्टर साफ़ करें' : 'Clear filters'}
              </button>
            </div>
          )}
        </div>
      </div>

      <GheeWicksFeature />

      {/* Machinery Showcase Banner */}
      <MachineryShowcase />

      {/* Best Sellers Section */}
      <TopSellingProducts />

      {/* Latest Products Section (New Arrivals) */}
      <LatestProducts />
    </div>
  );
}

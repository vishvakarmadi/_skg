import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, getImageUrl } from '@/lib/utils';
import { useCategories } from '@/hooks/useApi';

// Icon map for categories
const iconMap: Record<string, string> = {
  'puja-samagri': '🙏',
  'ghee-batti': '🔥',
  'agarbatti-dhoop': '🌸',
  'agarbatti': '🌸',
  'dhoop': '🌿',
  'camphor': '🔥',
  'sindoor-kumkum': '🔴',
  'mala-beads': '📿',
  'idol-murti': '🕉️',
  'diya': '🪔',
  'diya-batti': '🪔',
  'puja-kits': '🙏',
  'puja-thali': '🙏',
  'agarbatti-machine': '⚙️',
  'dhoop-machine': '⚙️',
  'diya-machine': '⚙️',
  'packaging-machine': '⚙️',
  'rudraksha': '📿',
  'idols': '🕉️',
};

// Fallback categories
const fallbackCategories = [
  { id: 'ghee-batti', name: 'Ghee Batti', nameHi: 'गी बत्ती', description: 'Pure cow ghee battis for daily puja', descriptionHi: 'दैनिक पूजा के लिए शुद्ध गाय घी बत्तियां', icon: '🔥', image: 'https://images.unsplash.com/photo-1606293926075-69a00febf780?w=400&h=400&fit=crop', productCount: 24, slug: 'ghee-batti' },
  { id: 'diya', name: 'Diya', nameHi: 'दीया', description: 'Traditional clay and brass diyas', descriptionHi: 'पारंपरिक मिट्टी और पीतल के दीये', icon: '🪔', image: 'https://images.unsplash.com/photo-1606293926075-69a00febf780?w=400&h=400&fit=crop', productCount: 18, slug: 'diya' },
  { id: 'agarbatti', name: 'Agarbatti', nameHi: 'अगरबत्ती', description: 'Fragrant incense sticks', descriptionHi: 'सुगंधित अगरबत्तियां', icon: '🌸', image: 'https://images.unsplash.com/photo-1602607683220-0c9c0c0c0c0c?w=400&h=400&fit=crop', productCount: 32, slug: 'agarbatti' },
  { id: 'puja-thali', name: 'Puja Thali', nameHi: 'पूजा थाली', description: 'Complete puja thali sets', descriptionHi: 'पूर्ण पूजा थाली सेट', icon: '🙏', image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&h=400&fit=crop', productCount: 15, slug: 'puja-thali' },
  { id: 'idols', name: 'Idols', nameHi: 'मूर्ति', description: 'Sacred deity idols', descriptionHi: 'पवित्र देवता मूर्तियां', icon: '🕉️', image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&h=400&fit=crop', productCount: 28, slug: 'idols' },
  { id: 'rudraksha', name: 'Rudraksha', nameHi: 'रुद्राक्ष', description: 'Authentic rudraksha beads', descriptionHi: 'प्रामाणिक रुद्राक्ष माला', icon: '📿', image: 'https://images.unsplash.com/photo-1602607683220-0c9c0c0c0c0c?w=400&h=400&fit=crop', productCount: 12, slug: 'rudraksha' },
];

export function CategoriesPage() {
  const { mode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const { data: apiCategories, loading } = useCategories();

  // Map API categories to display format
  const categories = apiCategories && apiCategories.length > 0
    ? apiCategories.map((c: any) => ({
      id: c.slug || String(c.id),
      name: c.name || '',
      nameHi: c.nameHi || c.name || '',
      description: c.description || '',
      descriptionHi: c.descriptionHi || c.description || '',
      icon: c.icon || iconMap[c.slug] || '🪔',
      image: c.image ? getImageUrl(c.image) : 'https://images.unsplash.com/photo-1606293926075-69a00febf780?w=400&h=400&fit=crop',
      productCount: c.products_count || c.productsCount || c.productCount || 0,
      slug: c.slug || String(c.id),
    }))
    : fallbackCategories;

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      {/* Header */}
      <div className={cn('py-12', isBhakti ? 'bg-sacred-gradient' : 'bg-steel')}>
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            {isHindi ? 'हमारी श्रेणियां' : 'Our Categories'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            {isHindi
              ? 'सभी प्रकार की शुद्ध पूजा सामग्री एक ही छत के नीचे'
              : 'All types of pure worship materials under one roof'}
          </motion.p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-muted rounded-2xl mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any, index: number) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/category/${category.slug || category.id}`}
                  className={cn(
                    'group block rounded-2xl overflow-hidden transition-all',
                    isBhakti ? 'bg-card shadow-sm hover:shadow-diya' : 'bg-steel border border-copper/30 hover:border-copper'
                  )}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={isHindi ? category.nameHi : category.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      {/* <span className="text-3xl">{category.icon}</span> */}
                      <h3 className="text-xl font-semibold">
                        {isHindi ? category.nameHi : category.name}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {isHindi ? category.descriptionHi : category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount} {isHindi ? 'उत्पाद' : 'products'}
                      </span>
                      <span className="flex items-center gap-1 text-saffron text-sm font-medium group-hover:gap-2 transition-all">
                        {isHindi ? 'देखें' : 'View'}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useUIStore } from '@/store';
import { cn, getImageUrl } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useApi';

// Icon map - maps API category slugs/names to emojis
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
  'rudraksha': '📿',
  'diya': '🪔',
  'diya-batti': '🪔',
  'puja-kits': '🙏',
  'puja-thali': '🙏',
  'agarbatti-machine': '⚙️',
  'dhoop-machine': '⚙️',
  'diya-machine': '⚙️',
  'packaging-machine': '⚙️',
  'yantra': '⚙️',
  'idols': '🕉️',
};

const colorMap: Record<string, string> = {
  'puja-samagri': 'from-orange-500 to-amber-500',
  'ghee-batti': 'from-yellow-500 to-amber-500',
  'agarbatti-dhoop': 'from-pink-500 to-rose-500',
  'agarbatti': 'from-pink-500 to-rose-500',
  'dhoop': 'from-green-500 to-emerald-500',
  'camphor': 'from-blue-500 to-cyan-500',
  'sindoor-kumkum': 'from-red-500 to-rose-500',
  'mala-beads': 'from-amber-700 to-amber-900',
  'idol-murti': 'from-amber-600 to-yellow-600',
  'rudraksha': 'from-amber-700 to-amber-900',
  'diya': 'from-orange-500 to-amber-500',
  'diya-batti': 'from-orange-500 to-amber-500',
  'puja-kits': 'from-red-500 to-orange-500',
  'agarbatti-machine': 'from-slate-600 to-slate-800',
  'dhoop-machine': 'from-slate-600 to-slate-800',
  'diya-machine': 'from-slate-600 to-slate-800',
  'packaging-machine': 'from-slate-600 to-slate-800',
  'yantra': 'from-slate-600 to-slate-800',
  'idols': 'from-amber-600 to-yellow-600',
};

// Fallback categories
const fallbackCategories: CategoryDisplay[] = [
  { id: 'diya-batti', name: 'Diya/Batti', nameHi: 'दीया/बत्ती', icon: '🪔', color: 'from-orange-500 to-amber-500', description: 'Pure Ghee Diyas & Battis', slug: 'diya-batti', image: undefined },
  { id: 'agarbatti', name: 'Agarbatti', nameHi: 'अगरबत्ती', icon: '🌸', color: 'from-pink-500 to-rose-500', description: 'Fragrant Incense Sticks', slug: 'agarbatti', image: undefined },
  { id: 'idols', name: 'Idols', nameHi: 'मूर्ति', icon: '🕉️', color: 'from-amber-600 to-yellow-600', description: 'Sacred Deity Idols', slug: 'idols', image: undefined },
  { id: 'puja-kits', name: 'Puja Kits', nameHi: 'पूजा किट', icon: '🙏', color: 'from-red-500 to-orange-500', description: 'Complete Puja Samagri', slug: 'puja-kits', image: undefined },
  { id: 'rudraksha', name: 'Rudraksha', nameHi: 'रुद्राक्ष', icon: '📿', color: 'from-amber-700 to-amber-900', description: 'Sacred Beads & Malas', slug: 'rudraksha', image: undefined },
  { id: 'yantra', name: 'Machinery', nameHi: 'यंत्र', icon: '⚙️', color: 'from-slate-600 to-slate-800', description: 'Temple Construction', slug: 'yantra', image: undefined },
];

interface CategoryDisplay {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  color: string;
  description: string;
  slug?: string;
  image?: string;
}

interface MandalaItemProps {
  category: CategoryDisplay;
  index: number;
  total: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function MandalaItem({ category, index, total, isHovered, onHover }: MandalaItemProps) {
  const { mode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';

  // Calculate position in circle
  const angle = (index * 360) / total - 90; // Start from top
  const radius = 140; // Distance from center
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.a
      href={`/category/${category.id}`}
      className={cn(
        'absolute flex flex-col items-center justify-center cursor-pointer',
        'w-24 h-24 rounded-full transition-all duration-500',
        isBhakti
          ? 'bg-card border-2 hover:border-saffron hover:shadow-glow'
          : 'bg-steel border border-copper hover:border-saffron'
      )}
      style={{
        left: `calc(50% + ${x}px - 48px)`,
        top: `calc(50% + ${y}px - 48px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: isHovered ? 1.15 : 1,
      }}
      transition={{
        opacity: { delay: index * 0.1 },
        scale: { type: 'spring', stiffness: 300 }
      }}
      onMouseEnter={() => onHover(category.id)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon */}
      <motion.span
        className="flex items-center justify-center mb-1"
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {category.image ? (
          <img
            src={getImageUrl(category.image)}
            alt={category.name}
            className="w-10 h-10 object-cover rounded-full drop-shadow-md"
          />
        ) : category.icon && (category.icon.includes('/') || category.icon.includes('.')) ? (
          <img
            src={getImageUrl(category.icon)}
            alt={category.name}
            className="w-10 h-10 object-contain drop-shadow-md"
          />
        ) : (
          <span className="text-3xl">{category.icon}</span>
        )}
      </motion.span>

      {/* Label */}
      <span className={`text-xs font-medium text-center leading-tight ${isHindi ? 'devanagari' : ''}`}>
        {isHindi ? category.nameHi : category.name}
      </span>

      {/* Pulse Effect on Hover */}
      {isHovered && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-full',
            `bg-gradient-to-br ${category.color}`
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.a>
  );
}

export function CategoryMandala() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const { mode } = useUIStore();
  const { t, isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const { data: apiCategories } = useCategories();

  // Map API categories to display format, or use fallback
  const categories = useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) return fallbackCategories;
    // Only show top-level (parent) categories, limit to 6 for mandala display
    return apiCategories
      .filter((c: any) => !c.parentId)
      .slice(0, 6)
      .map((c: any) => ({
        id: c.slug || String(c.id),
        name: c.name || '',
        nameHi: c.nameHi || c.name || '',
        icon: c.icon || iconMap[c.slug] || '🪔',
        image: c.image,
        color: colorMap[c.slug] || 'from-orange-500 to-amber-500',
        description: c.description || '',
        slug: c.slug || String(c.id),
      }));
  }, [apiCategories]);

  const activeCategory = categories.find((c: any) => c.id === hoveredCategory);

  return (
    <section className="py-20 bg-sacred-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="0.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className={`inline-block px-4 py-1 bg-saffron/10 text-saffron rounded-full text-sm font-medium mb-4 ${isHindi ? 'devanagari' : ''}`}>
            {t('categories.subtitle')}
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isHindi ? 'devanagari' : ''}`}>
            {isHindi ? 'हमारी ' : 'Our '}
            <span className="text-gradient-saffron">
              {isHindi ? 'पूजा सामग्री' : 'Puja Samagri'}
            </span>
          </h2>
          <p className={`text-muted-foreground max-w-2xl mx-auto ${isHindi ? 'devanagari' : ''}`}>
            {t('categories.description')}
          </p>
        </motion.div>

        {/* Mandala Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Mandala */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-[400px] h-[400px]"
          >
            {/* Outer Ring */}
            <motion.div
              className={cn(
                'absolute inset-0 rounded-full border-2',
                isBhakti ? 'border-saffron/20' : 'border-copper/30'
              )}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              {/* Decorative dots */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute w-2 h-2 rounded-full',
                    isBhakti ? 'bg-saffron/30' : 'bg-copper/40'
                  )}
                  style={{
                    top: '0',
                    left: '50%',
                    transform: `rotate(${i * 30}deg) translateY(-4px) translateX(-50%)`,
                  }}
                />
              ))}
            </motion.div>

            {/* Inner Ring */}
            <motion.div
              className={cn(
                'absolute inset-8 rounded-full border',
                isBhakti ? 'border-gold/20' : 'border-steel/40'
              )}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center Circle */}
            <motion.div
              className={cn(
                'absolute',
                'w-32 h-32 rounded-full flex flex-col items-center justify-center',
                'bg-gradient-to-br from-saffron to-gold shadow-glow'
              )}
              style={{
                top: '35%',
                left: '35%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-4xl mb-1">🕉️</span>
              <span
                className={`text-white text-xs font-medium text-center leading-tight ${isHindi ? 'devanagari' : ''
                  }`}
              >
                SKG<br />ENTERPRISE
              </span>
            </motion.div>

            {/* Category Items */}
            {categories.map((category, index) => (
              <MandalaItem
                key={category.id}
                category={category}
                index={index}
                total={categories.length}
                isHovered={hoveredCategory === category.id}
                onHover={setHoveredCategory}
              />
            ))}
          </motion.div>




          {/* Category Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-sm"
          >
            <div className={cn(
              'p-6 rounded-2xl',
              isBhakti ? 'bg-card shadow-diya' : 'bg-steel border border-copper'
            )}>
              {activeCategory ? (
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full">
                      {activeCategory.image ? (
                        <img
                          src={getImageUrl(activeCategory.image)}
                          alt={activeCategory.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : activeCategory.icon && (activeCategory.icon.includes('/') || activeCategory.icon.includes('.')) ? (
                        <img
                          src={getImageUrl(activeCategory.icon)}
                          alt={activeCategory.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        activeCategory.icon
                      )}
                    </span>
                    <div>
                      <h3 className={`text-xl font-bold ${isHindi ? 'devanagari' : ''}`}>
                        {isHindi ? activeCategory.nameHi : activeCategory.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {isHindi ? activeCategory.name : activeCategory.nameHi}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{activeCategory.description}</p>
                  <motion.a
                    href={`/category/${activeCategory.id}`}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                      'bg-saffron text-white hover:bg-saffron-dark transition-colors'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={isHindi ? 'devanagari' : ''}>{t('categories.viewProducts')}</span>
                    <span>→</span>
                  </motion.a>
                </motion.div>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full border-2 border-dashed border-saffron/30 flex items-center justify-center"
                  >
                    <span className="text-3xl">🪔</span>
                  </motion.div>
                  <p className={`text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                    {isHindi ? 'श्रेणी पर hovering करें' : 'Hover on category'}<br />
                    {isHindi ? 'अधिक जानकारी के लिए' : 'for more info'}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: isHindi ? '५००+' : '500+', label: t('categories.stats.products') },
                { value: isHindi ? '५०+' : '50+', label: t('categories.stats.categories') },
                { value: isHindi ? '९९%' : '99%', label: t('categories.stats.pure') },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'p-3 rounded-xl text-center',
                    isBhakti ? 'bg-card' : 'bg-steel border border-copper/30'
                  )}
                >
                  <p className={`text-xl font-bold text-saffron ${isHindi ? 'devanagari' : ''}`}>{stat.value}</p>
                  <p className={`text-xs text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

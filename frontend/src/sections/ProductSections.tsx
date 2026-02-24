import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Star, Zap } from 'lucide-react';
import { ProductCard } from '@/components/ui-custom/ProductCard';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';

import { cn } from '@/lib/utils';
import { useNewArrivals, useBestsellers, useFeaturedProducts } from '@/hooks/useApi';
import { Link } from 'react-router-dom';

// Section Header Component
interface SectionHeaderProps {
  badge: string;
  badgeHi: string;
  title: string;
  titleHi: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient?: string;
  link?: string;
}

function SectionHeader({ badge, badgeHi, title, titleHi, subtitle, icon, gradient = 'from-saffron to-gold', link = '/products' }: SectionHeaderProps) {
  const { isHindi } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
    >
      <div>
        <span className={cn(
          'inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4',
          'bg-gradient-to-r text-white',
          gradient
        )}>
          {icon}
          <span className={isHindi ? 'devanagari' : ''}>{isHindi ? badgeHi : badge}</span>
        </span>
        <h2 className={`text-3xl md:text-4xl font-bold ${isHindi ? 'devanagari' : ''}`}>
          {isHindi ? titleHi : title} <span className="text-gradient-saffron">{isHindi ? title : titleHi}</span>
        </h2>
        <p className={`text-muted-foreground mt-2 ${isHindi ? 'devanagari' : ''}`}>{subtitle}</p>
      </div>
      <Link to={link}>
        <motion.div
          className="inline-flex items-center gap-2 text-saffron hover:text-saffron-dark font-medium transition-colors cursor-pointer"
          whileHover={{ x: 5 }}
        >
          <span className={isHindi ? 'devanagari' : ''}>{isHindi ? 'सभी देखें' : 'View All'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Loading skeleton for product sections
function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square bg-muted rounded-xl mb-4" />
      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
      <div className="h-3 bg-muted rounded w-1/2 mb-2" />
      <div className="h-5 bg-muted rounded w-1/3" />
    </div>
  );
}

function SectionLoading({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-${count} gap-4 sm:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// Latest Products Section (New Arrivals) - NOW FROM API
export function LatestProducts() {
  const { mode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const { data: products, loading, error } = useNewArrivals();

  return (
    <section className={cn(
      'py-20',
      isBhakti ? 'bg-background' : 'bg-steel-dark'
    )}>
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="New Arrivals"
          badgeHi="नवीनतम"
          title="Products"
          titleHi="नए उत्पाद"
          subtitle={isHindi ? 'हमारी नवीनतम पूजा सामग्री देखें' : 'View our latest puja samagri'}
          icon={<Sparkles className="w-4 h-4" />}
          link="/products?sort=latest"
        />

        {loading && <SectionLoading count={4} />}
        {error && <SectionError message={error} />}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
        {products && products.length === 0 && !loading && (
          <SectionError message={isHindi ? 'कोई नया उत्पाद नहीं मिला' : 'No new arrivals found'} />
        )}
      </div>
    </section>
  );
}

// Top Selling Products Section - NOW FROM API
export function TopSellingProducts() {
  const { mode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const { data: products, loading, error } = useBestsellers();

  return (
    <section className={cn(
      'py-20',
      isBhakti ? 'bg-sacred-gradient' : 'bg-steel'
    )}>
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Bestsellers"
          badgeHi="बेस्टसेलर"
          title="Products"
          titleHi="लोकप्रिय"
          subtitle={isHindi ? 'हमारे सबसे लोकप्रिय उत्पाद' : 'Our most popular products'}
          icon={<TrendingUp className="w-4 h-4" />}
          gradient="from-green-500 to-emerald-500"
          link="/products?sort=popular"
        />

        {loading && <SectionLoading count={3} />}
        {error && <SectionError message={error} />}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'mt-12 p-6 rounded-2xl text-center',
            isBhakti ? 'bg-card shadow-diya' : 'bg-steel-dark border border-copper/30'
          )}
        >
          <p className={`text-2xl font-bold text-saffron mb-2 ${isHindi ? 'devanagari' : ''}`}>
            {isHindi ? '५,०००+ परिवारों ने इस महीने खरीदा' : '5,000+ families bought this month'}
          </p>
          <p className={`text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
            {isHindi ? 'हमारे उत्पादों पर भरोसा करने के लिए धन्यवाद' : 'Thank you for trusting our products'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// Featured Products Section - NOW FROM API
export function FeaturedProducts() {
  const { mode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';
  const { data: products, loading, error } = useFeaturedProducts();

  return (
    <section className={cn(
      'py-20',
      isBhakti ? 'bg-background' : 'bg-steel-dark'
    )}>
      <div className="container mx-auto px-4">
        <SectionHeader
          badge="Featured"
          badgeHi="विशेष"
          title="Selection"
          titleHi="विशेष चयन"
          subtitle={isHindi ? 'संस्थापक द्वारा व्यक्तिगत रूप से चुने गए उत्पाद' : 'Products personally selected by the founder'}
          icon={<Star className="w-4 h-4" />}
          gradient="from-purple-500 to-pink-500"
          link="/products?featured=true"
        />

        {loading && <SectionLoading count={3} />}
        {error && <SectionError message={error} />}
        {products && products.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Large Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 lg:row-span-2"
            >
              <ProductCard product={products[0]} variant="featured" />
            </motion.div>

            {/* Smaller Cards */}
            {products.slice(1, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* Founder Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'mt-12 p-8 rounded-2xl relative overflow-hidden',
            isBhakti ? 'bg-gradient-to-br from-saffron/10 to-gold/10' : 'bg-steel border border-copper/30'
          )}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🙏</span>
            </div>
            <div className="text-center md:text-left">
              <p className={`text-lg italic text-foreground mb-2 ${isHindi ? 'devanagari' : ''}`}>
                {isHindi
                  ? '"मैंने व्यक्तिगत रूप से प्रत्येक उत्पाद की शुद्धता की जांच की है। ये वस्तुएं आपकी भक्ति को और भी पवित्र बनाएंगी।"'
                  : '"I have personally verified the purity of each product. These items will make your devotion even more sacred."'
                }
              </p>
              <p className="text-saffron font-medium">
                {isHindi ? '— पवन हृदय नाहु, संस्थापक' : '— Pawan Hridya Nahu, Founder'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Machinery Showcase Section (static - no API change needed)
export function MachineryShowcase() {
  const { mode, setMode } = useUIStore();
  const { isHindi } = useLanguage();
  const isBhakti = mode === 'bhakti';

  const handleExploreMachinery = () => {
    setMode('yantra');
  };

  return (
    <section className={cn(
      'py-20 relative overflow-hidden',
      isBhakti ? 'bg-sacred-gradient' : 'bg-steel-dark'
    )}>
      {/* Background Transition */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-steel-dark to-copper-dark"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: isBhakti ? 0 : 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className={cn(
              'inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4',
              'bg-gradient-to-r from-steel to-copper text-white'
            )}>
              <Zap className="w-4 h-4" />
              <span className={isHindi ? 'devanagari' : ''}>{isHindi ? 'यंत्र शक्ति' : 'Machinery Power'}</span>
            </span>

            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isHindi ? 'devanagari' : ''}`}>
              {isHindi ? 'मंदिर निर्माण ' : 'Temple Construction '}
              <span className="text-gradient-saffron">{isHindi ? 'यंत्र' : 'Machinery'}</span>
            </h2>

            <p className={`text-muted-foreground mb-6 leading-relaxed ${isHindi ? 'devanagari' : ''}`}>
              {isHindi
                ? 'SKG ENTERPRISE के उन्नत यंत्रों के साथ अपने उत्पादन को बढ़ाएं। हमारी मशीनें दीया, अगरबत्ती, और अन्य पूजा सामग्री के बड़े पैमाने पर उत्पादन के लिए डिज़ाइन की गई हैं।'
                : 'Boost your production with SKG ENTERPRISE\'s advanced machinery. Our machines are designed for large-scale production of diyas, agarbatti, and other puja items.'
              }
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: isHindi ? '₹५० लाख+' : '₹50L+', label: isHindi ? 'टर्नओवर' : 'Turnover' },
                { value: isHindi ? '१०,०००+' : '10,000+', label: isHindi ? 'यूनिट/दिन' : 'Units/Day' },
                { value: isHindi ? '५०+' : '50+', label: isHindi ? 'ग्राहक' : 'Clients' },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-green-50 rounded-xl">
                  <p className={`text-xl font-bold text-saffron ${isHindi ? 'devanagari' : ''}`}>{stat.value}</p>
                  <p className={`text-xs text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleExploreMachinery}
                className="px-6 py-3 bg-gradient-to-r from-steel to-copper text-white rounded-full font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isHindi ? 'devanagari' : ''}>{isHindi ? 'यंत्र मोड देखें' : 'View Machinery Mode'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.a
                href="/machinery"
                className="px-6 py-3 border border-copper text-copper rounded-full font-medium flex items-center justify-center gap-2 hover:bg-copper/10 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isHindi ? 'devanagari' : ''}>{isHindi ? 'उद्धरण प्राप्त करें' : 'Get Quote'}</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content - Machinery Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop"
                alt="Machinery"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/80 via-transparent to-transparent" />

              {/* Specs Card */}
              <motion.div
                className="absolute bottom-4 left-4 right-4 p-4 bg-steel/90 backdrop-blur-md rounded-xl border border-copper/30"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm text-copper font-medium ${isHindi ? 'devanagari' : ''}`}>
                      {isHindi ? 'उत्पादन क्षमता' : 'Production Capacity'}
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {isHindi ? '१०,००० यूनिट/दिन' : '10,000 Units/Day'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-copper/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-copper" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-copper/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, getImageUrl } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBanners } from '@/hooks/useApi';


// Fallback banners in case API fails
const fallbackBanners = [
  {
    id: '1',
    title: 'Diwali Special Offer',
    titleHi: 'दीवाली स्पेशल ऑफर',
    subtitle: 'Get up to 50% off on all puja items',
    subtitleHi: 'सभी पूजा सामग्री पर ५०% तक की छूट',
    image: 'https://images.unsplash.com/photo-1606293926075-69a00febf780?w=1600&h=600&fit=crop',
    ctaText: 'Shop Now',
    ctaTextHi: 'खरीदारी करें',
    ctaLink: '/products',
    type: 'festival' as const,
    bgGradient: 'from-orange-600 via-amber-500 to-yellow-500',
  },
  {
    id: '2',
    title: 'New Machinery Arrival',
    titleHi: 'नई मशीनरी आ गई',
    subtitle: 'Now producing 10,000 diyas per day',
    subtitleHi: 'अब १०,००० दीये प्रतिदिन का उत्पादन',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&h=600&fit=crop',
    ctaText: 'Explore',
    ctaTextHi: 'जानें',
    ctaLink: '/machinery',
    type: 'machinery' as const,
    bgGradient: 'from-slate-700 via-slate-600 to-amber-700',
  },
  {
    id: '3',
    title: "Founder's Blessing",
    titleHi: 'संस्थापक का आशीर्वाद',
    subtitle: 'Pawan Hridya Nahu personally verifies each product',
    subtitleHi: 'पवन हृदय नाहु व्यक्तिगत रूप से प्रत्येक उत्पाद की जांच करते हैं',
    image: 'https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=1600&h=600&fit=crop',
    ctaText: 'Our Story',
    ctaTextHi: 'हमारी कहानी',
    ctaLink: '/about',
    type: 'promo' as const,
    bgGradient: 'from-amber-600 via-orange-500 to-red-500',
  },
];

// Map banner type to gradient
const typeGradientMap: Record<string, string> = {
  hero: 'from-orange-600 via-amber-500 to-yellow-500',
  festival: 'from-orange-600 via-amber-500 to-yellow-500',
  promo: 'from-amber-600 via-orange-500 to-red-500',
  machinery: 'from-slate-700 via-slate-600 to-amber-700',
};

interface BannerDisplay {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  image: string;
  ctaText: string;
  ctaTextHi: string;
  ctaLink: string;
  type: string;
  bgGradient: string;
}

function mapApiBanner(b: any): BannerDisplay {
  return {
    id: String(b.id),
    title: b.title || '',
    titleHi: b.titleHi || b.title || '',
    subtitle: b.subtitle || b.description || '',
    subtitleHi: b.subtitleHi || b.subtitle || b.description || '',
    image: getImageUrl(b.image || b.desktopImage) || 'https://images.unsplash.com/photo-1606293926075-69a00febf780?w=1600&h=600&fit=crop',
    ctaText: b.ctaText || b.buttonText || 'Shop Now',
    ctaTextHi: b.ctaTextHi || b.ctaText || b.buttonText || 'खरीदारी करें',
    ctaLink: b.ctaLink || b.buttonLink || '/products',
    type: b.type || 'promo',
    bgGradient: typeGradientMap[b.type] || 'from-orange-600 via-amber-500 to-yellow-500',
  };
}

export function BannerCarousel() {
  const { isHindi } = useLanguage();
  const { data: apiBanners } = useBanners();

  const banners: BannerDisplay[] =
    apiBanners && apiBanners.length > 0
      ? apiBanners.map(mapApiBanner)
      : fallbackBanners;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = banners.length - 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      return nextIndex;
    });
  }, [banners.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, paginate]);

  // Reset index when banners change
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  const currentBanner = banners[currentIndex] || banners[0];
  if (!currentBanner) return null;

  return (
    <section
      className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentBanner.image}
              alt={currentBanner.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-r',
              currentBanner.bgGradient,
              'opacity-70'
            )} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  'inline-block px-4 py-1 rounded-full text-sm font-medium mb-4',
                  'bg-white/20 backdrop-blur-sm text-white'
                )}
              >
                {currentBanner.type === 'festival' && (isHindi ? '🪔 त्योहार ऑफर' : '🪔 Festival Offer')}
                {currentBanner.type === 'machinery' && (isHindi ? '⚙️ यंत्र शक्ति' : '⚙️ Machinery Power')}
                {(currentBanner.type === 'promo' || currentBanner.type === 'hero') && (isHindi ? '✨ विशेष' : '✨ Special')}
              </motion.span>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight ${isHindi ? 'devanagari' : ''}`}
              >
                {isHindi ? currentBanner.titleHi : currentBanner.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-lg md:text-xl text-white/90 mb-8 ${isHindi ? 'devanagari' : ''}`}
              >
                {isHindi ? currentBanner.subtitleHi : currentBanner.subtitle}
              </motion.p>

              {/* CTA */}
              <motion.a
                href={currentBanner.ctaLink}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-saffron rounded-full font-semibold hover:bg-cream transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={isHindi ? 'devanagari' : ''}>
                  {isHindi ? currentBanner.ctaTextHi : currentBanner.ctaText}
                </span>
                <ChevronRight className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            key={currentIndex}
          />
        </div>
      )}
    </section>
  );
}

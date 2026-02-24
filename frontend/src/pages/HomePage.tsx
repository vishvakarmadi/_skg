import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Hero } from '@/sections/Hero';
import { BannerCarousel } from '@/sections/BannerCarousel';
import { CategoryMandala } from '@/sections/CategoryMandala';
import { CategorySlider } from '@/sections/CategorySlider';
import { LatestProducts, TopSellingProducts, FeaturedProducts, MachineryShowcase } from '@/sections/ProductSections';
import { ContactSection } from '@/sections/ContactSection';
import { TestimonialsSection } from '@/sections/TestimonialsSection';
import { StoriesSection } from '@/sections/StoriesSection';
import { GheeWicksFeature } from '@/components/ui-custom/GheeWicksFeature';

export function HomePage() {
  const { isHindi } = useLanguage();

  // Set page title
  useEffect(() => {
    document.title = isHindi
      ? 'SKG ENTERPRISE - शुद्धता का प्रतीक'
      : 'SKG ENTERPRISE - Symbol of Purity';
  }, [isHindi]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <Hero />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Category Slider */}
      <CategorySlider />

      {/* Category Mandala */}
      <CategoryMandala />

      {/* Latest Products */}
      <LatestProducts />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Ghee Wicks Features */}
      <GheeWicksFeature />

      {/* Machinery Showcase */}
      <MachineryShowcase />

      {/* Top Selling Products */}
      <TopSellingProducts />

      {/* Stories Section */}
      <StoriesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />
    </motion.div>
  );
}

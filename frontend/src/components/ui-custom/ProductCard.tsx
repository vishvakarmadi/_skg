import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Check, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCartStore, useWishlistStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Product } from '@/types';
import { cn, getImageUrl } from '@/lib/utils';
// motion is already imported at line 1

interface ProductCardProps {
  product: Product;
  variant?: 'bhakti' | 'yantra' | 'featured' | 'compact';
  index?: number;
}

export function ProductCard({ product, variant, index = 0 }: ProductCardProps) {
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isHindi, t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Determine card style based on product type or override
  const cardStyle = variant || product.cardStyle || (product.type === 'machinery' ? 'yantra' : 'bhakti');
  const isBhaktiStyle = cardStyle === 'bhakti' || cardStyle === 'featured';
  const isInCart = cartItems.some((item) => item.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      nameHi: product.nameHi,
      price: product.price,
      quantity: 1,
      image: getImageUrl(product.images[0]),
      category: product.category.name,
      isMachinery: product.type === 'machinery',
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId: product.id,
      name: product.name,
      nameHi: product.nameHi,
      price: product.price,
      image: getImageUrl(product.images[0]),
      category: product.category.name,
    });
  };

  // Price formatter
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Stagger animation delay
  const staggerDelay = index * 0.1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: staggerDelay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative overflow-hidden',
        isBhaktiStyle ? 'bhakti-card' : 'yantra-card',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {product.isNew && (
          <span className="purity-badge animate-sparkle">
            <span className={isHindi ? 'devanagari' : ''}>{t('products.new')}</span>
          </span>
        )}
        {product.purityCertified && (
          <span className="purity-badge">
            <Check className="w-3 h-3" />
            <span className={isHindi ? 'devanagari' : ''}>{t('products.pure')}</span>
          </span>
        )}
        {product.isBestseller && (
          <span className="px-2 py-0.5 text-xs font-medium bg-gold text-black rounded-full">
            <span className={isHindi ? 'devanagari' : ''}>{t('products.bestseller')}</span>
          </span>
        )}
        {product.type === 'machinery' && (
          <span className="px-2 py-0.5 text-xs font-medium bg-steel text-white rounded-full">
            <span className={isHindi ? 'devanagari' : ''}>{t('products.machinery')}</span>
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <motion.button
        onClick={handleToggleWishlist}
        className={cn(
          'absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300',
          inWishlist
            ? 'bg-saffron text-white'
            : 'bg-white/80 text-muted-foreground hover:bg-saffron hover:text-white'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
      </motion.button>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className={cn(
        'block relative overflow-hidden',
        cardStyle === 'featured' ? 'aspect-[4/3]' : 'aspect-square'
      )}>
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 skeleton-torana" />
        )}

        <motion.img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Quick Actions Overlay - Desktop only (hover) */}
        <motion.div
          className="absolute inset-0 bg-black/40 hidden sm:flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.preventDefault()}
        >
          <motion.button
            onClick={(e) => { e.preventDefault(); handleAddToCart(); }}
            className={cn(
              'p-3 rounded-full transition-all duration-300',
              isInCart
                ? 'bg-green-500 text-white'
                : 'bg-white text-foreground hover:bg-saffron hover:text-white'
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </motion.button>
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/product/${product.id}`);
            }}
            className="p-3 rounded-full bg-white text-foreground hover:bg-saffron hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Trademark Watermark */}
        <div className="absolute bottom-2 right-2 text-[8px] text-gold/60 font-sacred tracking-wider">
          SKG™
        </div>
      </Link>

      {/* Content */}
      <div className={cn(
        'p-2.5 sm:p-4',
        cardStyle === 'featured' && 'sm:p-6'
      )}>
        {/* Category */}
        <p className={cn("text-xs text-muted-foreground mb-1", isHindi && "devanagari")}>
          {isHindi ? (product.category.nameHi || product.category.name) : product.category.name}
        </p>

        {/* Name */}
        <h3 className={cn(
          'font-semibold text-foreground mb-1 sm:mb-2 line-clamp-2',
          cardStyle === 'featured' ? 'text-base sm:text-xl' : 'text-xs sm:text-sm',
          isHindi && "devanagari"
        )}>
          {isHindi ? (product.nameHi || product.name) : product.name}
        </h3>

        {/* Rating Summary */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < Math.round(product.avgRating || 0) ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"
                )}
              />
            ))}
          </div>
          {(product.reviewsCount ?? 0) > 0 && (
            <span className="text-[10px] text-muted-foreground ml-1">
              ({product.reviewsCount})
            </span>
          )}
        </div>

        {/* Description (featured only) */}
        {cardStyle === 'featured' && (
          <p className={cn("text-sm text-muted-foreground mb-4 line-clamp-2", isHindi && "devanagari")}>
            {isHindi ? (product.descriptionHi || product.description) : product.description}
          </p>
        )}

        {/* Purity Features */}
        {isBhaktiStyle && product.purityFeatures && product.purityFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.purityFeatures.slice(0, 2).map((feature, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 bg-saffron/10 text-saffron rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Technical Specs (Yantra) */}
        {!isBhaktiStyle && product.technicalSpecs && (
          <div className="space-y-1 mb-3">
            {Object.entries(product.technicalSpecs).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex justify-between text-xs">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-1">
          <div className="flex flex-col min-w-0">
            <span className={cn(
              'font-bold text-saffron',
              cardStyle === 'featured' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-lg'
            )}>
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <motion.button
            onClick={handleAddToCart}
            className={cn(
              'rounded-full font-medium transition-all duration-300 flex-shrink-0',
              'p-2 sm:px-4 sm:py-2 text-xs sm:text-sm',
              isInCart
                ? 'bg-green-500 text-white'
                : 'bg-saffron text-white hover:bg-saffron-dark'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isInCart ? (
              <>
                <Check className="w-4 h-4 sm:hidden" />
                <span className={cn('hidden sm:inline', isHindi ? 'devanagari' : '')}>{t('products.added')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 sm:hidden" />
                <span className={cn('hidden sm:inline', isHindi ? 'devanagari' : '')}>{t('products.addToCart')}</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Compact Product Card for Lists
export function ProductCardCompact({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { isHindi } = useLanguage();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-saffron/50 transition-colors">
      <img
        src={getImageUrl(product.images[0])}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs text-muted-foreground", isHindi && "devanagari")}>
          {isHindi ? (product.category.nameHi || product.category.name) : product.category.name}
        </p>
        <h4 className={cn("font-medium text-foreground truncate", isHindi && "devanagari")}>
          {isHindi ? (product.nameHi || product.name) : product.name}
        </h4>
        <p className="text-lg font-bold text-saffron mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => toggleWishlist({
            productId: product.id,
            name: product.name,
            nameHi: product.nameHi,
            price: product.price,
            image: getImageUrl(product.images[0]),
            category: product.category.name,
          })}
          className={cn(
            'p-2 rounded-full transition-colors',
            inWishlist ? 'bg-saffron text-white' : 'bg-muted hover:bg-saffron/10'
          )}
        >
          <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
        </button>
        <button
          onClick={() => addItem({
            productId: product.id,
            name: product.name,
            nameHi: product.nameHi,
            price: product.price,
            quantity: 1,
            image: getImageUrl(product.images[0]),
            category: product.category.name,
            isMachinery: product.type === 'machinery',
          })}
          className="p-2 rounded-full bg-saffron text-white hover:bg-saffron-dark transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

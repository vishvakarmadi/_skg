import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, Star, Truck, Shield, Check, Minus, Plus, Loader2 } from 'lucide-react';
import { useUIStore, useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { cn, getImageUrl } from '@/lib/utils';
import { ProductCard } from '@/components/ui-custom/ProductCard';
import { useProduct, useFeaturedProducts, useAddReview } from '@/hooks/useApi';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mode } = useUIStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { t, isHindi } = useLanguage();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Fetch product from API
  const { data: product, loading, error } = useProduct(id || '');
  // Fetch related products (using featured as a reasonable source)
  const { data: relatedProducts } = useFeaturedProducts();
  const { isAuthenticated } = useAuthStore();
  const { submitReview, loading: reviewLoading, success: reviewSuccess, error: reviewError, resetSuccess } = useAddReview();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const success = await submitReview(id || '', { rating, text: reviewText });
    if (success) {
      setReviewText('');
      setRating(5);
      // Wait a moment before resetting success message
      setTimeout(() => resetSuccess(), 3000);
    }
  };

  const inWishlist = product ? isInWishlist(product.id?.toString() || '') : false;
  const isBhakti = mode === 'bhakti';

  // Loading state
  if (loading) {
    return (
      <div className={cn('min-h-screen pt-32 flex items-center justify-center', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-saffron mx-auto" />
          <p className="text-muted-foreground">{isHindi ? 'उत्पाद लोड हो रहा है...' : 'Loading product...'}</p>
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (error || !product) {
    return (
      <div className={cn('min-h-screen pt-32 text-center', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
        <p className="text-muted-foreground">{isHindi ? 'उत्पाद नहीं मिला' : 'Product not found'}</p>
        <button onClick={() => navigate('/products')} className="mt-4 text-saffron hover:underline">
          {t('back')}
        </button>
      </div>
    );
  }

  const productId = product.id?.toString() || '';
  const productImages = product.images && product.images.length > 0
    ? product.images.map(img => getImageUrl(img))
    : ['https://placehold.co/600x600/f97316/white?text=Product'];

  const handleAddToCart = () => {
    addItem({
      productId,
      name: product.name,
      nameHi: product.nameHi,
      price: product.price,
      quantity,
      image: productImages[0],
      category: product.category?.name || '',
      isMachinery: product.type === 'machinery',
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist({
      productId,
      name: product.name,
      nameHi: product.nameHi,
      price: product.price,
      image: productImages[0],
      category: product.category?.name || '',
    });
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  // Filter related products to exclude current product, take max 4
  const filteredRelated = (relatedProducts || [])
    .filter(p => p.id?.toString() !== productId)
    .slice(0, 4);

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-muted-foreground hover:text-saffron mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className={cn('aspect-square rounded-2xl overflow-hidden', isBhakti ? 'bg-card' : 'bg-steel')}>
              <img
                src={productImages[selectedImage]}
                alt={isHindi ? product.nameHi : product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                      selectedImage === idx ? 'border-saffron' : 'border-transparent'
                    )}
                  >
                    <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {isHindi ? product.category?.nameHi : product.category?.name}
              </span>
              {product.isNew && (
                <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  {t('products.new')}
                </span>
              )}
              {product.purityCertified && (
                <span className="px-2 py-0.5 bg-saffron text-white text-xs rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {t('products.purityCertified')}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold">
              {isHindi ? product.nameHi : product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn(
                    "w-5 h-5",
                    i < Math.round(product.avgRating || 0) ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"
                  )} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewsCount || 0} {isHindi ? 'समीक्षाएं' : 'reviews'})</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-saffron">
                ₹{product.price}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.comparePrice}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    {discount}% {isHindi ? 'छूट' : 'OFF'}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <div
              className="text-muted-foreground line-clamp-3 prose-sm"
              dangerouslySetInnerHTML={{ __html: isHindi ? (product.descriptionHi || product.description) : product.description }}
            />

            {/* Purity Features */}
            {product.purityFeatures && (
              <div className="flex flex-wrap gap-2">
                {product.purityFeatures.map((feature, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm',
                      isBhakti ? 'bg-saffron/10 text-saffron' : 'bg-copper/20 text-copper'
                    )}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  {isHindi ? `स्टॉक में (${product.stock} उपलब्ध)` : `In Stock (${product.stock} available)`}
                </span>
              ) : (
                <span className="text-sm text-red-500">
                  {isHindi ? 'स्टॉक में नहीं' : 'Out of Stock'}
                </span>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Quantity Selector */}
              <div className={cn('flex items-center rounded-full border', isBhakti ? 'border-border' : 'border-copper/30')}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted rounded-l-full"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="p-3 hover:bg-muted rounded-r-full"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <DiyaButton size="lg" onClick={handleAddToCart} disabled={product.stock <= 0}>
                {t('products.addToCart')}
              </DiyaButton>

              {/* Wishlist */}
              <motion.button
                onClick={handleToggleWishlist}
                className={cn(
                  'p-4 rounded-full border-2 transition-all',
                  inWishlist
                    ? 'bg-saffron border-saffron text-white'
                    : 'border-border hover:border-saffron'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={cn('w-5 h-5', inWishlist && 'fill-current')} />
              </motion.button>

              {/* Share */}
              <motion.button
                className="p-4 rounded-full border-2 border-border hover:border-saffron transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-5 h-5 text-saffron" />
                {isHindi ? 'मुफ्त शिपिंग ₹500 से अधिक' : 'Free shipping above ₹500'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-saffron" />
                {isHindi ? 'शुद्धता की गारंटी' : 'Purity guarantee'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-6 border-b border-border">
            {(['description', 'specifications', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-3 text-sm font-medium capitalize transition-colors relative',
                  activeTab === tab ? 'text-saffron' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`products.${tab}`)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-saffron"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' ? (
              <div className="space-y-8">
                <div
                  className={cn("prose max-w-none leading-relaxed", isBhakti ? "prose-orange" : "prose-invert")}
                  dangerouslySetInnerHTML={{ __html: isHindi ? (product.descriptionHi || product.description) : product.description }}
                />

                {product.devotionalUse && (
                  <div className="mt-6 p-4 rounded-xl bg-saffron/5 border border-saffron/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-saffron">
                      <Heart className="w-5 h-5" />
                      {isHindi ? 'भक्ति उपयोग:' : 'Devotional Use:'}
                    </h4>
                    <p className="text-muted-foreground">{product.devotionalUse}</p>
                  </div>
                )}

                {/* Shipping info appended to all product descriptions */}
                <div className="mt-8 pt-8 border-t border-border">
                  <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                    <Truck className="w-5 h-5 text-saffron" />
                    {isHindi ? 'शिपिंग और डिलीवरी की जानकारी' : 'Shipping and Delivery Information'}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>{isHindi ? 'मुफ़्त शिपिंग' : 'Free Shipping'}</li>
                    <li>{isHindi ? 'आसान रिटर्न (लागू होने पर)' : 'Easy Returns'}</li>
                    <li>{isHindi ? '4 - 7 दिनों में डिलीवरी' : 'Delivers in 4 – 7 days'}</li>
                  </ul>
                </div>
              </div>
            ) : activeTab === 'specifications' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground text-sm block mb-1">SKU:</span>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm block mb-1">{isHindi ? 'स्टॉक:' : 'Stock:'}</span>
                    <p className="font-medium">{product.stock} {isHindi ? 'इकाइयां' : 'units'}</p>
                  </div>
                  {product.batchNumber && (
                    <div>
                      <span className="text-muted-foreground text-sm block mb-1">{isHindi ? 'बैच नंबर:' : 'Batch Number:'}</span>
                      <p className="font-medium">{product.batchNumber}</p>
                    </div>
                  )}
                  {product.madeOn && (
                    <div>
                      <span className="text-muted-foreground text-sm block mb-1">{isHindi ? 'निर्माण तिथि:' : 'Made On:'}</span>
                      <p className="font-medium">
                        {new Date(product.madeOn).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {product.warranty && (
                    <div>
                      <span className="text-muted-foreground text-sm block mb-1">{isHindi ? 'वारंटी:' : 'Warranty:'}</span>
                      <p className="font-medium">{product.warranty}</p>
                    </div>
                  )}
                  {product.productionCapacity && (
                    <div>
                      <span className="text-muted-foreground text-sm block mb-1">{isHindi ? 'उत्पादन क्षमता:' : 'Production Capacity:'}</span>
                      <p className="font-medium">{product.productionCapacity}</p>
                    </div>
                  )}
                  {product.technicalSpecs && Object.entries(product.technicalSpecs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground text-sm block mb-1 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Write Review Form */}
                <div className="mb-8 p-6 bg-card rounded-2xl border border-border/50">
                  <h3 className="text-xl font-bold mb-4">{isHindi ? 'एक समीक्षा लिखें' : 'Write a Review'}</h3>
                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                      {isHindi ? 'आपकी समीक्षा के लिए धन्यवाद!' : 'Thank you for your review!'}
                    </div>
                  )}
                  {reviewError && (
                    <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded-lg text-sm">
                      {reviewError}
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{isHindi ? 'रेटिंग' : 'Rating'}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star className={cn(
                              "w-6 h-6 transition-colors",
                              rating >= star ? "fill-gold text-gold" : "fill-slate-200 text-slate-200 hover:fill-gold/50"
                            )} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{isHindi ? 'आपकी समीक्षा' : 'Your Review'}</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                        minLength={10}
                        rows={4}
                        className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-copper"
                        placeholder={isHindi ? 'अपना अनुभव साझा करें...' : 'Share your experience with this product...'}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={reviewLoading}
                      className="px-6 py-2 bg-copper text-white rounded-lg font-medium hover:bg-copper-dark transition-colors disabled:opacity-50"
                    >
                      {reviewLoading ? (isHindi ? 'सबमिट किया जा रहा है...' : 'Submitting...') : (isHindi ? 'समीक्षा सबमिट करें' : 'Submit Review')}
                    </button>
                  </form>
                </div>

                {product.testimonials && product.testimonials.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {product.testimonials.map((review) => (
                      <div key={review.id} className="p-6 rounded-2xl bg-card border border-border/50">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron font-bold text-xl uppercase">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold flex items-center gap-2">
                                {isHindi ? review.nameHi || review.name : review.name}
                                {review.isVerified && (
                                  <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" /> Verified Buyer
                                  </span>
                                )}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={cn(
                                    "w-3.5 h-3.5",
                                    i < review.rating ? "fill-gold text-gold" : "fill-slate-200 text-slate-200"
                                  )} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed italic">
                          "{isHindi ? review.textHi || review.text : review.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed">
                    <p className="text-muted-foreground">
                      {isHindi ? 'अभी तक कोई समीक्षा नहीं है। पहले व्यक्ति बनें!' : 'No reviews yet. Be the first to share your experience!'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {filteredRelated.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('related Products')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredRelated.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';

export function WishlistDrawer() {
  const { items, isOpen, setWishlistOpen, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { t, isHindi } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleMoveToCart = (item: typeof items[0]) => {
    addItem({
      productId: item.productId,
      name: item.name,
      nameHi: item.nameHi,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category,
      isMachinery: false,
    });
    removeItem(item.productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setWishlistOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-saffron/10 rounded-full">
                  <Heart className="w-5 h-5 text-saffron fill-saffron" />
                </div>
                <div>
                  <h2 className={`font-semibold text-foreground ${isHindi ? 'devanagari' : ''}`}>{t('nav.wishlist')}</h2>
                  <p className="text-xs text-muted-foreground">
                    {items.length} {items.length === 1 ? (isHindi ? 'वस्तु' : 'item') : (isHindi ? 'वस्तुएं' : 'items')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"
                  >
                    <Heart className="w-10 h-10 text-muted-foreground" />
                  </motion.div>
                  <h3 className={`text-lg font-medium text-foreground mb-2 ${isHindi ? 'devanagari' : ''}`}>
                    {isHindi ? 'पूजा सूची खाली है' : 'Wishlist is empty'}
                  </h3>
                  <p className={`text-sm text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                    {isHindi ? 'अपनी पसंदीदा वस्तुएं सहेजें' : 'Save your favorite items'}
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-3 bg-muted/50 rounded-xl"
                  >
                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs text-muted-foreground ${isHindi ? 'devanagari' : ''}`}>
                        {item.category}
                      </p>
                      <h4 className={`font-medium text-foreground truncate text-sm ${isHindi ? 'devanagari' : ''}`}>
                        {isHindi ? item.nameHi || item.name : item.name}
                      </h4>
                      <p className="text-saffron font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2">
                        <motion.button
                          onClick={() => handleMoveToCart(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-saffron text-white text-xs rounded-full hover:bg-saffron-dark transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span className={isHindi ? 'devanagari' : ''}>{t('products.addToCart')}</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-border">
                <motion.button
                  onClick={() => setWishlistOpen(false)}
                  className="w-full py-3 bg-muted text-foreground rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={isHindi ? 'devanagari' : ''}>{t('cart.continueShopping')}</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Wishlist Icon with Badge for Header
export function WishlistIcon() {
  const { toggleWishlistOpen, getTotalItems } = useWishlistStore();
  const itemCount = getTotalItems();

  return (
    <motion.button
      onClick={toggleWishlistOpen}
      className="relative p-2 hover:bg-muted rounded-full transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open wishlist"
    >
      <Heart className="w-5 h-5" />
      {itemCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {itemCount > 9 ? '9+' : itemCount}
        </motion.span>
      )}
    </motion.button>
  );
}

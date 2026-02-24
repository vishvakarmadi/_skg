import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store';

export function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
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
            onClick={() => setCartOpen(false)}
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
                  <ShoppingBag className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground devanagari">सेवा पात्र</h2>
                  <p className="text-xs text-muted-foreground">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4"
                  >
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-foreground mb-2 devanagari">
                    पात्र खाली है
                  </h3>
                  <p className="text-sm text-muted-foreground devanagari">
                    पूजा सामग्री जोड़ने के लिए खरीदारी जारी रखें
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
                      <p className="text-xs text-muted-foreground devanagari">
                        {item.category}
                      </p>
                      <h4 className="font-medium text-foreground truncate text-sm">
                        {item.nameHi || item.name}
                      </h4>
                      <p className="text-saffron font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-background rounded-full hover:bg-saffron hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-background rounded-full hover:bg-saffron hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
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
              <div className="p-4 border-t border-border space-y-4">
                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span className="devanagari">पात्र खाली करें</span>
                </button>

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span className="devanagari">उप-योग</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span className="devanagari">शिपिंग</span>
                    <span className="text-green-500 devanagari">मुफ्त</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                    <span className="devanagari">कुल योग</span>
                    <span className="text-saffron">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  className="w-full py-3 bg-saffron text-white rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-saffron-dark transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="devanagari">चेकआउट करें</span>
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

// Cart Icon with Badge for Header
export function CartIcon() {
  const { toggleCart, getTotalItems } = useCartStore();
  const itemCount = getTotalItems();

  return (
    <motion.button
      onClick={toggleCart}
      className="relative p-2 hover:bg-muted rounded-full transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open cart"
    >
      <ShoppingBag className="w-5 h-5" />
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

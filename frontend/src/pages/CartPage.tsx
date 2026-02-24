import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUIStore, useCartStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { cn } from '@/lib/utils';

export function CartPage() {
  const navigate = useNavigate();
  const { mode } = useUIStore();
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  const { t, isHindi } = useLanguage();

  const isBhakti = mode === 'bhakti';
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className={cn('min-h-screen pt-32', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
          <p className="text-muted-foreground mb-6">{t('cart.emptyMessage')}</p>
          <DiyaButton onClick={() => navigate('/products')}>
            {t('cart.continueShopping')}
          </DiyaButton>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-muted-foreground hover:text-saffron mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('cart.continueShopping')}
        </motion.button>

        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex gap-4 p-4 rounded-xl',
                  isBhakti ? 'bg-card shadow-sm' : 'bg-steel border border-copper/30'
                )}
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={isHindi ? item.nameHi : item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{item.category}</p>
                  <h3 className="font-medium truncate">{isHindi ? item.nameHi : item.name}</h3>
                  <p className="text-saffron font-semibold mt-1">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-full',
                        isBhakti ? 'bg-muted hover:bg-saffron hover:text-white' : 'bg-steel-dark hover:bg-copper'
                      )}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-full',
                        isBhakti ? 'bg-muted hover:bg-saffron hover:text-white' : 'bg-steel-dark hover:bg-copper'
                      )}
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
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              {t('cart.clearCart')}
            </button>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              'p-6 rounded-2xl h-fit',
              isBhakti ? 'bg-card shadow-diya' : 'bg-steel border border-copper/30'
            )}
          >
            <h2 className="text-xl font-bold mb-6">{t('checkout.orderSummary')}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.subtotal')} ({totalItems} {isHindi ? 'आइटम' : 'items'})</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span className={shipping === 0 ? 'text-green-500' : ''}>
                  {shipping === 0 ? t('cart.free') : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="text-saffron">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <DiyaButton
              size="lg"
              className="w-full mt-6"
              onClick={() => navigate('/checkout')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              {t('cart.checkout')}
            </DiyaButton>

            <p className="text-xs text-muted-foreground text-center mt-4">
              {isHindi ? 'शिपिंग और करों की गणना चेकआउट पर की जाएगी' : 'Shipping and taxes calculated at checkout'}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

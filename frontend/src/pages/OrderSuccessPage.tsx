import { motion } from 'framer-motion';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Check, Package, Truck, Home } from 'lucide-react';
import { useCartStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { useOrder } from '@/hooks/useApi';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { t, isHindi } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const orderNumber = location.state?.orderNumber || searchParams.get('order') || 'SKG' + Date.now().toString().slice(-8);

  /* 
   * Fetch order details to check payment status before clearing cart.
   * If payment failed, we want to keep items in cart.
   */
  const { data: order } = useOrder(orderNumber);

  useEffect(() => {
    if (order) {
      if (order.paymentStatus === 'completed' || order.paymentMethod === 'cod') {
        clearCart();
      } else if (order.paymentStatus === 'failed') {
        // Optional: Show payment failed toast? 
        // For now, just don't clear cart.
      }
    } else {
      // Fallback: if we can't fetch order (maybe mock number), we might clear cart?
      // But better safe than sorry. Wait for order.
      // If orderNumber is mock (starts with SKG...), useOrder might fail or return null.
      // In dev mode with mock number, clearCart won't happen.
      // Ideally we should clearCart if it's a mock number (demo mode).
      if (orderNumber.startsWith('SKG') && orderNumber.length > 10 && !order) {
        // It's likely the mock timestamp one if useOrder returned nothing
        // clearCart(); 
        // actually useOrder will try to fetch.
      }
    }
  }, [order, clearCart, orderNumber]);

  return (
    <div className="min-h-screen pt-32 bg-sacred-gradient">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl shadow-diya p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">
            {isHindi ? 'धन्यवाद!' : 'Thank You!'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isHindi
              ? 'आपका ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है।'
              : 'Your order has been successfully placed.'}
          </p>

          {/* Order Number */}
          <div className="bg-muted rounded-xl p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">
              {isHindi ? 'ऑर्डर नंबर' : 'Order Number'}
            </p>
            <p className="text-xl font-bold text-saffron font-mono">{orderNumber}</p>
          </div>

          {/* Tracking Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { icon: Check, labelEn: 'Ordered', labelHi: 'ऑर्डर किया' },
              { icon: Package, labelEn: 'Processing', labelHi: 'प्रोसेसिंग' },
              { icon: Truck, labelEn: 'Shipped', labelHi: 'शिप किया' },
              { icon: Home, labelEn: 'Delivered', labelHi: 'डिलीवर किया' },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-1',
                    index === 0 ? 'bg-saffron text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {isHindi ? step.labelHi : step.labelEn}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <DiyaButton onClick={() => navigate('/products')}>
              {t('cart.continueShopping')}
            </DiyaButton>
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 border-2 border-saffron text-saffron rounded-full font-medium hover:bg-saffron/10 transition-colors"
            >
              {isHindi ? 'मेरे ऑर्डर' : 'My Orders'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

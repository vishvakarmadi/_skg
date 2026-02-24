import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Loader2, Plus } from 'lucide-react';
import { useUIStore, useCartStore, useAuthStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';
import { cn } from '@/lib/utils';
import { useAddresses } from '@/hooks/useApi';
import { ordersApi, paymentApi } from '@/api';
import { toast } from 'sonner';

import { AddressFormDialog } from '@/components/ui-custom/AddressFormDialog';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { mode } = useUIStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { t, isHindi } = useLanguage();

  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);

  const isBhakti = mode === 'bhakti';
  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + shipping;

  // Fetch saved addresses from API
  const { data: addresses, loading: addressesLoading, refetch: refetchAddresses } = useAddresses();

  // Auto-select default address
  if (!selectedAddress && addresses && addresses.length > 0) {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    if (defaultAddr) {
      setSelectedAddress(defaultAddr.id);
    }
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error(isHindi ? 'कृपया एक पता चुनें' : 'Please select a shipping address');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        shipping_address_id: selectedAddress,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
        from_cart: false,
      };

      const response = await ordersApi.create(orderData);
      const order = response.data as any; // Type assertion for flexibility
      const orderId = order.id || order.data.id;
      const orderNumber = order.orderNumber || order.data.orderNumber;

      if (paymentMethod === 'cod') {
        clearCart();
        toast.success(isHindi ? 'ऑर्डर सफलतापूर्वक दिया गया!' : 'Order placed successfully!');
        navigate('/order-success', { state: { orderNumber } });
        return;
      }

      // Handle Cashfree Payment
      if (paymentMethod === 'cashfree') {
        try {
          // Initiate payment
          const paymentRes = await paymentApi.initiate(orderId);
          // Controller: public function initiate(Request $request, Order $order)
          // Route: /payment/initiate/{order}
          // Since it uses model binding, we should pass the ID.
          // However, if we pass ID in URL, we must ensure it's the UUID.

          // Handle potential snake_case to camelCase transformation by API client
          const payData = paymentRes.data?.data as any;
          const sessionId = payData?.paymentSessionId || payData?.payment_session_id;

          if (paymentRes.data?.success && sessionId) {
            const cashfree = new (window as any).Cashfree({
              mode: "sandbox" // Default to sandbox
            });

            await cashfree.checkout({
              paymentSessionId: sessionId,
              redirectTarget: "_self",
              returnUrl: `${window.location.origin}/order-success?order=${orderNumber}`
            });
            // The user will be redirected, so we don't need to do anything else here usually.
            // But if redirectTarget is _self, the page will reload/navigate.
          } else {
            throw new Error('Failed to initiate payment session');
          }
        } catch (paymentError: any) {
          console.error('Payment initiation failed', paymentError);
          toast.error('Payment initiation failed. Please try again or choose COD.');
          setIsProcessing(false);
          // We might want to "undo" the order or leave it as pending_payment.
          // Usually we leave it and allow user to retry payment from specific page.
          // For now, let's stop loading.
          return;
        }
      }

    } catch (error: any) {
      console.error('Order failed', error);
      const message = error.response?.data?.message || error.message || 'Failed to place order';
      toast.error(message);
      setIsProcessing(false); // Ensure loading stops on error
    }
    // Note: We don't verify final payment status here as redirect happens.
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-muted-foreground hover:text-saffron mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back')}
        </motion.button>

        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'p-6 rounded-2xl',
                isBhakti ? 'bg-card shadow-sm' : 'bg-steel border border-copper/30'
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-saffron" />
                <h2 className="text-lg font-semibold">{t('checkout.shippingAddress')}</h2>
              </div>

              {addressesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-saffron mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">{isHindi ? 'पते लोड हो रहे हैं...' : 'Loading addresses...'}</p>
                </div>
              ) : addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all',
                        selectedAddress === addr.id
                          ? 'border-saffron bg-saffron/5'
                          : 'border-transparent bg-muted'
                      )}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{addr.name}</span>
                          <span className="text-xs capitalize text-muted-foreground px-2 py-0.5 bg-muted rounded-full">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 bg-saffron/10 text-saffron text-xs rounded-full">
                              {isHindi ? 'डिफ़ॉल्ट' : 'Default'}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                        </p>
                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    {isHindi ? 'कोई सेव किया हुआ पता नहीं है' : 'No saved addresses found'}
                  </p>
                </div>
              )}

              <button
                onClick={() => setIsAddressFormOpen(true)}
                className="mt-4 text-saffron text-sm hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                {isHindi ? 'नया पता जोड़ें' : 'Add new address'}
              </button>
            </motion.div>

            {/* Address Form Dialog */}
            <AddressFormDialog
              open={isAddressFormOpen}
              onOpenChange={setIsAddressFormOpen}
              onSuccess={() => {
                refetchAddresses();
                setIsAddressFormOpen(false);
              }}
            />

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                'p-6 rounded-2xl',
                isBhakti ? 'bg-card shadow-sm' : 'bg-steel border border-copper/30'
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-saffron" />
                <h2 className="text-lg font-semibold">{t('checkout.paymentMethod')}</h2>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'cashfree', nameEn: 'Cashfree (Cards/UPI/Netbanking)', nameHi: 'Cashfree (कार्ड/यूपीआई/नेटबैंकिंग)' },
                  { id: 'cod', nameEn: 'Cash on Delivery', nameHi: 'कैश ऑन डिलीवरी' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all',
                      paymentMethod === method.id
                        ? 'border-saffron bg-saffron/5'
                        : 'border-transparent bg-muted'
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <span>{isHindi ? method.nameHi : method.nameEn}</span>
                  </label>
                ))}
              </div>
            </motion.div>
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

            {/* Items */}
            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{isHindi ? item.nameHi : item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.subtotal')}</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('cart.shipping')}</span>
                <span className={shipping === 0 ? 'text-green-500' : ''}>
                  {shipping === 0 ? t('cart.free') : `₹${shipping}`}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="text-saffron">₹{finalTotal}</span>
                </div>
              </div>
            </div>

            <DiyaButton
              size="lg"
              className="w-full mt-6"
              onClick={handlePlaceOrder}
              loading={isProcessing}
              disabled={!selectedAddress || isProcessing}
            >
              {t('checkout.placeOrder')}
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

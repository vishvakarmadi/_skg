import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, Check, X, ChevronRight, Search, Loader2, ShoppingBag } from 'lucide-react';
import { useUIStore, useAuthStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useOrders } from '@/hooks/useApi';
import { Link } from 'react-router-dom';
import { DiyaButton } from '@/components/ui-custom/DiyaButton';

const statusConfig: Record<string, { color: string; icon: any; labelEn: string; labelHi: string }> = {
  pending: { color: 'bg-yellow-100 text-yellow-700', icon: Package, labelEn: 'Pending', labelHi: 'लंबित' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: Check, labelEn: 'Confirmed', labelHi: 'पुष्टि' },
  processing: { color: 'bg-blue-100 text-blue-700', icon: Package, labelEn: 'Processing', labelHi: 'प्रोसेसिंग' },
  shipped: { color: 'bg-purple-100 text-purple-700', icon: Truck, labelEn: 'Shipped', labelHi: 'शिप किया' },
  out_for_delivery: { color: 'bg-indigo-100 text-indigo-700', icon: Truck, labelEn: 'Out for Delivery', labelHi: 'डिलीवरी के लिए' },
  delivered: { color: 'bg-green-100 text-green-700', icon: Check, labelEn: 'Delivered', labelHi: 'डिलीवर किया' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: X, labelEn: 'Cancelled', labelHi: 'रद्द किया' },
  returned: { color: 'bg-orange-100 text-orange-700', icon: X, labelEn: 'Returned', labelHi: 'वापस किया' },
};

export function OrdersPage() {
  const { mode } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { isHindi } = useLanguage();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isBhakti = mode === 'bhakti';

  // Fetch orders from API
  const { data: orders, loading, error } = useOrders();

  // If not authenticated, prompt login
  if (!isAuthenticated) {
    return (
      <div className={cn('min-h-screen pt-32', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{isHindi ? 'कृपया लॉग इन करें' : 'Please Sign In'}</h2>
          <p className="text-muted-foreground mb-6">
            {isHindi ? 'अपने ऑर्डर देखने के लिए लॉग इन करें' : 'Sign in to view your orders'}
          </p>
          <Link to="/login">
            <DiyaButton>{isHindi ? 'लॉग इन करें' : 'Sign In'}</DiyaButton>
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className={cn('min-h-screen pt-32 flex items-center justify-center', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-saffron mx-auto" />
          <p className="text-muted-foreground">{isHindi ? 'ऑर्डर लोड हो रहे हैं...' : 'Loading orders...'}</p>
        </div>
      </div>
    );
  }

  const ordersList = orders || [];

  const filteredOrders = ordersList.filter((order) => {
    const orderNum = order.orderNumber || '';
    const matchesSearch = orderNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.items || []).some((item) =>
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{isHindi ? 'मेरे ऑर्डर' : 'My Orders'}</h1>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'ऑर्डर खोजें...' : 'Search orders...'}
            className={cn(
              'w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all',
              'border focus:ring-2 focus:ring-saffron/50',
              isBhakti ? 'bg-card border-border' : 'bg-steel border-copper/30 text-white'
            )}
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!error && ordersList.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{isHindi ? 'कोई ऑर्डर नहीं' : 'No Orders Yet'}</h2>
            <p className="text-muted-foreground mb-6">
              {isHindi ? 'आपने अभी तक कोई ऑर्डर नहीं दिया है' : "You haven't placed any orders yet"}
            </p>
            <Link to="/products">
              <DiyaButton>{isHindi ? 'खरीदारी शुरू करें' : 'Start Shopping'}</DiyaButton>
            </Link>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const statusKey = order.status || 'pending';
            const status = statusConfig[statusKey] || statusConfig.pending;
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.orderNumber;

            return (
              <motion.div
                key={order.orderNumber || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  'rounded-2xl overflow-hidden',
                  isBhakti ? 'bg-card shadow-sm' : 'bg-steel border border-copper/30'
                )}
              >
                {/* Order Header */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : (order.orderNumber || ''))}
                  className="w-full p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn('p-2 rounded-full', status.color)}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn('px-3 py-1 rounded-full text-sm', status.color)}>
                      {isHindi ? status.labelHi : status.labelEn}
                    </span>
                    <span className="font-semibold">₹{order.total}</span>
                    <ChevronRight
                      className={cn('w-5 h-5 text-muted-foreground transition-transform', isExpanded && 'rotate-90')}
                    />
                  </div>
                </button>

                {/* Order Details */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border p-4"
                  >
                    <div className="space-y-3">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{isHindi ? item.nameHi : item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {isHindi ? 'मात्रा' : 'Qty'}: {item.quantity}
                            </p>
                          </div>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-1">
                          {isHindi ? 'ट्रैकिंग नंबर' : 'Tracking Number'}
                        </p>
                        <p className="font-mono">{order.trackingNumber}</p>
                        {order.trackingUrl && (
                          <a
                            href={order.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-saffron text-sm hover:underline mt-1 inline-block"
                          >
                            {isHindi ? 'ट्रैक करें →' : 'Track Package →'}
                          </a>
                        )}
                      </div>
                    )}

                    {/* Payment Info */}
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{isHindi ? 'भुगतान:' : 'Payment:'}</span>
                        <p className="font-medium capitalize">{order.paymentMethod || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{isHindi ? 'भुगतान स्थिति:' : 'Payment Status:'}</span>
                        <p className="font-medium capitalize">{order.paymentStatus || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button className="flex-1 py-2 bg-saffron text-white rounded-full text-sm font-medium hover:bg-saffron-dark transition-colors">
                        {isHindi ? 'ऑर्डर देखें' : 'View Order'}
                      </button>
                      {order.status === 'delivered' && (
                        <button className="flex-1 py-2 border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors">
                          {isHindi ? 'दोबारा ऑर्डर' : 'Reorder'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {filteredOrders.length === 0 && ordersList.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{isHindi ? 'कोई ऑर्डर नहीं मिला' : 'No orders found'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

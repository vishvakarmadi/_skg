import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { CartDrawer } from '@/components/ui-custom/CartDrawer';
import { WishlistDrawer } from '@/components/ui-custom/WishlistDrawer';
import { SearchModal } from '@/components/ui-custom/SearchModal';
import { Toaster } from '@/components/ui/sonner';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AdminRoute } from '@/components/AdminRoute';

// Pages
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { MachineryPage } from '@/pages/MachineryPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderSuccessPage } from '@/pages/OrderSuccessPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminProductForm } from '@/pages/admin/AdminProductForm';
import { AdminOrders } from '@/pages/admin/AdminOrders';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminBanners } from '@/pages/admin/AdminBanners';
import { AdminBannerForm } from '@/pages/admin/AdminBannerForm';
import { AdminCategories } from '@/pages/admin/AdminCategories';
import { AdminCategoryForm } from '@/pages/admin/AdminCategoryForm';
import { AdminContacts } from '@/pages/admin/AdminContacts';
import { AdminBlogs } from '@/pages/admin/AdminBlogs';
import { AdminBlogForm } from '@/pages/admin/AdminBlogForm';
import { AdminMachinery } from '@/pages/admin/AdminMachinery';

// Story Pages
import { StoriesPage } from '@/pages/StoriesPage';
import { StoryDetailPage } from '@/pages/StoryDetailPage';

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Public Layout
function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/products" element={<PageTransition><ProductsPage /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
            <Route path="/categories" element={<PageTransition><CategoriesPage /></PageTransition>} />
            <Route path="/category/:slug" element={<PageTransition><ProductsPage /></PageTransition>} />
            <Route path="/machinery" element={<PageTransition><MachineryPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/stories" element={<PageTransition><StoriesPage /></PageTransition>} />
            <Route path="/stories/:slug" element={<PageTransition><StoryDetailPage /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
            <Route path="/order-success" element={<PageTransition><OrderSuccessPage /></PageTransition>} />
            <Route path="/orders" element={<PageTransition><OrdersPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/account" element={<PageTransition><AccountPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="categories/new" element={<AdminCategoryForm />} />
              <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="banners/new" element={<AdminBannerForm />} />
              <Route path="banners/:id/edit" element={<AdminBannerForm />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/new" element={<AdminBlogForm />} />
              <Route path="blogs/:id/edit" element={<AdminBlogForm />} />
              <Route path="machinery" element={<AdminMachinery />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Route>

          {/* Public Routes */}
          <Route path="/*" element={<PublicLayout />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;

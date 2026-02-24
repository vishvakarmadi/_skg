import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, User, ShoppingBag, Heart, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUIStore, useCartStore, useWishlistStore } from '@/store';
import { ModeToggle } from './ModeToggle';
import { cn, getImageUrl } from '@/lib/utils';
import { useCategories } from '@/hooks/useApi';
// Navigation links
const navLinks = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.products', href: '/products' },
  { key: 'nav.categories', href: '/categories' },
  { key: 'nav.machinery', href: '/machinery' },
  { key: 'nav.stories', href: '/stories' },
  { key: 'nav.about', href: '/about' },
  { key: 'nav.contact', href: '/contact' },
];

// Fallback categories for initial load
const defaultCategories = [
  { name: 'Ghee Batti', nameHi: 'गी बत्ती', icon: '🔥', href: '/category/ghee-batti', image: null },
  { name: 'Diya', nameHi: 'दीया', icon: '🪔', href: '/category/diya', image: null },
  { name: 'Agarbatti', nameHi: 'अगरबत्ती', icon: '🌸', href: '/category/agarbatti', image: null },
  { name: 'Puja Thali', nameHi: 'पूजा थाली', icon: '🙏', href: '/category/puja-thali', image: null },
  { name: 'Idols', nameHi: 'मूर्ति', icon: '🕉️', href: '/category/idols', image: null },
  { name: 'Rudraksha', nameHi: 'रुद्राक्ष', icon: '📿', href: '/category/rudraksha', image: null },
];

// Language Selector Component (Creative Toggle)
function LanguageSelector() {
  const { isHindi, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative h-9 w-20 bg-muted/50 rounded-full p-1 cursor-pointer overflow-hidden border border-border/50 hover:border-saffron/50 transition-all group"
      aria-label="Toggle Language"
    >
      {/* Sliding Background */}
      <div
        className={cn(
          "absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-spring bg-white shadow-sm z-10",
          isHindi ? "left-[calc(50%+2px)] bg-gradient-to-r from-saffron to-gold" : "left-1 bg-white"
        )}
      />

      {/* Text Labels */}
      <div className="relative z-20 flex w-full h-full items-center justify-between px-2 text-[10px] font-bold">
        <span className={cn(
          "transition-colors duration-300",
          !isHindi ? "text-foreground" : "text-muted-foreground"
        )}>
          EN
        </span>
        <span className={cn(
          "transition-colors duration-300 devanagari",
          isHindi ? "text-white" : "text-muted-foreground"
        )}>
          हिं
        </span>
      </div>
    </button>
  );
}

export function Navbar() {
  const { t, isHindi } = useLanguage();
  const { mode, toggleMobileMenu, isMobileMenuOpen, toggleSearch } = useUIStore();
  const { getTotalItems: getCartItems } = useCartStore();
  const { getTotalItems: getWishlistItems, toggleWishlistOpen } = useWishlistStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const location = useLocation();
  const isBhakti = mode === 'bhakti';

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
      toggleMobileMenu();
    }
  }, [location.pathname]);

  const cartCount = getCartItems();
  const wishlistCount = getWishlistItems();

  // Fetch categories
  const { data: apiCategories } = useCategories();

  const displayCategories = apiCategories && apiCategories.length > 0
    ? apiCategories.filter((c: any) => !c.parentId).slice(0, 8).map((c: any) => ({
      name: c.name,
      nameHi: c.nameHi || c.name,
      icon: c.icon || '🪔', // Default icon if missing
      image: c.image,
      href: `/category/${c.slug}`
    }))
    : defaultCategories;

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Top Bar */}
        {/* <div className={cn(
          'hidden lg:block transition-all duration-300 border-b border-border/50',
          isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-8 opacity-100'
        )}>
          <div className="container mx-auto px-4 h-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>+91 8800580015</span>
              <span className={isHindi ? 'devanagari' : ''}>
                {isHindi ? 'शुद्धता का प्रतीक - SKG ENTERPRISE' : 'Symbol of Purity - SKG ENTERPRISE'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-saffron font-medium">
                {isHindi ? 'दीवाली ऑफर चल रहा है!' : 'Diwali Offer Running!'}
              </span>
            </div>
          </div>
        </div> */}

        {/* Main Navbar */}
        <nav className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}

            {/* <Link to="/" className="flex items-center gap-3">
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center p-0.5 overflow-hidden',
                  isBhakti
                    ? 'bg-gradient-to-br from-saffron to-gold shadow-lg shadow-saffron/20'
                    : 'bg-gradient-to-br from-steel to-copper shadow-lg shadow-copper/20'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img 
                  src="/assets/skglogo.jpeg" 
                  alt="SKG Enterprise" 
                  className="w-full h-full object-cover rounded-full bg-white"
                />
              </motion.div>
              
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl leading-tight font-sacred tracking-wide">
                  SKG
                </h1>
                <h1 className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase font-medium">
                  ENTERPRISE
                </h1>
              </div>
            </Link> */}

            {/* Brand Logo Integration */}
            <Link to="/" className="flex items-center group">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {/* We set a specific height and auto width to maintain aspect ratio.
      h-12 is roughly 48px, h-16 is roughly 64px.
    */}
                <img
                  src="/assets/skglogo.png"
                  alt="SKG ENTERPRISE"
                  className={cn(
                    "h-12 md:h-14 w-auto object-contain transition-all duration-500",
                    /* Subtly brightening the logo in Steel mode to pop against dark backgrounds */
                    !isBhakti && "brightness-110 contrast-110"
                  )}
                  style={{
                    /* Explicitly setting dimensions if Tailwind classes aren't enough */
                    height: '56px',
                    width: 'auto'
                  }}
                />

                {/* Subtle Glow Effect on Hover (Bhakti Mode) */}
                {isBhakti && (
                  <div className="absolute inset-0 bg-saffron/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.key === 'nav.categories' && setIsCategoryOpen(true)}
                  onMouseLeave={() => link.key === 'nav.categories' && setIsCategoryOpen(false)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-full transition-colors flex items-center gap-1',
                      location.pathname === link.href
                        ? 'text-saffron bg-saffron/10'
                        : 'text-foreground hover:text-saffron hover:bg-muted'
                    )}
                  >
                    <span className={isHindi ? 'devanagari' : ''}>{t(link.key)}</span>
                    {link.key === 'nav.categories' && (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Link>

                  {/* Categories Dropdown */}
                  {link.key === 'nav.categories' && (
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-card rounded-xl shadow-xl border border-border overflow-hidden z-50"
                        >
                          <div className="p-2">
                            {displayCategories.map((cat) => (
                              <Link
                                key={cat.href}
                                to={cat.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                              >
                                <span className="text-lg">
                                  {cat.image ? (
                                    <img
                                      src={getImageUrl(cat.image)}
                                      alt={cat.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  ) : cat.icon && (cat.icon.includes('/') || cat.icon.includes('.')) ? (
                                    <img
                                      src={getImageUrl(cat.icon)}
                                      alt={cat.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  ) : (
                                    cat.icon
                                  )}
                                </span>
                                <div>
                                  <p className={`font-medium text-sm ${isHindi ? 'devanagari' : ''}`}>
                                    {isHindi ? cat.nameHi : cat.name}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Mode Toggle */}
             

              {/* Wishlist */}
              <button
                onClick={toggleWishlistOpen}
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-saffron text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                to="/account"
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={toggleMobileMenu} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 max-w-[80vw] bg-card shadow-xl overflow-y-auto"
            >
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    isBhakti
                      ? 'bg-gradient-to-br from-saffron to-gold'
                      : 'bg-gradient-to-br from-steel to-copper'
                  )}>
                    <span className="text-white font-bold text-lg font-sacred">S</span>
                  </div>
                  <div>
                    <h1 className="font-bold text-lg leading-tight font-sacred">SKG</h1>
                    <p className="text-[10px] text-muted-foreground">ENTERPRISE</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <LanguageSelector />
                  <ModeToggle />
                </div>
              </div>

              {/* Mobile Menu Links */}
              <div className="p-4 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl transition-colors',
                        location.pathname === link.href
                          ? 'bg-saffron/10 text-saffron'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span className={`font-medium ${isHindi ? 'devanagari' : ''}`}>
                        {t(link.key)}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Categories Section */}
              <div className="p-4 border-t border-border">
                <h3 className={`text-sm font-medium text-muted-foreground mb-3 ${isHindi ? 'devanagari' : ''}`}>
                  {isHindi ? 'श्रेणियां' : 'Categories'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {displayCategories.map((cat) => (
                    <Link
                      key={cat.href}
                      to={cat.href}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted hover:bg-saffron/10 transition-colors"
                    >
                      <span className="flex items-center justify-center w-6 h-6">
                        {cat.image ? (
                          <img
                            src={getImageUrl(cat.image)}
                            alt={cat.name}
                            className="w-5 h-5 object-contain"
                          />
                        ) : cat.icon && (cat.icon.includes('/') || cat.icon.includes('.')) ? (
                          <img
                            src={getImageUrl(cat.icon)}
                            alt={cat.name}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          cat.icon
                        )}
                      </span>
                      <span className={`text-sm ${isHindi ? 'devanagari' : ''}`}>
                        {isHindi ? cat.nameHi : cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>+91 8800580015</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isHindi: boolean;
  isLoaded: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.machinery': 'Machinery',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.stories': 'Stories',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.account': 'Account',
    'nav.orders': 'My Orders',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',

    // Hero
    'hero.tagline': 'Symbol of Purity',
    'hero.title': 'One Lamp Lights All',
    'hero.subtitle': 'Established by Pawan Hridya Nahu, SKG ENTERPRISE provides you with pure puja materials and temple construction machinery.',
    'hero.cta.shop': 'Start Shopping',
    'hero.cta.video': 'Watch Video',
    'hero.stats.customers': 'Happy Customers',
    'hero.stats.products': 'Products',
    'hero.stats.experience': 'Years Experience',

    // Categories
    'categories.title': 'Our Puja Samagri',
    'categories.subtitle': 'Categories',
    'categories.description': 'All types of pure worship materials under one roof',
    'categories.viewProducts': 'View Products',
    'categories.hover': 'Hover on category for more info',
    'categories.stats.products': 'Products',
    'categories.stats.categories': 'Categories',
    'categories.stats.pure': 'Pure',

    // Products
    'products.latest': 'New Arrivals',
    'products.bestsellers': 'Bestsellers',
    'products.featured': 'Featured',
    'products.viewAll': 'View All',
    'products.addToCart': 'Add to Cart',
    'products.added': 'Added',
    'products.new': 'New',
    'products.pure': 'Pure',
    'products.bestseller': 'Bestseller',
    'products.machinery': 'Machinery',
    'products.socialProof': 'families bought this month',
    'products.thankYou': 'Thank you for trusting our products',

    // Product Detail
    'product.inStock': 'In Stock',
    'product.outOfStock': 'Out of Stock',
    'product.lowStock': 'Low Stock',
    'product.quantity': 'Quantity',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.reviews': 'Reviews',
    'product.relatedProducts': 'Related Products',
    'product.buyNow': 'Buy Now',
    'product.addToWishlist': 'Add to Wishlist',
    'product.share': 'Share',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.emptyMessage': 'Continue shopping to add puja items',
    'cart.continueShopping': 'Continue Shopping',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.clear': 'Clear Cart',
    'cart.remove': 'Remove',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.billingAddress': 'Billing Address',
    'checkout.sameAsShipping': 'Same as shipping address',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.cashfree': 'Cashfree (Cards/UPI/Netbanking)',
    'checkout.cod': 'Cash on Delivery',
    'checkout.placeOrder': 'Place Order',
    'checkout.processing': 'Processing...',
    'checkout.orderSummary': 'Order Summary',
    'checkout.items': 'items',

    // Order
    'order.success.title': 'Order Placed Successfully!',
    'order.success.message': 'Thank you for your order. We will process it soon.',
    'order.success.orderNumber': 'Order Number',
    'order.success.continueShopping': 'Continue Shopping',
    'order.success.viewOrders': 'View Orders',
    'order.track': 'Track Order',
    'order.cancel': 'Cancel Order',
    'order.status.pending': 'Pending',
    'order.status.confirmed': 'Confirmed',
    'order.status.processing': 'Processing',
    'order.status.shipped': 'Shipped',
    'order.status.delivered': 'Delivered',
    'order.status.cancelled': 'Cancelled',

    // Machinery
    'machinery.title': 'Temple Construction Machinery',
    'machinery.subtitle': 'Machinery Power',
    'machinery.description': 'Boost your production with SKG ENTERPRISE\'s advanced machinery. Our machines are designed for large-scale production of diyas, agarbatti, and other puja items.',
    'machinery.viewMode': 'View Machinery Mode',
    'machinery.getQuote': 'Get Quote',
    'machinery.capacity': 'Production Capacity',
    'machinery.stats.turnover': 'Turnover',
    'machinery.stats.units': 'Units/Day',
    'machinery.stats.clients': 'Clients',

    // About
    'about.title': 'About Us',
    'about.subtitle': 'Our Story',
    'about.story': 'Founded by Pawan Hridya Nahu, SKG ENTERPRISE has been serving devotees with pure puja materials for over 25 years.',
    'about.mission': 'Our Mission',
    'about.missionText': 'To provide the purest puja materials to every devotee, maintaining the sanctity of our traditions.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To become India\'s most trusted brand for worship products and temple construction machinery.',
    'about.values': 'Our Values',
    'about.founder': 'Founder',
    'about.founderName': 'Pawan Hridya Nahu',
    'about.founderQuote': 'I have personally verified the purity of each product. These items will make your devotion even more sacred.',

    // Contact
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Contact',
    'contact.description': 'Get in touch with us for any queries or assistance',
    'contact.formTitle': 'Send Message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.form.selectSubject': 'Select Subject',
    'contact.form.general': 'General Inquiry',
    'contact.form.order': 'Order Related',
    'contact.form.bulk': 'Bulk Purchase',
    'contact.form.partnership': 'Partnership',
    'contact.success.title': 'Thank You!',
    'contact.success.message': 'Your message has been sent. We will contact you soon.',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.hours': 'Working Hours',

    // Auth
    'auth.login.title': 'Login',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.forgot': 'Forgot Password?',
    'auth.login.submit': 'Login',
    'auth.login.noAccount': 'Don\'t have an account?',
    'auth.login.register': 'Register',
    'auth.register.title': 'Register',
    'auth.register.name': 'Full Name',
    'auth.register.phone': 'Phone Number',
    'auth.register.password': 'Password',
    'auth.register.confirmPassword': 'Confirm Password',
    'auth.register.submit': 'Register',
    'auth.register.hasAccount': 'Already have an account?',
    'auth.register.login': 'Login',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.retry': 'Retry',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.price': 'Price',
    'common.category': 'Category',
    'common.rating': 'Rating',
    'common.reviews': 'Reviews',
    'common.inStock': 'In Stock',
    'common.outOfStock': 'Out of Stock',
    'common.readMore': 'Read More',
    'common.showLess': 'Show Less',
    'common.language': 'Language',
    'common.english': 'English',
    'common.hindi': 'Hindi',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.products': 'उत्पाद',
    'nav.categories': 'श्रेणियां',
    'nav.machinery': 'यंत्र',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.stories': 'कहानियां',
    'nav.cart': 'पात्र',
    'nav.wishlist': 'पूजा सूची',
    'nav.account': 'खाता',
    'nav.orders': 'मेरे ऑर्डर',
    'nav.logout': 'लॉगआउट',
    'nav.login': 'लॉगिन',
    'nav.register': 'रजिस्टर',

    // Hero
    'hero.tagline': 'शुद्धता का प्रतीक',
    'hero.title': 'सर्व देव नमस्कारं केशवम प्रतिगच्छति',
    'hero.subtitle': 'पवन हृदय नाहु द्वारा स्थापित, SKG ENTERPRISE आपको शुद्ध पूजा सामग्री और मंदिर निर्माण यंत्र प्रदान करता है।',
    'hero.cta.shop': 'खरीदारी शुरू करें',
    'hero.cta.video': 'वीडियो देखें',
    'hero.stats.customers': 'खुश ग्राहक',
    'hero.stats.products': 'उत्पाद',
    'hero.stats.experience': 'वर्षों का अनुभव',

    // Categories
    'categories.title': 'हमारी पूजा सामग्री',
    'categories.subtitle': 'श्रेणियां',
    'categories.description': 'सभी प्रकार की शुद्ध पूजा सामग्री एक ही छत के नीचे',
    'categories.viewProducts': 'उत्पाद देखें',
    'categories.hover': 'अधिक जानकारी के लिए श्रेणी पर hovering करें',
    'categories.stats.products': 'उत्पाद',
    'categories.stats.categories': 'श्रेणियां',
    'categories.stats.pure': 'शुद्ध',

    // Products
    'products.latest': 'नवीनतम',
    'products.bestsellers': 'बेस्टसेलर',
    'products.featured': 'विशेष',
    'products.viewAll': 'सभी देखें',
    'products.addToCart': 'पात्र में डालें',
    'products.added': 'जोड़ा गया',
    'products.new': 'नया',
    'products.pure': 'शुद्ध',
    'products.bestseller': 'बेस्टसेलर',
    'products.machinery': 'यंत्र',
    'products.socialProof': 'परिवारों ने इस महीने खरीदा',
    'products.thankYou': 'हमारे उत्पादों पर भरोसा करने के लिए धन्यवाद',

    // Product Detail
    'product.inStock': 'स्टॉक में',
    'product.outOfStock': 'स्टॉक में नहीं',
    'product.lowStock': 'कम स्टॉक',
    'product.quantity': 'मात्रा',
    'product.description': 'विवरण',
    'product.specifications': 'विशेषताएं',
    'product.reviews': 'समीक्षाएं',
    'product.relatedProducts': 'संबंधित उत्पाद',
    'product.buyNow': 'अभी खरीदें',
    'product.addToWishlist': 'पूजा सूची में डालें',
    'product.share': 'शेयर करें',

    // Cart
    'cart.title': 'सेवा पात्र',
    'cart.empty': 'पात्र खाली है',
    'cart.emptyMessage': 'पूजा सामग्री जोड़ने के लिए खरीदारी जारी रखें',
    'cart.continueShopping': 'खरीदारी जारी रखें',
    'cart.subtotal': 'उप-योग',
    'cart.shipping': 'शिपिंग',
    'cart.free': 'मुफ्त',
    'cart.total': 'कुल योग',
    'cart.checkout': 'चेकआउट करें',
    'cart.clear': 'पात्र खाली करें',
    'cart.remove': 'हटाएं',

    // Checkout
    'checkout.title': 'चेकआउट',
    'checkout.shippingAddress': 'शिपिंग पता',
    'checkout.billingAddress': 'बिलिंग पता',
    'checkout.sameAsShipping': 'शिपिंग पते के समान',
    'checkout.paymentMethod': 'भुगतान का तरीका',
    'checkout.cashfree': 'कैशफ्री (कार्ड/यूपीआई/नेटबैंकिंग)',
    'checkout.cod': 'कैश ऑन डिलीवरी',
    'checkout.placeOrder': 'ऑर्डर दें',
    'checkout.processing': 'प्रोसेसिंग...',
    'checkout.orderSummary': 'ऑर्डर सारांश',
    'checkout.items': 'वस्तुएं',

    // Order
    'order.success.title': 'ऑर्डर सफलतापूर्वक दिया गया!',
    'order.success.message': 'आपके ऑर्डर के लिए धन्यवाद। हम इसे जल्द ही प्रोसेस करेंगे।',
    'order.success.orderNumber': 'ऑर्डर नंबर',
    'order.success.continueShopping': 'खरीदारी जारी रखें',
    'order.success.viewOrders': 'ऑर्डर देखें',
    'order.track': 'ऑर्डर ट्रैक करें',
    'order.cancel': 'ऑर्डर रद्द करें',
    'order.status.pending': 'लंबित',
    'order.status.confirmed': 'पुष्टि हुई',
    'order.status.processing': 'प्रोसेसिंग',
    'order.status.shipped': 'भेज दिया गया',
    'order.status.delivered': 'डिलीवर हो गया',
    'order.status.cancelled': 'रद्द कर दिया गया',

    // Machinery
    'machinery.title': 'मंदिर निर्माण यंत्र',
    'machinery.subtitle': 'यंत्र शक्ति',
    'machinery.description': 'SKG ENTERPRISE के उन्नत यंत्रों के साथ अपने उत्पादन को बढ़ाएं। हमारी मशीनें दीया, अगरबत्ती, और अन्य पूजा सामग्री के बड़े पैमाने पर उत्पादन के लिए डिज़ाइन की गई हैं।',
    'machinery.viewMode': 'यंत्र मोड देखें',
    'machinery.getQuote': 'उद्धरण प्राप्त करें',
    'machinery.capacity': 'उत्पादन क्षमता',
    'machinery.stats.turnover': 'टर्नओवर',
    'machinery.stats.units': 'यूनिट/दिन',
    'machinery.stats.clients': 'ग्राहक',

    // About
    'about.title': 'हमारे बारे में',
    'about.subtitle': 'हमारी कहानी',
    'about.story': 'पवन हृदय नाहु द्वारा स्थापित, SKG ENTERPRISE 25 वर्षों से शुद्ध पूजा सामग्री प्रदान कर रहा है।',
    'about.mission': 'हमारा मिशन',
    'about.missionText': 'प्रत्येक भक्त को शुद्धतम पूजा सामग्री प्रदान करना, हमारी परंपराओं की पवित्रता बनाए रखते हुए।',
    'about.vision': 'हमारा दृष्टिकोण',
    'about.visionText': 'पूजा उत्पादों और मंदिर निर्माण यंत्र के लिए भारत का सबसे विश्वसनीय ब्रांड बनना।',
    'about.values': 'हमारे मूल्य',
    'about.founder': 'संस्थापक',
    'about.founderName': 'पवन हृदय नाहु',
    'about.founderQuote': 'मैंने व्यक्तिगत रूप से प्रत्येक उत्पाद की शुद्धता की जांच की है। ये वस्तुएं आपकी भक्ति को और भी पवित्र बनाएंगी।',

    // Contact
    'contact.title': 'हमसे संपर्क करें',
    'contact.subtitle': 'संपर्क करें',
    'contact.description': 'किसी भी प्रश्न या सहायता के लिए हमसे संपर्क करें',
    'contact.formTitle': 'संदेश भेजें',
    'contact.form.name': 'नाम',
    'contact.form.email': 'ईमेल',
    'contact.form.phone': 'फोन',
    'contact.form.subject': 'विषय',
    'contact.form.message': 'संदेश',
    'contact.form.submit': 'संदेश भेजें',
    'contact.form.selectSubject': 'विषय चुनें',
    'contact.form.general': 'सामान्य पूछताछ',
    'contact.form.order': 'ऑर्डर संबंधी',
    'contact.form.bulk': 'थोक खरीद',
    'contact.form.partnership': 'साझेदारी',
    'contact.success.title': 'धन्यवाद!',
    'contact.success.message': 'आपका संदेश भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।',
    'contact.address': 'पता',
    'contact.phone': 'फोन',
    'contact.email': 'ईमेल',
    'contact.hours': 'कार्य समय',

    // Auth
    'auth.login.title': 'लॉगिन',
    'auth.login.email': 'ईमेल',
    'auth.login.password': 'पासवर्ड',
    'auth.login.forgot': 'पासवर्ड भूल गए?',
    'auth.login.submit': 'लॉगिन',
    'auth.login.noAccount': 'खाता नहीं है?',
    'auth.login.register': 'रजिस्टर करें',
    'auth.register.title': 'रजिस्टर',
    'auth.register.name': 'पूरा नाम',
    'auth.register.phone': 'फोन नंबर',
    'auth.register.password': 'पासवर्ड',
    'auth.register.confirmPassword': 'पासवर्ड की पुष्टि',
    'auth.register.submit': 'रजिस्टर',
    'auth.register.hasAccount': 'पहले से खाता है?',
    'auth.register.login': 'लॉगिन करें',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.retry': 'पुनः प्रयास करें',
    'common.save': 'सहेजें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.search': 'खोजें',
    'common.filter': 'फ़िल्टर',
    'common.sort': 'क्रमबद्ध करें',
    'common.price': 'कीमत',
    'common.category': 'श्रेणी',
    'common.rating': 'रेटिंग',
    'common.reviews': 'समीक्षाएं',
    'common.inStock': 'स्टॉक में',
    'common.outOfStock': 'स्टॉक में नहीं',
    'common.readMore': 'और पढ़ें',
    'common.showLess': 'कम दिखाएं',
    'common.language': 'भाषा',
    'common.english': 'English',
    'common.hindi': 'हिंदी',
  },
};

// Detect language from browser or localStorage
function detectLanguage(): Language {
  // Check localStorage first
  const savedLang = localStorage.getItem('skg-language') as Language;
  if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
    return savedLang;
  }

  // Detect from browser
  const browserLang = navigator.language || (navigator as any).userLanguage;
  if (browserLang) {
    const lang = browserLang.toLowerCase().split('-')[0];
    if (lang === 'hi') return 'hi';
  }

  return 'en';
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const detected = detectLanguage();
    setLanguageState(detected);
    document.documentElement.lang = detected;
    setIsLoaded(true);
  }, []);

  // Set language and persist
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('skg-language', lang);
    document.documentElement.lang = lang;
  }, []);

  // Toggle between languages
  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
  }, [language, setLanguage]);

  // Translation function
  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isHindi: language === 'hi',
    isLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

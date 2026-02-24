// ============================================
// SKG ENTERPRISE - Internationalization
// Hindi / English Language Support
// ============================================

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: string | Translations;
}

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      machinery: 'Machinery',
      about: 'About Us',
      contact: 'Contact',
      search: 'Search',
      cart: 'Cart',
      wishlist: 'Wishlist',
      account: 'Account',
    },
    // Hero
    hero: {
      tagline: 'Symbol of Purity',
      title: 'One Lamp Lights All',
      subtitle: 'Established by Pawan Hridya Nahu, SKG ENTERPRISE provides pure worship materials and temple construction machinery.',
      cta: 'Start Shopping',
      watchVideo: 'Watch Video',
      stats: {
        customers: 'Happy Customers',
        products: 'Products',
        experience: 'Years of Experience',
      },
    },
    // Products
    products: {
      latest: 'Latest Products',
      bestsellers: 'Bestsellers',
      featured: 'Featured Selection',
      machinery: 'Temple Construction Machinery',
      viewAll: 'View All',
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      purityCertified: 'Pure',
      new: 'New',
      bestseller: 'Bestseller',
      price: 'Price',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      description: 'Description',
      specifications: 'Specifications',
      reviews: 'Reviews',
      relatedProducts: 'Related Products',
    },
    // Categories
    categories: {
      title: 'Our Categories',
      subtitle: 'Categories',
      description: 'All types of pure worship materials under one roof',
      viewProducts: 'View Products',
      gheeBatti: 'Ghee Batti',
      diya: 'Diya',
      agarbatti: 'Agarbatti',
      pujaThali: 'Puja Thali',
      idols: 'Idols',
      rudraksha: 'Rudraksha',
      machinery: 'Machinery',
      stats: {
        products: 'Products',
        categories: 'Categories',
        pure: 'Pure',
      },
    },
    // Cart
    cart: {
      title: 'Seva Patra',
      empty: 'Your cart is empty',
      emptyMessage: 'Continue shopping to add puja items',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      checkout: 'Checkout',
      clearCart: 'Clear Cart',
      continueShopping: 'Continue Shopping',
    },
    // Wishlist
    wishlist: {
      title: 'Puja List',
      empty: 'Your wishlist is empty',
      emptyMessage: 'Save your favorite items',
      moveToCart: 'Move to Cart',
    },
    // Checkout
    checkout: {
      title: 'Checkout',
      shippingAddress: 'Shipping Address',
      billingAddress: 'Billing Address',
      sameAsShipping: 'Same as shipping address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      processing: 'Processing...',
    },
    // Contact
    contact: {
      title: 'Contact Us',
      subtitle: 'Contact',
      description: 'Get in touch with us for any queries or assistance',
      formTitle: 'Send Message',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      success: 'Thank you! Your message has been sent.',
      address: 'Address',
      workingHours: 'Working Hours',
      form: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        submit: 'Send Message',
      },
    },
    // About
    about: {
      title: 'About Us',
      subtitle: 'Symbol of Purity - This is our identity',
      founder: 'Founder',
      founderQuote: 'Purity alone completes devotion',
      ourStory: 'Our Story',
      mission: 'Our Mission',
      vision: 'Our Vision',
      values: 'Our Values',
    },
    // Footer
    footer: {
      tagline: 'Symbol of Purity - This is our identity',
      founder: 'Founder',
      newsletter: 'Subscribe to Newsletter',
      subscribe: 'Subscribe',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
      refund: 'Refund Policy',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      close: 'Close',
      submit: 'Submit',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      language: 'Language',
    },
  },
  hi: {
    // Navigation
    nav: {
      home: 'होम',
      products: 'उत्पाद',
      categories: 'श्रेणियां',
      machinery: 'यंत्र',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      search: 'खोजें',
      cart: 'पात्र',
      wishlist: 'सूची',
      account: 'खाता',
    },
    // Hero
    hero: {
      tagline: 'शुद्धता का प्रतीक',
      title: 'सर्व देव नमस्कारं केशवं प्रतिगच्छति',
      subtitle: 'पवन हृदय नाहु द्वारा स्थापित, SKG ENTERPRISE आपको शुद्ध पूजा सामग्री और मंदिर निर्माण यंत्र प्रदान करता है।',
      cta: 'खरीदारी शुरू करें',
      watchVideo: 'वीडियो देखें',
      stats: {
        customers: 'खुश ग्राहक',
        products: 'उत्पाद',
        experience: 'वर्षों का अनुभव',
      },
    },
    // Products
    products: {
      latest: 'नवीनतम उत्पाद',
      bestsellers: 'बेस्टसेलर',
      featured: 'विशेष चयन',
      machinery: 'मंदिर निर्माण यंत्र',
      viewAll: 'सभी देखें',
      addToCart: 'पात्र में डालें',
      addedToCart: 'पात्र में जोड़ा गया',
      purityCertified: 'शुद्ध',
      new: 'नया',
      bestseller: 'बेस्टसेलर',
      price: 'कीमत',
      inStock: 'स्टॉक में',
      outOfStock: 'स्टॉक खत्म',
      quantity: 'मात्रा',
      description: 'विवरण',
      specifications: 'विशेषताएं',
      reviews: 'समीक्षाएं',
      relatedProducts: 'संबंधित उत्पाद',
    },
    // Categories
    categories: {
      title: 'हमारी श्रेणियां',
      subtitle: 'श्रेणियां',
      description: 'सभी प्रकार की शुद्ध पूजा सामग्री एक ही छत के नीचे',
      viewProducts: 'उत्पाद देखें',
      gheeBatti: 'गी बत्ती',
      diya: 'दीया',
      agarbatti: 'अगरबत्ती',
      pujaThali: 'पूजा थाली',
      idols: 'मूर्ति',
      rudraksha: 'रुद्राक्ष',
      machinery: 'यंत्र',
      stats: {
        products: 'उत्पाद',
        categories: 'श्रेणियां',
        pure: 'शुद्ध',
      },
    },
    // Cart
    cart: {
      title: 'सेवा पात्र',
      empty: 'पात्र खाली है',
      emptyMessage: 'पूजा सामग्री जोड़ने के लिए खरीदारी जारी रखें',
      subtotal: 'उप-योग',
      shipping: 'शिपिंग',
      free: 'मुफ्त',
      total: 'कुल योग',
      checkout: 'चेकआउट करें',
      clearCart: 'पात्र खाली करें',
      continueShopping: 'खरीदारी जारी रखें',
    },
    // Wishlist
    wishlist: {
      title: 'पूजा सूची',
      empty: 'पूजा सूची खाली है',
      emptyMessage: 'अपनी पसंदीदा वस्तुएं सहेजें',
      moveToCart: 'पात्र में डालें',
    },
    // Checkout
    checkout: {
      title: 'चेकआउट',
      shippingAddress: 'शिपिंग पता',
      billingAddress: 'बिलिंग पता',
      sameAsShipping: 'शिपिंग पते के समान',
      paymentMethod: 'भुगतान विधि',
      orderSummary: 'ऑर्डर सारांश',
      placeOrder: 'ऑर्डर दें',
      processing: 'प्रोसेसिंग...',
    },
    // Contact
    contact: {
      title: 'हमसे संपर्क करें',
      subtitle: 'संपर्क करें',
      description: 'किसी भी प्रश्न या सहायता के लिए हमसे संपर्क करें',
      formTitle: 'संदेश भेजें',
      name: 'नाम',
      email: 'ईमेल',
      phone: 'फोन',
      subject: 'विषय',
      message: 'संदेश',
      send: 'संदेश भेजें',
      success: 'धन्यवाद! आपका संदेश भेज दिया गया है।',
      address: 'पता',
      workingHours: 'कार्य समय',
      form: {
        name: 'नाम',
        email: 'ईमेल',
        phone: 'फोन',
        subject: 'विषय',
        message: 'संदेश',
        submit: 'संदेश भेजें',
      },
    },
    // About
    about: {
      title: 'हमारे बारे में',
      subtitle: 'शुद्धता का प्रतीक - यही हमारी पहचान',
      founder: 'संस्थापक',
      founderQuote: 'शुद्धता से ही भक्ति पूर्ण होती है',
      ourStory: 'हमारी कहानी',
      mission: 'हमारा लक्ष्य',
      vision: 'हमारा दृष्टिकोण',
      values: 'हमारे मूल्य',
    },
    // Footer
    footer: {
      tagline: 'शुद्धता का प्रतीक - यही हमारी पहचान',
      founder: 'संस्थापक',
      newsletter: 'न्यूज़लेटर सब्सक्राइब करें',
      subscribe: 'सब्सक्राइब',
      rights: 'सर्वाधिकार सुरक्षित।',
      privacy: 'गोपनीयता नीति',
      terms: 'नियम और शर्तें',
      refund: 'वापसी नीति',
    },
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'कुछ गलत हो गया',
      retry: 'पुनः प्रयास करें',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      close: 'बंद करें',
      submit: 'जमा करें',
      continue: 'जारी रखें',
      back: 'वापस',
      next: 'अगला',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'क्रमबद्ध करें',
      language: 'भाषा',
    },
  },
};

// Get nested translation value
export function getTranslation(
  lang: Language,
  key: string,
  params?: Record<string, string>
): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      let fallback: any = translations['en'];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key; // Return key if not found
        }
      }
      value = fallback;
      break;
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Replace params
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] || match;
    });
  }

  return value;
}

// Detect system/browser language
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

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

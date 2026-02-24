import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUIStore } from '@/store';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Sparkles, Plus, Minus, Milestone } from 'lucide-react';

const stats = [
  { value: '25+', labelEn: 'Years Experience', labelHi: 'वर्षों का अनुभव' },
  { value: '1L+', labelEn: 'Happy Customers', labelHi: 'खुश ग्राहक' },
  { value: '500+', labelEn: 'Products', labelHi: 'उत्पाद' },
  { value: '50+', labelEn: 'Temples Served', labelHi: 'मंदिर सेवा' },
];


const policies = [
  {
    id: 'terms',
    titleEn: 'Terms and Conditions',
    titleHi: 'नियम और शर्तें',
    contentEn: 'By accessing this website, we assume you accept these terms and conditions. Do not continue to use SKG ENTERPRISE if you do not agree to take all of the terms and conditions stated on this page. We reserve the right to modify these terms at any time. All products sold are subject to availability and our acceptance of your order.',
    contentHi: 'इस वेबसाइट तक पहुंचकर, हम मानते हैं कि आप इन नियमों और शर्तों को स्वीकार करते हैं। यदि आप इस पृष्ठ पर बताए गए सभी नियमों और शर्तों को स्वीकार करने के लिए सहमत नहीं हैं, तो SKG ENTERPRISE का उपयोग जारी न रखें।'
  },
  {
    id: 'privacy',
    titleEn: 'Privacy Policy',
    titleHi: 'गोपनीयता नीति',
    contentEn: 'We are committed to protecting your privacy. We use the information we collect about you to process orders and to provide a more personalized shopping experience. We do not sell, trade, or rent your personal information to others.',
    contentHi: 'हम आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध हैं। हम आपके बारे में जो जानकारी एकत्र करते हैं उसका उपयोग आदेशों को संसाधित करने और अधिक व्यक्तिगत खरीदारी अनुभव प्रदान करने के लिए करते हैं।'
  },
  {
    id: 'refund',
    titleEn: 'Refund Policy',
    titleHi: 'धनवापसी नीति',
    contentEn: 'We offer a 7-day return policy on unused, unsealed products. For machinery, a refund applies only before dispatch or in cases of severe manufacturing defect reported within 48 hours of delivery.',
    contentHi: 'हम सभी बिना खोले और बिना उपयोग किए गए उत्पादों पर 7 दिनों की वापसी नीति प्रदान करते हैं। मशीनरी के लिए, प्रेषण से पहले धनवापसी लागू होती है।'
  }
];

export function AboutPage() {
  const { mode } = useUIStore();
  const { t, isHindi } = useLanguage();
  const location = useLocation();
  const [openPolicy, setOpenPolicy] = useState<string | null>(null);
  const isBhakti = mode === 'bhakti';

  // Handle Hash Navigation (Footer Links)
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash && ['privacy', 'terms', 'refund'].includes(hash)) {
      setOpenPolicy(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [location]);

  return (
    <div className={cn('min-h-screen pt-20', isBhakti ? 'bg-background' : 'bg-steel-dark')}>

      {/* Hero Section */}
      <section className={cn('relative py-20 overflow-hidden', isBhakti ? 'bg-sacred-gradient' : 'bg-steel')}>
        <div className="absolute inset-0 opacity-10 bg-[url(\'https://www.transparenttextures.com/patterns/pinstriped-suit.png\')]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-saffron/10 text-saffron border border-saffron/20 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              {t('about.title')}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              {t('about.subtitle')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {isHindi
                ? 'पवन हृदय नाहु द्वारा स्थापित, SKG ENTERPRISE शुद्धता और भक्ति का प्रतीक है।'
                : 'Established by Pawan Hridya Nahu, SKG ENTERPRISE is a beacon of purity and devotion.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={cn(
                'aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10',
                isBhakti ? 'ring-1 ring-saffron/20' : 'ring-1 ring-copper/30'
              )}>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop"
                  alt="Pawan Hridya Nahu"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              {/* Decorative back-frame */}
              <div className={cn(
                'absolute -top-4 -left-4 w-full h-full rounded-3xl -z-0 opacity-20',
                isBhakti ? 'bg-saffron' : 'bg-copper'
              )} />

              <div className={cn(
                'absolute -bottom-10 -right-6 p-8 rounded-2xl max-w-xs shadow-2xl z-20 backdrop-blur-md',
                isBhakti ? 'bg-card/90 border-l-4 border-saffron' : 'bg-steel/90 border-l-4 border-copper'
              )}>
                <p className="text-lg italic text-muted-foreground mb-4">
                  "{t('about.founderQuote')}"
                </p>
                <div className="h-[1px] w-12 bg-saffron/30 mb-4" />
                <p className="font-bold text-saffron tracking-wider uppercase text-xs">
                  {t('about.founder')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">
                  {isHindi ? 'पवन हृदय नाहु' : 'Pawan Hridya Nahu'}
                </h2>
                <div className="h-1.5 w-20 bg-saffron rounded-full" />
              </div>
              <div className="space-y-6 text-lg text-muted-foreground leading-loose">
                <p>
                  {isHindi
                    ? 'पवन हृदय नाहु ने 1999 में SKG ENTERPRISE की स्थापना की, एक साधारण सी दुकान से शुरुआत करके आज एक राष्ट्रीय ब्रांड बनाने का सफर तय किया है।'
                    : 'Pawan Hridya Nahu founded SKG ENTERPRISE in 1999, embarking on a transformative journey from a modest shop to a nationally recognized brand.'}
                </p>
                <p>
                  {isHindi
                    ? 'उनका मानना है कि शुद्धता से ही भक्ति पूर्ण होती है। हर उत्पाद को व्यक्तिगत रूप से जांचने की उनकी प्रतिबद्धता ने हमें लाखों का विश्वास दिलाया है।'
                    : 'He believes that purity is the soul of devotion. His unwavering commitment to quality inspection has earned the trust of millions of devotees worldwide.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-4">
                {stats.slice(0, 2).map((s, i) => (
                  <div key={i}>
                    <p className="text-3xl font-bold text-saffron">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{isHindi ? s.labelHi : s.labelEn}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className={cn('py-12', isBhakti ? 'bg-saffron/5' : 'bg-steel')}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-black text-saffron mb-1">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground opacity-70">
                  {isHindi ? stat.labelHi : stat.labelEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

  {/* Creative Story Section - Refined */}
<section className="py-32 overflow-hidden">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
      <div className="max-w-xl">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-4"
        >
          {isHindi ? 'हमारी यात्रा' : 'THE JOURNEY'}
        </motion.h2>
        <div className="h-1.5 w-32 bg-saffron rounded-full" />
      </div>
      <p className="text-muted-foreground text-lg italic">
        {isHindi ? 'वाराणसी की गलियों से वैश्विक स्तर तक' : 'From the streets of Varanasi to global horizons'}
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { year: '1999', titleEn: 'The Seed', titleHi: 'बीज', descEn: 'A humble beginning in Varanasi with handmade diyas.', descHi: 'वाराणसी में हस्तनिर्मित दीयों के साथ एक विनम्र शुरुआत।' },
        { year: '2005', titleEn: 'Scaling Up', titleHi: 'विस्तार', descEn: 'Transitioning to advanced machinery for mass production.', descHi: 'बड़े पैमाने पर उत्पादन के लिए उन्नत मशीनरी का उपयोग।' },
        { year: '2015', titleEn: 'Global Reach', titleHi: 'वैश्विक पहुंच', descEn: 'Exporting purity to temples across the globe.', descHi: 'दुनिया भर के मंदिरों में शुद्धता का निर्यात।' },
        { year: '2024', titleEn: 'Future Ready', titleHi: 'भविष्य', descEn: 'Merging tradition with the digital shopping experience.', descHi: 'डिजिटल शॉपिंग अनुभव के साथ परंपरा का संगम।' },
      ].map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className={cn(
            "group relative p-8 rounded-3xl border transition-all duration-500 hover:-translate-y-2",
            isBhakti 
              ? "bg-card border-border hover:shadow-xl hover:shadow-saffron/5 hover:border-saffron/30" 
              : "bg-steel-dark border-copper/10 hover:shadow-xl hover:shadow-copper/5 hover:border-copper/30"
          )}
        >
          {/* Top Bar: Year + Expanding Line */}
          <div className="flex items-center justify-between mb-8">
            <span className={cn(
              "text-4xl font-black tracking-tighter transition-colors duration-500",
              isBhakti ? "group-hover:text-saffron" : "group-hover:text-copper"
            )}>
              {item.year}
            </span>
            
            {/* Dynamic Accent Line */}
            <div className="flex-1 mx-4 flex items-center justify-end opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <div className={cn("h-[2px] w-full rounded-full", isBhakti ? "bg-saffron/30" : "bg-copper/30")} />
              <div className={cn("w-2 h-2 rounded-full ml-1 shrink-0", isBhakti ? "bg-saffron" : "bg-copper")} />
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-3">
              {isHindi ? item.titleHi : item.titleEn}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {isHindi ? item.descHi : item.descEn}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* Policies Section */}
      <section className="py-24" id="policies">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{isHindi ? 'नीतियां और शर्तें' : 'Legal & Policies'}</h2>
            <p className="text-muted-foreground">{isHindi ? 'भरोसा और पारदर्शिता हमारी प्राथमिकता है' : 'Trust and transparency are our core priorities'}</p>
          </div>

          <div className="space-y-4">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                id={policy.id}
                className={cn(
                  "border-2 rounded-2xl overflow-hidden transition-all duration-300",
                  openPolicy === policy.id
                    ? (isBhakti ? "border-saffron bg-saffron/5 shadow-lg" : "border-copper bg-copper/5 shadow-lg")
                    : (isBhakti ? "bg-card border-border" : "bg-steel-dark border-copper/10")
                )}
              >
                <button
                  onClick={() => setOpenPolicy(openPolicy === policy.id ? null : policy.id)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      openPolicy === policy.id ? "bg-saffron text-white" : "bg-muted text-muted-foreground"
                    )}>
                      <Milestone className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg">
                      {isHindi ? policy.titleHi : policy.titleEn}
                    </span>
                  </div>
                  {openPolicy === policy.id ? (
                    <Minus className="w-5 h-5 text-saffron" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openPolicy === policy.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="p-8 pt-0 text-muted-foreground leading-relaxed border-t border-border/20">
                        {isHindi ? policy.contentHi : policy.contentEn}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
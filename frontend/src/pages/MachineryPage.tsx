import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Settings,
  TrendingUp,
  Phone,
  Mail,
  Factory,
  PenTool,
  Wrench,
  Quote,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts, useTestimonials, useBanners } from '@/hooks/useApi';
import { getImageUrl } from '@/lib/utils';
import { TestimonialsSection } from '@/sections/TestimonialsSection';

// Benefits Data
const benefits = [
  {
    icon: TrendingUp,
    titleEn: 'Increased Production',
    titleHi: 'बढ़ा हुआ उत्पादन',
    descEn: 'Produce 10x more with our automated machines.',
    descHi: 'हमारी स्वचालित मशीनों के साथ 10 गुना अधिक उत्पादन।',
  },
  {
    icon: Settings,
    titleEn: 'Easy Maintenance',
    titleHi: 'आसान रखरखाव',
    descEn: 'Low maintenance with 1-year warranty.',
    descHi: '1 साल की वारंटी के साथ कम रखरखाव।',
  },
  {
    icon: Zap,
    titleEn: 'Energy Efficient',
    titleHi: 'ऊर्जा कुशल',
    descEn: 'Save up to 30% on electricity costs.',
    descHi: 'बिजली की लागत पर 30% तक बचत करें।',
  },
];

// Process Data
const processSteps = [
  {
    icon: Factory,
    titleEn: 'Requirement Analysis',
    titleHi: 'आवश्यकता विश्लेषण',
    descEn: 'We analyze your production needs and space.',
    descHi: 'हम आपकी उत्पादन आवश्यकताओं और स्थान का विश्लेषण करते हैं।'
  },
  {
    icon: PenTool,
    titleEn: 'Custom Design',
    titleHi: 'कस्टम डिजाइन',
    descEn: 'Tailored machinery solutions for your specific needs.',
    descHi: 'आपकी विशिष्ट आवश्यकताओं के लिए अनुकूलित मशीनरी समाधान।'
  },
  {
    icon: Settings,
    titleEn: 'Manufacturing',
    titleHi: 'निर्माण',
    descEn: 'Precision engineering with high-grade materials.',
    descHi: 'उच्च श्रेणी की सामग्री के साथ सटीक इंजीनियरिंग।'
  },
  {
    icon: Wrench,
    titleEn: 'Installation & Support',
    titleHi: 'स्थापना और समर्थन',
    descEn: 'On-site installation and lifetime technical support.',
    descHi: 'साइट पर स्थापना और आजीवन तकनीकी सहायता।'
  }
];

// FAQ Data
const faqs = [
  {
    id: 1,
    qEn: "What is the warranty period?",
    qHi: "वारंटी अवधि क्या है?",
    aEn: "We provide 1 year comprehensive warranty on all machinery parts and motors. Extended warranty options are also available.",
    aHi: "हम सभी मशीनरी भागों और मोटरों पर 1 वर्ष की व्यापक वारंटी प्रदान करते हैं। विस्तारित वारंटी विकल्प भी उपलब्ध हैं।"
  },
  {
    id: 2,
    qEn: "Do you provide training?",
    qHi: "क्या आप प्रशिक्षण प्रदान करते हैं?",
    aEn: "Yes, our engineers provide complete on-site training for operation and maintenance to your staff.",
    aHi: "हां, हमारे इंजीनियर आपके कर्मचारियों को संचालन और रखरखाव के लिए पूर्ण ऑन-साइट प्रशिक्षण प्रदान करते हैं।"
  },
  {
    id: 3,
    qEn: "Are spare parts easily available?",
    qHi: "क्या स्पेयर पार्ट्स आसानी से उपलब्ध हैं?",
    aEn: "We ensure lifetime availability of original spare parts for all our models with quick shipping.",
    aHi: "हम अपने सभी मॉडलों के लिए त्वरित शिपिंग के साथ मूल स्पेयर पार्ट्स की आजीवन उपलब्धता सुनिश्चित करते हैं।"
  },
  {
    id: 4,
    qEn: "What is the power requirement?",
    qHi: "बिजली की आवश्यकता क्या है?",
    aEn: "Most machines run on standard single-phase power, but larger units may require three-phase connections.",
    aHi: "अधिकांश मशीनें मानक सिंगल-फेज बिजली पर चलती हैं, लेकिन बड़ी इकाइयों को थ्री-फेज कनेक्शन की आवश्यकता हो सकती है।"
  }
];

export function MachineryPage() {
  // const { mode, setMode } = useUIStore();
  const { isHindi } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 1. Fetch Machinery Products 
  // Adjusted to match the pagination structure seen in AdminProducts
  const { data, loading } = useProducts({ type: 'machinery', per_page: 100 });
  const machines = data?.data || [];

  // 2. Fetch Machinery Testimonials
  const { data: machineTestimonials } = useTestimonials({ product_type: 'machinery', limit: 4 });
  const testimonials = machineTestimonials || [];

  // 3. Fetch Machinery Banner
  const { data: banners } = useBanners();
  const machineryBanner = banners?.find(b => b.type === 'machinery');

  // Switch to Yantra mode when visiting this page
  // useEffect(() => {
  //   if (mode !== 'yantra') {
  //     setMode('yantra');
  //   }
  // }, [mode, setMode]);

  return (
    <div className="min-h-screen pt-20 bg-background text-foreground transition-colors duration-500">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden min-h-[500px] flex items-center">
        {machineryBanner ? (
          <div className="absolute inset-0 z-0">
            <img
              src={getImageUrl(machineryBanner.image)}
              alt="Machinery Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-copper-dark opacity-90 z-0" />
        )}

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1 bg-copper/20 text-copper border border-copper/30 rounded-full text-sm font-medium mb-6 backdrop-blur-md">
              <Zap className="w-4 h-4 fill-copper" />
              {isHindi ? 'यंत्र शक्ति' : 'Machinery Power'}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              {isHindi && machineryBanner?.titleHi ? machineryBanner.titleHi : (machineryBanner?.title || (isHindi ? 'मंदिर निर्माण यंत्र' : 'Industrial Machinery'))}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
              {isHindi && machineryBanner?.subtitleHi ? machineryBanner.subtitleHi : (machineryBanner?.subtitle || (isHindi
                ? 'SKG ENTERPRISE के उन्नत यंत्रों के साथ अपने उत्पादन को बढ़ाएं।'
                : 'Scale your production with SKG ENTERPRISE advanced machinery.'))}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-copper/20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '₹50L+', labelEn: 'Turnover', labelHi: 'टर्नओवर' },
              { value: '10,000+', labelEn: 'Units/Day', labelHi: 'यूनिट/दिन' },
              { value: '50+', labelEn: 'Clients', labelHi: 'ग्राहक' },
              { value: '25+', labelEn: 'Years', labelHi: 'वर्ष' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-copper mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{isHindi ? stat.labelHi : stat.labelEn}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              {isHindi ? 'हमारी प्रक्रिया' : 'Our Process'}
            </h2>
            <p className="text-slate-400">
              {isHindi ? 'संकल्पना से निर्माण तक' : 'From concept to creation'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-gradient-to-r from-copper/50 to-transparent z-0" />
                )}

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-slate-800 border-2 border-copper rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-copper/10">
                    <step.icon className="w-8 h-8 text-copper" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {isHindi ? step.titleHi : step.titleEn}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {isHindi ? step.descHi : step.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Machines Grid */}
      <section id="machines" className="py-20 bg-background min-h-[400px]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isHindi ? 'हमारी मशीनें' : 'Our Machines'}
            </h2>
            <p className="text-muted-foreground">
              {isHindi ? 'उच्च गुणवत्ता वाली उत्पादन मशीनें' : 'High-performance manufacturing solutions'}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-copper animate-spin mb-4" />
              <p className="text-muted-foreground">{isHindi ? 'लोड हो रहा है...' : 'Loading machines...'}</p>
            </div>
          ) : machines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {machines.map((machine: any, index: number) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-copper hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <Link to={`/product/${machine.id}`} className="aspect-video overflow-hidden bg-muted relative block">
                    {machine.images && machine.images[0] ? (
                      <img
                        src={getImageUrl(machine.images[0])}
                        alt={isHindi && machine.nameHi ? machine.nameHi : machine.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Factory className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                  </Link>

                  <div className="p-6 flex flex-col flex-1">
                    <Link to={`/product/${machine.id}`}>
                      <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-copper transition-colors">
                        {isHindi && machine.nameHi ? machine.nameHi : machine.name}
                      </h3>
                    </Link>

                    {/* Technical Details Display */}
                    <div className="space-y-3 text-sm text-muted-foreground mb-6">
                      <div className="flex justify-between items-center py-1 border-b border-border/50">
                        <span>{isHindi ? 'SKU कोड' : 'SKU Code'}</span>
                        <span className="text-foreground font-medium">{machine.sku}</span>
                      </div>

                      {/* Safely parse Technical Specs */}
                      {machine.technical_specs && typeof machine.technical_specs === 'object' ? (
                        Object.entries(machine.technical_specs).slice(0, 2).map(([key, value]: any) => (
                          <div key={key} className="flex justify-between items-center py-1 border-b border-border/50">
                            <span className="capitalize">{key.replace('_', ' ')}</span>
                            <span className="text-foreground font-medium">{value}</span>
                          </div>
                        ))
                      ) : machine.productionCapacity && (
                        <div className="flex justify-between items-center py-1 border-b border-border/50">
                          <span>{isHindi ? 'क्षमता' : 'Capacity'}</span>
                          <span className="text-foreground font-medium">{machine.productionCapacity}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-1 border-b border-border/50">
                        <span>{isHindi ? 'स्थिति' : 'Status'}</span>
                        <span className={`font-medium ${machine.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {machine.stock > 0 ? (isHindi ? 'स्टॉक में' : 'In Stock') : (isHindi ? 'आउट ऑफ स्टॉक' : 'Out of Stock')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-auto pt-4">
                      <span className="text-2xl font-bold text-copper">
                        ₹{Number(machine.price || 0).toLocaleString('en-IN')}
                      </span>
                      <div className="flex items-center gap-2 w-full">
                        <Link
                          to={`/product/${machine.id}`}
                          className="flex-1 px-4 py-2 border border-copper text-copper text-center rounded-lg text-sm font-medium hover:bg-copper/5 transition-colors"
                        >
                          {isHindi ? 'विवरण देखें' : 'View Details'}
                        </Link>
                        <Link
                          to={`/contact?subject=${encodeURIComponent(isHindi ? `पूछताछ: ${machine.nameHi || machine.name}` : `Inquiry: ${machine.name}`)}`}
                          className="flex-1 px-4 py-2 bg-copper text-white text-center rounded-lg text-sm font-medium hover:bg-copper-dark transition-colors flex items-center justify-center gap-1"
                        >
                          {isHindi ? 'उद्धरण' : 'Get Quote'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              {isHindi ? 'कोई मशीन नहीं मिली।' : 'No machines found matching your criteria.'}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:border-copper/50 transition-colors"
              >
                <div className="w-16 h-16 bg-copper/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-copper" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {isHindi ? benefit.titleHi : benefit.titleEn}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {isHindi ? benefit.descHi : benefit.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {isHindi ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-semibold text-lg text-foreground">
                    {isHindi ? faq.qHi : faq.qEn}
                  </span>
                  {openFaq === faq.id ? (
                    <Minus className="w-5 h-5 text-copper" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <AnimatePresence>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-6 pt-0 text-muted-foreground border-t border-border/50">
                        {isHindi ? faq.aHi : faq.aEn}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-copper to-copper-dark rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              {isHindi ? 'अपना प्रोडक्शन शुरू करने के लिए तैयार?' : 'Ready to scale your production?'}
            </h2>
            <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg relative z-10">
              {isHindi
                ? 'आज ही हमारे विशेषज्ञ से बात करें और अपने व्यवसाय के लिए सबसे अच्छा समाधान खोजें।'
                : 'Talk to our experts today and find the best machinery solution for your business.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <a
                href="tel:+918800580015"
                className="flex items-center gap-2 px-8 py-4 bg-white text-copper rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" />
                +91 8800580015
              </a>
              <a
                href="mailto:machinery@skgenterprise.com"
                className="flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                <Mail className="w-5 h-5" />
                {isHindi ? 'ईमेल करें' : 'Email Us'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

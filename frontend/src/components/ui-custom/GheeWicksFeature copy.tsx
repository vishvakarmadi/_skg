import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { Droplet, Leaf, CheckCircle2, Flame, Gift, Clock, ShieldCheck, Tractor } from 'lucide-react';

const features = [
    {
        icon: Droplet,
        titleEn: 'Pure Cow Ghee Wicks',
        titleHi: 'शुद्ध गाय के घी की बत्तियां',
        descEn: 'Made exclusively with pure cow ghee, ensuring a clean and traditional burn.',
        descHi: 'पूरी तरह से शुद्ध गाय के घी से निर्मित, जो एक स्वच्छ और पारंपरिक ज्योति सुनिश्चित करता है।'
    },
    {
        icon: Leaf,
        titleEn: 'No Wax, No Chemicals',
        titleHi: 'मोम या रसायन मुक्त',
        descEn: 'Free from wax and harmful chemicals, providing a natural and safe option for your rituals.',
        descHi: 'मोम और हानिकारक रसायनों से मुक्त, आपकी पूजा के लिए सुरक्षित और प्राकृतिक विकल्प।'
    },
    {
        icon: CheckCircle2,
        titleEn: 'All-Natural',
        titleHi: 'सौ प्रतिशत प्राकृतिक',
        descEn: 'No added aromas or colors, maintaining the purity and authenticity of the wicks.',
        descHi: 'कोई कृत्रिम सुगंध या रंग नहीं, बत्तियों की शुद्धता और प्रामाणिकता बरकरार है।'
    },
    {
        icon: Flame,
        titleEn: 'Perfect Size',
        titleHi: 'सही आकार',
        descEn: 'Designed to be the ideal size for easy handling and efficient burning.',
        descHi: 'आसानी से उपयोग करने और सही रूप से जलने के लिए बेहतरीन आकार।'
    },
    {
        icon: CheckCircle2, // Or a different icon for Versatility
        titleEn: 'Versatile Use',
        titleHi: 'बहुमुखी उपयोग',
        descEn: 'Ideal for daily use, pooja, aarti, and other religious ceremonies.',
        descHi: 'दैनिक पूजा, आरती, और अन्य धार्मिक अनुष्ठानों के लिए आदर्श।'
    },
    {
        icon: Gift,
        titleEn: 'Great for Gifting',
        titleHi: 'उपहार के लिए उत्तम',
        descEn: 'An excellent choice for gifting, bringing a touch of tradition and purity to any occasion.',
        descHi: 'उपहार के रूप में एक बेहतरीन विकल्प, जो प्रामाणिकता और परंपरा को दर्शाता है।'
    },
    {
        icon: Clock,
        titleEn: 'Long Burn Time',
        titleHi: 'लंबी अवधि तक जले',
        descEn: 'Each wick burns for approximately 10 to 20 minutes, offering a sustained flame.',
        descHi: 'प्रत्येक बत्ती लगभग 10 से 20 मिनट तक जलती है, अनुष्ठान के दौरान ज्योति बनाए रखती है।'
    },
    {
        icon: ShieldCheck,
        titleEn: 'Heat Resistant',
        titleHi: 'गर्मी प्रतिरोधी',
        descEn: 'Our ghee wicks are specially formulated not to melt at high temperatures, ensuring consistent performance.',
        descHi: 'हमारी घी की बत्तियां उच्च तापमान पर भी नहीं पिघलतीं, उत्कृष्ट गुणवत्ता सुनिश्चित करती हैं।'
    },
    {
        icon: Tractor,
        titleEn: 'Farm-Fresh Ghee',
        titleHi: 'ताज़ा खेतों का घी',
        descEn: 'The ghee is sourced directly from our own dairy farms, ensuring the highest quality and purity.',
        descHi: 'घी को सीधे हमारी अपनी डेयरी से प्राप्त किया जाता है, जिससे उच्चतम शुद्धता की गारंटी मिलती है।'
    }
];

export function GheeWicksFeature() {
    const { isHindi } = useLanguage();
    const { mode } = useUIStore();
    const isBhakti = mode === 'bhakti';

    return (
        <section className={cn("py-20 overflow-hidden", isBhakti ? "bg-card" : "bg-steel-dark")}>
            <div className="container mx-auto px-4">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-saffron/20 bg-saffron/5 text-saffron mb-6"
                    >
                        <Droplet className="w-5 h-5" />
                        <span className="font-semibold">{isHindi ? 'हमारी विशेषता' : 'Our Speciality'}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        {isHindi ? 'पवित्र गाय के घी की बत्तियां' : 'Pure Cow Ghee Wicks'}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        {isHindi
                            ? 'बिना रसायनों के पारंपरिक तरीके से निर्मित, जो आपके धार्मिक अनुष्ठानों में शुद्धता फैलाती हैं।'
                            : 'Crafted traditionally without any chemicals to bring pure illumination to your religious ceremonies.'}
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 group",
                                isBhakti ? "bg-background border-border hover:shadow-xl hover:shadow-saffron/5" : "bg-steel border-copper/10 hover:shadow-xl hover:shadow-copper/5 hover:border-copper/30"
                            )}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center mb-6 text-saffron group-hover:bg-saffron group-hover:text-white transition-colors duration-300">
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                {isHindi ? feature.titleHi : feature.titleEn}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {isHindi ? feature.descHi : feature.descEn}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

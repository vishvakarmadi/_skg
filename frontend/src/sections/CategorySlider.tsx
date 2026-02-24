import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useApi';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, getImageUrl } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const defaultCategories = [
    { id: 'ghee-batti', name: 'Ghee Batti', nameHi: 'गी बत्ती', icon: '🔥', slug: 'ghee-batti', image: undefined },
    { id: 'diya', name: 'Diya', nameHi: 'दीया', icon: '🪔', slug: 'diya', image: undefined },
    { id: 'agarbatti', name: 'Agarbatti', nameHi: 'अगरबत्ती', icon: '🌸', slug: 'agarbatti', image: undefined },
    { id: 'puja-thali', name: 'Puja Thali', nameHi: 'पूजा थाली', icon: '🙏', slug: 'puja-thali', image: undefined },
    { id: 'idols', name: 'Idols', nameHi: 'मूर्ति', icon: '🕉️', slug: 'idols', image: undefined },
    { id: 'rudraksha', name: 'Rudraksha', nameHi: 'रुद्राक्ष', icon: '📿', slug: 'rudraksha', image: undefined },
    { id: 'yantra', name: 'Yantra', nameHi: 'यंत्र', icon: '⚙️', slug: 'yantra', image: undefined },
    { id: 'machinery', name: 'Machinery', nameHi: 'मशीनरी', icon: '🏭', slug: 'machinery', image: undefined },
];

export function CategorySlider() {
    const { data: apiCategories, loading } = useCategories();
    const { isHindi } = useLanguage();
    const scrollRef = useRef<HTMLDivElement>(null);

    const categories = apiCategories && apiCategories.length > 0
        ? apiCategories.filter((c: any) => !c.parentId).map((c: any) => ({
            id: c.id,
            name: c.name,
            nameHi: c.nameHi || c.name,
            icon: c.icon || '🪔',
            image: c.image,
            slug: c.slug
        }))
        : defaultCategories;

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="py-12 border-b border-border/40">
            <div className="container mx-auto px-4 relative group/slider">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={cn("text-2xl font-bold", isHindi && "devanagari")}>
                        {isHindi ? 'श्रेणियाँ' : 'Shop By Category'}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide snap-x px-1"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id || index}
                            to={`/category/${cat.slug}`}
                            className="flex flex-col items-center gap-4 min-w-[120px] snap-center group"
                        >
                            <motion.div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-muted to-muted/50 border-2 border-border flex items-center justify-center text-5xl shadow-sm group-hover:border-saffron group-hover:shadow-lg transition-all relative overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center justify-center w-full h-full">
                                    {cat.image ? (
                                        <img
                                            src={getImageUrl(cat.image)}
                                            alt={cat.name}
                                            className="object-cover rounded-full drop-shadow-sm"
                                        />
                                    ) : cat.icon && (cat.icon.includes('/') || cat.icon.includes('.')) ? (
                                        <img
                                            src={getImageUrl(cat.icon)}
                                            alt={cat.name}
                                            className="w-20 h-20 object-contain drop-shadow-sm"
                                        />
                                    ) : (
                                        cat.icon
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-saffron/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                            <span className={cn("text-base font-medium text-center group-hover:text-saffron transition-colors", isHindi && "devanagari")}>
                                {isHindi ? (cat.nameHi || cat.name) : cat.name}
                            </span>
                        </Link>
                    ))}

                    {/* Skeleton loading state */}
                    {loading && !apiCategories && (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-4 min-w-[120px]">
                                <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
                                <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}

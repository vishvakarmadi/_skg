import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTestimonials } from '@/hooks/useApi';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const fallbackTestimonials = [
    { id: 1, name: "Ramesh Kumar", role: "Factory Owner", content: "SKG Enterprise has provided us with top quality machinery parts. Their service is impeccable and delivery is always on time.", avatar: "RK", rating: 5 },
    { id: 2, name: "Sita Devi", role: "Devotee", content: "The puja items I ordered were authentic and of very high quality. Will definitely order again.", avatar: "SD", rating: 5 },
    { id: 3, name: "Amit Patel", role: "Business Owner", content: "Excellent range of products. Whether it's industrial or spiritual, SKG has it all.", avatar: "AP", rating: 4 }
];

export function TestimonialsSection() {
    const { isHindi } = useLanguage();
    const { data: apiTestimonials, loading } = useTestimonials({ limit: 10, random: true });

    const testimonials = apiTestimonials && apiTestimonials.length > 0
        ? apiTestimonials.map((t: any) => ({
            id: t.id,
            name: isHindi && t.name_hi ? t.name_hi : (t.name || 'Customer'),
            role: t.location || t.customerDesignation || t.customerLocation || t.role || '',
            content: isHindi ? (t.text_hi || t.contentHi || t.text || t.content || t.review || '') : (t.text || t.content || t.review || ''),
            avatar: (t.name || 'C').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
            rating: t.rating || 5,
        }))
        : fallbackTestimonials;

    return (
        <section className="relative pt-20  bg-slate-50 overflow-hidden">
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-blue-50/60 rounded-full blur-3xl" />

            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 ${isHindi ? 'font-devanagari' : ''}`}>
                            {isHindi ? 'हमारे ग्राहक क्या कहते हैं' : 'What Our Customers Say'}
                        </h2>
                        <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full" />
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex gap-6 justify-center">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full md:w-1/3 animate-pulse">
                                <div className="h-64 bg-slate-200 rounded-3xl" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative px-4 md:px-12">
                        <Carousel opts={{ align: "start", loop: true }} className="w-full">
                            <CarouselContent className="-ml-4 md:-ml-6">
                                {testimonials.map((testimonial, index) => (
                                    <CarouselItem key={testimonial.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="h-full pb-6"
                                        >
                                            <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl bg-white overflow-hidden group">
                                                <CardContent className="p-8 flex flex-col h-full">

                                                    {/* Header: Avatar, Name & Stars */}
                                                    <div className="flex items-start gap-4 mb-6">
                                                        <motion.div
                                                            animate={{ y: [0, -4, 0] }} // Gentle floating animation
                                                            transition={{
                                                                duration: 4,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: index * 0.5
                                                            }}
                                                        >
                                                            <Avatar className="h-14 w-14 border-2 border-orange-100 shadow-sm transition-transform group-hover:scale-110">
                                                                <AvatarFallback className="bg-orange-50 text-orange-700 font-bold text-base">
                                                                    {testimonial.avatar}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </motion.div>

                                                        <div className="flex flex-col gap-1.5">
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-orange-600 transition-colors">
                                                                    {testimonial.name}
                                                                </h3>
                                                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                                                                    {testimonial.role}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-0.5">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`h-4 w-4 ${i < testimonial.rating
                                                                            ? 'text-yellow-400 fill-yellow-400'
                                                                            : 'text-slate-200'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Body: Testimonial Text */}
                                                    <div className="relative">
                                                        <p className="text-slate-600 italic leading-relaxed text-lg z-10 relative">
                                                            "{testimonial.content}"
                                                        </p>
                                                        {/* Subtle decorative background quote mark */}
                                                        <span className="absolute -top-4 -left-2 text-8xl text-slate-50 font-serif select-none -z-0">“</span>
                                                    </div>

                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <div className="hidden md:block">
                                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-600 hover:text-white border-none size-12 shadow-lg transition-all" />
                                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-white hover:bg-orange-600 hover:text-white border-none size-12 shadow-lg transition-all" />
                            </div>
                        </Carousel>
                    </div>
                )}
            </div>
        </section>
    );
}
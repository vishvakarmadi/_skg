
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import api from '@/api';
import type { Blog } from '@/types';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';

export function StoriesPage() {
    const [stories, setStories] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('latest');
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [page, setPage] = useState(1);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                per_page: 9,
                q: searchTerm
            };

            const response = await api.blogs.getAll(params);
            if (response.data.success && response.data.data) {
                const data = response.data.data as any;
                const rawItems = data.data || [];
                const mapped = rawItems.map((b: any) => ({
                    ...b,
                    isPublished: b.is_published !== undefined ? !!b.is_published : !!b.isPublished,
                    isFeatured: b.is_featured !== undefined ? !!b.is_featured : !!b.isFeatured,
                    publishedAt: b.published_at || b.publishedAt,
                    createdAt: b.created_at || b.createdAt
                }));

                setStories(mapped);
                setMeta({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch stories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, [page, sortBy]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) fetchStories();
            else setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div className="pb-20">
            {/* Header */}
            <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=1600&q=40')] bg-cover bg-center opacity-20" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Spiritual <span className="text-orange-500">Stories</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-300 max-w-2xl mx-auto"
                    >
                        Journey through the intersection of ancient traditions and modern innovations.
                    </motion.p>
                </div>
            </section>

            {/* Filters & Search */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <Card className="shadow-xl border-none p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative col-span-1 md:col-span-2">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search stories..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger>
                                    <div className="flex items-center">
                                        <SortAsc className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Sort By" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Latest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="popular">Most Popular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 mt-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : stories.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-semibold text-slate-500">No stories found matching your criteria.</h3>
                        <Button variant="link" onClick={() => { setSearchTerm(''); setPage(1); }} className="text-orange-600 mt-4">
                            Clear all filters
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link to={`/stories/${story.slug}`}>
                                        <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                                            <div className="aspect-[16/10] overflow-hidden relative">
                                                <img
                                                    src={getImageUrl(story.image)}
                                                    alt={story.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                {story.isFeatured && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                            Featured
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {(() => {
                                                            const dateVal = story.publishedAt || story.createdAt;
                                                            if (!dateVal) return 'Recently';
                                                            const d = new Date(dateVal);
                                                            return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            });
                                                        })()}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-3">
                                                    {story.title}
                                                </h3>
                                                <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                                                    {story.excerpt}
                                                </p>
                                                <div className="flex items-center text-orange-600 font-bold text-sm group/btn">
                                                    Read Full Story
                                                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {meta.last_page > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <Button
                                    variant="outline"
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </Button>
                                {[...Array(meta.last_page)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={page === i + 1 ? "default" : "outline"}
                                        onClick={() => setPage(i + 1)}
                                        className={page === i + 1 ? "bg-orange-600 hover:bg-orange-700" : ""}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    disabled={page === meta.last_page}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

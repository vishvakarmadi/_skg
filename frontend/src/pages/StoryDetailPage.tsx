
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/api';
import type { Blog } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function StoryDetailPage() {
    const { slug } = useParams();
    const [story, setStory] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentStories, setRecentStories] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchStory = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const response = await api.blogs.getBySlug(slug);
                if (response.data.success && response.data.data) {
                    const b = response.data.data as any;
                    setStory({
                        ...b,
                        isPublished: b.is_published ?? b.isPublished ?? false,
                        isFeatured: b.is_featured ?? b.isFeatured ?? false,
                        publishedAt: b.published_at || b.publishedAt || b.created_at || b.createdAt,
                    } as Blog);
                }

                // Also fetch recent stories for sidebar/bottom
                const recentRes = await api.blogs.getAll({ limit: 4 });
                if (recentRes.data.success && recentRes.data.data) {
                    const blogData = recentRes.data.data;
                    const items = Array.isArray(blogData) ? blogData : ((blogData as any).data || []);

                    const mapped = items.map((b: any) => ({
                        ...b,
                        isPublished: b.is_published ?? b.isPublished ?? false,
                        isFeatured: b.is_featured ?? b.isFeatured ?? false,
                        publishedAt: b.published_at || b.publishedAt || b.created_at || b.createdAt,
                    })).filter((b: any) => b.slug !== slug).slice(0, 3);

                    setRecentStories(mapped as Blog[]);
                }
            } catch (error) {
                console.error('Failed to fetch story', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-20 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                    <div className="h-10 bg-slate-200 rounded w-1/4" />
                    <div className="h-64 bg-slate-200 rounded-xl" />
                    <div className="h-12 bg-slate-200 rounded w-3/4" />
                    <div className="space-y-4">
                        <div className="h-4 bg-slate-200 rounded" />
                        <div className="h-4 bg-slate-200 rounded" />
                        <div className="h-4 bg-slate-200 rounded w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="container mx-auto px-4 py-40 text-center">
                <h2 className="text-3xl font-bold mb-6">Story not found</h2>
                <Link to="/stories">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        Back to Stories
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Navigation & Context */}
            <div className="bg-slate-50 border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/stories" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors group">
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to All Stories
                    </Link>
                </div>
            </div>

            <article className="container mx-auto px-4 pt-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-6"
                        >
                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 uppercase tracking-widest text-[10px] font-bold px-3 py-1">
                                Spiritual Insight
                            </Badge>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6"
                        >
                            {story.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center justify-center gap-6 text-slate-500 text-sm font-medium"
                        >
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-orange-500" />
                                {new Date(story.publishedAt || story.createdAt).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>8 min read</span>
                        </motion.div>
                    </header>

                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12"
                    >
                        <img
                            src={getImageUrl(story.image)}
                            alt={story.title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar */}
                        <aside className="lg:col-span-1 border-r lg:block hidden">
                            <div className="sticky top-24 flex flex-col gap-6 items-center">
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">Share</span>
                                <button className="p-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors text-slate-400">
                                    <Facebook className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors text-slate-400">
                                    <Twitter className="h-5 w-5" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-orange-50 hover:text-orange-600 transition-colors text-slate-400">
                                    <Linkedin className="h-5 w-5" />
                                </button>
                            </div>
                        </aside>

                        {/* Text Content */}
                        <div className="lg:col-span-8 lg:col-start-3">
                            <div
                                className="prose prose-orange prose-lg max-w-none text-slate-700 leading-relaxed font-serif"
                                dangerouslySetInnerHTML={{ __html: story.content }}
                            />

                            {/* Footer of article */}
                            <div className="mt-16 pt-10 border-t flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-orange-600 border">
                                        SK
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">SKG Enterprise Team</p>
                                        <p className="text-xs text-slate-500">Curating purity since 1974</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="rounded-full">
                                        <Share2 className="h-4 w-4 mr-2" /> Share Story
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Stories */}
            <section className="mt-24 py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">More <span className="text-orange-600">Stories</span> to Explore</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {recentStories.map((s) => (
                            <Link key={s.id} to={`/stories/${s.slug}`} className="group">
                                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 shadow-md">
                                    <img
                                        src={getImageUrl(s.image)}
                                        alt={s.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                                    {s.title}
                                </h4>
                                <p className="text-slate-500 text-sm mt-2 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(s.publishedAt || s.createdAt).toLocaleDateString()}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}


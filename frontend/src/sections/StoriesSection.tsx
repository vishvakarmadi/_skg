import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api from "@/api"
import type { Blog } from "@/types"
import { Link } from "react-router-dom"
import { getImageUrl } from "@/lib/utils"

export function StoriesSection() {
    const [stories, setStories] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await api.blogs.getAll({
                    random: true,
                    limit: 3,
                })

                if (response.data.success && response.data.data) {
                    const blogData = response.data.data
                    const items = Array.isArray(blogData)
                        ? blogData
                        : (blogData as any).data || []

                    const mapped = items.map((b: any) => ({
                        ...b,
                        isPublished:
                            b.is_published ?? b.isPublished ?? false,
                        isFeatured:
                            b.is_featured ?? b.isFeatured ?? false,
                        publishedAt:
                            b.published_at ||
                            b.publishedAt ||
                            b.created_at ||
                            b.createdAt,
                        createdAt: b.created_at || b.createdAt,
                    }))

                    setStories(mapped as Blog[])
                }
            } catch (error) {
                console.error("Failed to fetch stories", error)
            } finally {
                setLoading(false)
            }
        }

        fetchStories()
    }, [])

    if (loading || stories.length === 0) return null

    return (
        <section className="relative py-[clamp(3rem,8vw,6rem)] bg-[#fffaf4] overflow-hidden">
            {/* Subtle saffron glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-saffron/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-[clamp(2rem,6vw,4rem)]">

                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-bold text-[#2a1f15] leading-tight"
                            style={{
                                fontSize: "clamp(1.8rem, 4vw, 3rem)"
                            }}
                        >
                            Spiritual{" "}
                            <span className="text-saffron">
                                Stories
                            </span>{" "}
                            & Insights
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-[#6b5b4b]"
                            style={{
                                fontSize:
                                    "clamp(0.95rem, 1.5vw, 1.1rem)"
                            }}
                        >
                            Explore our collection of articles on tradition,
                            spirituality, and mindful innovation.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link to="/stories">
                            <Button
                                variant="outline"
                                className="border-saffron text-saffron hover:bg-saffron hover:text-white transition-all duration-300 rounded-full px-6"
                            >
                                View All Stories
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Grid - 2 columns mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-[clamp(1rem,3vw,2.5rem)]">

                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/stories/${story.slug}`}>
                                <Card className="h-full border border-saffron/10 bg-white/70 backdrop-blur-sm hover:shadow-[0_15px_40px_rgba(255,140,0,0.15)] transition-all duration-500 rounded-2xl overflow-hidden group">

                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden">
                                        <img
                                            src={getImageUrl(story.image)}
                                            alt={story.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>

                                    <CardContent className="p-[clamp(0.9rem,2vw,1.6rem)]">

                                        {/* Date */}
                                        <div className="flex items-center gap-2 text-[clamp(0.65rem,2vw,0.75rem)] text-[#8b7355] mb-3">
                                            <Calendar className="h-3 w-3 text-saffron" />
                                            {new Date(
                                                story.publishedAt ||
                                                story.createdAt
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="font-semibold text-[#2a1f15] group-hover:text-saffron transition-colors leading-snug line-clamp-2"
                                            style={{
                                                fontSize:
                                                    "clamp(0.95rem,2.8vw,1.2rem)"
                                            }}
                                        >
                                            {story.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p
                                            className="mt-3 text-[#6b5b4b] line-clamp-3 leading-relaxed"
                                            style={{
                                                fontSize:
                                                    "clamp(0.75rem,2.4vw,0.9rem)"
                                            }}
                                        >
                                            {story.excerpt}
                                        </p>

                                        {/* Read More */}
                                        <div className="mt-5 flex items-center text-saffron font-medium text-[clamp(0.7rem,2vw,0.85rem)]">
                                            Read More
                                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>

                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
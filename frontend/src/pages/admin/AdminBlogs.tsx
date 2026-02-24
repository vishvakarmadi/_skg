
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import api from '@/api';
import type { Blog } from '@/types';
import { toast } from 'sonner';

export function AdminBlogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await api.blogs.getAll({
                all: true,
                page,
                per_page: 10,
                q: searchTerm
            });
            if (response.data.success && response.data.data) {
                const data = response.data.data as any;
                // Backend might return snake_case is_published. Mapping handled by default or manually?
                // I'll map it to be safe.
                const mapped = (data.data || []).map((b: any) => ({
                    ...b,
                    isPublished: b.is_published !== undefined ? b.is_published : b.isPublished,
                    isFeatured: b.is_featured !== undefined ? b.is_featured : b.isFeatured,
                    publishedAt: b.published_at || b.publishedAt
                }));
                setBlogs(mapped);
                setMeta({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    total: data.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch blogs', error);
            toast.error('Failed to load stories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, [page]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchBlogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this story?')) return;

        try {
            await api.blogs.delete(id);
            toast.success('Story deleted successfully');
            fetchBlogs();
        } catch (error) {
            console.error('Failed to delete blog', error);
            toast.error('Failed to delete story');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Stories <span className="text-slate-400 text-lg font-normal">(Blogs)</span></h1>
                <Button onClick={() => navigate('/admin/blogs/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add New Story
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-md border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search stories by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Published Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400">Loading stories...</TableCell>
                            </TableRow>
                        ) : blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-20 text-slate-400">No stories found.</TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell>
                                        <div className="h-12 w-20 rounded overflow-hidden bg-slate-100 border">
                                            <img
                                                src={getImageUrl(blog.image)}
                                                alt={blog.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 line-clamp-1">{blog.title}</span>
                                            <span className="text-xs text-slate-500 font-mono">{blog.slug}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={blog.isPublished ? "default" : "secondary"} className={blog.isPublished ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : ""}>
                                            {blog.isPublished ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {blog.isFeatured ? (
                                            <Badge className="bg-orange-100 text-orange-600 border-none hover:bg-orange-100">
                                                <Star className="h-3 w-3 mr-1 fill-orange-600" /> Featured
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => window.open(`/stories/${blog.slug}`, '_blank')}>
                                                <Eye className="h-4 w-4 text-slate-400" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}>
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white p-4 border rounded-md shadow-sm">
                <div className="text-sm text-muted-foreground font-medium">
                    Showing {blogs.length} of {meta.total} stories
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={meta.current_page <= 1}
                        className="text-slate-600"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center gap-1 font-bold text-sm px-4">
                        <span className="text-orange-600">{meta.current_page}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-600">{meta.last_page}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                        disabled={meta.current_page >= meta.last_page}
                        className="text-slate-600"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

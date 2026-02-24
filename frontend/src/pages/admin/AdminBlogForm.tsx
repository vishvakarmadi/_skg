
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    Upload,
    Save,
    Eye,
    Tag,
    Globe,
    Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/api';
import type { Blog } from '@/types';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export function AdminBlogForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Blog>>({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        isPublished: true,
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: ''
    });

    // Quill Modules
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (isEditMode && id) {
                setLoading(true);
                try {
                    const response = await api.blogs.getBySlug(id); // Backend supports ID or Slug
                    if (response.data.success && response.data.data) {
                        const blog = response.data.data as any;
                        setFormData({
                            ...blog,
                            isPublished: blog.is_published !== undefined ? !!blog.is_published : !!blog.isPublished,
                            isFeatured: blog.is_featured !== undefined ? !!blog.is_featured : !!blog.isFeatured,
                            publishedAt: blog.published_at || blog.publishedAt,
                            createdAt: blog.created_at || blog.createdAt,
                            metaTitle: blog.meta_title || blog.metaTitle || '',
                            metaDescription: blog.meta_description || blog.metaDescription || '',
                            metaKeywords: blog.meta_keywords || blog.metaKeywords || ''
                        });
                    }
                } catch (error) {
                    console.error('Failed to load story', error);
                    toast.error('Failed to load story');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('title', formData.title || '');
            data.append('excerpt', formData.excerpt || '');
            data.append('content', formData.content || '');
            data.append('is_published', formData.isPublished ? '1' : '0');
            data.append('is_featured', formData.isFeatured ? '1' : '0');
            data.append('meta_title', formData.metaTitle || '');
            data.append('meta_description', formData.metaDescription || '');
            data.append('meta_keywords', formData.metaKeywords || '');

            if (imageFile) {
                data.append('image', imageFile);
            } else if (formData.image) {
                data.append('image', formData.image);
            }

            if (isEditMode && id) {
                await api.blogs.update(id, data);
                toast.success('Story updated successfully');
            } else {
                await api.blogs.create(data);
                toast.success('Story created successfully');
            }
            navigate('/admin/blogs');
        } catch (error) {
            console.error('Failed to save story', error);
            // @ts-ignore
            const msg = error.response?.data?.message || 'Failed to save story';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
                <p className="text-slate-500 font-medium">Loading story data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blogs')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isEditMode ? 'Edit Story' : 'New Story'}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate('/admin/blogs')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="bg-orange-600 hover:bg-orange-700">
                        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        {isEditMode ? 'Update Story' : 'Publish Story'}
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layout className="h-5 w-5 text-orange-600" /> General Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-slate-700">Story Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter a compelling title..."
                                    className="text-lg font-medium py-6"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="text-slate-700">Short Summary (Excerpt)</Label>
                                <Textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    placeholder="Brief summary for cards and search results..."
                                    rows={3}
                                />
                                <p className="text-[11px] text-slate-400">Keep it under 160 characters for best visibility.</p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700">Main Content</Label>
                                <div className="bg-white rounded-md border min-h-[400px]">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={handleContentChange}
                                        modules={modules}
                                        className="h-[350px] mb-12"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-5 w-5 text-orange-600" /> SEO & Meta Tags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input
                                    id="metaTitle"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleInputChange}
                                    placeholder="Title for search engines..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleInputChange}
                                    placeholder="Description for search engines..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                                <Input
                                    id="metaKeywords"
                                    name="metaKeywords"
                                    value={formData.metaKeywords}
                                    onChange={handleInputChange}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Tag className="h-5 w-5 text-orange-600" /> Status & Visibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Published</Label>
                                    <p className="text-xs text-slate-500">Live on the website</p>
                                </div>
                                <Switch
                                    checked={formData.isPublished}
                                    onCheckedChange={(c) => handleSwitchChange('isPublished', c)}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold">Featured</Label>
                                    <p className="text-xs text-slate-500">Show in home section</p>
                                </div>
                                <Switch
                                    checked={formData.isFeatured}
                                    onCheckedChange={(c) => handleSwitchChange('isFeatured', c)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Upload className="h-5 w-5 text-orange-600" /> Cover Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {formData.image && (
                                <div className="aspect-[16/10] rounded-md overflow-hidden border shadow-inner">
                                    <img src={formData.image.startsWith('blob:') ? formData.image : (formData.image.startsWith('http') ? formData.image : `http://localhost:8000${formData.image}`)} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex flex-col gap-3">
                                <Button type="button" variant="outline" className="relative cursor-pointer w-full py-8 border-dashed border-2 bg-slate-50 hover:bg-slate-100 transition-all">
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="h-6 w-6 text-slate-400" />
                                        <span className="text-sm text-slate-600 font-medium">Click to upload image</span>
                                    </div>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setImageFile(e.target.files[0]);
                                                const url = URL.createObjectURL(e.target.files[0]);
                                                setFormData(prev => ({ ...prev, image: url }));
                                            }
                                        }}
                                    />
                                </Button>
                                <div className="relative">
                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200" />
                                    <span className="relative z-10 mx-auto px-2 bg-white text-[10px] text-slate-400 font-bold uppercase block w-max">OR URL</span>
                                </div>
                                <Input
                                    name="image"
                                    value={formData.image && !formData.image.startsWith('blob:') ? formData.image : ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter Image URL"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {isEditMode && (
                        <Card className="shadow-sm border-slate-200 bg-slate-50">
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-slate-400" /> Quick Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="outline"
                                    className="w-full text-slate-600"
                                    onClick={() => window.open(`/stories/${formData.slug}`, '_blank')}
                                >
                                    View Live Story
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </form>
        </div>
    );
}


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import api from '@/api';
import type { Category } from '@/types';

export function AdminCategoryForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Category>>({
        name: '',
        nameHi: '',
        slug: '',
        description: '',
        image: '',
        icon: '',
        sortOrder: 0,
        isActive: true,
        parentId: null as any // Optional parent
    } as any);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch All Categories for Parent Selection
                const catResponse = await api.categories.getAll();
                if (catResponse.data.success && catResponse.data.data) {
                    setCategories(catResponse.data.data.filter(c => c.id !== id)); // Exclude self if editing
                }

                // Fetch Category if Edit Mode
                if (isEditMode && id) {
                    // We assume getBySlug works with ID or added getById
                    // api.categories.getBySlug returns Category
                    const response = await api.categories.getBySlug(id);
                    if (response.data.success && response.data.data) {
                        const category = response.data.data as any;
                        setFormData({
                            ...category,
                            nameHi: category.name_hi || category.nameHi || '',
                            isActive: category.is_active !== undefined ? !!category.is_active : !!category.isActive,
                            sortOrder: category.sort_order !== undefined ? category.sort_order : category.sortOrder,
                            parentId: category.parent_id !== undefined ? category.parent_id : category.parentId
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to load data', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = new FormData();
            payload.append('name', formData.name || '');
            payload.append('name_hi', formData.nameHi || '');
            if (formData.slug) payload.append('slug', formData.slug);
            payload.append('description', formData.description || '');
            payload.append('sort_order', (formData.sortOrder || 0).toString());
            payload.append('is_active', formData.isActive ? '1' : '0');
            if (formData.parentId) payload.append('parent_id', formData.parentId);

            // Handle Image
            if (imageFile) {
                payload.append('image', imageFile);
            } else if (formData.image) {
                payload.append('image', formData.image);
            }

            // Handle Icon
            payload.append('icon', formData.icon || '');

            if (isEditMode && id) {
                await api.categories.update(id, payload);
                toast.success('Category updated successfully');
            } else {
                await api.categories.create(payload);
                toast.success('Category created successfully');
            }
            navigate('/admin/categories');
        } catch (error) {
            console.error('Failed to save category', error);
            // @ts-ignore
            const msg = error.response?.data?.message || 'Failed to save category';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/categories')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? 'Edit Category' : 'New Category'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name (English)</Label>
                                <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameHi">Name (Hindi)</Label>
                                <Input id="nameHi" name="nameHi" value={formData.nameHi || ''} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug (Optional)</Label>
                            <Input id="slug" name="slug" value={formData.slug || ''} onChange={handleInputChange} placeholder="Leave empty to auto-generate" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentId">Parent Category</Label>
                            <Select
                                value={formData.parentId || "none"}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, parentId: val === "none" ? null : val as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="No Parent (Top Level)" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Parent (Top Level)</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Input id="sortOrder" name="sortOrder" type="number" value={formData.sortOrder} onChange={handleInputChange} />
                            </div>
                            <div className="flex items-end pb-2">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={formData.isActive}
                                        onCheckedChange={(c) => handleSwitchChange('isActive', c)}
                                    />
                                    <Label>Active</Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Image</Label>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <Button type="button" variant="outline" className="relative cursor-pointer">
                                        <div className="flex items-center">
                                            <Upload className="mr-2 h-4 w-4" />
                                            <span>Upload Image</span>
                                        </div>
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setImageFile(e.target.files[0]);
                                                    // Preview
                                                    const url = URL.createObjectURL(e.target.files[0]);
                                                    setFormData((prev: any) => ({ ...prev, image: url }));
                                                }
                                            }}
                                        />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">OR</span>
                                    <Input
                                        id="image"
                                        name="image"
                                        value={formData.image || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Image URL"
                                        className="flex-1"
                                    />
                                </div>
                                {formData.image && (
                                    <div className="mt-2 rounded-md overflow-hidden border w-32 h-32">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/categories')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Update Category' : 'Create Category'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

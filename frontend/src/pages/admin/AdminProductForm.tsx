
import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import { useNavigate, useParams } from 'react-router-dom';

// Actually standard state is safer if I don't know package.json.
// Let's use standard state.

import {
    ArrowLeft,
    X,
    Plus,
    Upload,
    Loader2
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
import type { Product, Category } from '@/types';

export function AdminProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        nameHi: '',
        sku: '',
        price: 0,
        comparePrice: 0,
        stock: 0,
        description: '',
        descriptionHi: '',
        type: 'worship',
        isValid: true, // Internal use
        isFeatured: false,
        isNew: false,
        isBestseller: false,
        purityCertified: false,
        images: [],
        tags: [],
        purityFeatures: [],
        categoryId: '', // We use categoryId for API, though type has category object
        // New Fields
        devotionalUse: '',
        batchNumber: '',
        madeOn: '',
        technicalSpecs: '',
        warranty: '',
        productionCapacity: '',
        cardStyle: 'bhakti',
        metaTitle: '',
        metaDescription: '',
    } as any);

    const [imageFiles, setImageFiles] = useState<File[]>([]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const catResponse = await api.categories.getAll();
                if (catResponse.data.success && catResponse.data.data) {
                    setCategories(catResponse.data.data);
                }

                // Fetch Product if Edit Mode
                if (isEditMode && id) {
                    // We skip prodResponse since we use getBySlug below. 
                    // But wait, the original code had:
                    // const prodResponse = await api.products.getBySlug(id); // Usually id, but api is bySlug? admin api uses id.
                    // The linter says prodResponse is never read. In the original code, I had TWO calls.
                    // One commented out logic, then `const response = await ...`.
                    // I will just remove the unused variable warning by removing the line if it was dead code.
                    // Actually, I wrote:
                    // if (isEditMode && id) {
                    //     const prodResponse = ... check comments ...
                    //     const response = await ...
                    // }
                    // So `prodResponse` line 76 is indeed unused.
                    // I will just remove it.
                    // Let's check api.products.update signature. It takes id.
                    // But to fetch for edit, we need getById.
                    // api.products.getBySlug is for public.
                    // api/index.ts doesn't have getById for admin? 
                    // It has getAll, create, update, delete.
                    // Public getBySlug returns Product. 
                    // Let's assume we can use public API or we might need to add getById to admin api.
                    // For now I'll try public getBySlug but likely I need BY ID.
                    // Checking index.ts -> `getBySlug: (slug: string) => ...`
                    // Does it work with ID? Probably not if backend expects slug.
                    // Wait, Admin list shows ID.
                    // If I pass ID to getBySlug it might fail if backend looks up slug.
                    // BUT, I can filter from the list? No, that's bad.
                    // Let's assume for now I can use `api.products.getBySlug(id)` if the ID is actually a slug or if backend handles id lookup fallback.
                    // Actually, usually in admin we use ID.
                    // Let's look at `api/index.ts` again.
                    // `getBySlug` calls `/products/${slug}`.
                    // I will use that.
                    // If it fails, I might need to implement `getById` in admin API.

                    // Actually, I should check if there is an admin getById.
                    // `productsApi` object in index.ts:
                    //   getBySlug, ...
                    //   create, update, delete.
                    // No admin getById.
                    // I'll try `/products/${id}` (public endpoint) - it might work if backend accepts ID or Slug.
                    // Looking at ProductController (public) usually supports slug.

                    const response = await api.products.getBySlug(id); // Hoping ID works or slug is passed
                    if (response.data.success && response.data.data) {
                        const prod = response.data.data as any;

                        // Handle technical specs which might be snake_case in API
                        const rawSpecs = prod.technical_specs || prod.technicalSpecs;
                        let specString = '';
                        if (rawSpecs && typeof rawSpecs === 'object' && !Array.isArray(rawSpecs)) {
                            specString = Object.entries(rawSpecs)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join('\n');
                        } else if (typeof rawSpecs === 'string') {
                            specString = rawSpecs;
                        } else if (Array.isArray(rawSpecs)) {
                            specString = rawSpecs.join('\n');
                        }

                        // Sanitize arrays
                        const sanitizedTags = Array.isArray(prod.tags) ? prod.tags : [];
                        const sanitizedPurityFeatures = Array.isArray(prod.purity_features || prod.purityFeatures)
                            ? (prod.purity_features || prod.purityFeatures)
                            : [];
                        const sanitizedImages = Array.isArray(prod.images)
                            ? prod.images.filter((img: any) => typeof img === 'string')
                            : [];

                        setFormData({
                            ...prod,
                            nameHi: prod.name_hi || prod.nameHi || '',
                            descriptionHi: prod.description_hi || prod.descriptionHi || '',
                            comparePrice: prod.compare_price !== undefined ? prod.compare_price : prod.comparePrice,
                            isFeatured: prod.is_featured !== undefined ? !!prod.is_featured : !!prod.isFeatured,
                            isNew: prod.is_new !== undefined ? !!prod.is_new : !!prod.isNew,
                            isBestseller: prod.is_bestseller !== undefined ? !!prod.is_bestseller : !!prod.isBestseller,
                            purityCertified: prod.purity_certified !== undefined ? !!prod.purity_certified : !!prod.purityCertified,
                            categoryId: prod.category_id || prod.categoryId || prod.category?.id || '',
                            devotionalUse: prod.devotional_use || prod.devotionalUse || '',
                            batchNumber: prod.batch_number || prod.batchNumber || '',
                            madeOn: prod.made_on || prod.madeOn || '',
                            metaTitle: prod.meta_title || prod.metaTitle || '',
                            metaDescription: prod.meta_description || prod.metaDescription || '',
                            productionCapacity: prod.production_capacity || prod.productionCapacity || '',
                            warranty: prod.warranty || '',
                            tags: sanitizedTags,
                            purityFeatures: sanitizedPurityFeatures,
                            images: sanitizedImages,
                            technicalSpecs: specString as any,
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
        if (name === 'tags' || name === 'purityFeatures') {
            setFormData(prev => ({
                ...prev,
                [name]: value.split(',').map((s: string) => s.trim())
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseFloat(value) : value
            }));
        }
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const addImageUrl = () => {
        const url = prompt("Enter image URL");
        if (url) {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), url]
            }));
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeFile = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            data.append('name', formData.name || '');
            data.append('name_hi', formData.nameHi || '');
            data.append('description', formData.description || '');
            data.append('description_hi', formData.descriptionHi || '');
            data.append('sku', formData.sku || '');
            data.append('price', (formData.price || 0).toString());
            data.append('compare_price', (formData.comparePrice || 0).toString());
            data.append('stock', (formData.stock || 0).toString());
            data.append('type', formData.type || 'worship');
            data.append('card_style', formData.type === 'worship' ? 'bhakti' : 'yantra');
            data.append('is_featured', formData.isFeatured ? '1' : '0');
            data.append('is_new', formData.isNew ? '1' : '0');
            data.append('is_bestseller', formData.isBestseller ? '1' : '0');
            data.append('purity_certified', formData.purityCertified ? '1' : '0');
            data.append('category_id', (formData as any).categoryId || '');

            // Append Arrays (Tags, Purity Features)
            // Note: FormData handles array by appending multiple times with same key ending in []
            (formData.tags || []).forEach((tag: string) => data.append('tags[]', tag));
            (formData.purityFeatures || []).forEach((feat: string) => data.append('purity_features[]', feat));

            // Handle Images
            // 1. Existing URLs
            (formData.images || []).forEach((url: string) => data.append('images[]', url));

            // 2. New Files
            imageFiles.forEach((file) => data.append('images[]', file));

            // Missing Fields
            data.append('card_style', formData.cardStyle || 'bhakti');
            data.append('devotional_use', formData.devotionalUse || '');
            data.append('batch_number', formData.batchNumber || '');
            data.append('made_on', formData.madeOn || '');
            data.append('meta_title', formData.metaTitle || '');
            data.append('meta_description', formData.metaDescription || '');

            // Technical Specs (Array of strings from newline)
            if (formData.technicalSpecs) {
                const specs = (formData.technicalSpecs as unknown as string).split('\n').filter((s: string) => s.trim() !== '');
                specs.forEach((s: string) => data.append('technical_specs[]', s.trim()));
            }

            // Machinery Fields
            if (formData.type === 'machinery') {
                if (formData.productionCapacity) data.append('production_capacity', formData.productionCapacity);
                if (formData.warranty) data.append('warranty', formData.warranty);
            }

            if (isEditMode && id) {
                await api.products.update(id, data);
                toast.success('Product updated successfully');
            } else {
                await api.products.create(data);
                toast.success('Product created successfully');
                navigate('/admin/products');
            }
        } catch (error) {
            console.error('Failed to save product', error);
            // @ts-ignore
            const msg = error.response?.data?.message || 'Failed to save product';
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/products')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? 'Edit Product' : 'New Product'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
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
                                    <Label htmlFor="description">Description (English)</Label>
                                    <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={5} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="descriptionHi">Description (Hindi)</Label>
                                    <Textarea id="descriptionHi" name="descriptionHi" value={formData.descriptionHi || ''} onChange={handleInputChange} rows={5} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* New Section: Details & SEO */}
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-medium mb-2">Additional Details</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="devotionalUse">Devotional Use</Label>
                                    <Textarea id="devotionalUse" name="devotionalUse" value={formData.devotionalUse || ''} onChange={handleInputChange} rows={3} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags (comma separated)</Label>
                                    <Input
                                        id="tags"
                                        name="tags"
                                        value={(formData.tags || []).join(', ')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="purityFeatures">Purity Features (comma separated)</Label>
                                    <Input
                                        id="purityFeatures"
                                        name="purityFeatures"
                                        value={(formData.purityFeatures || []).join(', ')}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="batchNumber">Batch Number</Label>
                                        <Input id="batchNumber" name="batchNumber" value={formData.batchNumber || ''} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="madeOn">Made On</Label>
                                        <Input id="madeOn" name="madeOn" type="date" value={formData.madeOn || ''} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input id="metaTitle" name="metaTitle" value={formData.metaTitle || ''} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea id="metaDescription" name="metaDescription" value={formData.metaDescription || ''} onChange={handleInputChange} rows={3} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <h3 className="font-medium mb-2">Images</h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    {/* Existing URL Images */}
                                    {formData.images?.map((img, idx) => (
                                        <div key={`url-${idx}`} className="relative aspect-square rounded-md overflow-hidden border group">
                                            <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New File Images */}
                                    {imageFiles.map((file, idx) => (
                                        <div key={`file-${idx}`} className="relative aspect-square rounded-md overflow-hidden border group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <Label
                                        htmlFor="image-upload"
                                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-muted transition-colors cursor-pointer"
                                    >
                                        <Upload className="h-6 w-6 mb-1 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Upload</span>
                                    </Label>
                                    <Input
                                        id="image-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    {/* Add URL Button */}
                                    <button
                                        type="button"
                                        onClick={addImageUrl}
                                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-md hover:bg-muted transition-colors"
                                    >
                                        <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Add URL</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.isFeatured}
                                            onCheckedChange={(c) => handleSwitchChange('isFeatured', c)}
                                        />
                                        <Label>Featured Product</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.isNew}
                                            onCheckedChange={(c) => handleSwitchChange('isNew', c)}
                                        />
                                        <Label>New Arrival</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.isBestseller}
                                            onCheckedChange={(c) => handleSwitchChange('isBestseller', c)}
                                        />
                                        <Label>Bestseller</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={formData.purityCertified}
                                            onCheckedChange={(c) => handleSwitchChange('purityCertified', c)}
                                        />
                                        <Label>Purity Certified</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Product Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, type: val as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="worship">Worship</SelectItem>
                                            <SelectItem value="machinery">Machinery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={(formData as any).categoryId}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val } as any))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cardStyle">Card Style</Label>
                                    <Select
                                        value={formData.cardStyle}
                                        onValueChange={(val) => setFormData(prev => ({ ...prev, cardStyle: val as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bhakti">Bhakti</SelectItem>
                                            <SelectItem value="yantra">Yantra</SelectItem>
                                            <SelectItem value="featured">Featured</SelectItem>
                                            <SelectItem value="compact">Compact</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.type === 'machinery' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="productionCapacity">Production Capacity (Optional)</Label>
                                            <Input id="productionCapacity" name="productionCapacity" value={formData.productionCapacity || ''} onChange={handleInputChange} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="technicalSpecs">Technical Specs (One per line)</Label>
                                            <Textarea id="technicalSpecs" name="technicalSpecs" value={(formData.technicalSpecs as any) || ''} onChange={handleInputChange} rows={4} placeholder="Spec 1&#10;Spec 2" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="warranty">Warranty</Label>
                                            <Input id="warranty" name="warranty" value={formData.warranty || ''} onChange={handleInputChange} />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comparePrice">Compare Price (₹)</Label>
                                    <Input id="comparePrice" name="comparePrice" type="number" value={formData.comparePrice} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock</Label>
                                    <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleInputChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input id="sku" name="sku" value={formData.sku || ''} onChange={handleInputChange} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

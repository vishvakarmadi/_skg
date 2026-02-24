
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Loader2,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
// import type { Banner } from '@/types';

export function AdminBannerForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [mobileImageFile, setMobileImageFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({
        title: '',
        image: '',
        mobile_image: '',
        // @ts-ignore
        link: '',
        type: 'hero',
        sortOrder: 0,
        isActive: true,
        ctaText: 'Shop Now',
        ctaLink: ''
    } as any);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (isEditMode && id) {
                setLoading(true);
                try {
                    // Assuming we have to find it from the list or add getById
                    // api.banners.getAll returns items.
                    // But we might need getById.
                    // I'll use getAll and find for MVP if getById is missing.
                    // Wait, usually admins have getById.
                    // api/index.ts -> bannersApi has `getAll`. No `getById`.
                    // But `BannerController` has `update` which needs ID.
                    // I'll try to fetch all and find it, OR add getById to API.
                    // Fetching all is safer given I can't easily change API index now without viewing it again.
                    // Actually, `BannerController` has `show`? No, I checked it earlier... wait.
                    // I CHECKED BannerController lines 1-108. It has `index`, `byType`, `store`, `update`, `destroy`.
                    // IT DOES NOT HAVE `show`!
                    // So I MUST fetch all and filter.

                    // Fetch all banners (including inactive) to find the one we're editing
                    const response = await api.banners.getAll({ all: true });
                    if (response.data.success && response.data.data) {
                        const allBanners = response.data.data as any[];
                        const banner = allBanners.find((b: any) => String(b.id) === String(id));
                        if (banner) {
                            setFormData({
                                ...banner,
                                isActive: banner.is_active !== undefined ? banner.is_active : banner.isActive,
                                sortOrder: banner.sort_order !== undefined ? banner.sort_order : banner.sortOrder,
                                ctaLink: banner.cta_link || banner.link || banner.ctaLink || '',
                                ctaText: banner.cta_text || banner.ctaText || 'Shop Now'
                            });
                        } else {
                            toast.error('Banner not found');
                            navigate('/admin/banners');
                        }
                    }
                } catch (error) {
                    console.error('Failed to load banner', error);
                    toast.error('Failed to load banner');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id, isEditMode, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData((prev: any) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title || '');
            payload.append('link', formData.link || formData.ctaLink || '');
            payload.append('type', formData.type);
            payload.append('sort_order', (formData.sortOrder || 0).toString());
            payload.append('is_active', formData.isActive ? '1' : '0');

            if (imageFile) {
                payload.append('image', imageFile);
            } else if (formData.image && typeof formData.image === 'string' && !formData.image.startsWith('blob:')) {
                payload.append('image', formData.image);
            }

            if (mobileImageFile) {
                payload.append('mobile_image', mobileImageFile);
            } else if (formData.mobile_image && typeof formData.mobile_image === 'string' && !formData.mobile_image.startsWith('blob:')) {
                payload.append('mobile_image', formData.mobile_image);
            }

            if (isEditMode && id) {
                await api.banners.update(id, payload);
                toast.success('Banner updated successfully');
            } else {
                await api.banners.create(payload);
                toast.success('Banner created successfully');
            }
            navigate('/admin/banners');
        } catch (error) {
            console.error('Failed to save banner', error);
            // @ts-ignore
            const msg = error.response?.data?.message || 'Failed to save banner';
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
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/banners')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditMode ? 'Edit Banner' : 'New Banner'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title (Optional)</Label>
                            <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Desktop Image</Label>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <Button type="button" variant="outline" className="relative cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        toast.warning('Image size should be less than 2MB');
                                                        return;
                                                    }
                                                    setImageFile(file);
                                                    const url = URL.createObjectURL(file);
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
                            </div>
                            {formData.image && (
                                <div className="mt-2 rounded-md overflow-hidden border">
                                    <img src={formData.image} alt="Desktop Preview" className="w-full h-auto max-h-[150px] object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mobile_image">Mobile Image (Optional)</Label>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <Button type="button" variant="outline" className="relative cursor-pointer">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Mobile Image
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    if (file.size > 2 * 1024 * 1024) {
                                                        toast.warning('Image size should be less than 2MB');
                                                        return;
                                                    }
                                                    setMobileImageFile(file);
                                                    const url = URL.createObjectURL(file);
                                                    setFormData((prev: any) => ({ ...prev, mobile_image: url }));
                                                }
                                            }}
                                        />
                                    </Button>
                                    <span className="text-sm text-muted-foreground">OR</span>
                                    <Input
                                        id="mobile_image"
                                        name="mobile_image"
                                        value={formData.mobile_image || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter Mobile Image URL"
                                        className="flex-1"
                                    />
                                </div>
                            </div>
                            {formData.mobile_image && (
                                <div className="mt-2 rounded-md overflow-hidden border">
                                    <img src={formData.mobile_image} alt="Mobile Preview" className="w-full h-auto max-h-[150px] object-cover" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="link">Link URL</Label>
                            <Input id="link" name="link" value={formData.link || ''} onChange={handleInputChange} placeholder="/products/..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData((prev: any) => ({ ...prev, type: val as any }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hero">Hero Slider</SelectItem>
                                    <SelectItem value="festival">Festival</SelectItem>
                                    <SelectItem value="promo">Promo</SelectItem>
                                    <SelectItem value="machinery">Machinery</SelectItem>
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


                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/banners')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Update Banner' : 'Create Banner'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

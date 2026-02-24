import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils';

import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Edit,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import api from '@/api';
import type { Banner } from '@/types';

export function AdminBanners() {
    const navigate = useNavigate();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            // Pass { all: true } to fetch inactive banners too
            const response = await api.banners.getAll({ all: true });
            if (response.data.success && response.data.data) {
                const mappedBanners = response.data.data.map((b: any) => ({
                    ...b,
                    isActive: b.is_active !== undefined ? b.is_active : b.isActive,
                    sortOrder: b.sort_order !== undefined ? b.sort_order : b.sortOrder
                }));
                setBanners(mappedBanners);
            }
        } catch (error) {
            console.error('Failed to fetch banners', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this banner?')) return;

        try {
            await api.banners.delete(id);
            setBanners(banners.filter(b => b.id !== id));
        } catch (error) {
            console.error('Failed to delete banner', error);
            alert('Failed to delete banner');
        }
    };

    const handleStatusToggle = async (id: string, isActive: boolean) => {
        try {
            // @ts-ignore - API expects snake_case if payload, but usually update takes object. 
            // We'll update the local state first optimistically
            setBanners(banners.map(b => b.id === id ? { ...b, isActive } : b));

            await api.banners.update(id, { is_active: isActive } as any);
        } catch (error) {
            console.error('Failed to update status', error);
            // Revert
            setBanners(banners.map(b => b.id === id ? { ...b, isActive: !isActive } : b));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Banners</h1>
                <Button onClick={() => navigate('/admin/banners/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Banner
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : banners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">No banners found</TableCell>
                            </TableRow>
                        ) : (
                            banners.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                        <div className="h-16 w-24 rounded-md overflow-hidden bg-gray-100">
                                            {banner.image && (
                                                <img
                                                    src={getImageUrl(banner.image)}
                                                    alt={banner.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <div>{banner.title}</div>
                                        <div className="text-xs text-muted-foreground">{banner.subtitle}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{banner.type}</Badge>
                                    </TableCell>
                                    <TableCell>{banner.sortOrder}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={banner.isActive}
                                            onCheckedChange={(checked) => handleStatusToggle(banner.id, checked)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/banners/${banner.id}/edit`)}>
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(banner.id)}>
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
        </div>
    );
}


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
import api from '@/api';
import type { Category } from '@/types';

export function AdminCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await api.categories.getAll();
            if (response.data.success && response.data.data) {
                const mappedCategories = response.data.data.map((c: any) => ({
                    ...c,
                    isActive: c.is_active !== undefined ? !!c.is_active : !!c.isActive
                }));
                setCategories(mappedCategories);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.categories.delete(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category', error);
            alert('Failed to delete category');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Button onClick={() => navigate('/admin/categories/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Parent</TableHead>
                            <TableHead>Active</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">No categories found</TableCell>
                            </TableRow>
                        ) : (
                            categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                            {category.image && (
                                                <img
                                                    src={getImageUrl(category.image)}
                                                    alt={category.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{category.slug}</TableCell>
                                    <TableCell>{category.parentId || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={category.isActive ? 'outline' : 'destructive'}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/categories/${category.id}/edit`)}>
                                                    <Edit className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
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


import { useEffect, useState } from 'react';
import { getImageUrl } from '@/lib/utils';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import type { Product } from '@/types';
import { useNavigate } from 'react-router-dom';

export function AdminMachinery() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [categories, setCategories] = useState<any[]>([]);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [tagFilter, setTagFilter] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Fetch Categories
        api.categories.getAll().then(res => {
            if (res.data.success) setCategories(res.data.data || []);
        });
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                per_page: 10,
                type: 'machinery' // Force fetch only machinery products
            };
            if (searchTerm) params.search = searchTerm;
            if (categoryFilter !== 'all') params.category = categoryFilter;
            if (tagFilter) params.tag = tagFilter;

            const response = await api.products.getAll(params);
            if (response.data.success && response.data.data) {
                setProducts(response.data.data.data);
                const metaData = response.data.data as any;
                setMeta({
                    current_page: metaData.current_page,
                    last_page: metaData.last_page,
                    total: metaData.total
                });
            }
        } catch (error) {
            console.error('Failed to fetch machinery products', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page, categoryFilter]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, tagFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this machine?')) return;

        try {
            await api.products.delete(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Machinery</h1>
                <Button onClick={() => navigate('/admin/products/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Machine
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-md border">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search machines..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={(val) => { setCategoryFilter(val); setPage(1); }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Filter by Tag"
                    value={tagFilter}
                    onChange={(e) => { setTagFilter(e.target.value); setPage(1); }}
                    className="w-[180px]"
                />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-center">Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">No machinery products found</TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100">
                                            {product.images && product.images[0] && (
                                                <img
                                                    src={getImageUrl(product.images[0])}
                                                    alt={product.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{product.category?.name}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₹{product.price}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                                            {product.stock}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/products/${product.id}/edit`)}>
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
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
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Page {meta.current_page} of {meta.last_page} ({meta.total} machines)
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={meta.current_page <= 1}
                    >
                        <ChevronLeft className="h-4 w-4" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                        disabled={meta.current_page >= meta.last_page}
                    >
                        Next <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}


import { useEffect, useState } from 'react';
import {
    Search,
    Edit // Adding Edit
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import api from '@/api';
import type { Order } from '@/types';

import { transformKeys } from '@/api/transform';

export function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
    const [newStatus, setNewStatus] = useState<string>('');
    const [trackingNumber, setTrackingNumber] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.orders.getAllAdmin({});
            if (response.data.success && response.data.data) {
                // Handle pagination response
                const items = (response.data.data as any).data || response.data.data;
                const rawItems = Array.isArray(items) ? items : [];
                setOrders(rawItems.map((item: any) => transformKeys<Order>(item)));
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return;

        try {
            await api.orders.updateStatus(selectedOrder.orderNumber, {
                status: newStatus,
                tracking_number: trackingNumber,
                tracking_url: trackingUrl
            });

            // Refresh orders
            fetchOrders();
            setStatusUpdateOpen(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setTrackingNumber(order.trackingNumber || '');
        setTrackingUrl(order.trackingUrl || '');
        setStatusUpdateOpen(true);
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // @ts-ignore
        (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'delivered': return 'default';
            case 'processing': return 'secondary';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-md border">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order #</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">No orders found</TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            {/* @ts-ignore */}
                                            <span>{order.user?.name || 'Guest'}</span>
                                            {/* @ts-ignore */}
                                            <span className="text-xs text-muted-foreground">{order.user?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.paymentStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(order.status) as any}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">₹{order.total}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openStatusModal(order)}>
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(newStatus === 'shipped' || newStatus === 'out_for_delivery') && (
                                <>
                                    <div className="grid gap-2">
                                        <Label>Tracking Number</Label>
                                        <Input
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Tracking URL</Label>
                                        <Input
                                            value={trackingUrl}
                                            onChange={(e) => setTrackingUrl(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusUpdateOpen(false)}>Cancel</Button>
                        <Button onClick={handleStatusUpdate}>Update Status</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

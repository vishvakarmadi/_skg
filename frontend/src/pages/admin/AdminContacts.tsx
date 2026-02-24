
import { useEffect, useState } from 'react';
import {
    Mail,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import api from '@/api';
import type { ContactMessage } from '@/types';

export function AdminContacts() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await api.contact.getAll();
            if (response.data.success && response.data.data) {
                // @ts-ignore
                setMessages(response.data.data.data || response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            await api.contact.updateStatus(id, status);
            setMessages(messages.map(m => m.id === id ? { ...m, status: status as any } : m));
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            // Assuming api.contact.delete exists
            // @ts-ignore
            await api.contact.delete(id);
            setMessages(messages.filter(m => m.id !== id));
        } catch (error) {
            console.error('Failed to delete message', error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Inquiries</h1>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : messages.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10">No messages found</TableCell>
                            </TableRow>
                        ) : (
                            messages.map((msg) => (
                                <TableRow key={msg.id}>
                                    <TableCell>{new Date(msg.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">
                                        <div>{msg.name}</div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Mail className="h-3 w-3" /> {msg.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>{msg.subject}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{msg.type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={msg.status}
                                            onValueChange={(val) => handleStatusUpdate(msg.id, val)}
                                        >
                                            <SelectTrigger className="w-[110px] h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">New</SelectItem>
                                                <SelectItem value="read">Read</SelectItem>
                                                <SelectItem value="replied">Replied</SelectItem>
                                                <SelectItem value="closed">Archived</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
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

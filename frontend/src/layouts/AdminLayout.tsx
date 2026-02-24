
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    FolderTree,
    Image,
    MessageSquare,
    LogOut,
    Menu,
    X,
    BookOpen,
    Factory
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';

export function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/machinery', icon: Factory, label: 'Machinery' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/admin/categories', icon: FolderTree, label: 'Categories' },
        { href: '/admin/users', icon: Users, label: 'Users' },
        { href: '/admin/banners', icon: Image, label: 'Banners' },
        { href: '/admin/blogs', icon: BookOpen, label: 'Stories' },
        { href: '/admin/contacts', icon: MessageSquare, label: 'Inquiries' },
    ];

    return (
        <div className="min-h-screen bg-muted/40 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="h-14 flex items-center border-b px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Package className="h-6 w-6" />
                            <span>SKG Admin</span>
                        </Link>
                        <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    location.pathname.startsWith(item.href)
                                        ? "bg-muted text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 flex items-center gap-4 border-b bg-background px-6 lg:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold">SKG Admin</span>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}

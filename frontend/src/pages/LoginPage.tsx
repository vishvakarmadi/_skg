
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function LoginPage() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { login: storeLogin } = useAuthStore();
    const { syncWithServer: syncCart } = useCartStore();
    const { syncWithServer: syncWishlist } = useWishlistStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const email = (e.target as any).email.value;
            const password = (e.target as any).password.value;

            const response = await api.auth.login(email, password);
            const { access_token: token, user } = response.data;

            if (token && user) {
                localStorage.setItem('skg-token', token);

                // Map backend user to store shape
                storeLogin({
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    isAdmin: user.role === 'admin' || user.role === 'superadmin',
                });

                toast.success('Login successful!');

                // Sync cart and wishlist with server (fire-and-forget)
                syncCart();
                syncWishlist();

                if (user.role === 'admin' || user.role === 'superadmin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/account');
                }
            } else {
                throw new Error(response.data.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login failed', error);
            const message = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-4rem)]">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 bg-[url('assets/diya.jpeg')] bg-cover bg-center mix-blend-overlay opacity-60" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <img src="assets/skglogo.png" alt="logo" className="h-20 w-20" />
                
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg text-black">
                            &ldquo;Quality products and excellent service provided by SKG Enterprise.
                            Highly recommended for all your machinery and parts needs.&rdquo;
                        </p>
                        <footer className="text-sm">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Login to your account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to login to your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleLogin}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <Button disabled={isLoading}>
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    )}
                                    Sign In with Email
                                </Button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" disabled={isLoading}>
                                Google
                            </Button>
                            <Button variant="outline" disabled={isLoading}>
                                Phone
                            </Button>
                        </div>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

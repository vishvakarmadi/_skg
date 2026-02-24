
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api';
import { useAuthStore, useCartStore, useWishlistStore } from '@/store';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export function RegisterPage() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { login: storeLogin } = useAuthStore();
    const { syncWithServer: syncCart } = useCartStore();
    const { syncWithServer: syncWishlist } = useWishlistStore();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = e.target as any;
            const firstName = form.firstName.value;
            const lastName = form.lastName.value;
            const email = form.email.value;
            const phone = form.phone?.value || undefined;
            const password = form.password.value;
            const passwordConfirm = form.passwordConfirm.value;

            if (password !== passwordConfirm) {
                toast.error('Passwords do not match');
                setIsLoading(false);
                return;
            }

            const response = await api.auth.register({
                name: `${firstName} ${lastName}`.trim(),
                email,
                phone,
                password,
            });

            // Backend returns { message, access_token, token_type, user }
            const { access_token: token, user } = response.data as any;

            if (token && user) {
                localStorage.setItem('skg-token', token);

                storeLogin({
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    avatar: user.avatar,
                    isAdmin: user.role === 'admin' || user.role === 'superadmin',
                });

                toast.success('Registration successful! Welcome to SKG Enterprise.');

                // Sync cart and wishlist with server
                syncCart();
                syncWishlist();

                navigate('/account');
            } else {
                throw new Error('Registration failed');
            }
        } catch (error: any) {
            console.error('Registration failed', error);
            const message = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-4rem)]">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    SKG Enterprise
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            &ldquo;Joining SKG Enterprise platform has streamlined our procurement process.
                            The quality and reliability are unmatched in the industry.&rdquo;
                        </p>
                        <footer className="text-sm">Alex Johnson</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleRegister}>
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="firstName">First name</Label>
                                        <Input id="firstName" placeholder="John" required disabled={isLoading} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="lastName">Last name</Label>
                                        <Input id="lastName" placeholder="Doe" required disabled={isLoading} />
                                    </div>
                                </div>
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
                                    <Label htmlFor="phone">Phone (optional)</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+91 8800580015"
                                        type="tel"
                                        autoComplete="tel"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="passwordConfirm">Confirm Password</Label>
                                    <Input
                                        id="passwordConfirm"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <Button disabled={isLoading}>
                                    {isLoading && (
                                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    )}
                                    Create Account
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
                                GitHub
                            </Button>
                        </div>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

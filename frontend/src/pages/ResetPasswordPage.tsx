
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '@/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            toast.error('Invalid password reset link.');
            navigate('/login');
        }
    }, [token, email, navigate]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = e.target as any;
            const password = form.password.value;
            const passwordConfirm = form.passwordConfirm.value;

            if (password !== passwordConfirm) {
                toast.error('Passwords do not match');
                setIsLoading(false);
                return;
            }

            await api.auth.resetPassword({
                token: token!,
                email: email!,
                password,
                password_confirmation: passwordConfirm,
            });

            toast.success('Password has been reset successfully!');
            navigate('/login');
        } catch (error: any) {
            console.error('Reset Password failed', error);
            const message = error.response?.data?.message || error.message || 'Failed to reset password. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) return null;

    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-4rem)]">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621976498727-9e5c6130bb66?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />
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
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password below.
                        </p>
                    </div>

                    <div className="grid gap-6">
                        <form onSubmit={handleResetPassword}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New Password</Label>
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
                                    <Label htmlFor="passwordConfirm">Confirm New Password</Label>
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
                                    Reset Password
                                </Button>
                            </div>
                        </form>

                        <p className="px-8 text-center text-sm text-muted-foreground">
                            <Link
                                to="/login"
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Back to Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

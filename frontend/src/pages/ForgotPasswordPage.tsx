
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/api';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const email = (e.target as any).email.value;

            await api.auth.forgotPassword(email);

            setIsSubmitted(true);
            toast.success('Reset link sent! Please check your email.');
        } catch (error: any) {
            console.error('Forgot Password failed', error);
            const message = error.response?.data?.message || error.message || 'Failed to send reset email. Please try again.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-[calc(100vh-4rem)]">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427368-35b81a3dd6dd?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50" />
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
                        <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to receive a password reset link.
                        </p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-100 text-green-800 p-4 rounded-md">
                                Reset link sent! Please check your email.
                            </div>
                            <Button variant="outline" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            <form onSubmit={handleForgotPassword}>
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
                                    <Button disabled={isLoading}>
                                        {isLoading && (
                                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        )}
                                        Send Reset Link
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
                    )}
                </div>
            </div>
        </div>
    );
}

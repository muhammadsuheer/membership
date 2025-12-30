'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                }
            });

            if (error) {
                toast.error(error.message);
            } else {
                setIsSent(true);
                toast.success('Magic link sent!');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
                <div className="w-full max-w-md animate-fade-in">

                    {isSent ? (
                        <div className="card text-center py-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                            <p className="text-gray-600 mb-6">
                                We've sent a temporary login link to <br />
                                <span className="font-semibold text-gray-900">{email}</span>
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-primary hover:underline text-sm"
                            >
                                Try a different email
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-primary-900 mb-2">Welcome Back</h1>
                                <p className="text-gray-600">Sign in via Magic Link (No Password)</p>
                            </div>

                            <div className="card shadow-xl border-t-4 border-t-primary">
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div>
                                        <label className="label">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input pl-10"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-primary w-full h-12 text-lg shadow-lg hover:shadow-xl transition-all"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending Link...
                                            </>
                                        ) : (
                                            <>
                                                Sign In <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                    <p className="text-gray-600">
                                        Don't have an account?{' '}
                                        <Link href="/signup" className="text-primary font-bold hover:underline">
                                            Apply for Membership
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export const metadata: Metadata = {
    title: 'My Membership - SOOOP Dashboard',
    description: 'View your SOOOP membership details',
};

export default async function MembershipDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-primary">My Membership</h1>

                {/* Membership Card */}
                <div className="card bg-gradient-primary text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-white/80 text-sm">Member ID</span>
                            <span className="badge bg-white/20 text-white">Active</span>
                        </div>
                        <div className="text-2xl font-bold mb-1">SOOOP-2024-001</div>
                        <div className="text-white/80 mb-6">{user.email}</div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                            <div>
                                <div className="text-white/60 text-xs">Member Type</div>
                                <div className="font-semibold">Full Membership</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white/60 text-xs">Valid Until</div>
                                <div className="font-semibold">December 2025</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-lg font-bold text-primary mb-4">Membership Details</h2>
                        <dl className="space-y-4">
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Type</dt>
                                <dd className="font-medium">Full Membership</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Status</dt>
                                <dd className="badge badge-success">Active</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Joined</dt>
                                <dd className="font-medium">January 2024</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Expires</dt>
                                <dd className="font-medium">December 2025</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-500">Annual Fee</dt>
                                <dd className="font-medium text-accent">Rs. 1,500/-</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-bold text-primary mb-4">Benefits</h2>
                        <ul className="space-y-3">
                            {[
                                'Professional development resources',
                                'Networking opportunities',
                                'Conference discounts',
                                'Quarterly journal subscription',
                                'Research grant access',
                                'Voting rights',
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-center gap-3 text-gray-600">
                                    <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Quick Downloads */}
                <div className="card">
                    <h2 className="text-lg font-bold text-primary mb-4">Documents</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <a
                            href="/membership-form.pdf"
                            download
                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Membership Form</p>
                                <p className="text-sm text-gray-500">PDF • 192 KB</p>
                            </div>
                        </a>

                        <a
                            href="/membership-oath.pdf"
                            download
                            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">SOOOP Oath</p>
                                <p className="text-sm text-gray-500">PDF • 88 KB</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Renew CTA */}
                <div className="card bg-accent/5 border-2 border-accent">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <div className="flex-grow text-center sm:text-left">
                            <h3 className="text-xl font-bold text-primary mb-1">Renew Your Membership</h3>
                            <p className="text-gray-600">Your membership expires in 365 days. Renew early to keep your benefits!</p>
                        </div>
                        <button className="btn btn-accent flex-shrink-0">
                            Renew Now
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

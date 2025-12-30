import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Clock, Calendar, FileText, User, CreditCard } from 'lucide-react';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Dashboard - SOOOP',
    description: 'SOOOP Member Dashboard',
};

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch Application Status
    const { data: application } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

    const membershipStatus = profile?.membership_status || 'pending';
    const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear();
    const expiryDate = profile?.membership_expiry ? new Date(profile.membership_expiry).toLocaleDateString() : 'N/A';

    // Determine alerts/messages
    let statusMessage = {
        title: "Welcome back!",
        desc: "Manage your membership and stay connected.",
        color: "bg-gradient-to-r from-primary-900 to-primary-800"
    };

    if (membershipStatus === 'pending') {
        statusMessage = {
            title: "Application Under Review",
            desc: "Your membership application is currently being reviewed by the administration.",
            color: "bg-yellow-600"
        };
    } else if (membershipStatus === 'rejected') {
        statusMessage = {
            title: "Application Rejected",
            desc: "There was an issue with your application. Please contact support.",
            color: "bg-red-600"
        };
    } else if (membershipStatus === 'expired') {
        statusMessage = {
            title: "Membership Expired",
            desc: "Your membership has expired. Please renew to continue accessing benefits.",
            color: "bg-orange-600"
        };
    }

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

    return (
        <div className="space-y-8 animate-fade-in">
            {isAdmin && (
                <div className="bg-gray-900 text-white p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Admin Privileges Active</h2>
                            <p className="text-gray-300">You have access to the administration panel.</p>
                        </div>
                    </div>
                    <Link href="/admin" className="btn bg-white text-gray-900 hover:bg-gray-100 flex items-center gap-2">
                        Go to Admin Dashboard <CheckCircle className="w-4 h-4" />
                    </Link>
                </div>
            )}

            {/* Welcome Section */}
            <div className={`card ${statusMessage.color} text-white`}>
                <h1 className="text-2xl font-bold mb-2">{statusMessage.title}</h1>
                <p className="text-white/90">{statusMessage.desc}</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Status</p>
                            <p className="text-xl font-bold capitalize text-primary-900">{membershipStatus}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${membershipStatus === 'active' ? 'bg-green-100 text-green-600' :
                            membershipStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                            }`}>
                            {membershipStatus === 'active' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Member Since</p>
                            <p className="text-xl font-bold text-primary-900">{memberSince}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Valid Until</p>
                            <p className="text-xl font-bold text-primary-900">{expiryDate}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Registration #</p>
                            <p className="text-sm font-bold text-primary-900 truncate max-w-[100px]" title={profile?.registration_number}>{profile?.registration_number || 'Pending'}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
                <h2 className="text-xl font-bold text-primary-900 mb-6">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/dashboard/card" className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-gray-900">Membership Card</p>
                        <p className="text-sm text-gray-500">Download ID Card</p>
                    </Link>

                    {/* Placeholder for Profile Editing - could be /dashboard/profile if implemented */}
                    <button disabled className="p-4 rounded-xl border-2 border-dashed border-gray-100 opacity-60 cursor-not-allowed text-left">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center mb-3">
                            <User className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-gray-900">Edit Profile</p>
                        <p className="text-sm text-gray-500">Coming Soon</p>
                    </button>

                    <Link href="/events" className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left group">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <p className="font-medium text-gray-900">Events</p>
                        <p className="text-sm text-gray-500">Browse Events</p>
                    </Link>

                    {membershipStatus === 'expired' && (
                        <Link href="/contact" className="p-4 rounded-xl border-2 border-dashed border-red-200 hover:border-red-500 hover:bg-red-50 transition-all text-left group">
                            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-all">
                                <Clock className="w-5 h-5" />
                            </div>
                            <p className="font-medium text-gray-900">Renew Membership</p>
                            <p className="text-sm text-gray-500">Contact Admin</p>
                        </Link>
                    )}
                </div>
            </div>

            {!application && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-blue-900">Complete Application</h3>
                        <p className="text-blue-700 text-sm">We don't see a submitted application for your account yet.</p>
                    </div>
                    <Link href="/signup" className="btn btn-primary whitespace-nowrap">
                        Apply Now
                    </Link>
                </div>
            )}
        </div>
    );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MembershipCard from '@/components/cabinet/MembershipCard';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function MemberCardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) {
        return <div>Error loading profile</div>;
    }

    const isActive = profile.membership_status === 'active';
    // Check expiry. If null, handle gracefully (maybe not active yet).
    const isExpired = profile.membership_expiry ? new Date(profile.membership_expiry) < new Date() : false;

    if (!isActive || isExpired) {
        return (
            <>
                <main className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 border-red-500">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Membership Issue</h1>

                        {isExpired ? (
                            <p className="text-gray-600 mb-6">
                                Your membership expired on <span className="font-semibold">{new Date(profile.membership_expiry).toLocaleDateString()}</span>.
                                <br />Please renew your membership to access your card.
                            </p>
                        ) : (
                            <p className="text-gray-600 mb-6">
                                Your membership is currently <strong>{profile.membership_status || 'Pending'}</strong>.
                                <br />You will be able to download your card once an administrator approves your application.
                            </p>
                        )}

                        <Link href="/contact" className="btn btn-primary w-full">
                            Contact Administration
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const memberData = {
        name: profile.full_name,
        specialty: profile.specialty || 'Optometrist', // Fallback or strict?
        registration_no: profile.registration_number || 'Pending',
        cnic: profile.cnic,
        expiry: profile.membership_expiry,
        photo_url: profile.profile_photo_url,
        phone: profile.contact_number,
        address: profile.residential_address || 'Lahore, Pakistan',
    };

    return (
        <div className="py-8">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">My Membership Card</h1>
                        <p className="text-gray-500 text-sm">Download and print your official SOOOP membership card.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-center mb-6">
                        <MembershipCard member={memberData} />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>
                            <strong>Note:</strong> This card is computer generated and valid only until the expiry date shown.
                            Please keep a digital copy for your records. If you notice any errors, please contact the secretariat immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

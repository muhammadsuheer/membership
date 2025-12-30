import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MembershipForm from '@/components/auth/MembershipForm';

export const metadata: Metadata = {
    title: 'Membership Registration - SOOOP',
    description: 'Apply for SOOOP membership online. Complete the registration form for Optometrists, Orthoptists, and Ophthalmic Technologists.',
};

export default function SignupPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-12 md:py-20">
                <div className="container px-4 mx-auto">
                    <MembershipForm />
                </div>
            </main>
            <Footer />
        </>
    );
}

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayout'; // The client wrapper we saw earlier

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/admin');
    }

    // Check Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        redirect('/dashboard'); // Kick non-admins back to dashboard
    }

    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    );
}

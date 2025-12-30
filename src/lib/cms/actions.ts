'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type SaveContentResponse = {
    success: boolean;
    error?: string;
};

export async function updateContent(key: string, content: any): Promise<SaveContentResponse> {
    const supabase = await createClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    // 2. Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        return { success: false, error: 'Forbidden: Admin access required' };
    }

    // 3. Update Content
    const { error } = await supabase
        .from('site_content')
        .upsert({
            key,
            content,
            updated_at: new Date().toISOString(),
            updated_by: user.id
        });

    if (error) {
        console.error('Error updating content:', error);
        return { success: false, error: 'Database error' };
    }

    // 4. Revalidate
    revalidatePath('/', 'layout'); // Revalidate everything to be safe
    return { success: true };
}

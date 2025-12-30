import { createClient } from "@supabase/supabase-js";

// Direct client for SSG/ISR
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type CMSSection = {
    id: string;
    section_type: string;
    content: any;
    order_index: number;
};

export type CMSPage = {
    title: string;
    meta_title?: string;
    meta_description?: string;
    sections: CMSSection[];
};

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
    try {
        const { data, error } = await supabase
            .from('cms_pages')
            .select(`
                title,
                seo_title,
                seo_description,
                sections:cms_sections(
                    id,
                    section_type,
                    content,
                    order_index
                )
            `)
            .eq('slug', slug)
            .eq('is_published', true)
            .eq('sections.is_active', true)
            .order('order_index', { foreignTable: 'sections', ascending: true })
            .single();

        if (error) {
            // If the error code is PGRST116, it means no rows returned (404-ish for single())
            if (error.code !== 'PGRST116') {
                console.error(`Error fetching page for slug ${slug}:`, error);
            }
            return null;
        }

        if (!data) return null;

        // Map the data to the expected format
        // Note: The type assertion is needed because Supabase types might not perfectly match our internal types automatically
        // and we are constructing the response object.
        const page: CMSPage = {
            title: data.title,
            meta_title: data.seo_title || undefined,
            meta_description: data.seo_description || undefined,
            sections: (data.sections || []) as CMSSection[]
        };

        return page;

    } catch (error) {
        console.error(`Unexpected error fetching page for slug ${slug}:`, error);
        return null;
    }
}

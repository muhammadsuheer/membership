import { createClient } from "@supabase/supabase-js";

// Direct client for SSG/ISR
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchContent<T>(key: string): Promise<T | null> {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', key)
            .single();

        if (error || !data) return null;
        return data.content as T;
    } catch (error) {
        console.error(`Error fetching content for ${key}:`, error);
        return null;
    }
}

export type HeroContent = {
    title: string;
    description: string;
    announcement: string;
    stats: { label: string; value: string; }[];
};

export type AboutContent = {
    title: string;
    description: string;
    points: string[];
    image: string;
    years_count: string;
    years_text: string;
    // Compatibility fields for transition
    heading?: string;
    subheading?: string;
};

export type ContactPageContent = {
    hero: {
        title: string;
        subtitle: string;
    };
    info: {
        address: string;
        phone: string;
        email: string;
    };
};

export type EventItem = {
    title: string;
    date: string;
    location: string;
    description: string;
    featured?: boolean;
};

export type EventsPageContent = {
    upcoming: EventItem[];
    past: EventItem[];
};

export type BenefitItem = {
    id: number;
    title: string;
    description: string;
    image: string;
    link: string;
};

export type MembershipTypeItem = {
    type: string;
    fee: string;
    description: string;
    features: string[];
    popular: boolean;
};

export type MembershipPageContent = {
    benefits: BenefitItem[];
    types: MembershipTypeItem[];
    downloads: { name: string; url: string; }[];
};

export type CabinetMember = {
    name: string;
    role: string;
    image: string;
    qualification: string;
    bio: string;
    email?: string;
};

export type CabinetCommitteeMember = {
    name: string;
    position: string;
};

export type CabinetPageContent = {
    patrons: CabinetMember[];
    executive: CabinetMember[];
    committee: CabinetCommitteeMember[];
};

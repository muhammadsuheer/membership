import { fetchContent, type HeroContent } from '@/lib/cms/fetchContent';
import HeroEditor from '@/components/admin/cms/HeroEditor';
import { LayoutTemplate, AlertCircle } from 'lucide-react';

export default async function ContentManagementPage() {
    // Fetch all content concurrently
    const heroContent = await fetchContent<HeroContent>('home_hero');

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
                    <p className="text-gray-600 mt-2">Manage website content, text, and announcements dynamically.</p>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 text-blue-800">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                    Changes made here update the website instantly. If a field is left empty, the system may use a default fallback value.
                    Always verify your changes on the live site after saving.
                </p>
            </div>

            {/* Tabs / Sections */}
            <div className="space-y-12">

                {/* Hero Section Editor */}
                <section>
                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                        <LayoutTemplate className="w-5 h-5 text-gray-500" />
                        <h2 className="text-xl font-bold text-gray-800">Homepage Hero</h2>
                    </div>
                    <HeroEditor initialData={heroContent} />
                </section>

                {/* More sections can be added here */}
                {/* <section>
                    <h3>About Us</h3>
                    <AboutEditor initialData={aboutContent} />
                </section> */}

            </div>
        </div>
    );
}

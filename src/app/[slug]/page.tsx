import { getPageBySlug, CMSPage } from "@/lib/cms/cms-server";
import SectionRenderer from "@/components/cms/SectionRenderer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute
export const dynamicParams = true; // Allow dynamic params for pages not generated at build time

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug) as CMSPage | null;

    if (!page) {
        return {
            title: 'Page Not Found',
        };
    }

    return {
        title: page.meta_title || `${page.title} - SOOOP`,
        description: page.meta_description || `Read about ${page.title}`,
    };
}

export default async function DynamicCMSPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = await getPageBySlug(slug) as CMSPage | null;

    if (!page) {
        notFound();
    }

    return (
        <>
            <Header />
            <main>
                {page.sections.map((section) => (
                    <SectionRenderer
                        key={section.id}
                        type={section.section_type}
                        content={section.content}
                    />
                ))}


            </main>
            <Footer />
        </>
    );
}

import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import AboutSection from '@/components/home/AboutSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import CTASection from '@/components/home/CTASection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ImageSlider from '@/components/home/ImageSlider';
import LeadershipSection from '@/components/home/LeadershipSection';
import SponsorsSection from '@/components/home/SponsorsSection';

type SectionRendererProps = {
    type: string;
    content: any;
};

export default function SectionRenderer({ type, content }: SectionRendererProps) {
    switch (type) {
        case 'hero':
            return <HeroSection content={content} />;
        case 'about':
            return <AboutSection content={content} />;
        case 'benefits':
            return <BenefitsSection content={content} />;
        case 'cta':
            // CTASection expects content prop, though type might be loose or missing import in the component file
            return <CTASection content={content} />;
        case 'testimonials':
            return <TestimonialsSection />; // Check if it accepts content, assuming default handling for now
        case 'slider':
            return <ImageSlider />; // Check props
        case 'leadership':
            return <LeadershipSection />;
        case 'sponsors':
            return <SponsorsSection />;
        default:
            console.warn(`Unknown section type: ${type}`);
            return null;
    }
}

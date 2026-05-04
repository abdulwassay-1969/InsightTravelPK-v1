import type { Metadata } from 'next';
import VisualGallerySection from '@/components/sections/visual-gallery-section';

export const metadata: Metadata = {
    title: 'Traveler Gallery | InsightTravelPK',
    description:
        'Browse HD photos shared by real travelers from across Pakistan. Upload your own and inspire the world.',
};

export default function GalleryPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-br from-primary via-primary/80 to-accent/60 text-white pt-32 pb-16 text-center overflow-hidden">
                {/* decorative circles */}
                <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

                <div className="relative container mx-auto px-4">
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-4 border border-white/20">
                        📸 Community Gallery
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-headline mb-4">
                        Pakistan Through Your Lens
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Real moments, real places, real travelers. Browse HD photos from across Pakistan
                        and add your own to inspire the world.
                    </p>
                </div>
            </div>

            {/* Gallery Section */}
            <VisualGallerySection />
        </div>
    );
}

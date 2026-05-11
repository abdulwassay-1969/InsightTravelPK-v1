import { provinces } from '@/lib/data';
import { getDistrictDetail } from '@/lib/district-details';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PhotoGallery from '@/components/district/photo-gallery';
import BookmarkButton from '@/components/district/bookmark-button';
import HeroWeather from '@/components/district/hero-weather';
import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateStaticParams() {
  const paths = provinces.flatMap((province) =>
    province.districts.map((district) => ({
      slug: district.slug,
    }))
  );
  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const district = provinces
    .flatMap((p) => p.districts)
    .find((d) => d.slug === slug);
  const province = provinces.find((p) => p.districts.some((d) => d.slug === slug));

  if (!district || !province) {
    return { title: 'District Not Found | InsightTravelPK' };
  }

  const detail = getDistrictDetail(slug);
  return {
    title: `${district.name}, ${province.name} - Tourism & Travel Guide | InsightTravelPK`,
    description: detail?.description || `Discover the beauty of ${district.name} in ${province.name}. Explore attractions, culture, and plan your trip with InsightTravelPK.`,
  };
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const district = provinces
    .flatMap((p) => p.districts)
    .find((d) => d.slug === slug);
  const province = provinces.find(p => p.districts.some(d => d.slug === slug));

  if (!district || !province) {
    notFound();
  }

  const image = getPlaceholderImage(district.image);
  const detail = getDistrictDetail(slug);

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-lime-50">
      {/* Hero */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={image.imageUrl}
          alt={image.description}
          data-ai-hint={image.imageHint}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end p-4 md:p-12 text-white">
          <div className="container mx-auto px-4 w-full">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-white/70 mb-3">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link href="/#provinces" className="hover:text-white transition-colors">Provinces</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="font-semibold text-white">{district.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 w-full">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{province.name}</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl font-headline uppercase">
                  {district.name}
                </h1>
                {detail && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-3">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Best time to visit: <strong className="text-white">{detail.bestTime}</strong></span>
                    </div>
                    
                    {/* Live Weather Widget */}
                    <Suspense fallback={<div className="h-8 w-32 bg-white/10 rounded-full animate-pulse" />}>
                      <HeroWeather cityName={district.name} />
                    </Suspense>
                  </div>
                )}
              </div>

              {/* Bookmark visible on hero */}
              <div className="shrink-0">
                <BookmarkButton districtSlug={slug} districtName={district.name} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">

        {detail ? (
          <>
            {/* Description */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-primary mb-3">About {district.name}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{detail.description}</p>
            </section>

            {/* Top Attractions */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                <h2 className="text-2xl font-bold text-foreground">Top Attractions</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detail.attractions.map((attr, i) => (
                  <div
                    key={i}
                    className="group bg-secondary/40 border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                  >
                    {attr.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={attr.image}
                          alt={attr.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center z-10">
                          <span className="text-primary font-bold text-xs">{i + 1}</span>
                        </div>
                      </div>
                    )}
                    <div className="p-5 flex flex-col flex-grow">
                      {!attr.image && (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <span className="text-primary font-bold text-sm">{i + 1}</span>
                        </div>
                      )}
                      <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {attr.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {attr.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery */}
            {detail.gallery.length > 0 && (
              <PhotoGallery images={detail.gallery} districtName={district.name} />
            )}

            {/* Affiliate / Monetization Placeholder */}
            <section className="py-12 border-t border-border mt-12 bg-secondary/20 rounded-2xl p-8 mb-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">Plan Your Trip to {district.name}</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Ready to explore {district.name}? Find the best deals on hotels, flights, and rental cars to make your journey unforgettable.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" disabled className="bg-blue-600/70 text-white cursor-not-allowed">
                  🏨 Hotel Booking Coming Soon
                </Button>
                <Button size="lg" variant="outline" disabled className="border-primary text-primary cursor-not-allowed opacity-70">
                  ✈️ Flight Search Coming Soon
                </Button>
              </div>
            </section>
          </>
        ) : (
          /* Fallback for districts without detail data */
          <div className="prose lg:prose-xl max-w-none text-muted-foreground">
            <h2 className="text-3xl font-bold text-primary mb-4">About {district.name}</h2>
            <p>
              Welcome to {district.name}, a jewel in the heart of {province.name}. This page provides
              a glimpse into the unique culture, history, and natural beauty of the area.
            </p>
            <p>
              Explore its scenic beauty, learn about its local traditions, and find practical
              information for your visit.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

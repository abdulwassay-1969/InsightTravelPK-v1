'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  // Stunning Unsplash image for Northern Pakistan / Mountains
  const heroImageUrl = "https://images.unsplash.com/photo-1611080402167-ed75bae6df32?q=80&w=2000&auto=format&fit=crop";
  const blurUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8+v//fwAJaQOE+e1wFAAAAABJRU5ErkJggg==";

  return (
    <section id="home" className="relative min-h-[70vh] w-full overflow:hidden" role="region" aria-label="Homepage hero">
      <Image
        src={heroImageUrl}
        alt="Breathtaking mountains of Pakistan"
        fill
        className="object-cover scale-105 animate-slow-zoom"
        priority
        placeholder="blur"
        blurDataURL={blurUrl}
      />
      
      {/* Gradients to ensure text readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,121,140,0.48), rgba(2,6,23,0.36))' }} />
      
      <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center text-center text-white px-6">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-md">
          Pakistan Travel Guide
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl font-headline animate-fade-in-up drop-shadow-xl">
          Discover the <span className="text-primary">Natural Beauty</span>
          <br />of Pakistan
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-white/90 animate-fade-in-up animation-delay-300 font-medium">
          Start from a province or district, ask the assistant about routes, weather, hotels, or build a trip you can save.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 h-12 px-6 text-lg rounded-full shadow-md shadow-primary/20 transition-transform active:scale-95">
            <a href="#provinces">Explore Provinces</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-6 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/10">
            <a href="/assistant">Open Travel Assistant</a>
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/12">Weather</a>
          <a href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/12">Best time to visit</a>
          <a href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/12">Nearby places</a>
          <a href="/assistant" className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/12">Emergency contacts</a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/80">
        <span className="text-sm font-medium tracking-wide">Scroll to discover</span>
        <ChevronDown className="h-6 w-6" />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-slow-zoom {
          animation: slowZoom 20s ease-out forwards;
        }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-600 { animation-delay: 0.6s; }
      `}</style>
    </section>
  );
}

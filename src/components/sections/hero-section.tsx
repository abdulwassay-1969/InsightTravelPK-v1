"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getPlaceholderImage } from '@/lib/placeholder-images';

import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  // Stunning Unsplash image for Northern Pakistan / Mountains
  const heroImageUrl = "https://images.unsplash.com/photo-1611080402167-ed75bae6df32?q=80&w=2000&auto=format&fit=crop";
  const blurUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8+v//fwAJaQOE+e1wFAAAAABJRU5ErkJggg==";

  return (
    <section id="home" className="relative h-[100dvh] w-full overflow-hidden">
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
      <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-md">
          Pakistan Travel Guide
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl font-headline animate-fade-in-up drop-shadow-xl">
          Discover the <span className="text-accent">Untold Beauty</span><br />
          of Pakistan
        </h1>
        <p className="mt-6 max-w-3xl text-lg md:text-2xl text-neutral-200 animate-fade-in-up animation-delay-300 drop-shadow-md font-medium">
          Start with a province, open a district, and build a trip you can save in minutes.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-5 animate-fade-in-up animation-delay-600">
          <Button asChild size="lg" className="bg-primary text-white hover:bg-primary/90 h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/30 transition-transform active:scale-95">
            <a href="#provinces">Explore Provinces</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white hover:text-primary h-14 px-8 text-lg rounded-full transition-transform active:scale-95">
            <a href="/planner">Start Planning</a>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce flex flex-col items-center gap-2 text-white/80">
        <span className="text-xs font-semibold uppercase tracking-widest">Scroll to Discover</span>
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

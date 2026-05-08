"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { provinces } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const featuredSlugs = [
  'lahore', // Punjab
  'larkana', // Sindh (for Mohenjo-Daro)
  'swat', // Khyber Pakhtunkhwa
  'ziarat', // Balochistan
  'hunza', // Gilgit-Baltistan
  'muzaffarabad', // Azad Kashmir (for Neelum Valley)
  'islamabad', // Islamabad Capital Territory
];

function getLoopDistance(index: number, active: number, total: number) {
  const direct = Math.abs(index - active);
  return Math.min(direct, total - direct);
}

const blurUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO8+v//fwAJaQOE+e1wFAAAAABJRU5ErkJggg==";

export default function FeaturedDestinationsSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const featuredDistricts = featuredSlugs
    .map((slug) => provinces.flatMap((p) => p.districts).find((d) => d.slug === slug))
    .filter((d) => d !== undefined);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <section id="destinations" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 font-headline md:text-5xl">
            Featured <span className="text-primary">Destinations</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600 font-medium">
            Discover the most captivating places Pakistan has to offer, hand-picked for your next adventure.
          </p>
        </div>

        <div className="relative">
          <div className="mb-6 flex justify-end">
            <Button asChild variant="outline" className="rounded-full border-slate-300 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-colors">
              <Link href="/map">View All Destinations</Link>
            </Button>
          </div>

          <Carousel opts={{ align: "center", loop: true }} setApi={setApi} className="w-full px-6 md:px-12">
            <CarouselContent className="-ml-3 md:-ml-4">
              {featuredDistricts.map((district, idx) => {
                if (!district) return null;
                const image = getPlaceholderImage(district.image);
                const distance = getLoopDistance(idx, activeIndex, featuredDistricts.length);
                const isActive = distance === 0;
                const isAdjacent = distance === 1;
                const isOuter = distance === 2;

                const scaleClass = isActive
                  ? "scale-[1.08] shadow-2xl"
                  : isAdjacent
                    ? "scale-95 shadow-lg"
                    : isOuter
                      ? "scale-90 opacity-70 cursor-pointer"
                      : "scale-[0.85] opacity-40 cursor-pointer";
                      
                const zClass = isActive ? "z-30" : isAdjacent ? "z-20" : "z-10";
                
                return (
                  <CarouselItem
                    key={district.slug}
                    className="pl-3 basis-[85%] sm:basis-[50%] lg:basis-[28%] py-8"
                    onClick={() => api?.scrollTo(idx)}
                  >
                    <div
                      className={`group relative -mx-2 block transition-all duration-700 ease-out ${scaleClass} ${zClass}`}
                    >
                      <article className="relative h-[350px] md:h-[450px] overflow-hidden rounded-[2rem] border-0">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          data-ai-hint={image.imageHint}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          placeholder="blur"
                          blurDataURL={blurUrl}
                          priority={idx === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-8 text-white">
                          <h4 className="text-3xl font-bold font-headline mb-3 tracking-tight drop-shadow-md">
                            {district.name}
                          </h4>
                          <Button
                            asChild
                            variant="secondary"
                            className="w-fit rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-primary hover:border-primary hover:text-white transition-all shadow-lg"
                          >
                            <Link href={`/districts/${district.slug}`}>EXPLORE</Link>
                          </Button>
                        </div>
                      </article>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="left-0 h-14 w-14 border border-slate-200 bg-white text-slate-800 hover:bg-primary hover:text-white hover:border-primary shadow-xl transition-colors" />
            <CarouselNext className="right-0 h-14 w-14 border border-slate-200 bg-white text-slate-800 hover:bg-primary hover:text-white hover:border-primary shadow-xl transition-colors" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { provinces } from "@/lib/data";
import { getPlaceholderImage } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const PROVINCE_OVERVIEW: Record<string, string> = {
  Punjab:
    "Punjab is a vibrant gateway to Pakistan's cultural heart, where Mughal-era monuments, Sufi shrines, and living heritage blend with modern city life. Travelers can explore Lahore's historic old city, enjoy famous Punjabi cuisine, visit colorful bazaars, and experience rural landscapes shaped by rivers and fertile plains. From architecture and festivals to family-friendly urban attractions, Punjab offers a rich mix of history, hospitality, and everyday local culture.",
  Sindh:
    "Sindh offers a deep historical journey from the Indus Valley civilization to coastal life along the Arabian Sea. Visitors can discover ancient archaeology near Larkana, spiritual and Sufi traditions in major cities, handcraft markets, and dynamic food scenes. Karachi adds a metropolitan travel experience with beaches, museums, and colonial landmarks, while interior Sindh provides a quieter cultural landscape rooted in poetry, music, and heritage.",
  "Khyber Pakhtunkhwa":
    "Khyber Pakhtunkhwa is ideal for mountain travelers and nature enthusiasts, known for high valleys, rivers, alpine meadows, and cool-weather escapes. Regions such as Swat, Chitral, and surrounding hill districts offer scenic roads, trekking opportunities, and traditional mountain communities. Beyond landscapes, the province is known for warm hospitality, distinctive cuisine, and a strong cultural identity that makes every stop feel authentic and memorable.",
  Balochistan:
    "Balochistan is Pakistan's largest province by area and showcases dramatic natural diversity, from rugged mountains and juniper forests to dramatic deserts and coastline views. Travelers seeking offbeat destinations will find unique geological formations, quiet historical towns, and long-distance road adventures. Its local traditions, tribal heritage, and untouched scenery make Balochistan a rewarding destination for explorers looking beyond mainstream tourism routes.",
  "Gilgit-Baltistan":
    "Gilgit-Baltistan is Pakistan's high-altitude wonderland, home to world-famous peaks, glaciers, and postcard-perfect valleys such as Hunza and Skardu. It is a top destination for mountain photography, trekking, jeep expeditions, and cultural tourism in remote communities. Crystal lakes, historic forts, and panoramic passes create an unforgettable travel experience for both adventure seekers and families looking for peaceful scenic escapes.",
  "Azad Kashmir":
    "Azad Kashmir is known for lush hills, forested valleys, waterfalls, and river viewpoints that attract nature lovers year-round. It offers calm hill retreats, boating spots, and scenic drives with moderate-weather destinations suitable for families and couples. The region's traditional cuisine, local crafts, and relaxed pace provide a peaceful contrast to larger cities while still offering plenty of sightseeing opportunities.",
  "Islamabad Capital Territory":
    "Islamabad Capital Territory combines modern urban planning with easy access to nature through the Margalla Hills and surrounding viewpoints. Visitors can explore landmark mosques, museums, parks, and family attractions while enjoying a cleaner, calmer city atmosphere. It is also an ideal base for short trips to nearby regions, making it a convenient starting point for travelers who want both comfort and quick access to Pakistan's northern routes.",
};

const PROVINCE_BG: Record<string, string> = {
  Punjab: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
  Sindh: "bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50",
  "Khyber Pakhtunkhwa": "bg-gradient-to-br from-green-50 via-lime-50 to-emerald-50",
  Balochistan: "bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50",
  "Gilgit-Baltistan": "bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50",
  "Azad Kashmir": "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
  "Islamabad Capital Territory": "bg-gradient-to-br from-slate-50 via-zinc-50 to-blue-50",
};

export default function TourismIntroSection() {
  const provinceSlides = provinces.map((province) => {
    const firstDistrict = province.districts[0];
    const image = getPlaceholderImage(firstDistrict?.image ?? "tourism-intro-image");
    return {
      name: province.name,
      image,
      overview:
        PROVINCE_OVERVIEW[province.name] ??
        "Explore this region's culture, landscapes, heritage sites, and local experiences.",
    };
  });

  return (
    <section id="about" className="py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline md:text-4xl">
            Tourism in Pakistan
          </h2>
          <p className="mt-3 mx-auto max-w-3xl text-muted-foreground">
            Explore quick province overviews to discover what makes each region of Pakistan unique.
          </p>
        </div>

        <Carousel opts={{ align: "center", loop: true }} className="mx-auto w-full max-w-6xl">
          <CarouselContent>
            {provinceSlides.map((slide, idx) => (
              <CarouselItem key={slide.name}>
                <article
                  className={`grid gap-5 md:gap-8 rounded-2xl p-4 md:p-8 shadow-sm md:grid-cols-2 md:items-center ${
                    PROVINCE_BG[slide.name] ?? "bg-gradient-to-br from-slate-50 to-blue-50"
                  }`}
                >
                  <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
                      Province Overview
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary font-headline">{slide.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{slide.overview}</p>
                  </div>
                  <div className="overflow-hidden rounded-xl">
                    <Image
                      src={slide.image.imageUrl}
                      alt={slide.image.description}
                      data-ai-hint={slide.image.imageHint}
                      width={900}
                      height={560}
                      className="h-[220px] sm:h-[260px] w-full object-cover md:h-[340px]"
                      priority={idx === 0}
                    />
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2 md:-left-6 h-11 w-11 md:h-10 md:w-10" />
          <CarouselNext className="-right-2 md:-right-6 h-11 w-11 md:h-10 md:w-10" />
        </Carousel>
      </div>
    </section>
  );
}

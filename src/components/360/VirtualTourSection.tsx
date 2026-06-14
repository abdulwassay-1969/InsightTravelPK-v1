"use client";

import { useMemo, useState } from "react";
import { VirtualTourPanel } from "@/components/maps/virtual-tour-panel";
import { VIRTUAL_TOUR_LOCATIONS } from "@/data/virtual-tours";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Sparkles } from "lucide-react";

export default function VirtualTourSection() {
  const [selectedId, setSelectedId] = useState<string>(VIRTUAL_TOUR_LOCATIONS[0]?.id ?? "");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const selected = useMemo(() => {
    return VIRTUAL_TOUR_LOCATIONS.find((l) => l.id === selectedId) ?? VIRTUAL_TOUR_LOCATIONS[0];
  }, [selectedId]);

  return (
    <section className="py-14 md:py-20 bg-white" id="virtual-tours">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-[#003D5B]">
              Explore Pakistan in 360°
            </h2>
            <p className="mt-3 text-slate-500 font-medium">
              Virtual tours of Pakistan's most iconic locations
            </p>
          </div>

          {/* Selector */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-2 px-2">
              {VIRTUAL_TOUR_LOCATIONS.map((loc) => {
                const active = loc.id === selectedId;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedId(loc.id);
                    }}
                    className={cn(
                      "shrink-0 w-[230px] sm:w-[260px] text-left rounded-3xl border p-3 transition-all duration-300",
                      active
                        ? "border-teal-500/40 bg-teal-50/40 shadow-[0_20px_60px_rgba(13,148,136,0.12)]"
                        : "border-slate-200 bg-white hover:border-teal-500/20 hover:bg-white"
                    )}
                    aria-pressed={active}
                  >
                    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                      <Image
                        src={loc.imageUrl}
                        alt={loc.name}
                        fill
                        className="object-cover"
                        sizes="260px"
                        priority={active}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className="absolute left-3 top-3">
                        <Badge
                          className={cn(
                            "rounded-full bg-white/90 text-slate-900 border border-white/40",
                            active ? "shadow-md" : ""
                          )}
                        >
                          {loc.province}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-bold text-slate-900 line-clamp-1">{loc.name}</div>
                      <div className="mt-2 text-xs text-slate-500 line-clamp-2">{loc.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview + CTA */}
          {selected ? (
            <div
              key={selected.id}
              className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-teal-50/40 to-white p-6 md:p-8 transition-all"
>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-black uppercase tracking-widest text-teal-700">
                        {selected.name}
                      </span>
                    </div>
                    <div className="text-slate-600 text-sm md:text-base max-w-2xl">
                      {selected.description}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="rounded-full bg-teal-600 hover:bg-teal-600 text-white border-0">
                        {selected.province}
                      </Badge>
                      <Badge variant="outline" className="rounded-full border-slate-200">
                        360° Virtual Experience
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsPanelOpen(true)}
                      className="bg-[#0d9488] hover:bg-[#0b7a74] text-white rounded-2xl h-12 px-6 font-black shadow-lg shadow-teal-900/10"
                    >
                      Start 360° Tour
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-2xl h-12 px-6 border-slate-200"
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selected.coordinates.lat},${selected.coordinates.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Google Maps
                      </a>
                    </Button>
                  </div>
              </div>

              {/* Small helper */}
              <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
                <div className="text-xs text-slate-500">
                  Tip: open the 360° viewer to get the AI audio guide.
                </div>
                <Link href="/virtual-tour" className="text-xs font-bold text-teal-700 hover:underline">
                  Open Tours Page →
                </Link>
              </div>
            </div>
          ) : null}



          {/* Panel */}
          <VirtualTourPanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            location={selected ? { ...selected } : null}
          />

          {/* Safety spacing */}
          <div className="h-2" />
        </div>
      </div>
    </section>
  );
}


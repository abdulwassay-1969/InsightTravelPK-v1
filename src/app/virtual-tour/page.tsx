import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Virtual Tour | InsightTravelPK",
  description:
    "Explore Pakistan virtually with the Pakistan Motorcycle Tour playlist, more YouTube clips, and quick links to the map and Smart Planner.",
};

/** Curated YouTube tours — embedded for inline playback */
const VIRTUAL_TOUR_VIDEOS: {
  id: string;
  label: string;
  /** Optional start time in seconds (e.g. &t=2m7s → 127) */
  start?: number;
}[] = [
  { id: "15W4PLDYDfw", label: "Hunza Valley Road Trip – Pakistan's Most Scenic Drive", start: 127 },
  { id: "3VX2ka0ak1E", label: "Skardu – Gateway to K2 Base Camp" },
  { id: "PQMAWhVtGqM", label: "Lahore – The Cultural Heart of Pakistan" },
  { id: "ExyCpYVtJpU", label: "Fairy Meadows & Nanga Parbat Trek" },
  { id: "41RDQj0d24Q", label: "Swat Valley – The Switzerland of Pakistan" },
  { id: "zepaVaOcLME", label: "Gilgit-Baltistan – Land of Giants" },
  { id: "VxZBUfC2j3E", label: "Kalash Valley – Ancient Culture of Chitral" },
  { id: "2B3nvBbmMnk", label: "Deosai National Park – World's Highest Plateau" },
  { id: "eQ3tLm70p2g", label: "Karachi to Gwadar – The Makran Coastal Highway" },
];

/** [Pakistan Motorcycle Tour](https://www.youtube.com/playlist?list=PLSjc2o-bXB-r-pU3cOpLYfRXQQAum17Yl) — full playlist in one player */
const PAKISTAN_MOTORCYCLE_PLAYLIST_ID = "PLSjc2o-bXB-r-pU3cOpLYfRXQQAum17Yl";
const PAKISTAN_MOTORCYCLE_PLAYLIST_URL =
  "https://www.youtube.com/playlist?list=PLSjc2o-bXB-r-pU3cOpLYfRXQQAum17Yl";

function playlistEmbedSrc(listId: string) {
  const params = new URLSearchParams({
    list: listId,
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
}

function embedSrc(video: (typeof VIRTUAL_TOUR_VIDEOS)[number]) {
  const base = `https://www.youtube.com/embed/${video.id}`;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (video.start != null) params.set("start", String(video.start));
  return `${base}?${params.toString()}`;
}

export default function VirtualTourPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-lime-50 pt-24 md:pt-28 pb-12">
      <div className="container mx-auto px-4 space-y-6">
        <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 md:p-10">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <Camera className="h-3.5 w-3.5" /> Virtual Tour Experience
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight font-headline">Explore Pakistan from Anywhere</h1>
            <p className="mt-3 text-muted-foreground">
              This section is now live as a guided preview hub. Dive into destination highlights and jump directly
              into map planning or custom itineraries.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild><Link href="/map"><MapPin className="mr-2 h-4 w-4" />Open Interactive Map</Link></Button>
              <Button asChild variant="outline"><Link href="/planner"><Compass className="mr-2 h-4 w-4" />Plan a Tour</Link></Button>
            </div>
          </div>
        </div>

        <section className="space-y-4" aria-labelledby="virtual-tour-videos-heading">
          <div className="flex flex-col gap-1">
            <h2 id="virtual-tour-videos-heading" className="text-2xl font-bold tracking-tight text-[#003D5B]">
              Video tours
            </h2>
            <p className="text-sm text-muted-foreground">
              Watch curated Pakistan travel footage. Playback uses{" "}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#00798C] underline-offset-4 hover:underline"
              >
                YouTube
              </a>{" "}
              embeds.
            </p>
          </div>

          <div
            className="space-y-3 rounded-2xl border bg-card/50 p-4 md:p-6"
            aria-labelledby="playlist-motorcycle-heading"
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3
                  id="playlist-motorcycle-heading"
                  className="text-lg font-semibold text-[#003D5B] md:text-xl"
                >
                  Pakistan Motorcycle Tour
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Full YouTube playlist — use the player menu to switch between all episodes.
                </p>
              </div>
              <a
                href={PAKISTAN_MOTORCYCLE_PLAYLIST_URL}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-sm font-medium text-[#00798C] underline-offset-4 hover:underline"
              >
                Open playlist on YouTube
              </a>
            </div>
            <div className="mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-xl border bg-black shadow-md">
              <iframe
                className="h-full w-full"
                src={playlistEmbedSrc(PAKISTAN_MOTORCYCLE_PLAYLIST_ID)}
                title="Pakistan Motorcycle Tour — YouTube playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[#003D5B] pt-2">More video tours</h3>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {VIRTUAL_TOUR_VIDEOS.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="h-full w-full"
                    src={embedSrc(video)}
                    title={video.label}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 border-t px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{video.label}</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}${video.start != null ? `&t=${video.start}s` : ""}`}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-xs text-[#00798C] underline-offset-4 hover:underline"
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

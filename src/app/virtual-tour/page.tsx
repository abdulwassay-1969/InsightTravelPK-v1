"use client";

import Link from "next/link";
import { MapPin, Compass, Play, Youtube, Info, Sparkles, Camera, Map } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VirtualTourPage() {
  const moreVideos = [
    { id: "15W4PLDYDfw", title: "Hunza Valley Road Trip" },
    { id: "3VX2ka0ak1E", title: "Skardu – Gateway to K2 Base Camp" },
    { id: "PQMAWhVtGqM", title: "Lahore – The Cultural Heart of Pakistan" },
    { id: "ExyCpYVtJpU", title: "Fairy Meadows & Nanga Parbat Trek" },
    { id: "41RDQj0d24Q", title: "Swat Valley – The Switzerland of Pakistan" },
    { id: "zepaVaOcLME", title: "Gilgit-Baltistan – Land of Giants" },
    { id: "VxZBUfC2j3E", title: "Kalash Valley – Ancient Culture of Chitral" },
    { id: "2B3nvBbmMnk", title: "Deosai National Park" },
    { id: "eQ3tLm70p2g", title: "Karachi to Gwadar – Coastal Highway" },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-24 md:pt-28 pb-20">
      <div className="container mx-auto px-4 space-y-16">
        
        {/* Hero Section - Matched to Live Site */}
        <div className="relative rounded-[2rem] overflow-hidden border border-slate-200 bg-stone-50/50 p-8 md:p-16 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-4 py-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              <Play className="h-3.5 w-3.5 fill-current" /> Virtual Tour Experience
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 font-headline">
              Explore Pakistan from Anywhere
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              This section is now live as a guided preview hub. Dive into destination highlights and jump directly 
              into map planning or custom itineraries.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild size="lg" className="bg-[#0f2e2e] hover:bg-[#0a1f1f] text-white rounded-xl px-8 h-14 text-lg font-bold shadow-xl shadow-teal-900/10">
                <Link href="/map">
                  <Map className="mr-2 h-5 w-5" />
                  Open Interactive Map
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-slate-200 bg-white text-slate-700 px-8 h-14 text-lg font-bold hover:bg-slate-50">
                <Link href="/planner">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                  Plan a Tour
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Video Tours */}
        <div className="space-y-10">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-[#003D5B] tracking-tight">Video tours</h2>
            <p className="text-slate-500 font-medium">
              Watch curated Pakistan travel footage. Playback uses <span className="text-teal-600 font-bold border-b-2 border-teal-600/20">YouTube</span> embeds.
            </p>
          </div>

          {/* Pakistan Motorcycle Tour Card */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-xl hover:border-teal-500/20">
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-[#003D5B] tracking-tight">Pakistan Motorcycle Tour</h3>
                  <p className="text-slate-500 font-medium">Full YouTube playlist — use the player menu to switch between all episodes.</p>
                </div>
                <Button variant="link" asChild className="text-[#00798C] p-0 h-auto font-black text-sm uppercase tracking-widest hover:text-[#005f6d]">
                  <a href="https://www.youtube.com/playlist?list=PLSjc2o-bXB-r-pU3cOpLYfRXQQAum17Yl" target="_blank" rel="noopener noreferrer">
                    Open playlist on YouTube
                  </a>
                </Button>
              </div>

              {/* YouTube Main Player */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
                <iframe
                  src="https://www.youtube.com/embed/videoseries?list=PLSjc2o-bXB-r-pU3cOpLYfRXQQAum17Yl"
                  title="Pakistan Motorcycle Tour Playlist"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* More Video Tours Grid */}
        <div className="space-y-12 pt-10">
          <div className="space-y-2 text-center md:text-left border-l-4 border-teal-500 pl-6">
            <h2 className="text-3xl font-black text-[#003D5B] tracking-tight uppercase">More video tours</h2>
            <p className="text-slate-500 font-medium italic">Discover the beauty of Pakistan through these curated videos.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {moreVideos.map((video) => (
              <div key={video.id} className="group flex flex-col space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 shadow-md transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1 border border-slate-100">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?rel=0&showinfo=0&controls=1`}
                    title={video.title}
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="space-y-1 px-1">
                  <h4 className="font-bold text-slate-800 line-clamp-1 group-hover:text-teal-600 transition-colors">{video.title}</h4>
                  <a 
                    href={`https://www.youtube.com/watch?v=${video.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[11px] font-black text-[#00798C] uppercase tracking-widest hover:underline"
                  >
                    Open on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="rounded-[3rem] bg-slate-900 p-12 md:p-20 text-center text-white space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[100px] -mr-32 -mt-32" />
          <div className="max-w-2xl mx-auto space-y-6 relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Compass className="h-8 w-8 text-teal-400" />
            </div>
            <h3 className="text-3xl font-black tracking-tight">Expand the Library</h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Are you a traveler with high-quality Pakistan footage? Share your YouTube links with us 
              and help the world discover our beautiful country.
            </p>
            <Button className="bg-teal-600 hover:bg-teal-500 text-white rounded-full px-10 h-14 font-black shadow-xl shadow-teal-900/20 transition-transform hover:scale-105">
              Submit Your Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Square, ExternalLink, Compass, Sparkles, Loader2, Info, Headphones, Youtube, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateAiTourGuide } from '@/app/actions/ai-guide';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface VirtualTourPanelProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
    province: string;
    imageUrl: string;
    youtubeId?: string;
  } | null;
}

export function VirtualTourPanel({ isOpen, onClose, location }: VirtualTourPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiContent, setAiContent] = useState<{
    script: string;
    didYouKnow: { question: string; answer: string }[];
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [expandedTrivia, setExpandedTrivia] = useState<number | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    // If it's a YouTube video, it loads its own player, so we don't need a loader spinner after initial render
    setIsImageLoading(!!location?.imageUrl && !location?.youtubeId);
  }, [location?.imageUrl, location?.youtubeId]);

  useEffect(() => {
    if (isOpen) {
      setAiContent(null);
      setExpandedTrivia(null);
      stopAudio();
    }
  }, [location, isOpen]);

  const handleStartAiGuide = async () => {
    if (!location) return;
    try {
      setIsAiLoading(true);
      const content = await generateAiTourGuide(location.name);
      if (!content) throw new Error("No content generated");
      
      setAiContent(content);
      
      // Setup Text to Speech
      const utterance = new SpeechSynthesisUtterance(content.script);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setSpeech(utterance);
      
      // Auto play
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (error) {
      console.error("AI Guide Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const togglePlay = () => {
    if (!speech) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.speak(speech);
      }
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  if (!isOpen || !location) return null;

  return (
    <div 
      className={cn(
        "z-[3000] bg-[#0f2027] text-white shadow-2xl transition-all duration-500 ease-in-out",
        "fixed inset-x-0 bottom-0 h-[85vh] rounded-t-3xl border-t border-white/10 md:relative md:inset-auto md:h-full md:w-[500px] md:rounded-none md:border-l",
        isOpen ? "translate-y-0 md:translate-x-0 opacity-100" : "translate-y-full md:translate-x-full opacity-0 md:w-0 md:border-none"
      )}
    >
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0f2027]/80 backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{location.name}</h2>
            <p className="text-xs text-teal-400 font-medium uppercase tracking-wider">{location.province}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full hover:bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-0">
            {/* Immersive View (YouTube 360 or Image Fallback) */}
            <div className="aspect-[16/9] md:aspect-[4/3] w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
              {location.youtubeId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${location.youtubeId}?autoplay=0&controls=1&rel=0&showinfo=0&mute=0&vq=hd1080`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                    </div>
                  )}
                  <img
                    src={location.imageUrl}
                    alt={location.name}
                    onLoad={() => setIsImageLoading(false)}
                    className={cn(
                      "w-full h-full object-cover animate-ken-burns scale-110 transition-opacity duration-700",
                      isImageLoading ? "opacity-0" : "opacity-100"
                    )}
                  />
                </>
              )}
              
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-teal-600/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-lg">
                <Youtube className={cn("h-3 w-3", location.youtubeId ? "text-red-500" : "text-white animate-spin-slow")} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  {location.youtubeId ? "360° Virtual Experience" : "Virtual Insight"}
                </span>
              </div>

              {!location.youtubeId && (
                <div className="absolute bottom-4 right-4">
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-[10px] h-8 rounded-full gap-2">
                    <Upload className="h-3 w-3" />
                    Submit 360° Video
                  </Button>
                </div>
              )}
            </div>

            {/* AI Guide Section */}
            <div className="p-6 space-y-6">
              {!aiContent ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-teal-400" />
                  </div>
                  <p className="text-slate-400 text-sm italic">
                    Ready to explore {location.name} with an AI companion?
                  </p>
                  <Button 
                    onClick={handleStartAiGuide}
                    disabled={isAiLoading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-14 font-bold shadow-lg shadow-teal-900/20 gap-3"
                  >
                    {isAiLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Preparing your guide...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        Start AI Audio Guide
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  {/* Audio Controls */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-500/20 p-2 rounded-lg">
                        <Compass className="h-5 w-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Voice</p>
                        <p className="text-sm font-medium">InsightTravelPK Guide</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={togglePlay}
                        className="h-12 w-12 rounded-full bg-teal-600 hover:bg-teal-500 text-white"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={stopAudio}
                        className="h-12 w-12 rounded-full border border-white/10 hover:bg-white/5 text-slate-400"
                      >
                        <Square className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Script Text */}
                  <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-[0.2em] mb-3">Tour Commentary</h4>
                    <p className="text-slate-300 leading-relaxed italic text-sm">
                      "{aiContent.script}"
                    </p>
                  </div>

                  {/* Trivia */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-2">Did you know?</h4>
                    {aiContent.didYouKnow.map((item, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all",
                          expandedTrivia === idx ? "ring-1 ring-teal-500/50" : ""
                        )}
                      >
                        <button 
                          onClick={() => setExpandedTrivia(expandedTrivia === idx ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <span className="text-sm font-semibold pr-4">{item.question}</span>
                          <Info className={cn("h-4 w-4 shrink-0 transition-transform", expandedTrivia === idx ? "text-teal-400 rotate-180" : "text-slate-500")} />
                        </button>
                        {expandedTrivia === idx && (
                          <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-300">
                            <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-[#0f2027] grid grid-cols-2 gap-3">
          <Button asChild variant="outline" className="rounded-xl border-white/10 bg-transparent hover:bg-white/5 text-white gap-2">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${location.coordinates.lat},${location.coordinates.lng}`} 
              target="_blank" 
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Google Maps
            </a>
          </Button>
          <Button asChild className="rounded-xl bg-primary text-white gap-2">
            <Link href={`/planner?dest=${encodeURIComponent(location.name)}`}>
              <Compass className="h-4 w-4" />
              Plan a Trip
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { 
  Compass, 
  Star, 
  CheckCircle, 
  Languages, 
  Award,
  Loader,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { searchGuides, bookGuide, rateGuide, type Guide } from '../actions';

interface GuidesPanelProps {
  userId: string;
  locationName: string;
}

export function GuidesPanel({ userId, locationName }: GuidesPanelProps) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiringId, setHiringId] = useState<string | null>(null);
  const [hiredStatus, setHiredStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadGuides() {
      try {
        setLoading(true);
        const data = await searchGuides(locationName);
        setGuides(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadGuides();
  }, [locationName]);

  const handleHire = async (guide: Guide) => {
    const guideIdStr = guide.id || guide.name;
    try {
      setHiringId(guideIdStr);
      const dateStr = new Date().toISOString().split('T')[0];
      await bookGuide(userId, guideIdStr, guide.name, dateStr, guide.ratePerDay);
      setHiredStatus(prev => ({ ...prev, [guideIdStr]: true }));
    } catch (e) {
      console.error(e);
    } finally {
      setHiringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400">
        <Loader className="h-6 w-6 animate-spin text-teal-500 mb-2" />
        <p className="text-xs">Finding local experts in {locationName}...</p>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 text-xs">
        No verified guides listed for {locationName} yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
          <Compass className="h-4 w-4" />
          Verified Local Tour Guides in {locationName}
        </h4>
        <span className="text-[10px] text-slate-400">{guides.length} Experts Online</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((guide) => {
          const guideIdStr = guide.id || guide.name;
          const isHired = hiredStatus[guideIdStr];
          return (
            <Card key={guideIdStr} className="bg-slate-900/30 border-slate-700/50 text-white overflow-hidden shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-4 flex gap-4">
                <img 
                  src={guide.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} 
                  alt={guide.name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-700 shrink-0"
                />
                
                <div className="flex-grow space-y-1.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-white truncate flex items-center gap-1">
                      {guide.name}
                      {guide.verified && <CheckCircle className="h-3.5 w-3.5 text-teal-400 shrink-0" />}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-400 text-xs font-bold shrink-0">
                      <Star className="h-3 w-3 fill-amber-400" />
                      {guide.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Languages className="h-3 w-3 shrink-0" />
                    <span className="truncate">{guide.languages.join(', ')}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {guide.specialties.slice(0, 2).map((s) => (
                      <span key={s} className="text-[9px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Daily Rate:</span>
                      <span className="text-xs font-black text-white">PKR {guide.ratePerDay.toLocaleString()}</span>
                    </div>

                    <Button 
                      onClick={() => handleHire(guide)}
                      disabled={isHired || hiringId === guideIdStr}
                      size="sm"
                      className={`h-7 px-3 text-[10px] font-bold rounded-lg ${
                        isHired 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-teal-600 hover:bg-teal-500 text-white'
                      }`}
                    >
                      {hiringId === guideIdStr && <Loader className="h-3 w-3 animate-spin mr-1" />}
                      {isHired ? <UserCheck className="h-3 w-3 mr-1" /> : null}
                      {isHired ? "Hired" : "Book Guide"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

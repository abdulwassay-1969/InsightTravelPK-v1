'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { AuthDialog } from '@/components/auth-dialog';
import { BookingPanel } from '@/features/bookings/components/booking-panel';
import { AdvancedWeather } from '@/features/weather/components/advanced-weather';
import { SafetyPanel } from '@/features/safety/components/safety-panel';
import { GuidesPanel } from '@/features/guides/components/guides-panel';
import { OfflineManager } from '@/features/offline/components/offline-manager';
import { AdminPanel } from '@/features/admin/components/admin-panel';
import { AudioNarration } from '@/features/tts/components/audio-narration';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Compass, 
  MapPin, 
  ShieldAlert, 
  Smartphone, 
  Briefcase, 
  Volume2, 
  Settings, 
  Calendar,
  Lock,
  Wifi,
  CloudSun,
  Users
} from 'lucide-react';

export default function FeaturesDashboard() {
  const { user, loading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'weather' | 'safety' | 'guides' | 'offline' | 'admin'>('bookings');

  // Fallback demo user ID if not logged in to facilitate offline/live testing
  const activeUserId = user?.uid || 'demo-explorer-786';

  const sampleTourScript = "You are looking at the stunning Fairy Meadows, situated at the base of Nanga Parbat, the ninth highest mountain in the world. The green pasture is surrounded by dense pine forests and offers a breathtaking view of the massive snow-capped peak. Locally known as 'Joot', this area was named Fairy Meadows by German climbers in 1953.";

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 md:pt-32">
      <AuthDialog isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <div className="container mx-auto px-4 max-w-6xl space-y-8">
        {/* Header banner */}
        <div className="rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-[#003D5B] to-slate-900 border border-slate-800 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[120px] -mr-40 -mt-40 pointer-events-none" />
          <div className="max-w-2xl relative space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              <Compass className="h-3.5 w-3.5" /> Explorer Services
            </span>
            <h1 className="text-3xl md:text-5xl font-black font-headline tracking-tight text-white">
              InsightTravelPK Portal Dashboard
            </h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Access real-time safety alerts, manage local hotel/transport bookings, verify tour experts, and prepare map layers for offline mountain travel.
            </p>
            
            {!user && (
              <div className="flex items-center gap-2 pt-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl max-w-md">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Running in <b>Demo Mode</b>. Log in to save bookings and reports to your account.</span>
                <Button onClick={() => setIsAuthOpen(true)} size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-bold ml-auto py-1 h-7">
                  Log In
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Global TTS Audio Player Widget */}
        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          <Card className="bg-slate-900/40 border-slate-800 text-white md:col-span-2 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-teal-400" />
                Immersive Tour Voice Commentary Demo
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Test the multi-language speech synthesizers for local narrations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioNarration text={sampleTourScript} />
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/40 border-slate-800 text-white shadow-lg flex flex-col justify-between p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-teal-400">
                <Wifi className="h-5 w-5" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Network Status & Caching</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Leaflet tiles and route paths are saved to Cache Storage automatically as you explore the live interactive maps.
              </p>
            </div>
            <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3 mt-4">
              ✔ PWA Service Worker activated locally.
            </div>
          </Card>
        </div>

        {/* Main Tabbed Grid */}
        <div className="grid gap-6 md:grid-cols-4 items-start">
          {/* Sidebar Tabs */}
          <div className="space-y-2 md:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">Feature Navigation</h3>
            
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'bookings' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              Bookings & Commerce
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'weather' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <CloudSun className="h-4 w-4" />
              Mountain Safety & Weather
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'safety' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              SOS & Live Alerts
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'guides' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <Users className="h-4 w-4" />
              Verified Local Guides
            </button>

            <button
              onClick={() => setActiveTab('offline')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'offline' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              Offline Map Caches
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
                activeTab === 'admin' 
                  ? 'bg-[#003D5B] text-teal-400 shadow-md border-l-4 border-teal-500' 
                  : 'bg-slate-900/40 text-slate-300 hover:bg-slate-900/60'
              }`}
            >
              <Settings className="h-4 w-4" />
              Partnership & CMS Panel
            </button>
          </div>

          {/* Active Panel View */}
          <div className="md:col-span-3">
            {activeTab === 'bookings' && <BookingPanel userId={activeUserId} />}
            {activeTab === 'weather' && <AdvancedWeather />}
            {activeTab === 'safety' && <SafetyPanel userId={activeUserId} currentLocationName="Hunza Valley" />}
            {activeTab === 'guides' && <GuidesPanel userId={activeUserId} locationName="Hunza Valley" />}
            {activeTab === 'offline' && <OfflineManager />}
            {activeTab === 'admin' && <AdminPanel userId={activeUserId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

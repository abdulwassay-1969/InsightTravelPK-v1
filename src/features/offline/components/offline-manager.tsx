'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle2, 
  HardDrive,
  Loader,
  RefreshCw
} from 'lucide-react';
import { downloadOfflineMap, type OfflinePackage } from '../actions';

export function OfflineManager() {
  const [isOnline, setIsOnline] = useState(true);
  const [downloadedProvinces, setDownloadedProvinces] = useState<Record<string, OfflinePackage>>({});
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Register service worker and monitor online status
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register PWA Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('ServiceWorker registered successfully:', reg.scope))
          .catch((err) => console.warn('ServiceWorker registration failed:', err));
      });
    }

    // Load downloaded packages from localStorage
    const saved = localStorage.getItem('downloaded_maps');
    if (saved) {
      try {
        setDownloadedProvinces(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDownload = async (provinceKey: string, provinceName: string) => {
    try {
      setDownloading(provinceKey);
      setProgress(10);
      
      // Simulate progress bar movement
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 20;
        });
      }, 300);

      const pkg = await downloadOfflineMap(provinceKey);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        const updated = {
          ...downloadedProvinces,
          [provinceKey]: pkg
        };
        setDownloadedProvinces(updated);
        localStorage.setItem('downloaded_maps', JSON.stringify(updated));
        setDownloading(null);
        setProgress(0);
      }, 500);
    } catch (e) {
      console.error(e);
      setDownloading(null);
    }
  };

  const PROVINCES = [
    { key: 'gilgit_baltistan', name: 'Gilgit-Baltistan' },
    { key: 'kp', name: 'Khyber Pakhtunkhwa' },
    { key: 'punjab', name: 'Punjab' },
    { key: 'sindh', name: 'Sindh' }
  ];

  return (
    <div className="space-y-6">
      {/* Floating Network Status Indicator */}
      {!isOnline && (
        <div className="fixed bottom-6 left-6 z-[4000] bg-red-600 border border-red-500 text-white px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl animate-bounce">
          <WifiOff className="h-4 w-4" />
          <span className="text-xs font-black uppercase tracking-wider">Offline Mode Active</span>
        </div>
      )}

      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-700/50 p-2 rounded-xl">
                <HardDrive className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-white">Offline Access Management</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Cache routes and destination markers locally for travel where signal is lost.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {isOnline ? 'Live Connection' : 'Offline'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROVINCES.map((prov) => {
              const isDownloaded = !!downloadedProvinces[prov.key];
              const isDownloading = downloading === prov.key;
              return (
                <div key={prov.key} className="p-4 bg-slate-900/30 border border-slate-700/50 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-white block">{prov.name} Map Package</span>
                    {isDownloaded ? (
                      <span className="text-[10px] text-teal-400 flex items-center gap-1 mt-0.5 font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Ready Offline ({downloadedProvinces[prov.key].packageSizeMb} MB)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 block mt-0.5">Not cached locally</span>
                    )}
                  </div>

                  <Button
                    onClick={() => handleDownload(prov.key, prov.name)}
                    disabled={isDownloading || !isOnline}
                    size="sm"
                    className={`h-8 px-3 text-[10px] font-bold rounded-lg ${
                      isDownloaded 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' 
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {isDownloading ? (
                      <span className="flex items-center gap-1">
                        <Loader className="h-3 w-3 animate-spin" /> {progress}%
                      </span>
                    ) : isDownloaded ? (
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" /> Update
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" /> Cache
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

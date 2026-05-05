'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function ConnectivityManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initial check
    if (typeof window !== 'undefined') {
      setIsOffline(!window.navigator.onLine);
    }

    const handleOnline = () => {
      setIsOffline(false);
      setShowBanner(false);
      toast({
        title: "Back Online",
        description: "Your connection has been restored. You can now use all features.",
        variant: "default",
        className: "bg-[#0F6E56] text-white border-none",
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
      toast({
        title: "Connection Lost",
        description: "You are currently offline. Some features may be unavailable.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!showBanner) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[3000] transition-all duration-500 ease-in-out transform",
      showBanner ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="bg-destructive/90 backdrop-blur-md text-white px-4 py-2 flex items-center justify-between shadow-lg border-b border-white/10">
        <div className="flex items-center gap-3 container mx-auto">
          <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-none">Offline Mode</span>
            <span className="text-[10px] opacity-80">Working with cached data only</span>
          </div>
          <div className="hidden md:flex items-center gap-4 ml-8 border-l border-white/20 pl-8">
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-xs hover:text-white/80 transition-colors bg-white/10 px-3 py-1 rounded-full border border-white/20"
            >
              <RefreshCw className="w-3 h-3" />
              Retry Connection
            </button>
          </div>
        </div>
        <button 
          onClick={() => setShowBanner(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

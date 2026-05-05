'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress on route change
    setLoading(true);
    setProgress(10);
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(timer);
          return 90;
        }
        return prev + 10;
      });
    }, 150);

    // End progress after a short delay to simulate completion
    const endTimer = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(endTimer);
    };
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[4000] h-[3px]">
      <div 
        className="h-full bg-gradient-to-r from-[#0F6E56] via-[#059669] to-[#34d399] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(15,110,86,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

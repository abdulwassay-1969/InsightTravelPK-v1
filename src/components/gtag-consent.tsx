"use client";

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'ga_consent';

function injectGtag(measurementId: string) {
  if (!measurementId) return;
  if (typeof window === 'undefined') return;

  // avoid injecting twice
  if ((window as any).__ga_script_loaded) return;
  (window as any).__ga_script_loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);} 
    gtag('js', new Date());
    gtag('config', '${measurementId}', { 'anonymize_ip': true });
  `;
  document.head.appendChild(inline);
}

export default function GtagConsent() {
  const [consent, setConsent] = useState<string | null>(null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setConsent(stored);
      if (stored === 'granted' && measurementId) {
        injectGtag(measurementId);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [measurementId]);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch {};
    setConsent('granted');
    if (measurementId) injectGtag(measurementId);
  };

  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch {};
    setConsent('denied');
  };

  // If measurementId not configured or consent already decided, render nothing
  if (!measurementId || consent === 'granted' || consent === 'denied') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[4000] max-w-xl w-[calc(100%-32px)] bg-white/95 border border-border shadow-lg rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="text-sm text-slate-800">
        We use Google Analytics to improve the site. Do you allow analytics cookies?
      </div>
      <div className="flex items-center gap-2">
        <button onClick={decline} className="px-3 py-2 text-sm rounded-md border border-muted text-muted">Decline</button>
        <button onClick={accept} className="px-3 py-2 text-sm rounded-md bg-primary text-primary-foreground">Accept</button>
      </div>
    </div>
  );
}

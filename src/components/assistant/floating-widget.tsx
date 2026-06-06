'use client';

import React, { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';

const TourismChatbot = dynamic(() => import('@/components/assistant/tourism-chatbot'), { ssr: false });

export default function FloatingWidget() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const shouldShowWidget =
    !!pathname &&
    !pathname.startsWith('/assistant') &&
    !pathname.startsWith('/login') &&
    !pathname.startsWith('/register');

  if (!shouldShowWidget) {
    return null;
  }

  const startSpeechRecognition = () => {
    const win = typeof window !== 'undefined' ? window as any : undefined;
    const SpeechRecognition = win?.SpeechRecognition || win?.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    recognition.onerror = (evt: any) => {
      setListening(false);
      recognitionRef.current = null;
      console.error('Speech recognition error', evt);
    };

    recognition.onresult = (evt: any) => {
      const transcript = evt.results[0][0].transcript;
      window.location.href = `/assistant?voice=${encodeURIComponent(transcript)}`;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setListening(false);
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        {/* Toggle button — clicking will open or close the chat panel */}
        <button
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          onClick={() => setOpen((v) => !v)}
          className="fixed right-5 bottom-6 z-[4000] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>

        <SheetContent
          side="right"
          className="right-3 top-3 bottom-3 h-[calc(100vh-1.5rem)] w-[min(430px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border border-slate-200/70 p-0 shadow-[0_30px_90px_rgba(2,40,63,0.18)] sm:max-w-none"
        >
          <div className="h-full overflow-auto">
            <TourismChatbot compact resetOnOpen initialGreeting="Hello, how can I help you?" />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

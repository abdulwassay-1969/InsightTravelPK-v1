'use client';

import React, { useState, useRef } from 'react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic } from 'lucide-react';
import dynamic from 'next/dynamic';

const TourismChatbot = dynamic(() => import('@/components/assistant/tourism-chatbot'), { ssr: false });

export default function FloatingWidget() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
      <Sheet>
          <SheetTrigger asChild>
          <button
            aria-label="Open assistant"
            className="fixed right-5 bottom-6 z-[4000] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl hover:scale-105"
          >
            <MessageSquare className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-lg font-bold">InsightTravelPK Assistant</h3>
            <div className="flex items-center gap-2">
              <Button onClick={() => (listening ? stopSpeechRecognition() : startSpeechRecognition())} className="rounded-full">
                <Mic className="mr-2 h-4 w-4" />
                {listening ? 'Listening...' : 'Voice'}
              </Button>
            </div>
          </div>
          <div className="p-4">
            <TourismChatbot />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

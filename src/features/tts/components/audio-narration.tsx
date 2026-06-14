'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  Languages, 
  User,
  Loader
} from 'lucide-react';
import { generateMultiLangAudio } from '../actions';

interface AudioNarrationProps {
  text: string;
}

export function AudioNarration({ text }: AudioNarrationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState('english');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Stop any speaking audio if component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handlePlay = async () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    try {
      setLoading(true);
      window.speechSynthesis.cancel(); // Reset active speech

      const config = await generateMultiLangAudio(text, language, gender);
      const utterance = new SpeechSynthesisUtterance(config.text);
      utterance.lang = config.langCode;
      utterance.rate = config.speechRate;

      // Find best matched voice in browser voices database
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => 
        v.lang.startsWith(config.langCode) && 
        (v.name.includes(config.voiceNamePattern || '') || v.name.toLowerCase().includes(gender))
      ) || voices.find(v => v.lang.startsWith(config.langCode));

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <Card className="bg-slate-900/40 border-slate-700/50 text-white overflow-hidden shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-teal-400" />
            <span className="text-xs font-bold text-slate-200">Audio Guide Commentary</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <Languages className="h-3 w-3 text-slate-400" />
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  handleStop();
                }}
                className="bg-transparent text-[10px] font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="english">English</option>
                <option value="urdu">Urdu</option>
                <option value="chinese">Chinese</option>
                <option value="arabic">Arabic</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            {/* Voice Gender Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/50">
              <User className="h-3 w-3 text-slate-400" />
              <select
                value={gender}
                onChange={(e) => {
                  setGender(e.target.value as 'male' | 'female');
                  handleStop();
                }}
                className="bg-transparent text-[10px] font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="female">Female Voice</option>
                <option value="male">Male Voice</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={handlePlay}
            disabled={loading}
            className="h-10 w-10 bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-md"
          >
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
          </Button>

          <Button
            size="icon"
            onClick={handlePause}
            disabled={!isPlaying}
            className="h-10 w-10 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl"
          >
            <Pause className="h-4 w-4 fill-slate-300" />
          </Button>

          <Button
            size="icon"
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="h-10 w-10 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl"
          >
            <Square className="h-4 w-4 fill-slate-300" />
          </Button>
          
          <div className="text-[10px] text-slate-400 pl-2 italic">
            {isPlaying ? "Speaking..." : isPaused ? "Paused" : "Ready to speak"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

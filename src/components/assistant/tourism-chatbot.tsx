'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Building2,
  CloudSun,
  Compass,
  Loader2,
  MapPin,
  MessageSquare,
  Route,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  Wallet,
  Mic,
} from 'lucide-react';

import { CONTACTS } from '@/data/contacts';
import { getDistrictDetail } from '@/lib/district-details';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type AssistantLanguage = 'english' | 'urdu' | 'roman-urdu';

type AssistantPageType = 'general' | 'province' | 'district' | 'weather' | 'planner';

type AssistantContext = {
  locationName?: string;
  provinceName?: string;
  pageType?: AssistantPageType;
  bestTimeToVisit?: string;
  attractions?: string[];
  emergencySummary?: string;
  weatherSummary?: string;
  sourceUrl?: string;
  reset?: boolean;
};

type ChatRole = 'user' | 'assistant';

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  quickReplies?: string[];
  safetyNote?: string;
  suggestedFollowUp?: string;
};

type StoredAssistantState = {
  messages: ChatMessage[];
  language: AssistantLanguage;
  context: AssistantContext;
  updatedAt: string;
};

type TourismChatbotProps = {
  initialContext?: AssistantContext;
  title?: string;
  subtitle?: string;
};

const STORAGE_KEY = 'insighttravelpk-tourism-assistant-v1';

const QUICK_ACTIONS = [
  { key: 'weather', label: 'Weather', icon: CloudSun },
  { key: 'best-time', label: 'Best time', icon: Sparkles },
  { key: 'nearby', label: 'Nearby places', icon: Compass },
  { key: 'budget', label: 'Budget', icon: Wallet },
  { key: 'route', label: 'Route', icon: Route },
  { key: 'hotels', label: 'Hotels', icon: Building2 },
  { key: 'contacts', label: 'Emergency', icon: ShieldAlert },
] as const;

const LANGUAGE_OPTIONS: Array<{ value: AssistantLanguage; label: string; short: string }> = [
  { value: 'english', label: 'English', short: 'EN' },
  { value: 'urdu', label: 'Urdu', short: 'اردو' },
  { value: 'roman-urdu', label: 'Roman Urdu', short: 'RU' },
];

const SAMPLE_PROMPTS = [
  'Plan a 3-day family trip to Hunza',
  'What is the safest time to visit Skardu?',
  'Suggest a budget route from Lahore to Swat',
  'Tell me emergency contacts for this province',
];

function createId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
}

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function findProvinceContact(provinceName?: string) {
  if (!provinceName) {
    return undefined;
  }

  const normalizedProvince = normalizeName(provinceName);
  const aliases: Record<string, string> = {
    'azad kashmir': 'azad jammu and kashmir',
    'islamabad capital territory': 'islamabad capital territory',
  };

  const lookup = aliases[normalizedProvince] ?? normalizedProvince;

  return CONTACTS.find((entry) => normalizeName(entry.province) === lookup);
}

function buildEmergencySummary(provinceName?: string) {
  const contact = findProvinceContact(provinceName);

  if (!contact) {
    return 'Police 15, Ambulance 1122, Fire 16, Motorway Police 130. Check the Contacts page for the latest province-specific tourism lines.';
  }

  return `${contact.province}: Police ${contact.emergency.police}, Ambulance ${contact.emergency.ambulance}, Fire ${contact.emergency.fire}, Motorway Police ${contact.emergency.motorway}. Tourism line: ${contact.tourism.phone}. Verified ${contact.tourism.lastVerified}.`;
}

function buildWeatherSummary(weatherData: any) {
  if (!weatherData?.current || !Array.isArray(weatherData?.forecast)) {
    return undefined;
  }

  const forecastText = weatherData.forecast
    .slice(0, 3)
    .map((day: any) => `${day.day} ${day.high}/${day.low}°C`)
    .join(', ');

  return `${weatherData.city}: ${weatherData.current.temp}°C and ${weatherData.current.description}. Next 3 days: ${forecastText}.`;
}

function buildWelcomeMessage(language: AssistantLanguage, context: AssistantContext) {
  const locationText = context.locationName
    ? ` I already know you are looking at ${context.locationName}${context.provinceName ? `, ${context.provinceName}` : ''}.`
    : '';

  if (language === 'urdu') {
    return {
      id: createId(),
      role: 'assistant' as const,
      content: `میں InsightTravelPK اسسٹنٹ ہوں۔ پاکستان کے سفر، مقامات، راستوں، موسم، بجٹ، ہوٹل، اور حفاظت کے بارے میں پوچھیں۔${locationText ? ` ${locationText}` : ''}`,
      createdAt: new Date().toISOString(),
      quickReplies: ['Weather', 'Best time to visit', 'Nearby places', 'Emergency contacts'],
    };
  }

  if (language === 'roman-urdu') {
    return {
      id: createId(),
      role: 'assistant' as const,
      content: `Main InsightTravelPK assistant hoon. Pakistan ke safar, jagahon, routes, weather, budget, hotels, aur safety ke bare mein pooch sakte hain.${locationText ? ` ${locationText}` : ''}`,
      createdAt: new Date().toISOString(),
      quickReplies: ['Weather', 'Best time to visit', 'Nearby places', 'Emergency contacts'],
    };
  }

  return {
    id: createId(),
    role: 'assistant' as const,
    content: `I’m the InsightTravelPK assistant. Ask me anything about Pakistan tourism, routes, weather, best time to visit, budgets, hotels, or safety.${locationText}`,
    createdAt: new Date().toISOString(),
    quickReplies: ['Weather', 'Best time to visit', 'Nearby places', 'Emergency contacts'],
  };
}

function buildQuickActionPrompt(actionKey: string, context: AssistantContext, language: AssistantLanguage) {
  const locationText = context.locationName
    ? `${context.locationName}${context.provinceName ? `, ${context.provinceName}` : ''}`
    : context.provinceName ?? 'Pakistan';

  const languageInstruction =
    language === 'urdu' ? 'Reply in Urdu.' : language === 'roman-urdu' ? 'Reply in Roman Urdu.' : 'Reply in English.';

  switch (actionKey) {
    case 'weather':
      return `${languageInstruction} Give a practical travel weather update for ${locationText}. Include what to pack and whether it is a good time to travel.`;
    case 'best-time':
      return `${languageInstruction} Tell me the best time to visit ${locationText}. Mention season, weather, and road or altitude cautions.`;
    case 'nearby':
      return `${languageInstruction} Suggest nearby places, viewpoints, or side trips around ${locationText}. Keep it tourist-friendly and realistic.`;
    case 'budget':
      return `${languageInstruction} Estimate a budget for a short tourist trip to ${locationText}. Break it down into travel, stay, food, and activities.`;
    case 'route':
      return `${languageInstruction} Explain the safest and most practical route to ${locationText}. Mention road conditions, travel time, and seasonal warnings.`;
    case 'hotels':
      return `${languageInstruction} Suggest hotel areas or stay options around ${locationText} for families, couples, and budget travelers.`;
    case 'contacts':
      return `${languageInstruction} Share the relevant emergency and tourism contacts for ${locationText} and mention the key travel safety numbers.`;
    default:
      return `${languageInstruction} Help me plan a tourism-related trip in Pakistan.`;
  }
}

async function fetchWeatherSummary(locationName?: string) {
  if (!locationName) {
    return undefined;
  }

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(locationName)}`);
    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    return buildWeatherSummary(data);
  } catch {
    return undefined;
  }
}

function createWelcomeState(language: AssistantLanguage, context: AssistantContext) {
  return [buildWelcomeMessage(language, context)];
}

export default function TourismChatbot({ initialContext, title, subtitle }: TourismChatbotProps) {
  const initialLanguage: AssistantLanguage = 'english';
  const initialAssistantContext: AssistantContext = {
    pageType: 'general',
    attractions: [],
    ...initialContext,
  };
  const [language, setLanguage] = useState<AssistantLanguage>(initialLanguage);
  const [context, setContext] = useState<AssistantContext>(() => initialAssistantContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);
      if (savedState && !initialContext?.reset) {
        const parsedState = JSON.parse(savedState) as StoredAssistantState;
        if (parsedState?.messages?.length) {
          setMessages(parsedState.messages);
          setLanguage(parsedState.language ?? initialLanguage);
          setContext({
            pageType: 'general',
            attractions: [],
            ...initialContext,
            ...parsedState.context,
          });
          setIsHydrated(true);
          return;
        }
      }
    } catch {
      // Ignore malformed saved state and fall back to a fresh chat.
    }

    const welcomeContext: AssistantContext = {
      pageType: 'general',
      attractions: [],
      ...initialContext,
    };

    setMessages(createWelcomeState(initialLanguage, welcomeContext));
    setLanguage(initialLanguage);
    setContext(welcomeContext);
    setIsHydrated(true);
  }, [initialContext]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const stateToPersist: StoredAssistantState = {
      messages,
      language,
      context,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [context, isHydrated, language, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  const resetChat = () => {
    const nextContext: AssistantContext = {
      pageType: 'general',
      attractions: [],
      ...initialContext,
    };

    setContext(nextContext);
    setLanguage(initialLanguage);
    setMessages(createWelcomeState(initialLanguage, nextContext));
    setDraft('');
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (messageText: string, overrideContext?: Partial<AssistantContext>) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isSending) {
      return;
    }

    const nextConversation: ChatMessage[] = [
      ...messages,
      {
        id: createId(),
        role: 'user',
        content: trimmedMessage,
        createdAt: new Date().toISOString(),
      },
    ];

    const effectiveContext: AssistantContext = {
      ...context,
      ...overrideContext,
    };

    setMessages(nextConversation);
    setDraft('');
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          language,
          conversation: nextConversation.slice(-12).map((entry) => ({
            role: entry.role,
            content: entry.content,
          })),
          context: {
            locationName: effectiveContext.locationName,
            provinceName: effectiveContext.provinceName,
            pageType: effectiveContext.pageType ?? 'general',
            bestTimeToVisit: effectiveContext.bestTimeToVisit,
            attractions: effectiveContext.attractions ?? [],
            emergencySummary: effectiveContext.emergencySummary,
            weatherSummary: effectiveContext.weatherSummary,
            sourceUrl: effectiveContext.sourceUrl,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'The tourism assistant could not respond right now.');
      }

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content: data.reply,
        createdAt: new Date().toISOString(),
        quickReplies: data.quickReplies,
        safetyNote: data.safetyNote,
        suggestedFollowUp: data.suggestedFollowUp,
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setContext(effectiveContext);
    } catch (chatError) {
      const fallbackMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content:
          chatError instanceof Error
            ? chatError.message
            : 'The tourism assistant is temporarily unavailable. Please try again in a moment.',
        createdAt: new Date().toISOString(),
        quickReplies: ['Weather', 'Best time to visit', 'Nearby places', 'Emergency contacts'],
      };

      setError(fallbackMessage.content);
      setMessages((currentMessages) => [...currentMessages, fallbackMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(draft);
  };

  const handleSamplePrompt = async (prompt: string) => {
    setDraft(prompt);
    await sendMessage(prompt);
  };

  const startListening = () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError('Speech recognition is not supported in this browser.');
        return;
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = language === 'urdu' || language === 'roman-urdu' ? 'ur-PK' : 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (ev: any) => {
        try {
          const transcript = Array.from(ev.results).map((r: any) => r[0].transcript).join(' ');
          setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
        } catch {
          // ignore
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      setError('Unable to start speech recognition.');
    }
  };

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }
    setIsListening(false);
    recognitionRef.current = null;
  };

  const handleQuickAction = async (actionKey: string) => {
    const locationName = context.locationName || context.provinceName;

    if (actionKey === 'weather') {
      const liveWeatherSummary = await fetchWeatherSummary(locationName);
      const nextContext = {
        ...context,
        weatherSummary: liveWeatherSummary,
      };

      setContext(nextContext);
      await sendMessage(buildQuickActionPrompt(actionKey, nextContext, language), nextContext);
      return;
    }

    if (actionKey === 'contacts') {
      const emergencySummary = buildEmergencySummary(context.provinceName || context.locationName);
      const nextContext = {
        ...context,
        emergencySummary,
      };

      setContext(nextContext);
      await sendMessage(buildQuickActionPrompt(actionKey, nextContext, language), nextContext);
      return;
    }

    await sendMessage(buildQuickActionPrompt(actionKey, context, language), context);
  };

  const locationTag = context.locationName ?? context.provinceName ?? 'All Pakistan';
  const attractionPreview = context.attractions?.slice(0, 3) ?? [];

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_90px_rgba(2,40,63,0.14)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(0,61,91,0.96),rgba(0,121,140,0.88),rgba(116,175,219,0.55))] px-5 py-5 text-white md:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
              <Badge className="border-white/20 bg-white/10 text-white">Pakistan tourism only</Badge>
              {context.pageType === 'district' && (
                <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-50">Context aware</Badge>
              )}
              <Badge className="border-white/20 bg-white/10 text-white">Saved locally on this device</Badge>
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                {title || 'InsightTravelPK Travel Assistant'}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/82 md:text-base">
                {subtitle || 'Ask about destinations, routes, weather, budgets, hotels, safety, and emergency travel contacts anywhere in Pakistan.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <Button variant="secondary" onClick={resetChat} className="rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Trash2 className="mr-2 h-4 w-4" /> New chat
            </Button>
            <Button asChild variant="secondary" className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
              <Link href="/contact">
                <ShieldAlert className="mr-2 h-4 w-4" /> Contacts
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="secondary"
              onClick={() => setLanguage(option.value)}
              className={cn(
                'rounded-full border text-xs font-semibold uppercase tracking-[0.2em] transition-all',
                language === option.value
                  ? 'border-white/20 bg-white text-slate-900 hover:bg-white'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white'
              )}
            >
              {option.short}
            </Button>
          ))}
        </div>

        {locationTag && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
              <MapPin className="h-3.5 w-3.5" /> {locationTag}
            </span>
            {context.bestTimeToVisit && (
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                Best time: {context.bestTimeToVisit}
              </span>
            )}
            {attractionPreview.map((attraction) => (
              <span key={attraction} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                {attraction}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 bg-white/90 p-4 lg:border-b-0 lg:border-r lg:p-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSamplePrompt(prompt)}
                className="group rounded-2xl border border-white/10 bg-white px-4 py-4 text-left text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <MessageSquare className="mb-3 h-4 w-4 text-primary transition-transform group-hover:scale-110" />
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.key}
                  type="button"
                  variant="outline"
                  onClick={() => handleQuickAction(action.key)}
                  className="justify-start gap-2 rounded-2xl border-white/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="h-4 w-4" />
              Safety-first travel guidance
            </div>
            <p className="mt-1 text-sm leading-6 text-amber-900/90">
              The assistant will prioritize road conditions, seasonal travel risks, weather, altitude, and emergency contacts whenever those details matter.
            </p>
          </div>
        </div>

        <div className="flex min-h-[520px] flex-col bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:px-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Bot className="h-4 w-4 text-primary" /> Live chat
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {messages.length ? 'Your conversation is saved automatically on this device.' : 'Start with a destination or tap a quick action.'}
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600">
              {language === 'english' ? 'EN' : language === 'urdu' ? 'اردو' : 'Roman Urdu'}
            </Badge>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[92%] rounded-[1.4rem] px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[84%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-white/10 bg-white/95 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] opacity-80">
                    {message.role === 'user' ? <span>You</span> : <span>InsightTravelPK</span>}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{message.content}</p>

                  {message.safetyNote && (
                    <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                      <span className="font-semibold">Safety note:</span> {message.safetyNote}
                    </div>
                  )}

                  {message.suggestedFollowUp && (
                    <p className="mt-3 text-xs opacity-85">{message.suggestedFollowUp}</p>
                  )}

                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {message.quickReplies.map((reply) => (
                        <Button
                          key={reply}
                          type="button"
                          variant="secondary"
                          onClick={() => sendMessage(reply)}
                          className={cn(
                            'h-auto rounded-full px-3 py-1.5 text-xs font-semibold',
                            message.role === 'assistant'
                              ? 'bg-white text-slate-700 hover:bg-slate-100'
                              : 'bg-white/15 text-white hover:bg-white/25'
                          )}
                        >
                          {reply}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/95 px-4 py-3 text-sm text-foreground shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Thinking about the best Pakistan travel answer...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 bg-white/90 px-4 py-4 md:px-6">
            {error && (
              <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                {error}
              </div>
            )}

            <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm">
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void handleSend();
                  }
                }}
                placeholder={
                  language === 'urdu'
                    ? 'پاکستان کے سفر کے بارے میں سوال لکھیں...'
                    : language === 'roman-urdu'
                      ? 'Pakistan ke safar ke bare mein sawal likhein...'
                      : 'Ask anything about Pakistan tourism...'
                }
                className="min-h-[110px] resize-none border-0 bg-transparent px-2 py-2 text-base shadow-none focus-visible:ring-0"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {SAMPLE_PROMPTS.slice(0, 2).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSamplePrompt(s)}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-foreground hover:bg-white/10"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-col gap-3 border-t border-white/5 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  Ask about destinations, weather, routes, hotels, budgets, permits, safety, or emergency contacts in Pakistan.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening() : startListening())}
                    aria-pressed={isListening}
                    className={cn(
                      'rounded-full p-2 transition-colors',
                      isListening ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-foreground'
                    )}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  <Button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={isSending || !draft.trim()}
                    className="rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                  >
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
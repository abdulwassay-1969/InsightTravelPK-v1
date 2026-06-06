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
  compact?: boolean;
  resetOnOpen?: boolean;
  initialGreeting?: string;
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
  { value: 'urdu', label: 'Urdu', short: 'UR' },
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
    .map((day: any) => `${day.day} ${day.high}/${day.low}Â°C`)
    .join(', ');

  return `${weatherData.city}: ${weatherData.current.temp}Â°C and ${weatherData.current.description}. Next 3 days: ${forecastText}.`;
}

function buildWelcomeMessage(language: AssistantLanguage, context: AssistantContext) {
  const locationText = context.locationName
    ? ` I already know you are looking at ${context.locationName}${context.provinceName ? `, ${context.provinceName}` : ''}.`
    : '';

  if (language === 'urdu') {
    return {
      id: createId(),
      role: 'assistant' as const,
      content: `Ù…ÛŒÚº InsightTravelPK Ø§Ø³Ø³Ù¹Ù†Ù¹ ÛÙˆÚºÛ” Ù¾Ø§Ú©Ø³ØªØ§Ù† Ú©Û’ Ø³ÙØ±ØŒ Ù…Ù‚Ø§Ù…Ø§ØªØŒ Ø±Ø§Ø³ØªÙˆÚºØŒ Ù…ÙˆØ³Ù…ØŒ Ø¨Ø¬Ù¹ØŒ ÛÙˆÙ¹Ù„ØŒ Ø§ÙˆØ± Ø­ÙØ§Ø¸Øª Ú©Û’ Ø¨Ø§Ø±Û’ Ù…ÛŒÚº Ù¾ÙˆÚ†Ú¾ÛŒÚºÛ”${locationText ? ` ${locationText}` : ''}`,
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
    content: `Iâ€™m the InsightTravelPK assistant. Ask me anything about Pakistan tourism, routes, weather, best time to visit, budgets, hotels, or safety.${locationText}`,
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

function getAssistantChatUrl() {
  return new URL('/api/assistant/chat', window.location.origin).toString();
}

function createWelcomeState(language: AssistantLanguage, context: AssistantContext) {
  return [buildWelcomeMessage(language, context)];
}

function formatMessageTime(createdAt: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(createdAt));
  } catch {
    return '';
  }
}

export default function TourismChatbot({ initialContext, title, subtitle, compact = false, resetOnOpen = false, initialGreeting, }: TourismChatbotProps) {
  const initialLanguage: AssistantLanguage = 'english';
  const initialAssistantContext: AssistantContext = {
    pageType: 'general',
    attractions: [],
    ...initialContext,
  };
  // `compact` controls whether the component renders a minimal chat-only UI.
  const [language, setLanguage] = useState<AssistantLanguage>(initialLanguage);
  const [context, setContext] = useState<AssistantContext>(() => initialAssistantContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(STORAGE_KEY);
      const parsedState = savedState ? (JSON.parse(savedState) as StoredAssistantState) : null;
      const forceReset = resetOnOpen || initialContext?.reset;
      if (parsedState && !forceReset) {
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

    // If an explicit initial greeting is requested, show only that assistant message.
    if (initialGreeting) {
      setMessages([
        {
          id: createId(),
          role: 'assistant',
          content: initialGreeting,
          createdAt: new Date().toISOString(),
          quickReplies: ['Weather', 'Best time to visit', 'Nearby places'],
        },
      ]);
    } else {
      setMessages(createWelcomeState(initialLanguage, welcomeContext));
    }

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
      const response = await fetch(getAssistantChatUrl(), {
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

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const responseText = await response.text();
        throw new Error(
          `Assistant returned an unexpected response (${response.status}). ${responseText.slice(0, 180)}`
        );
      }

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
      const isNetworkFailure =
        chatError instanceof TypeError &&
        chatError.message === 'Failed to fetch';

      const fallbackMessage: ChatMessage = {
        id: createId(),
        role: 'assistant',
        content:
          isNetworkFailure
            ? 'I could not reach the assistant server. Please make sure the Next.js dev server is still running, then refresh the page and try again.'
            : chatError instanceof Error
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
  const starterPrompts = SAMPLE_PROMPTS.slice(0, 3);

  const renderMessageBubble = (message: ChatMessage, theme: 'compact' | 'full') => {
    const isUser = message.role === 'user';
    const timeLabel = formatMessageTime(message.createdAt);

    return (
      <div key={message.id} className={cn('flex items-end gap-3', isUser ? 'justify-end' : 'justify-start')}>
        {!isUser && (
          <div
            className={cn(
              'mb-1 flex shrink-0 items-center justify-center rounded-2xl text-white shadow-lg',
              theme === 'compact'
                ? 'h-10 w-10 bg-[linear-gradient(135deg,#003D5B,#00798C)]'
                : 'h-11 w-11 bg-[linear-gradient(135deg,#003D5B,#00798C)]'
            )}
          >
            <Bot className="h-5 w-5" />
          </div>
        )}

        <div
          className={cn(
            'max-w-[92%] rounded-[1.6rem] px-4 py-3 text-sm leading-7 shadow-sm md:max-w-[84%]',
            isUser
              ? theme === 'compact'
                ? 'bg-[linear-gradient(135deg,#003D5B,#00798C)] text-white'
                : 'bg-[linear-gradient(135deg,#003D5B,#005D77)] text-white'
              : theme === 'compact'
                ? 'border border-slate-200 bg-white/96 text-slate-800'
                : 'border border-slate-200 bg-slate-50 text-slate-800'
          )}
        >
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-[0.18em]">
            <span className={isUser ? 'text-white/80' : 'text-slate-500'}>
              {isUser ? 'You' : 'InsightTravelPK'}
            </span>
            {timeLabel && (
              <span className={isUser ? 'text-white/55' : 'text-slate-400'}>{timeLabel}</span>
            )}
          </div>

          <p className="mt-2 whitespace-pre-wrap">{message.content}</p>

          {message.safetyNote && (
            <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              <span className="font-semibold">Safety note:</span> {message.safetyNote}
            </div>
          )}

          {message.suggestedFollowUp && (
            <p className="mt-3 text-xs leading-5 opacity-85">{message.suggestedFollowUp}</p>
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
                    isUser
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  )}
                >
                  {reply}
                </Button>
              ))}
            </div>
          )}
        </div>

        {isUser && (
          <div
            className={cn(
              'mb-1 flex shrink-0 items-center justify-center rounded-2xl text-white shadow-lg',
              theme === 'compact'
                ? 'h-10 w-10 bg-[linear-gradient(135deg,#0f172a,#334155)]'
                : 'h-11 w-11 bg-[linear-gradient(135deg,#0f172a,#334155)]'
            )}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">You</span>
          </div>
        )}
      </div>
    );
  };

  const renderTypingBubble = (theme: 'compact' | 'full') => (
    <div className="flex items-end gap-3 justify-start">
      <div
        className={cn(
          'mb-1 flex shrink-0 items-center justify-center rounded-2xl text-white shadow-lg',
          theme === 'compact'
            ? 'h-10 w-10 bg-[linear-gradient(135deg,#003D5B,#00798C)]'
            : 'h-11 w-11 bg-[linear-gradient(135deg,#003D5B,#00798C)]'
        )}
      >
        <Bot className="h-5 w-5" />
      </div>

      <div
        className={cn(
          'inline-flex items-center gap-3 rounded-[1.6rem] border px-4 py-3 text-sm shadow-sm',
          theme === 'compact'
            ? 'border-slate-200 bg-white/96 text-slate-600'
            : 'border-slate-200 bg-slate-50 text-slate-600'
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin text-[#00798C]" />
        <span>Thinking about the best Pakistan travel answer...</span>
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,251,253,0.96))] shadow-[0_30px_90px_rgba(2,40,63,0.14)] backdrop-blur-xl">
      <div className="border-b border-slate-200/80 bg-[radial-gradient(circle_at_top_right,rgba(116,175,219,0.22),transparent_36%),linear-gradient(135deg,rgba(0,61,91,0.96),rgba(0,121,140,0.9),rgba(116,175,219,0.48))] px-5 py-5 text-white md:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            {context.pageType === 'district' && (
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75">
                <Badge className="border-emerald-300/20 bg-emerald-400/15 text-emerald-50">Context aware</Badge>
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/10 text-white shadow-lg ring-1 ring-white/10 md:flex">
                <Bot className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2
                    className={cn(
                      'max-w-[12ch] font-black tracking-tight text-white',
                      compact ? 'text-2xl leading-[1.02] md:text-3xl' : 'text-3xl leading-[1.02] md:text-4xl'
                    )}
                  >
                    {title || 'InsightTravelPK Travel Assistant'}
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/20 bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold text-emerald-50">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Live assistant
                  </span>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-white/84 md:text-base">
                  {subtitle || 'Talk to the assistant like you would to a travel guide. Ask naturally about routes, weather, hotels, budgets, safety, or local tips anywhere in Pakistan.'}
                </p>
              </div>
            </div>

            {locationTag && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
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
              title={option.label}
              aria-label={option.label}
              onClick={() => setLanguage(option.value)}
              className={cn(
                'min-w-[3.5rem] rounded-full border text-xs font-semibold uppercase tracking-[0.2em] transition-all',
                language === option.value
                  ? 'border-white/20 bg-white text-slate-900 hover:bg-white'
                  : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white'
              )}
            >
              {option.short}
            </Button>
          ))}
        </div>
      </div>

      {compact ? (
        <div className="p-4 md:p-5">
          <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,253,1))] shadow-[0_24px_70px_rgba(2,40,63,0.08)]">
            <div className="border-b border-slate-200/80 px-4 py-4 md:px-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#003D5B,#00798C)] text-white shadow-lg">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      InsightTravelPK Assistant
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Ready
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Ask like you would with a local travel guide. Short questions, long questions, or voice-style notes all work.
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600">
                  {language === 'english' ? 'EN' : language === 'urdu' ? 'UR' : 'RU'}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSamplePrompt(prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:text-[#003D5B] hover:shadow-md"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-[560px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(0,121,140,0.05),transparent_28%),linear-gradient(180deg,rgba(250,252,255,1),rgba(255,255,255,1))] px-4 py-5 md:px-6">
                {messages.map((message) => renderMessageBubble(message, 'compact'))}

                {isSending && renderTypingBubble('compact')}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-slate-200/80 bg-white/95 px-4 py-4 md:px-6">
                {error && (
                  <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </div>
                )}

                <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {starterPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        type="button"
                        variant="secondary"
                        onClick={() => handleSamplePrompt(prompt)}
                        className="h-auto rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>

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
                        ? 'سفر، روٹ، موسم، یا بجٹ کے بارے میں سوال لکھیں...'
                        : language === 'roman-urdu'
                          ? 'Safar, route, weather, ya budget ke bare mein sawal likhein...'
                          : 'Ask about routes, weather, hotels, budgets, safety, or places to visit...'
                    }
                    className="min-h-[112px] resize-none border-0 bg-transparent px-2 py-2 text-base shadow-none focus-visible:ring-0"
                  />

                  <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-slate-500">
                      Press Enter to send. Shift+Enter adds a new line.
                    </p>
                    <Button
                      type="button"
                      onClick={() => void handleSend()}
                      disabled={isSending || !draft.trim()}
                      className="rounded-full bg-[#003D5B] px-5 text-white hover:bg-[#005173]"
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
      ) : (
        <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="border-b border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,252,254,1),rgba(241,247,250,1))] p-4 lg:border-b-0 lg:border-r lg:p-5">
            <div className="space-y-5">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Start here
                </p>
                <div className="mt-3 grid gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSamplePrompt(prompt)}
                      className="group rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-md"
                    >
                      <MessageSquare className="mb-3 h-4 w-4 text-[#00798C] transition-transform group-hover:scale-110" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.key}
                      type="button"
                      variant="outline"
                      onClick={() => handleQuickAction(action.key)}
                      className="justify-start gap-2 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#00798C]/30 hover:bg-[#00798C]/5 hover:text-[#003D5B]"
                    >
                      <Icon className="h-4 w-4" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ShieldAlert className="h-4 w-4 text-[#00798C]" />
                  Travel guidance built in
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  I’ll prioritize road conditions, seasonal travel risks, weather, altitude, and emergency contacts whenever they matter.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                    Press Enter to send
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                    Shift+Enter for line breaks
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-[720px] flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,251,253,1))]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#003D5B,#00798C)] text-white shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    Live chat
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Online
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {messages.length ? 'Your conversation is saved automatically on this device.' : 'Start by typing a destination or tapping a starter prompt.'}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-600">
                {language === 'english' ? 'EN' : language === 'urdu' ? 'UR' : 'RU'}
              </Badge>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(0,121,140,0.05),transparent_28%),linear-gradient(180deg,rgba(250,252,255,1),rgba(255,255,255,1))] px-4 py-5 md:px-6">
              {messages.map((message) => renderMessageBubble(message, 'full'))}

              {isSending && renderTypingBubble('full')}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200/80 bg-white/95 px-4 py-4 md:px-6">
              {error && (
                <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  {error}
                </div>
              )}

              <div className="rounded-[1.6rem] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-3 flex flex-wrap gap-2">
                  {starterPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="secondary"
                      onClick={() => handleSamplePrompt(prompt)}
                      className="h-auto rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>

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
                      ? 'سفر، روٹ، موسم، یا بجٹ کے بارے میں سوال لکھیں...'
                      : language === 'roman-urdu'
                        ? 'Safar, route, weather, ya budget ke bare mein sawal likhein...'
                        : 'Ask about routes, weather, hotels, budgets, safety, or places to visit...'
                  }
                  className="min-h-[112px] resize-none border-0 bg-transparent px-2 py-2 text-base shadow-none focus-visible:ring-0"
                />

                <div className="mt-3 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    Press Enter to send. Shift+Enter adds a new line.
                  </p>
                  <Button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={isSending || !draft.trim()}
                    className="rounded-full bg-[#003D5B] px-5 text-white hover:bg-[#005173]"
                  >
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
    );
}


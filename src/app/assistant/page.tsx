import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, Globe2, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

import TourismChatbot from '@/components/assistant/tourism-chatbot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CONTACTS } from '@/data/contacts';
import { provinces } from '@/lib/data';
import { getDistrictDetail } from '@/lib/district-details';

type SearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: 'Pakistan Tourism Assistant | InsightTravelPK',
  description: 'A smart Pakistan tourism chatbot for destinations, routes, weather, budgets, hotels, and safety guidance.',
};

function pickFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}


function buildInitialContext(searchParams: SearchParams) {
  const districtSlug = pickFirst(searchParams.districtSlug);
  const provinceSlug = pickFirst(searchParams.provinceSlug);
  const reset = pickFirst(searchParams.reset) === '1' || pickFirst(searchParams.reset) === 'true';

  const province = provinceSlug ? provinces.find((entry) => entry.slug === provinceSlug) : undefined;
  const district = districtSlug
    ? provinces.flatMap((entry) => entry.districts).find((entry) => entry.slug === districtSlug)
    : undefined;

  const provinceName = province?.name ?? undefined;
  const districtName = district?.name ?? undefined;
  const districtDetail = districtSlug ? getDistrictDetail(districtSlug) : undefined;
  const provinceContact = CONTACTS.find((entry) => {
    const normalizedContactProvince = entry.province.toLowerCase().replace(/&/g, 'and');
    const normalizedSelectedProvince = (provinceName ?? '').toLowerCase().replace(/&/g, 'and');
    return normalizedContactProvince === normalizedSelectedProvince;
  });

  const context = {
    pageType: districtName ? ('district' as const) : provinceName ? ('province' as const) : ('general' as const),
    locationName: districtName ?? provinceName,
    provinceName,
    bestTimeToVisit: districtDetail?.bestTime,
    attractions: districtDetail?.attractions.map((attraction) => attraction.name) ?? province?.districts.map((entry) => entry.name).slice(0, 5) ?? [],
    emergencySummary: provinceContact
      ? `${provinceContact.province}: Police ${provinceContact.emergency.police}, Ambulance ${provinceContact.emergency.ambulance}, Fire ${provinceContact.emergency.fire}, Motorway Police ${provinceContact.emergency.motorway}. Tourism line ${provinceContact.tourism.phone}.`
      : undefined,
    reset,
    sourceUrl: districtName ? `/districts/${districtSlug}` : provinceName ? `/provinces/${provinceSlug}` : '/assistant',
  };

  return context;
}

export default async function AssistantPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const initialContext = buildInitialContext(resolvedSearchParams);
  const locationLabel = initialContext.locationName ?? 'Pakistan-wide travel help';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,121,140,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(116,175,219,0.18),transparent_26%),linear-gradient(180deg,rgba(241,248,252,1),rgba(250,252,255,1)_40%,rgba(233,243,247,0.9))] pt-28 pb-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 shadow-[0_22px_80px_rgba(2,40,63,0.12)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.92fr]">
            <div className="relative overflow-hidden px-6 py-8 md:px-10 md:py-12">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,61,91,0.96),rgba(0,121,140,0.9),rgba(116,175,219,0.48))]" />
              <div className="absolute -right-12 top-6 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-12 left-20 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
              <div className="relative z-10 max-w-2xl text-white">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/75">
                  <Badge className="border-white/20 bg-white/10 text-white">Smart travel assistant</Badge>
                  <Badge className="border-white/20 bg-white/10 text-white">English, Urdu, Roman Urdu</Badge>
                </div>
                <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                  Pakistan Tourism Assistant
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/84 md:text-lg">
                  Ask about routes, weather, hotels, budgets, local food, safety, permits, and emergency contacts for any Pakistan destination. The assistant saves your chat locally so you can continue later.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button asChild className="rounded-full bg-white text-slate-900 hover:bg-slate-100">
                    <Link href="/planner">
                      Open Smart Planner <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                    <Link href="/contact">
                      <ShieldAlert className="mr-2 h-4 w-4" /> Emergency contacts
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-0 border-t border-white/60 bg-white/90 p-6 md:p-8 lg:border-l lg:border-t-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/90 p-5 shadow-sm">
                  <Globe2 className="h-5 w-5 text-primary" />
                  <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-foreground">Tourism only</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The assistant stays focused on Pakistan travel so answers are concise and reliable.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/90 p-5 shadow-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-foreground">Smart follow-ups</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Quick buttons let users ask about weather, routes, hotels, budgets, nearby places, and contacts with one tap.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/90 p-5 shadow-sm sm:col-span-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.22em] text-foreground">Context aware</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {initialContext.locationName
                      ? `This chat opens with context for ${locationLabel}, so the assistant can answer without asking the user to repeat the location.`
                      : 'Open a district or province page to launch a location-aware chat, or use the general assistant for Pakistan-wide travel help.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50 p-4 text-sm text-amber-950">
                <div className="flex items-center gap-2 font-semibold">
                  <Bot className="h-4 w-4" /> Safety-first travel guidance
                </div>
                <p className="mt-2 leading-6 text-amber-900/95">
                  The assistant prioritizes road conditions, seasonal travel risks, weather, altitude, and emergency contacts whenever those details matter.
                </p>
              </div>
            </div>
          </div>
        </div>

        <TourismChatbot
          initialContext={initialContext}
          title="Ask the Pakistan Travel Assistant"
          subtitle="Use the quick actions or type a question in English, Urdu, or Roman Urdu."
        />
      </div>
    </main>
  );
}
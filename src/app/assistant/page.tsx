import type { Metadata } from 'next';

import TourismChatbot from '@/components/assistant/tourism-chatbot';
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

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,121,140,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(116,175,219,0.18),transparent_26%),linear-gradient(180deg,rgba(241,248,252,1),rgba(250,252,255,1)_40%,rgba(233,243,247,0.9))] px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <TourismChatbot
          initialContext={initialContext}
          title="Pakistan Travel Chat"
          subtitle="Ask your travel questions and get straight answers without the extra page clutter."
        />
      </div>
    </main>
  );
}

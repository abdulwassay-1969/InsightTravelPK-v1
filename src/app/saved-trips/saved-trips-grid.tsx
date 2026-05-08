"use client";

import Link from "next/link";
import { ArrowRight, CalendarRange, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SAVED_TRIPS, type SavedTrip } from "@/data/saved-trips";
import { cn } from "@/lib/utils";

const ACCENT_BAR_BY_ID: Record<string, string> = {
  "hunza-silk-road": "bg-gradient-to-r from-cyan-600 via-sky-700 to-indigo-900",
  "swat-alpine": "bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900",
  "lahore-mughal": "bg-gradient-to-r from-amber-700 via-orange-800 to-rose-950",
  "islamabad-capital": "bg-gradient-to-r from-slate-600 via-zinc-800 to-stone-950",
  "skardu-highlands": "bg-gradient-to-r from-blue-800 via-slate-800 to-cyan-950",
  "karachi-sindh": "bg-gradient-to-r from-rose-800 via-fuchsia-900 to-violet-950",
  "gwadar-coast": "bg-gradient-to-r from-amber-900 via-orange-950 to-stone-950",
  "neelum-kashmir": "bg-gradient-to-r from-green-800 via-emerald-900 to-teal-950",
};

const INTEREST_LABELS: Record<string, string> = {
  history: "History & culture",
  nature: "Nature & scenery",
  adventure: "Adventure & sports",
  food: "Culinary & food",
  relaxation: "Relaxation & wellness",
};

const TRANSPORT_LABELS: Record<string, string> = {
  "road-trip": "Road trip / car",
  "public-transport": "Public transport",
  mixed: "Mixed (road + flight)",
};

const PACE_LABELS: Record<string, string> = {
  relaxed: "Relaxed",
  balanced: "Balanced",
  packed: "Packed",
};

const STYLE_LABELS: Record<string, string> = {
  solo: "Solo",
  couple: "Couple",
  family: "Family",
  friends: "Friends",
};

const BUDGET_LABELS: Record<string, string> = {
  "budget-friendly": "Budget-friendly",
  "mid-range": "Mid-range",
  luxury: "Luxury",
};

const ACC_LABELS: Record<string, string> = {
  "budget-guesthouse": "Budget guesthouse",
  "comfortable-hotel": "Comfortable hotel",
  "premium-resort": "Premium resort",
};

function TripDetails({ trip }: { trip: SavedTrip }) {
  const p = trip.plannerDefaults;
  const interests = p.interests.map((id) => INTEREST_LABELS[id] ?? id).join(" · ");

  return (
    <div className="space-y-4 border-t border-slate-200 pt-4 text-left text-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailRow label="Travel style" value={STYLE_LABELS[p.travelStyle] ?? p.travelStyle} />
        <DetailRow label="Pace" value={PACE_LABELS[p.pace] ?? p.pace} />
        <DetailRow label="Transport" value={TRANSPORT_LABELS[p.transport] ?? p.transport} />
        <DetailRow label="Budget band" value={BUDGET_LABELS[p.budget] ?? p.budget} />
        <DetailRow label="Accommodation" value={ACC_LABELS[p.accommodation] ?? p.accommodation} />
        <DetailRow label="Travelers" value={String(p.travelers)} />
        <DetailRow label="Currency" value={p.currency} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Interests</p>
        <p className="mt-1 text-slate-700">{interests || "—"}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Must-visit stops</p>
        <ul className="mt-1 list-inside list-disc space-y-1 text-slate-700">
          {p.mustVisit.map((m) => (
            <li key={m}>{m}</li>
          ))}
          {p.mustVisitOther ? (
            <li className="list-none pl-0 text-slate-600">
              <span className="font-medium text-slate-800">Also: </span>
              {p.mustVisitOther}
            </li>
          ) : null}
        </ul>
      </div>
      {p.notes ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Planner notes</p>
          <p className="mt-1 leading-relaxed text-slate-700">{p.notes}</p>
        </div>
      ) : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 font-medium text-slate-900">{value}</p>
    </div>
  );
}

export function SavedTripsGrid() {
  return (
    <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2">
      {SAVED_TRIPS.map((trip) => (
        <article
          key={trip.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition hover:shadow-lg"
        >
          <div
            className={cn(
              "h-2 w-full shrink-0",
              ACCENT_BAR_BY_ID[trip.id] ?? "bg-gradient-to-r from-[#00798C] to-[#003D5B]"
            )}
            aria-hidden
          />

          <div className="flex min-h-0 flex-1 flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl font-bold leading-tight text-slate-900 md:text-2xl">
                  {trip.title}
                </h2>
                <p className="mt-2 text-sm leading-snug text-slate-600">{trip.subtitle}</p>
              </div>
              <Sparkles className="h-6 w-6 shrink-0 text-[#00798C]" aria-hidden />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#003D5B]/10 px-3 py-1.5 text-xs font-semibold text-[#003D5B]">
                <CalendarRange className="h-3.5 w-3.5" aria-hidden />
                {trip.durationDays} days
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {trip.plannerDefaults.destination}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Highlights</p>
              <ul className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">
                {trip.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2">
                    <span className="mt-0.5 text-[#00798C]" aria-hidden>•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Collapsible defaultOpen className="mt-5 flex flex-1 flex-col">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-left text-sm font-semibold text-[#003D5B] transition hover:bg-slate-100 [&[data-state=open]>svg]:rotate-180">
                <span>Full trip details (planner preset)</span>
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" aria-hidden />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3 overflow-hidden">
                <TripDetails trip={trip} />
              </CollapsibleContent>
            </Collapsible>

            <Button asChild className="mt-6 w-full bg-[#00798C] text-white hover:bg-[#006a7a]">
              <Link href={`/planner?preset=${trip.id}`}>
                Open in Smart Planner
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}

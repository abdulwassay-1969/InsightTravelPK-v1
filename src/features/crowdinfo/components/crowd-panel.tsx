'use client';

import { useEffect, useState } from 'react';
import { Users, Clock, Calendar, TrendingDown, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { getCrowdInfo, getAlternativeDestinations } from '../actions';
import type { CrowdData, AlternativeDestination } from '../actions';

// ─── Types & helpers ──────────────────────────────────────────────────────────

interface Props {
  locationId: string;
  locationName: string;
}

type Density = CrowdData['currentDensity'];

const densityConfig: Record<
  Density,
  { label: string; barWidth: string; textColor: string; bgColor: string; borderColor: string }
> = {
  Empty: {
    label: 'Empty',
    barWidth: 'w-[8%]',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/40',
  },
  Quiet: {
    label: 'Quiet',
    barWidth: 'w-[25%]',
    textColor: 'text-teal-400',
    bgColor: 'bg-teal-500',
    borderColor: 'border-teal-500/40',
  },
  Moderate: {
    label: 'Moderate',
    barWidth: 'w-[50%]',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500',
    borderColor: 'border-amber-500/40',
  },
  Busy: {
    label: 'Busy',
    barWidth: 'w-[75%]',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-500/40',
  },
  Peak: {
    label: 'Peak',
    barWidth: 'w-full',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500',
    borderColor: 'border-red-500/40',
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MonthChip({ label, variant }: { label: string; variant: 'best' | 'peak' }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
        variant === 'best'
          ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
          : 'bg-orange-500/15 text-orange-300 border-orange-500/30'
      }`}
    >
      {label}
    </span>
  );
}

function AlternativeCard({ alt }: { alt: AlternativeDestination }) {
  return (
    <div className="flex gap-3 items-start p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:border-teal-500/40 transition-colors">
      <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-white">{alt.name}</p>
        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{alt.reason}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CrowdPanel({ locationId, locationName }: Props) {
  const [crowdData, setCrowdData] = useState<CrowdData | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [crowd, alts] = await Promise.all([
          getCrowdInfo(locationId, locationName),
          getAlternativeDestinations(locationId),
        ]);
        setCrowdData(crowd);
        setAlternatives(alts);
      } catch {
        setError('Failed to load crowd information. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [locationId, locationName]);

  // ── Loading State ──
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
        <span className="text-slate-400 text-sm">Loading crowd info…</span>
      </div>
    );
  }

  // ── Error State ──
  if (error || !crowdData) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-red-300 text-sm">{error ?? 'No crowd data available.'}</span>
      </div>
    );
  }

  const density = densityConfig[crowdData.currentDensity];

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700/60">
        <Users className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-semibold text-white">Crowd & Peak Times</h2>
      </div>

      <div className="p-5 space-y-6">
        {/* ── Current Density ── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Current crowd level</span>
            <span className={`text-sm font-semibold ${density.textColor}`}>
              {crowdData.currentDensity}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${density.bgColor} ${density.barWidth}`}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {(['Empty', 'Quiet', 'Moderate', 'Busy', 'Peak'] as Density[]).map((d) => (
              <span
                key={d}
                className={`text-[10px] ${
                  d === crowdData.currentDensity ? density.textColor + ' font-semibold' : 'text-slate-600'
                }`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* ── Best Months ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-slate-300">Best months to visit</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {crowdData.bestMonths.map((m) => (
              <MonthChip key={m} label={m} variant="best" />
            ))}
          </div>
        </div>

        {/* ── Peak Months ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-slate-300">Peak crowd months</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {crowdData.peakMonths.map((m) => (
              <MonthChip key={m} label={m} variant="peak" />
            ))}
          </div>
        </div>

        {/* ── Best Time of Day ── */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-teal-500/10 border border-teal-500/25">
          <Clock className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-teal-300 uppercase tracking-wide mb-0.5">
              Best time of day
            </p>
            <p className="text-sm text-white">{crowdData.bestTimeOfDay}</p>
            {crowdData.avgWaitMinutes > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Avg. queue wait: ~{crowdData.avgWaitMinutes} min during busy periods
              </p>
            )}
          </div>
        </div>

        {/* ── Insider Tip ── */}
        {crowdData.tip && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-700/40 border border-slate-600/40">
            <TrendingDown className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-0.5">
                Crowd insider tip
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">{crowdData.tip}</p>
            </div>
          </div>
        )}

        {/* ── Alternatives ── */}
        {alternatives.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-semibold text-white">Lesser-known alternatives</span>
            </div>
            <div className="space-y-2">
              {alternatives.map((alt) => (
                <AlternativeCard key={alt.locationId} alt={alt} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import {
  Accessibility,
  Heart,
  Building2,
  Utensils,
  Stethoscope,
  MapPin,
  ChevronDown,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Mountain,
} from 'lucide-react';
import { getAccessibilityInfo, getHealthcareFacilities, PROVINCES } from '../actions';
import type { AccessibilityInfo, HealthcareFacility } from '../actions';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  locationId: string;
  locationName: string;
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

const difficultyStyles: Record<AccessibilityInfo['difficulty'], string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Moderate: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Hard: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  Expert: 'bg-red-500/15 text-red-300 border-red-500/30',
};

// ─── Accessibility icon row item ──────────────────────────────────────────────

function AccessibilityItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
      <Icon className="w-5 h-5 text-slate-400" />
      <span className="text-[11px] text-slate-400 text-center leading-tight">{label}</span>
      {value ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <XCircle className="w-4 h-4 text-red-400" />
      )}
    </div>
  );
}

// ─── Hospital card ────────────────────────────────────────────────────────────

function HospitalCard({ facility }: { facility: HealthcareFacility }) {
  const typeColors: Record<HealthcareFacility['type'], string> = {
    Public: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    Private: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    Military: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    Mission: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/30 transition-colors">
      <Stethoscope className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-white leading-tight">{facility.name}</p>
          <span
            className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${typeColors[facility.type]}`}
          >
            {facility.type}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-slate-500" />
          <p className="text-xs text-slate-400">{facility.city}</p>
        </div>
        <a
          href={`tel:${facility.phone}`}
          className="text-xs text-teal-400 hover:text-teal-300 transition-colors mt-0.5 block"
        >
          {facility.phone}
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AccessibilityPanel({ locationId, locationName }: Props) {
  const [info, setInfo] = useState<AccessibilityInfo | null>(null);
  const [hospitals, setHospitals] = useState<HealthcareFacility[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>(PROVINCES[0]);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load accessibility info
  useEffect(() => {
    async function load() {
      try {
        setLoadingInfo(true);
        setError(null);
        const data = await getAccessibilityInfo(locationId);
        setInfo(data);
      } catch {
        setError('Failed to load accessibility information.');
      } finally {
        setLoadingInfo(false);
      }
    }
    load();
  }, [locationId]);

  // Load hospitals when province changes
  useEffect(() => {
    async function loadHospitals() {
      setLoadingHospitals(true);
      const data = await getHealthcareFacilities(selectedProvince);
      setHospitals(data);
      setLoadingHospitals(false);
    }
    loadHospitals();
  }, [selectedProvince]);

  // ── Loading State ──
  if (loadingInfo) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
        <span className="text-slate-400 text-sm">Loading accessibility info…</span>
      </div>
    );
  }

  // ── Error State ──
  if (error || !info) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <span className="text-red-300 text-sm">
          {error ?? 'Accessibility data unavailable.'}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700/60">
        <Accessibility className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-semibold text-white">Accessibility Information</h2>
      </div>

      <div className="p-5 space-y-6">
        {/* ── Icon Grid ── */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Facilities available
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            <AccessibilityItem
              icon={Accessibility}
              label="Wheelchair access"
              value={info.wheelchairAccess}
            />
            <AccessibilityItem
              icon={Heart}
              label="Senior friendly"
              value={info.seniorFriendly}
            />
            <AccessibilityItem
              icon={Building2}
              label="Family friendly"
              value={info.familyFriendly}
            />
            <AccessibilityItem
              icon={Building2}
              label="Prayer facilities"
              value={info.prayerFacilities}
            />
            <AccessibilityItem
              icon={Utensils}
              label="Halal food"
              value={info.halalFood}
            />
          </div>
        </div>

        {/* ── Altitude & Difficulty ── */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50">
            <Mountain className="w-4 h-4 text-teal-400" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">Altitude</p>
              <p className="text-sm font-semibold text-white">
                {info.altitude.toLocaleString()}m
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600/50">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide mb-1">Difficulty</p>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  difficultyStyles[info.difficulty]
                }`}
              >
                {info.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* ── Nearest Hospital ── */}
        <div className="flex items-start gap-3 p-3.5 rounded-lg bg-red-500/8 border border-red-500/20">
          <Stethoscope className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-red-300 uppercase tracking-wide mb-0.5">
              Nearest hospital
            </p>
            <p className="text-sm text-white font-medium">{info.nearestHospital}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {info.hospitalDistanceKm} km from location
            </p>
          </div>
        </div>

        {/* ── Notes ── */}
        {info.notes && (
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-700/40 border border-slate-600/40">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide mb-0.5">
                Accessibility notes
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">{info.notes}</p>
            </div>
          </div>
        )}

        {/* ── Province Healthcare Dropdown ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-semibold text-white">Healthcare by province</span>
          </div>
          <div className="relative mb-3">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full appearance-none bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {loadingHospitals ? (
            <div className="flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
              <span className="text-slate-400 text-sm">Loading facilities…</span>
            </div>
          ) : (
            <div className="space-y-2">
              {hospitals.map((h, i) => (
                <HospitalCard key={i} facility={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

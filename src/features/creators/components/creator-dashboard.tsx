'use client';

import { useEffect, useState, useTransition } from 'react';
import {
  BarChart2,
  Code2,
  DollarSign,
  Eye,
  Share2,
  Award,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Video,
  Star,
} from 'lucide-react';
import {
  registerCreator,
  getCreatorProfile,
  generateEmbedCode,
  getCreatorStats,
} from '../actions';
import type { CreatorProfile, CreatorContent } from '../actions';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  userId: string;
}

interface Stats {
  totalViews: number;
  totalEarnings: number;
  contentCount: number;
  topContent: CreatorContent[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function formatPKR(n: number): string {
  return `PKR ${n.toLocaleString('en-PK')}`;
}

const contentTypeIcon: Record<CreatorContent['type'], React.ElementType> = {
  itinerary: FileText,
  review: Star,
  vlog: Video,
};

const contentTypeBadge: Record<CreatorContent['type'], string> = {
  itinerary: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  review: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  vlog: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
};

// ─── Registration Form ────────────────────────────────────────────────────────

function RegistrationForm({
  userId,
  onSuccess,
}: {
  userId: string;
  onSuccess: (profile: CreatorProfile) => void;
}) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !bio.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await registerCreator(userId, displayName, bio);
      if (!result.success) {
        setError(result.error ?? 'Registration failed.');
        return;
      }
      onSuccess({
        userId,
        displayName: displayName.trim(),
        bio: bio.trim(),
        followers: 0,
        totalViews: 0,
        earnings: 0,
        verified: false,
        createdAt: new Date().toISOString(),
      });
    });
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-700/60">
        <Share2 className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-semibold text-white">Become a Creator</h2>
      </div>

      <div className="p-5">
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Join the InsightTravelPK creator programme. Share itineraries, reviews, and vlogs —
          earn PKR for every view your content generates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your creator name…"
              maxLength={50}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell travellers about yourself…"
              rows={3}
              maxLength={300}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-4 py-2.5 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
            />
            <p className="text-right text-xs text-slate-600 mt-1">{bio.length}/300</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Award className="w-4 h-4" />
            )}
            {isPending ? 'Registering…' : 'Become a Creator'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex-1 p-4 rounded-lg bg-slate-800/60 border border-slate-700/50">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-4 h-4 ${accent ?? 'text-teal-400'}`} />
        <span className="text-[11px] text-slate-400 uppercase tracking-wide font-medium">
          {label}
        </span>
      </div>
      <p className={`text-lg font-bold ${accent ?? 'text-white'}`}>{value}</p>
    </div>
  );
}

// ─── Embed Code Section ───────────────────────────────────────────────────────

function EmbedSection({ creatorId }: { creatorId: string }) {
  const [tripId, setTripId] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!tripId.trim()) return;
    setGenerating(true);
    const code = await generateEmbedCode(tripId.trim(), creatorId);
    setEmbedCode(code);
    setGenerating(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-800/30 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Code2 className="w-4 h-4 text-teal-400" />
        <span className="text-sm font-semibold text-white">Generate embed code</span>
      </div>
      <p className="text-xs text-slate-400">
        Paste a trip ID to generate an iframe you can embed on any website.
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={tripId}
          onChange={(e) => setTripId(e.target.value)}
          placeholder="e.g. hunza-skardu-7day"
          className="flex-1 bg-slate-800 border border-slate-600 text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
        />
        <button
          onClick={handleGenerate}
          disabled={!tripId.trim() || generating}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
          Generate
        </button>
      </div>

      {embedCode && (
        <div className="relative">
          <textarea
            readOnly
            value={embedCode}
            rows={5}
            className="w-full bg-slate-900 border border-slate-600 text-slate-300 text-xs rounded-lg px-3 py-2.5 font-mono resize-none focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Content Row ──────────────────────────────────────────────────────────────

function ContentRow({ content }: { content: CreatorContent }) {
  const Icon = contentTypeIcon[content.type];
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/30 transition-colors">
      <Icon className="w-4 h-4 text-slate-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{content.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border capitalize ${contentTypeBadge[content.type]}`}
          >
            {content.type}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Eye className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-400">{formatNumber(content.views)}</span>
        </div>
        <p className="text-xs font-semibold text-amber-400 mt-0.5">
          {formatPKR(content.earnings)}
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ profile, userId }: { profile: CreatorProfile; userId: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const s = await getCreatorStats(profile.id ?? userId);
      setStats(s);
      setLoading(false);
    }
    loadStats();
  }, [profile.id, userId]);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-semibold text-white">Creator Dashboard</h2>
        </div>
        {profile.verified && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">Verified</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-5">
        {/* Profile summary */}
        <div>
          <p className="text-base font-bold text-white">{profile.displayName}</p>
          <p className="text-sm text-slate-400 mt-0.5 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Stats row */}
        {loading ? (
          <div className="flex items-center gap-2 py-3">
            <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
            <span className="text-slate-400 text-sm">Loading stats…</span>
          </div>
        ) : stats ? (
          <>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <StatCard
                icon={Eye}
                label="Total views"
                value={formatNumber(stats.totalViews)}
              />
              <StatCard
                icon={DollarSign}
                label="Earnings"
                value={formatPKR(stats.totalEarnings)}
                accent="text-amber-400"
              />
              <StatCard
                icon={BarChart2}
                label="Content"
                value={stats.contentCount.toString()}
              />
            </div>

            {/* Embed generator */}
            <EmbedSection creatorId={profile.id ?? userId} />

            {/* Top content */}
            {stats.topContent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-4 h-4 text-teal-400" />
                  <span className="text-sm font-semibold text-white">Top content</span>
                </div>
                <div className="space-y-2">
                  {stats.topContent.map((c) => (
                    <ContentRow key={c.id} content={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

// ─── Root Export ──────────────────────────────────────────────────────────────

export default function CreatorDashboard({ userId }: Props) {
  const [profile, setProfile] = useState<CreatorProfile | null | undefined>(undefined);

  useEffect(() => {
    async function load() {
      const p = await getCreatorProfile(userId);
      setProfile(p);
    }
    load();
  }, [userId]);

  // Initial loading
  if (profile === undefined) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-6 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
        <span className="text-slate-400 text-sm">Loading creator profile…</span>
      </div>
    );
  }

  // Not registered
  if (profile === null) {
    return <RegistrationForm userId={userId} onSuccess={(p) => setProfile(p)} />;
  }

  // Registered
  return <Dashboard profile={profile} userId={userId} />;
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Link2, Users, Trash2, Copy, CheckCircle2, Loader, Clock } from 'lucide-react';
import { shareTrip, getSharedTrips, revokeShare, type TripShare } from '../actions';

interface ShareTripPanelProps {
  userId: string;
  tripId: string;
  tripTitle: string;
}

export function ShareTripPanel({ userId, tripId, tripTitle }: ShareTripPanelProps) {
  const [emailInput, setEmailInput] = useState('');
  const [permissions, setPermissions] = useState<'view' | 'edit'>('view');
  const [shares, setShares] = useState<TripShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [latestCode, setLatestCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadShares = async () => {
    try {
      setLoading(true);
      const data = await getSharedTrips(userId);
      setShares(data.filter(s => s.tripId === tripId));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadShares(); }, [userId, tripId]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const emails = emailInput.split(',').map(e => e.trim()).filter(Boolean);
    try {
      setSharing(true);
      const code = await shareTrip(userId, tripId, emails, permissions);
      setLatestCode(code);
      setEmailInput('');
      loadShares();
    } catch (err) { console.error(err); }
    finally { setSharing(false); }
  };

  const copyLink = async (code: string) => {
    await navigator.clipboard.writeText(`https://insighttravelpk.com/join/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!id) return;
    await revokeShare(id);
    loadShares();
    if (latestCode) setLatestCode(null);
  };

  return (
    <div className="space-y-5">
      {/* Share Form */}
      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Share2 className="h-4 w-4 text-teal-400" /> Share "{tripTitle}"
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Invite friends by email. They'll get a shareable link valid for 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShare} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <Users className="h-3 w-3" /> Email Addresses (comma separated)
              </label>
              <Input value={emailInput} onChange={e => setEmailInput(e.target.value)}
                placeholder="friend@example.com, colleague@gmail.com"
                className="bg-slate-900/50 border-slate-700 text-white text-xs h-9 focus:ring-teal-500" />
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1 flex-1">
                <label className="text-[11px] text-slate-400 font-semibold">Permissions</label>
                <div className="flex gap-2">
                  {(['view', 'edit'] as const).map(p => (
                    <button key={p} type="button" onClick={() => setPermissions(p)}
                      className={`flex-1 text-xs py-1.5 rounded-lg border capitalize font-semibold transition-all ${permissions === p ? 'bg-teal-600/20 text-teal-400 border-teal-500' : 'bg-slate-900/30 text-slate-400 border-slate-700'}`}>
                      {p === 'view' ? '👁 View Only' : '✏️ Can Edit'}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={sharing || !emailInput.trim()}
                className="bg-teal-600 hover:bg-teal-500 text-white text-xs h-9 px-5 font-bold rounded-lg mt-5 gap-1.5">
                {sharing ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                Generate Link
              </Button>
            </div>
          </form>

          {latestCode && (
            <div className="mt-4 p-3 bg-teal-950/30 border border-teal-500/20 rounded-xl space-y-2">
              <p className="text-[11px] text-teal-400 font-bold uppercase tracking-wider">✔ Share Link Generated!</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-slate-200 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-700 truncate">
                  https://insighttravelpk.com/join/{latestCode}
                </code>
                <Button size="icon" onClick={() => copyLink(latestCode)}
                  className="h-8 w-8 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg shrink-0">
                  {copied ? <CheckCircle2 className="h-4 w-4 text-teal-400" /> : <Copy className="h-4 w-4 text-slate-300" />}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Shares */}
      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-400" /> Active Share Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6"><Loader className="h-5 w-5 animate-spin text-teal-500" /></div>
          ) : shares.length === 0 ? (
            <p className="text-center py-6 text-slate-500 text-xs">No active share links for this trip.</p>
          ) : (
            <div className="space-y-3">
              {shares.map(share => (
                <div key={share.id} className="flex items-center justify-between gap-3 p-3 bg-slate-900/30 border border-slate-700/50 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate">Code: <span className="text-teal-400 font-mono">{share.shareCode}</span></p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <Clock className="h-3 w-3" /> Expires {new Date(share.expiresAt).toLocaleDateString()}
                      <span className="capitalize">· {share.permissions}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <Button size="icon" onClick={() => copyLink(share.shareCode)}
                      className="h-7 w-7 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg">
                      <Copy className="h-3.5 w-3.5 text-slate-300" />
                    </Button>
                    <Button size="icon" onClick={() => share.id && handleRevoke(share.id)}
                      className="h-7 w-7 bg-red-950/30 hover:bg-red-950 border border-red-900/30 rounded-lg">
                      <Trash2 className="h-3.5 w-3.5 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

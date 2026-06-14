'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Megaphone, 
  ShieldAlert, 
  Send,
  Loader,
  Users,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { publishAlert, addPartner, getAdminAlerts, type AdminAlert } from '../actions';

interface AdminPanelProps {
  userId: string;
}

export function AdminPanel({ userId }: AdminPanelProps) {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  
  // Alert Form state
  const [alertType, setAlertType] = useState<AdminAlert['alertType']>('road_close');
  const [alertMsg, setAlertMsg] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Partner Form state
  const [partnerName, setPartnerName] = useState('');
  const [partnerType, setPartnerType] = useState<'hotel' | 'transport' | 'guide'>('hotel');
  const [partnerDesc, setPartnerDesc] = useState('');
  const [submittingPartner, setSubmittingPartner] = useState(false);
  const [partnerSuccess, setPartnerSuccess] = useState(false);

  const loadAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const data = await getAdminAlerts();
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertMsg.trim()) return;

    try {
      setPublishing(true);
      await publishAlert(userId, alertType, alertMsg);
      setAlertMsg('');
      setAlertSuccess(true);
      loadAlerts();
      setTimeout(() => setAlertSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;

    try {
      setSubmittingPartner(true);
      await addPartner(userId, partnerName, partnerType, { description: partnerDesc });
      setPartnerName('');
      setPartnerDesc('');
      setPartnerSuccess(true);
      setTimeout(() => setPartnerSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPartner(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Publish Alert Form */}
        <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-teal-400" />
              Publish Official Travel Advisory
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Broadcast critical updates across the platform (weather, security, or roads).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAlertSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Advisory Type</label>
                <select 
                  value={alertType}
                  onChange={(e) => setAlertType(e.target.value as AdminAlert['alertType'])}
                  className="w-full bg-slate-900/50 border border-slate-700 text-xs h-9 rounded-md px-3 text-white focus:ring-teal-500"
                >
                  <option value="road_close">Road Closure / Blockage</option>
                  <option value="weather">Severe Weather warning</option>
                  <option value="general">General Advisory</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Message</label>
                <textarea
                  value={alertMsg}
                  onChange={(e) => setAlertMsg(e.target.value)}
                  placeholder="Details of blockage, detours, expected opening times..."
                  className="w-full bg-slate-900/50 border border-slate-700 text-xs rounded-lg p-3 text-white h-20 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button 
                type="submit" 
                disabled={publishing || !alertMsg.trim()}
                className="w-full bg-teal-600 hover:bg-teal-500 text-xs text-white h-9 rounded-lg font-bold gap-2"
              >
                {publishing ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Publish Live Advisory
              </Button>

              {alertSuccess && (
                <div className="text-xs text-teal-400 text-center font-semibold bg-teal-950/20 p-2 rounded-lg border border-teal-500/20">
                  ✔ Advisory successfully published.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Partnership Application Form */}
        <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-400" />
              Register local Tourism Partnership
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Submit hotels, guest rentals, or transportation systems to join our booking marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePartnerSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Business Name</label>
                  <Input 
                    type="text" 
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="e.g. Hunza Serena Inn"
                    className="bg-slate-900/50 border-slate-700 text-xs h-9 text-white focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Category</label>
                  <select 
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as any)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-xs h-9 rounded-md px-3 text-white focus:ring-teal-500"
                  >
                    <option value="hotel">Hotel / Guesthouse</option>
                    <option value="transport">Transport / Car Rental</option>
                    <option value="guide">Tour Agency / Guide</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Service Description</label>
                <textarea
                  value={partnerDesc}
                  onChange={(e) => setPartnerDesc(e.target.value)}
                  placeholder="Describe your rooms, vehicles, routes covered, and specialized features..."
                  className="w-full bg-slate-900/50 border border-slate-700 text-xs rounded-lg p-3 text-white h-20 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button 
                type="submit" 
                disabled={submittingPartner || !partnerName.trim()}
                className="w-full bg-teal-600 hover:bg-teal-500 text-xs text-white h-9 rounded-lg font-bold gap-2"
              >
                {submittingPartner ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Building2 className="h-3.5 w-3.5" />}
                Submit Partner Application
              </Button>

              {partnerSuccess && (
                <div className="text-xs text-teal-400 text-center font-semibold bg-teal-950/20 p-2 rounded-lg border border-teal-500/20">
                  ✔ Application submitted. Review status in dashboard.
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Admin Advisory History */}
      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <meg-phone className="h-5 w-5 text-teal-400" />
            Advisory Broadcast History
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Recently published warnings across the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingAlerts ? (
            <div className="flex justify-center py-6 text-slate-400">
              <Loader className="h-5 w-5 animate-spin text-teal-500" />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No advisory histories recorded.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-900/30 border border-slate-700/50 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <span className="text-teal-400">{alert.alertType}</span>
                    <span>Just now</span>
                  </div>
                  <p className="text-xs text-slate-200">{alert.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

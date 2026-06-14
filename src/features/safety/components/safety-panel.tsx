'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertOctagon, 
  MapPin, 
  ShieldAlert, 
  PhoneCall, 
  Send,
  Loader,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { triggerSOS, reportIncident, getSafetyAlerts, type IncidentReport } from '../actions';

interface SafetyPanelProps {
  userId: string;
  currentLocationName?: string;
}

export function SafetyPanel({ userId, currentLocationName = 'Islamabad' }: SafetyPanelProps) {
  const [alerts, setAlerts] = useState<IncidentReport[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [sosStatus, setSosStatus] = useState<'idle' | 'locating' | 'sending' | 'success'>('idle');
  const [sosError, setSosError] = useState<string | null>(null);
  
  // Incident Form state
  const [reportLocation, setReportLocation] = useState(currentLocationName);
  const [reportType, setReportType] = useState<IncidentReport['type']>('roadblock');
  const [reportSeverity, setReportSeverity] = useState<IncidentReport['severity']>('medium');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const loadAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const data = await getSafetyAlerts(currentLocationName);
      setAlerts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAlerts(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [currentLocationName]);

  const handleSOS = () => {
    setSosStatus('locating');
    setSosError(null);

    if (!navigator.geolocation) {
      setSosError("Geolocation is not supported by your browser.");
      setSosStatus('idle');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          setSosStatus('sending');
          const mockPhone = '+92-300-1234567'; // User profile fallback contact
          await triggerSOS(userId, pos.coords.latitude, pos.coords.longitude, mockPhone);
          setSosStatus('success');
          setTimeout(() => setSosStatus('idle'), 5000);
        } catch (err) {
          setSosError("Failed to transmit emergency signal.");
          setSosStatus('idle');
        }
      },
      (err) => {
        setSosError("Failed to resolve GPS coordinates. Ensure locations are enabled.");
        setSosStatus('idle');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDesc.trim()) return;

    try {
      setSubmittingReport(true);
      await reportIncident(userId, reportLocation, reportType, reportSeverity, reportDesc);
      setReportDesc('');
      setReportSuccess(true);
      loadAlerts();
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReport(false);
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* emergency SOS banner */}
      <Card className="bg-gradient-to-r from-red-950 to-slate-900 border-red-900/50 text-white shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="bg-red-600/20 p-2 rounded-xl border border-red-500/30">
              <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-lg font-black tracking-wide">Emergency SOS Assist</CardTitle>
              <CardDescription className="text-xs text-red-200">
                Broadcasting is instant. Response units will receive your current GPS coordinates.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleSOS}
              disabled={sosStatus !== 'idle'}
              className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 font-bold rounded-xl shadow-lg border-t border-red-500 flex-1 gap-2"
            >
              {sosStatus === 'locating' && <Loader className="h-4 w-4 animate-spin" />}
              {sosStatus === 'sending' && <Loader className="h-4 w-4 animate-spin" />}
              {sosStatus === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {sosStatus === 'idle' && <PhoneCall className="h-4 w-4" />}
              {sosStatus === 'idle' && "Broadcast Location Alert"}
              {sosStatus === 'locating' && "Resolving GPS..."}
              {sosStatus === 'sending' && "Broadcasting SOS Signal..."}
              {sosStatus === 'success' && "Emergency Dispatched!"}
            </Button>
            <div className="text-xs text-slate-300 flex items-center justify-center p-3 border border-white/5 bg-white/5 rounded-xl text-center">
              ⚠️ In absolute emergency, also call National Highway Police: <b>130</b> or Rescue: <b>1122</b>
            </div>
          </div>
          {sosError && <p className="text-xs text-red-400 bg-red-950/50 p-2 rounded-lg">{sosError}</p>}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Incident Form */}
        <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-amber-500" />
              Report Live Road Obstacle or Hazard
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Help fellow travelers by reporting slides, roadblocks, scams, or avalanches.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Location / District</label>
                  <Input 
                    type="text" 
                    value={reportLocation}
                    onChange={(e) => setReportLocation(e.target.value)}
                    className="bg-slate-900/50 border-slate-700 text-xs h-9 text-white focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-semibold">Type</label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as IncidentReport['type'])}
                    className="w-full bg-slate-900/50 border border-slate-700 text-xs h-9 rounded-md px-3 text-white focus:ring-teal-500"
                  >
                    <option value="roadblock">Roadblock</option>
                    <option value="landslide">Landslide</option>
                    <option value="scam">Tourist Scam</option>
                    <option value="weather_hazard">Weather Hazard</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Severity</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as IncidentReport['severity'][]).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setReportSeverity(sev)}
                      className={`flex-1 text-[10px] font-bold border py-1.5 rounded-lg capitalize transition-all ${
                        reportSeverity === sev 
                          ? 'bg-teal-600/20 text-teal-400 border-teal-500' 
                          : 'bg-slate-900/20 text-slate-400 border-slate-700/50'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-semibold">Description</label>
                <textarea
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Provide details (e.g. Landslide at Attabad tunnel bypass, road closed for next 5 hours...)"
                  className="w-full bg-slate-900/50 border border-slate-700 text-xs rounded-lg p-3 text-white h-20 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button 
                type="submit" 
                disabled={submittingReport || !reportDesc.trim()}
                className="w-full bg-teal-600 hover:bg-teal-500 text-xs text-white h-9 rounded-lg font-bold gap-2"
              >
                {submittingReport ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                Submit Safety Alert
              </Button>

              {reportSuccess && (
                <div className="text-xs text-teal-400 text-center font-semibold bg-teal-950/20 p-2 rounded-lg border border-teal-500/20">
                  ✔ Safety incident submitted to live travel feed.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Live Safety Alerts Feed */}
        <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Compass className="h-5 w-5 text-teal-400" />
              Live Safety & Road Alerts
            </CardTitle>
            <CardDescription className="text-xs text-slate-400">
              Crowdsourced hazard status alerts for {currentLocationName} area.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[340px] space-y-3 pt-2 pr-2">
            {loadingAlerts ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader className="h-6 w-6 animate-spin text-teal-500 mb-2" />
                <p className="text-xs">Fetching live alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active safety warnings or roadblock alerts reported in this region.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="p-3 bg-slate-900/30 border border-slate-700/50 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`border px-2 py-0.5 rounded-full uppercase font-semibold ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-300 font-bold capitalize">{alert.type}</span>
                    </div>
                    <span className="text-slate-500 flex items-center gap-0.5">
                      <Clock className="h-3 w-3" />
                      Just now
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {alert.description}
                  </p>
                  <div className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {alert.location}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

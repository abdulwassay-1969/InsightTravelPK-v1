'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CloudSun, 
  ShieldAlert, 
  MapPin, 
  Flame, 
  Gauge, 
  ChevronDown, 
  ChevronUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { getAltitudeHealthWarnings, getRoadStatus, type AltitudeHealthWarning, type RoadStatus } from '../actions';

export function AdvancedWeather() {
  const [isOpen, setIsOpen] = useState(false);
  const [altitude, setAltitude] = useState(2500);
  const [days, setDays] = useState(0);
  const [warnings, setWarnings] = useState<AltitudeHealthWarning | null>(null);
  const [roads, setRoads] = useState<RoadStatus[]>([]);

  useEffect(() => {
    async function loadData() {
      const w = await getAltitudeHealthWarnings(altitude, days);
      setWarnings(w);
      const r = await getRoadStatus();
      setRoads(r);
    }
    loadData();
  }, [altitude, days]);

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Moderate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <Card className="bg-slate-800/40 border-slate-700 text-white shadow-xl overflow-hidden mt-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <CloudSun className="h-6 w-6 text-teal-400" />
          <div>
            <h3 className="font-bold text-base text-white">Advanced Mountain Weather & Safety</h3>
            <p className="text-xs text-slate-400">Road conditions, altitude sickness risk, and mountain safety metrics</p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>

      {isOpen && (
        <CardContent className="border-t border-slate-700/50 p-6 space-y-6">
          {/* Section 1: Altitude & Sickness Risk Assessment */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Altitude Sickness Risk Calculator
              </h4>
              <p className="text-xs text-slate-300">
                Risk increases significantly above 2,500m. Acclimatization days help reduce risk.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Altitude (Meters)</label>
                  <Input 
                    type="number"
                    value={altitude}
                    onChange={(e) => setAltitude(Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500 text-sm h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Acclimatization Days</label>
                  <Input 
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500 text-sm h-10"
                  />
                </div>
              </div>

              {warnings && (
                <div className="p-4 bg-slate-900/30 rounded-2xl border border-slate-700/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Calculated Risk Level:</span>
                    <span className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${getRiskBadgeColor(warnings.riskLevel)}`}>
                      {warnings.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Temperature Drop:</span>
                    <span className="text-xs font-bold text-slate-200">
                      -{warnings.tempDropCelsius}°C from Sea Level
                    </span>
                  </div>
                </div>
              )}
            </div>

            {warnings && warnings.riskLevel !== 'Low' && (
              <div className="space-y-4 bg-slate-900/20 p-5 rounded-2xl border border-slate-700/50">
                <div className="flex items-center gap-2 text-orange-400">
                  <ShieldAlert className="h-5 w-5" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Health Guidelines</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Potential Symptoms:</span>
                    <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-0.5">
                      {warnings.symptoms.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Acclimatization Tips:</span>
                    <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-1">
                      {warnings.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Northern Passes Road Status */}
          <div className="space-y-4 pt-4 border-t border-slate-700/50">
            <h4 className="text-sm font-bold text-teal-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              High Mountain Passes Road Status
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {roads.map((road) => (
                <div key={road.passName} className="p-4 bg-slate-900/30 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-200">{road.passName}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Elevation: {road.elevation.toLocaleString()}m</p>
                    </div>
                    {road.isOpen ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                        <CheckCircle2 className="h-3 w-3" /> OPEN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                        <XCircle className="h-3 w-3" /> CLOSED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 italic mt-1 border-t border-slate-800/60 pt-2">
                    "{road.statusNotes}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

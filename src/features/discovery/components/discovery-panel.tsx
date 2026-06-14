'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, SlidersHorizontal, MapPin, Banknote, Mountain,
  Compass, Leaf, Users, Sun, Filter, X, ArrowRight
} from 'lucide-react';
import { advancedSearch, type SearchFilters, type SearchResult } from '../actions';

export function DiscoveryPanel() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await advancedSearch({ ...filters, query });
      setResults(data);
      setHasSearched(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const difficultyColors: Record<string, string> = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    advanced: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    expert: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search destinations, provinces, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="pl-10 h-12 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-teal-500"
          />
        </div>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline"
          className="h-12 px-4 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 rounded-xl gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
        <Button onClick={handleSearch} disabled={loading}
          className="h-12 px-6 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold">
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Filter className="h-4 w-4 text-teal-400" />
                Advanced Filters
              </CardTitle>
              <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                <X className="h-3.5 w-3.5" /> Clear All
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Banknote className="h-3 w-3" /> Budget Range (PKR/day)
                </label>
                <div className="flex gap-2">
                  <Input type="number" placeholder="Min" value={filters.budgetMin ?? ''} onChange={e => setFilters(f => ({ ...f, budgetMin: Number(e.target.value) || undefined }))}
                    className="h-8 text-xs bg-slate-900/50 border-slate-700 text-white" />
                  <Input type="number" placeholder="Max" value={filters.budgetMax ?? ''} onChange={e => setFilters(f => ({ ...f, budgetMax: Number(e.target.value) || undefined }))}
                    className="h-8 text-xs bg-slate-900/50 border-slate-700 text-white" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Mountain className="h-3 w-3" /> Difficulty Level
                </label>
                <select value={filters.difficulty ?? ''} onChange={e => setFilters(f => ({ ...f, difficulty: e.target.value as any || undefined }))}
                  className="w-full h-8 text-xs bg-slate-900/50 border border-slate-700 rounded-md px-2 text-white">
                  <option value="">Any Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Compass className="h-3 w-3" /> Adventure Type
                </label>
                <select value={filters.adventureType ?? ''} onChange={e => setFilters(f => ({ ...f, adventureType: e.target.value as any || undefined }))}
                  className="w-full h-8 text-xs bg-slate-900/50 border border-slate-700 rounded-md px-2 text-white">
                  <option value="">Any Type</option>
                  <option value="trekking">Trekking</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="wildlife">Wildlife</option>
                  <option value="historical">Historical</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Sun className="h-3 w-3" /> Best Season
                </label>
                <select value={filters.season ?? ''} onChange={e => setFilters(f => ({ ...f, season: e.target.value as any || undefined }))}
                  className="w-full h-8 text-xs bg-slate-900/50 border border-slate-700 rounded-md px-2 text-white">
                  <option value="">Any Season</option>
                  <option value="spring">Spring (Mar-May)</option>
                  <option value="summer">Summer (Jun-Aug)</option>
                  <option value="autumn">Autumn (Sep-Nov)</option>
                  <option value="winter">Winter (Dec-Feb)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 pt-3">
                {[
                  { key: 'wheelchair', label: 'Wheelchair Accessible', icon: '♿' },
                  { key: 'familyFriendly', label: 'Family Friendly', icon: '👨‍👩‍👧' },
                ].map(opt => (
                  <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!filters[opt.key as keyof SearchFilters]}
                      onChange={e => setFilters(f => ({ ...f, [opt.key]: e.target.checked || undefined }))}
                      className="rounded border-slate-600 bg-slate-800 text-teal-500" />
                    <span className="text-xs text-slate-300">{opt.icon} {opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 font-semibold">
            {results.length} destinations found {query && `for "${query}"`}
          </p>

          {results.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/20 rounded-2xl border border-slate-700/50">
              <Compass className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No destinations matched your filters.</p>
              <button onClick={clearFilters} className="text-teal-400 text-xs mt-2 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(dest => (
                <Card key={dest.id} className="bg-slate-800/40 border-slate-700 text-white overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group">
                  <div className="relative h-36 overflow-hidden">
                    <img src={dest.imageUrl} alt={dest.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <span className={`absolute top-3 right-3 text-[9px] font-bold border px-2 py-0.5 rounded-full capitalize ${difficultyColors[dest.difficulty] || 'bg-slate-800/80 text-slate-300 border-slate-600'}`}>
                      {dest.difficulty}
                    </span>
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <div>
                      <h3 className="font-bold text-sm text-white">{dest.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <MapPin className="h-3 w-3" /> {dest.province}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{dest.description}</p>
                    <div className="flex items-center justify-between border-t border-slate-700/50 pt-2">
                      <span className="text-xs font-bold text-white">
                        PKR {dest.budgetPerDayPKR.toLocaleString()}<span className="text-[10px] text-slate-400 font-normal">/day</span>
                      </span>
                      <div className="flex gap-1">
                        {dest.accessible && <span className="text-[10px] text-emerald-400">♿</span>}
                        {dest.familyFriendly && <span className="text-[10px] text-teal-400">👨‍👩‍👧</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-slate-700/50 border-dashed">
          <Search className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-slate-300 font-bold text-base mb-1">Search & Discover Pakistan</h3>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            Use filters to find destinations by budget, difficulty, accessibility, and season.
          </p>
        </div>
      )}
    </div>
  );
}

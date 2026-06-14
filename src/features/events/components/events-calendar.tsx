'use client';

import { useEffect, useState } from 'react';
import { Calendar, MapPin, Tag, Filter } from 'lucide-react';
import { getUpcomingEvents, getEventsByProvince, PakistanEvent } from '../actions';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PROVINCES = [
  'All',
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
];

const CATEGORY_STYLES: Record<
  PakistanEvent['category'],
  { label: string; className: string }
> = {
  festival: { label: 'Festival', className: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  cultural: { label: 'Cultural', className: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
  sports: { label: 'Sports', className: 'bg-green-500/20 text-green-300 border-green-500/40' },
  religious: { label: 'Religious', className: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (startDate === endDate) return start.toLocaleDateString('en-PK', { ...opts, year: 'numeric' });
  if (start.getMonth() === end.getMonth()) {
    return `${start.toLocaleDateString('en-PK', opts)} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString('en-PK', opts)} – ${end.toLocaleDateString('en-PK', { ...opts, year: 'numeric' })}`;
}

function getMonthBadge(startDate: string): string {
  return new Date(startDate).toLocaleDateString('en-PK', { month: 'short' }).toUpperCase();
}

function EventCard({ event }: { event: PakistanEvent }) {
  const catStyle = CATEGORY_STYLES[event.category];

  return (
    <Card className="bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden flex flex-col hover:border-teal-500/50 transition-colors duration-300 group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-700">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-slate-500" />
          </div>
        )}
        {/* Month badge overlay */}
        <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">
          {getMonthBadge(event.startDate)}
        </div>
        {/* Category badge overlay */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-sm ${catStyle.className}`}
          >
            {catStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-teal-300 transition-colors">
          {event.name}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 text-teal-400 text-sm">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>{formatDateRange(event.startDate, event.endDate)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <MapPin className="w-4 h-4 shrink-0" />
          <span>{event.location}</span>
        </div>

        {/* Province tag */}
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Tag className="w-3.5 h-3.5 shrink-0" />
          <span>{event.province}</span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mt-auto">
          {event.description}
        </p>
      </div>
    </Card>
  );
}

export default function EventsCalendar() {
  const [events, setEvents] = useState<PakistanEvent[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventsByProvince(selectedProvince);
        setEvents(data);
      } catch {
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedProvince]);

  const categories = ['All', 'festival', 'cultural', 'sports', 'religious'] as const;

  const filteredEvents =
    activeCategory === 'All'
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-400" />
          Pakistan Events Calendar
        </h2>
        <p className="text-slate-400 text-sm">
          Discover festivals, cultural gatherings, sports events, and religious occasions across Pakistan.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Province dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-400 shrink-0" />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const style =
              cat === 'All'
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : CATEGORY_STYLES[cat as PakistanEvent['category']].className;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all capitalize ${
                  isActive
                    ? `${style} ring-1 ring-offset-1 ring-offset-slate-900 ring-current`
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {cat === 'All' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/40 border border-slate-700 rounded-2xl h-72 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Calendar className="w-12 h-12 text-slate-600" />
          <p className="text-slate-400 text-sm">{error}</p>
          <Button
            onClick={() => setSelectedProvince('All')}
            className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Calendar className="w-12 h-12 text-slate-600" />
          <p className="text-white font-medium">No events found</p>
          <p className="text-slate-400 text-sm text-center">
            No events match the selected province and category. Try changing the filters.
          </p>
          <Button
            onClick={() => { setSelectedProvince('All'); setActiveCategory('All'); }}
            className="bg-teal-600 hover:bg-teal-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && !error && filteredEvents.length > 0 && (
        <p className="text-slate-500 text-xs text-right">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      )}
    </section>
  );
}

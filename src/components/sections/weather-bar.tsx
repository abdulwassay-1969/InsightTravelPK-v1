"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cloud, CloudRain, CloudSun, Loader, Sun } from 'lucide-react';
import { getWeather } from '@/app/actions';
import type { WeatherData } from '@/ai/flows/weather-flow';
import { Button } from '../ui/button';
import { Card } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  'clear-day': Sun,
  'clear-night': Sun,
  cloudy: Cloud,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudSun,
  rain: CloudRain,
  'showers-day': CloudRain,
  'showers-night': CloudRain,
  snow: Cloud,
  'thunder-rain': CloudRain,
  wind: Cloud,
  default: Cloud,
};

function WeatherIcon({ iconName, ...props }: { iconName: string; [key: string]: any }) {
  const Icon = iconMap[iconName] || iconMap.default;
  return <Icon {...props} />;
}

export default function WeatherBar() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const data = await getWeather({ city: 'Islamabad' });
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setError('Could not fetch weather data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const Shell = ({ children, tone }: { children: React.ReactNode; tone: string }) => (
    <section className={`relative z-20 bg-background -mt-12 sm:-mt-16 ${tone}`}>
      <div className="w-full">
        <Card className="overflow-hidden rounded-none border-0 bg-slate-800 text-white shadow-lg">
          <div className="container mx-auto px-3 sm:px-4">
            {children}
          </div>
        </Card>
      </div>
    </section>
  );

  if (loading) {
    return (
      <Shell tone="">
        <div className="flex flex-col items-center justify-center gap-3 py-6 sm:min-h-[124px] sm:flex-row">
          <Loader className="h-7 w-7 animate-spin sm:h-8 sm:w-8" />
          <p className="text-sm text-center sm:text-lg">Loading weather...</p>
        </div>
      </Shell>
    );
  }

  if (error || !weatherData) {
    return (
      <Shell tone="">
        <div className="flex flex-col items-center justify-center gap-3 py-6 text-center sm:min-h-[124px] sm:flex-row">
          <p className="text-sm sm:text-lg">{error || 'Weather data not available.'}</p>
          <Button
            variant="outline"
            onClick={fetchWeather}
            className="w-full border-white bg-transparent text-white hover:bg-white hover:text-slate-800 sm:w-auto"
          >
            Retry
          </Button>
        </div>
      </Shell>
    );
  }

  const { city, current, forecast } = weatherData;

  return (
    <Shell tone="">
      <div className="flex flex-row items-center justify-between gap-4 py-3 sm:py-4">
        {/* Today's Weather */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <WeatherIcon iconName={current.icon} className="h-10 w-10 shrink-0 sm:h-14 sm:w-14 md:h-16 md:w-16" />
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 sm:text-xs md:text-sm sm:tracking-wide">
              {city} Weather
            </div>
            <div className="mt-0.5 flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <div className="text-xl font-bold leading-none sm:text-3xl md:text-4xl">
                {current.temp}
                <span className="align-top text-xs sm:text-sm md:text-2xl">&deg;C</span>
              </div>
              <div className="text-[11px] text-slate-300 sm:text-xs md:text-sm truncate max-w-[120px] sm:max-w-none">
                {current.description}
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast - Hidden on mobile/minimized screens, visible in full page (lg) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-3">
          {forecast.map((day) => (
            <div key={day.day} className="flex flex-col items-center rounded-2xl bg-white/5 px-3 py-3">
              <div className="text-xs font-semibold">{day.day}</div>
              <WeatherIcon iconName={day.icon} className="my-1 h-8 w-8" />
              <div className="text-xs">
                <span className="text-red-400">{day.high}&deg;</span>
                <span className="ml-1 text-blue-400">{day.low}&deg;</span>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <Button
          asChild
          variant="outline"
          className="border-white bg-transparent text-xs text-white hover:bg-white hover:text-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 h-auto w-auto shrink-0"
        >
          <Link href="/weather">View More</Link>
        </Button>
      </div>
    </Shell>
  );
}

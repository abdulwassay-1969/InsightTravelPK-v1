'use server';

import { format } from 'date-fns';
import type { WeatherData, WeatherInput } from "@/ai/flows/weather-flow";
import { cities } from './data';

// Maps Meteoblue pictocode to a simpler icon name
const mapIcon = (rawPictocode: number) => {
  const pictocode = rawPictocode > 100 ? rawPictocode - 100 : rawPictocode;
  if (pictocode <= 2) return 'clear-day';
  if (pictocode <= 5) return 'partly-cloudy-day';
  if (pictocode <= 7) return 'cloudy';
  if (pictocode >= 8 && pictocode <= 10) return 'rain';
  if (pictocode >= 11 && pictocode <= 13) return 'showers-day';
  if (pictocode === 14 || pictocode === 24) return 'snow';
  if (pictocode >= 15 && pictocode <= 23) return 'thunder-rain';
  return 'default';
};

// Simple pictocode → human-readable description
const getDescription = (rawPictocode: number) => {
  if (rawPictocode === undefined || rawPictocode === null) return 'Available Soon';
  const pictocode = rawPictocode > 100 ? rawPictocode - 100 : rawPictocode;
  if (pictocode <= 2) return 'Clear Sky';
  if (pictocode <= 5) return 'Partly Cloudy';
  if (pictocode <= 7) return 'Overcast';
  if (pictocode >= 8 && pictocode <= 10) return 'Rain';
  if (pictocode >= 11 && pictocode <= 13) return 'Showers';
  if (pictocode === 14 || pictocode === 24) return 'Snow';
  if (pictocode >= 15 && pictocode <= 23) return 'Thunderstorm';
  return 'Clear Sky'; // Fallback instead of Unknown
};

export async function fetchWeatherData({ city }: WeatherInput): Promise<WeatherData> {
  const cityData = cities.find(c => c.name.toLowerCase() === city.toLowerCase());

  const lat = cityData?.lat ?? 24.8607; // Default Karachi
  const lon = cityData?.lon ?? 67.0011;
  const resolvedCity = cityData?.name ?? 'Karachi';

  // Use the API key from environment variables
  const apiKey = process.env.METEOBLUE_API_KEY;

  if (!apiKey) {
    console.warn("[Weather] Meteoblue API key is missing.");
    throw new Error('Meteoblue API key is not configured.');
  }

  // console.log(`[Weather] Fetching for ${resolvedCity}...`);

  const url = `https://my.meteoblue.com/packages/basic-1h_basic-day?` +
              `lat=${lat}&lon=${lon}&` +
              `temperature=C&` +
              `format=json&` +
              `apikey=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 hour

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Meteoblue API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Find closest/current hour in 1h data
    const now = new Date();
    const timeArray: string[] = data.data_1h.time;
    let currentIndex = timeArray.findIndex((t: string) => {
      const ft = new Date(t);
      return ft.getHours() === now.getHours() && ft.getDate() === now.getDate();
    });

    if (currentIndex === -1) {
      currentIndex = Math.min(Math.max(0, Math.round((now.getTime() - new Date(timeArray[0]).getTime()) / 3600000)), timeArray.length - 1);
    }

    const currentTemp = data.data_1h.temperature[currentIndex];
    const currentPictocode = data.data_1h.pictocode[currentIndex];

    return {
      city: resolvedCity,
      current: {
        temp: Math.round(currentTemp),
        description: getDescription(currentPictocode),
        icon: mapIcon(currentPictocode),
      },
      forecast: data.data_day.time.slice(0, 7).map((day: string, i: number) => ({
        day: format(new Date(day), 'EEE'),
        high: Math.round(data.data_day.temperature_max[i]),
        low: Math.round(data.data_day.temperature_min[i]),
        icon: mapIcon(data.data_day.pictocode[i]),
      })),
    };
  } catch (e: any) {
    console.error("Failed to fetch or process weather data", e);
    return {
      city: `${resolvedCity} (Mock - check API key)`,
      current: { temp: 28, description: 'Partly Cloudy', icon: 'partly-cloudy-day' },
      forecast: [
        { day: 'Today', high: 30, low: 22, icon: 'clear-day' },
        { day: 'Tomorrow', high: 31, low: 23, icon: 'cloudy' },
        { day: 'Fri', high: 32, low: 24, icon: 'rain' },
        { day: 'Sat', high: 30, low: 22, icon: 'showers-day' },
        { day: 'Sun', high: 29, low: 21, icon: 'thunder-rain' },
        { day: 'Mon', high: 31, low: 23, icon: 'partly-cloudy-day' },
        { day: 'Tue', high: 32, low: 24, icon: 'clear-day' },
      ]
    };
  }
}
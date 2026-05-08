
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader, Search, Sun, Cloud, CloudRain, CloudSun, MapPin } from 'lucide-react';
import { getWeather } from '@/app/actions';
import type { WeatherData } from '@/ai/flows/weather-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cities } from '@/lib/data';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const quickCities = ['Islamabad', 'Lahore', 'Karachi', 'Skardu', 'Hunza'];

const iconMap: { [key: string]: React.ElementType } = {
  'clear-day': Sun,
  'clear-night': Sun, 
  'cloudy': Cloud,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudSun,
  'rain': CloudRain,
  'showers-day': CloudRain,
  'showers-night': CloudRain,
  'snow': Cloud,
  'thunder-rain': CloudRain,
  'wind': Cloud,
  'default': Cloud,
};

const WeatherIcon = ({ iconName, ...props }: { iconName: string; [key: string]: any }) => {
  const Icon = iconMap[iconName] || iconMap['default'];
  return <Icon {...props} />;
};


const formSchema = z.object({
  city: z.string().min(1, 'Please select a city.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: 'Islamabad',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        setError(null);
        const result = await getWeather({ city: data.city });
        setWeatherData(result);
      } catch (e: any) {
        setError(e.message || 'An error occurred while fetching weather data.');
      }
    });
  };

  const handleQuickCity = (city: string) => {
    form.setValue('city', city);
    setOpen(false);
    onSubmit({ city });
  };

  const handleRetry = () => {
    onSubmit(form.getValues());
  };

  useEffect(() => {
    // Fetch default weather on initial load
    onSubmit({ city: 'Islamabad' });
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-100 via-white to-lime-50 min-h-screen">
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center">
              <Sun className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-3xl md:text-4xl font-headline mt-4">
                Weather Forecast
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Get the latest weather updates for any major city in Pakistan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
                >
                  <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between"
                                >
                                  {field.value
                                    ? cities.find(
                                        (city) => city.name.toLowerCase() === field.value.toLowerCase()
                                      )?.name
                                    : "Select city"}
                                    <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                               <Command>
                                <CommandInput placeholder="Search city..." />
                                <CommandList>
                                  <CommandEmpty>No city found.</CommandEmpty>
                                  <CommandGroup>
                                    {cities.map((city) => (
                                      <CommandItem
                                        value={city.name}
                                        key={city.name}
                                        onSelect={(value) => {
                                          form.setValue("city", value);
                                          setOpen(false);
                                        }}
                                      >
                                        {city.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <Button type="submit" disabled={isPending} className="h-11 sm:h-10 w-full sm:w-auto">
                    {isPending ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isPending && !weatherData && (
             <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center h-64">
                    <Loader className="h-12 w-12 animate-spin text-primary"/>
                    <p className="mt-4 text-muted-foreground">Fetching weather data...</p>
                </CardContent>
             </Card>
          )}

          {error && (
            <div className="space-y-4 mb-6">
              <Alert variant="destructive">
                <AlertTitle>Weather Service Error</AlertTitle>
                <AlertDescription>
                  {error} Try one of the popular cities below or retry the current selection.
                </AlertDescription>
              </Alert>
              <div className="flex flex-wrap gap-2">
                {quickCities.map((city) => (
                  <Button key={city} type="button" variant="outline" size="sm" onClick={() => handleQuickCity(city)}>
                    {city}
                  </Button>
                ))}
                <Button type="button" variant="secondary" size="sm" onClick={handleRetry}>
                  Retry current city
                </Button>
              </div>
            </div>
          )}

          {!isPending && !weatherData && !error && (
            <Card className="text-center py-12">
               <CardContent className="flex flex-col items-center justify-center">
                   <Sun className="h-16 w-16 text-muted-foreground/30 mb-4" />
                   <h3 className="text-xl font-semibold text-foreground">Pick a city to begin</h3>
                   <p className="text-muted-foreground mt-2 max-w-sm">Use the search above or start with one of the popular cities below.</p>
                   <div className="mt-6 flex flex-wrap justify-center gap-2">
                     {quickCities.map((city) => (
                       <Button key={city} type="button" variant="outline" size="sm" onClick={() => handleQuickCity(city)}>
                         {city}
                       </Button>
                     ))}
                   </div>
               </CardContent>
            </Card>
          )}

          {weatherData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Weather in {weatherData.city}</CardTitle>
                <CardDescription>
                  Currently {weatherData.current.temp}°C and {weatherData.current.description.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 md:gap-6 mb-8">
                  <WeatherIcon iconName={weatherData.current.icon} className="w-24 h-24 text-primary" />
                  <div>
                    <p className="text-5xl md:text-7xl font-bold">{weatherData.current.temp}°C</p>
                    <p className="text-muted-foreground">{weatherData.current.description}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4">7-Day Forecast</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
                    {weatherData.forecast.map((day) => (
                      <Card key={day.day} className="p-4 flex flex-col items-center">
                        <p className="font-semibold text-lg">{day.day}</p>
                        <WeatherIcon iconName={day.icon} className="w-12 h-12 my-2 text-primary" />
                        <div className="text-lg">
                          <span className="font-bold text-red-500">{day.high}°</span>
                          <span className="text-muted-foreground ml-2">{day.low}°</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}


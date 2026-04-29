'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader, Wand2, MapPin, Calendar, Wallet, RefreshCw, Clock, BedDouble, Star, ShieldAlert, Lightbulb } from 'lucide-react';
import { getTravelPlan } from '@/app/actions';
import type { TravelPlannerOutput } from '@/ai/flows/planner-flow';
import { provinces } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSavedTripById } from '@/data/saved-trips';

const interests = [
  { id: 'history', label: 'History & Culture' },
  { id: 'nature', label: 'Nature & Scenery' },
  { id: 'adventure', label: 'Adventure & Sports' },
  { id: 'food', label: 'Culinary & Food' },
  { id: 'relaxation', label: 'Relaxation & Wellness' },
];

const formSchema = z.object({
  destination: z.string().min(1, 'Please select a destination.'),
  duration: z.coerce
    .number()
    .min(1, 'Duration must be at least 1 day.')
    .max(30, 'Duration cannot exceed 30 days.'),
  interests: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: 'You have to select at least one interest.',
    }),
  budget: z.string().min(1, 'Please select a budget.'),
  startDate: z.string().min(1, 'Please choose a start date.'),
  travelers: z.coerce.number().min(1, 'At least 1 traveler is required.').max(20),
  travelStyle: z.string().min(1, 'Please select a travel style.'),
  pace: z.string().min(1, 'Please select trip pace.'),
  transport: z.string().min(1, 'Please select preferred transport.'),
  accommodation: z.string().min(1, 'Please select accommodation style.'),
  currency: z.string().min(1, 'Please select currency.'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getMaxDateString() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().slice(0, 10);
}

function PlannerPageContent() {
  const searchParams = useSearchParams();
  const [presetLabel, setPresetLabel] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlannerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string>('');
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      duration: 7,
      interests: [],
      budget: 'mid-range',
      startDate: getTodayString(),
      travelers: 2,
      travelStyle: 'family',
      pace: 'balanced',
      transport: 'road-trip',
      accommodation: 'comfortable-hotel',
      currency: 'PKR',
      notes: '',
    },
  });

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        setError(null);
        setPlan(null);
        const result = await getTravelPlan({
          ...data,
          notes: data.notes || 'None',
        });
        setPlan(result);
      } catch (e: any) {
        setError(e.message || 'An error occurred while generating the plan.');
      }
    });
  };

  const loadRates = async () => {
    try {
      setRatesLoading(true);
      setRatesError(null);
      const response = await fetch('https://open.er-api.com/v6/latest/PKR');
      if (!response.ok) throw new Error('Could not fetch exchange rates');
      const data = await response.json();
      setRates({
        USD: data?.rates?.USD,
        EUR: data?.rates?.EUR,
        GBP: data?.rates?.GBP,
        AED: data?.rates?.AED,
        SAR: data?.rates?.SAR,
        CNY: data?.rates?.CNY,
      });
      setRatesUpdatedAt(new Date().toLocaleString());
    } catch {
      setRatesError('Live exchange rates are temporarily unavailable.');
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
    const timer = setInterval(loadRates, 10 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const presetParam = searchParams.get('preset');

  useEffect(() => {
    if (!presetParam) {
      setPresetLabel(null);
      return;
    }
    const trip = getSavedTripById(presetParam);
    if (!trip) {
      setPresetLabel(null);
      return;
    }
    setPresetLabel(trip.title);
    const d = new Date();
    d.setDate(d.getDate() + 21);
    const startDate = d.toISOString().slice(0, 10);
    const p = trip.plannerDefaults;
    form.reset({
      destination: p.destination,
      duration: p.duration,
      interests: [...p.interests],
      budget: p.budget,
      startDate,
      travelers: p.travelers,
      travelStyle: p.travelStyle,
      pace: p.pace,
      transport: p.transport,
      accommodation: p.accommodation,
      currency: p.currency,
      notes: p.notes ?? '',
    });
  }, [presetParam, form]);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#00798C_0%,#30638E_55%,#003D5B_100%)]">
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] xl:items-start">
          <div className="flex min-w-0 flex-col gap-6">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <Wand2 className="mx-auto h-12 w-12 text-primary" />
              <CardTitle className="text-3xl md:text-4xl font-headline mt-4">
                AI Smart Travel Planner
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Let our AI craft the perfect Pakistani adventure for you.
              </CardDescription>
              {presetLabel ? (
                <p className="mt-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-center text-sm font-medium text-primary">
                  Loaded idea: {presetLabel} — review fields, then generate.
                </p>
              ) : null}
              <p className="mt-3 text-center text-sm">
                <Link
                  href="/saved-trips"
                  className="text-[#00798C] underline-offset-4 hover:underline"
                >
                  Browse saved trip ideas
                </Link>
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 rounded-xl bg-muted/30 p-3 md:p-4">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <MapPin className="mr-2" />
                                <SelectValue placeholder="Select a province or major city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {provinces.map((province) => (
                                <SelectItem
                                  key={province.slug}
                                  value={province.name}
                                >
                                  {province.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={getTodayString()}
                              max={getMaxDateString()}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Duration (days)</FormLabel>
                          <FormControl>
                             <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input type="number" placeholder="e.g., 7" {...field} className="pl-10" />
                              </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travelers</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={20} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Travel Style</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select travel style" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solo">Solo</SelectItem>
                              <SelectItem value="couple">Couple</SelectItem>
                              <SelectItem value="family">Family</SelectItem>
                              <SelectItem value="friends">Friends Group</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 rounded-xl bg-muted/30 p-3 md:p-4">
                    <FormField
                      control={form.control}
                      name="pace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trip Pace</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pace" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="relaxed">Relaxed</SelectItem>
                              <SelectItem value="balanced">Balanced</SelectItem>
                              <SelectItem value="packed">Packed (more activities)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Transport</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select transport" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="road-trip">Road Trip / Car</SelectItem>
                              <SelectItem value="public-transport">Public Transport</SelectItem>
                              <SelectItem value="mixed">Mixed (Road + Flight)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="accommodation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accommodation</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select accommodation" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="budget-guesthouse">Budget Guesthouse</SelectItem>
                              <SelectItem value="comfortable-hotel">Comfortable Hotel</SelectItem>
                              <SelectItem value="premium-resort">Premium Resort</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <Wallet className="mr-2" />
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PKR">PKR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="AED">AED</SelectItem>
                              <SelectItem value="SAR">SAR</SelectItem>
                              <SelectItem value="CNY">CNY</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            Interests
                          </FormLabel>
                          <FormDescription>
                            Select what you&apos;d like to do.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {interests.map((interest) => (
                            <FormField
                              key={interest.id}
                              control={form.control}
                              name="interests"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={interest.id}
                                    className="flex flex-row items-center space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          interest.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                interest.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== interest.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {interest.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={3}
                            placeholder="Any special needs (elderly travelers, kids, wheelchair access, photography focus, etc.)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <Wallet className="mr-2" />
                              <SelectValue placeholder="Select your budget" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="budget-friendly">Budget-Friendly</SelectItem>
                            <SelectItem value="mid-range">Mid-Range</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isPending} className="w-full h-11 md:h-10 sticky bottom-3 md:static z-10">
                    {isPending ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating Your Plan...
                      </>
                    ) : (
                       <>
                        <Wand2 className="mr-2" />
                        Generate Plan
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {plan && (
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-3xl font-headline">
                  {plan.tripTitle}
                </CardTitle>
                <CardDescription className="mt-1">
                  {plan.duration}-day trip{' \u00b7 '}{plan.destination}
                </CardDescription>
                {plan.summary && (
                  <p className="mt-3 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3 text-sm text-foreground/80 leading-relaxed">
                    {plan.summary}
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Budget + Transport overview */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-primary">Budget Summary</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.budgetSummary}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-primary">Transport Plan</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.transportPlan}</p>
                  </div>
                </div>

                {/* Budget Breakdown */}
                {plan.budgetBreakdown ? (
                  <div className="rounded-lg border p-4">
                    <h4 className="font-semibold text-primary">Budget Breakdown ({plan.budgetBreakdown.currency})</h4>
                    {plan.budgetBreakdown.estimatedRouteKm != null && plan.budgetBreakdown.estimatedRouteKm > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Estimated route distance:{' '}
                        <span className="font-medium text-foreground">
                          ~{plan.budgetBreakdown.estimatedRouteKm} km
                        </span>
                        {plan.budgetBreakdown.routeDistanceMethod === 'osrm' && ' (road route via OSRM)'}
                        {plan.budgetBreakdown.routeDistanceMethod === 'haversine' && ' (straight-line fallback)'}
                        . Transport cost is scaled using this distance.
                      </p>
                    )}
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                      <p>Accommodation: <span className="font-medium text-foreground">{plan.budgetBreakdown.accommodation.toLocaleString('en-PK')}</span></p>
                      <p>Food: <span className="font-medium text-foreground">{plan.budgetBreakdown.food.toLocaleString('en-PK')}</span></p>
                      <p>Transport: <span className="font-medium text-foreground">{plan.budgetBreakdown.transport.toLocaleString('en-PK')}</span></p>
                      <p>Activities: <span className="font-medium text-foreground">{plan.budgetBreakdown.activities.toLocaleString('en-PK')}</span></p>
                      <p>Contingency (10%): <span className="font-medium text-foreground">{plan.budgetBreakdown.contingency.toLocaleString('en-PK')}</span></p>
                      <p>Per Person Total: <span className="font-medium text-foreground">{plan.budgetBreakdown.perPersonTotal.toLocaleString('en-PK')}</span></p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-primary">
                      Grand Total: {plan.budgetBreakdown.total.toLocaleString('en-PK')} {plan.budgetBreakdown.currency}
                    </p>
                  </div>
                ) : null}

                {/* Daily Itinerary */}
                <div className="space-y-5">
                  <h4 className="font-semibold text-primary text-lg">Day-by-Day Itinerary</h4>
                  {plan.dailyPlan.map((day, index) => (
                    <div key={index} className="rounded-xl border bg-muted/20 overflow-hidden">
                      {/* Day header */}
                      <div className="bg-primary/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-bold text-primary">
                          Day {day.day}: {day.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {day.drivingTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {day.drivingTime}
                            </span>
                          )}
                          {day.overnight && (
                            <span className="flex items-center gap-1">
                              <BedDouble className="h-3.5 w-3.5" />
                              {day.overnight}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="px-4 py-3 space-y-3">
                        {/* Highlights chips */}
                        {day.highlights?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {day.highlights.map((h, hi) => (
                              <span
                                key={hi}
                                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                              >
                                <Star className="h-3 w-3" />
                                {h}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {day.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Local Tips */}
                {plan.localTips?.length ? (
                  <div className="rounded-lg border p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-primary">
                      <Lightbulb className="h-4 w-4" />
                      Local Tips
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {plan.localTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {/* Safety Notes */}
                {plan.safetyNotes?.length ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="h-4 w-4" />
                      Safety Notes
                    </h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-800/80 dark:text-amber-300/80">
                      {plan.safetyNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

              </CardContent>
               <CardFooter>
                <p className="text-sm text-muted-foreground">
                  This plan is AI-generated. Always verify local conditions before travel.
                </p>
              </CardFooter>
            </Card>
          )}
          </div>

          <aside className="h-fit w-full xl:max-w-[min(100%,320px)] xl:justify-self-end">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-xl">Live Exchange Rates</CardTitle>
                  <Button variant="outline" size="sm" onClick={loadRates} disabled={ratesLoading}>
                    <RefreshCw className={`mr-1 h-3.5 w-3.5 ${ratesLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                <CardDescription>Real-time reference against PKR</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {ratesError ? (
                  <p className="text-destructive">{ratesError}</p>
                ) : rates ? (
                  <>
                    {Object.entries(rates).map(([code, value]) => (
                      <div key={code} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                        <span className="font-medium">{code}</span>
                        <span>
                          {value && value > 0
                            ? `1 ${code} = ${(1 / value).toFixed(2)} PKR`
                            : '-'}
                        </span>
                      </div>
                    ))}
                    <p className="pt-2 text-xs text-muted-foreground">Updated: {ratesUpdatedAt}</p>
                    <a
                      href="https://open.er-api.com/v6/latest/PKR"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs text-primary underline-offset-4 hover:underline"
                    >
                      Source: open.er-api.com
                    </a>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Loading rates...
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[linear-gradient(135deg,#00798C_0%,#30638E_55%,#003D5B_100%)]">
          <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] xl:items-start">
              <div className="flex min-w-0 flex-col gap-6">
                <div className="rounded-xl bg-card/80 backdrop-blur-sm p-6 shadow-sm animate-pulse min-h-[600px] flex flex-col items-center pt-12">
                   <div className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
                   <div className="h-8 w-64 bg-primary/20 rounded-md mb-2" />
                   <div className="h-4 w-48 bg-primary/10 rounded-md mb-8" />
                   <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-20 bg-muted/50 rounded-xl" />
                      ))}
                   </div>
                </div>
              </div>
              <div className="rounded-xl bg-card p-6 shadow-sm animate-pulse h-64" />
            </div>
          </div>
        </div>
      }
    >
      <PlannerPageContent />
    </Suspense>
  );
}

'use client';

import React, { Suspense, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
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
import { useToast } from '@/hooks/use-toast';
import { Loader, Wand2, MapPin, Calendar, RefreshCw, Clock, BedDouble, Star, ShieldAlert, Lightbulb, Wallet, WifiOff } from 'lucide-react';
import { getTravelPlan } from '@/app/actions';
import type { TravelPlannerOutput } from '@/ai/flows/planner-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSavedTripById } from '@/data/saved-trips';
import { cn } from '@/lib/utils';

const PROVINCES = ["All Pakistan", "Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "AJK", "Islamabad"];

const PROVINCE_DESTINATIONS: Record<string, string[]> = {
  "All Pakistan": ["Lahore", "Karachi", "Islamabad", "Hunza", "Swat", "Murree", "Naran", "Skardu", "Multan", "Peshawar", "Quetta", "Chitral", "Fairy Meadows", "Bahawalpur", "Hyderabad", "Mohenjo-daro"],
  "Punjab": ["Lahore", "Multan", "Rawalpindi", "Bahawalpur", "Taxila", "Khewra Salt Mine", "Rohtas Fort", "Faisalabad", "Sialkot", "Sheikhupura", "Jhelum", "Chakwal"],
  "Sindh": ["Karachi", "Hyderabad", "Mohenjo-daro", "Makli", "Sukkur", "Thatta", "Gorakh Hill", "Keenjhar Lake", "Ranikot Fort", "Clifton Beach", "Sehwan Sharif", "Larkana"],
  "KPK": ["Peshawar", "Swat", "Nathia Gali", "Abbottabad", "Naran", "Kaghan", "Chitral", "Kalam", "Galiyat", "Kalash Valley", "Khyber Pass", "Takht Bhai"],
  "Balochistan": ["Quetta", "Ziarat", "Gwadar", "Makran Coast", "Kund Malir", "Hanna Lake", "Hinglaj", "Ormara", "Bolan Pass", "Urak Valley", "Turbat", "Lasbela"],
  "Gilgit-Baltistan": ["Hunza", "Skardu", "Fairy Meadows", "Khunjerab Pass", "Attabad Lake", "Naltar Valley", "Deosai Plains", "Passu Cones", "Shigar", "Gilgit", "Rakaposhi", "Nagar"],
  "AJK": ["Neelum Valley", "Muzaffarabad", "Rawalakot", "Ratti Gali Lake", "Leepa Valley", "Kel", "Shounter Lake", "Taobat", "Banjosa Lake", "Poonch", "Bagh", "Mirpur"],
  "Islamabad": ["Faisal Mosque", "Margalla Hills", "Daman-e-Koh", "Rawal Lake", "Saidpur Village", "Trail 3", "Trail 5", "Pir Sohawa", "Pakistan Monument", "Shakarparian", "Lok Virsa Museum"]
};

const TRAVEL_STYLES = ["Family trip", "Couple / Honeymoon", "Solo adventure", "Friends group", "Corporate / Team"];
const TRIP_PACES = ["Balanced", "Relaxed — slow & easy", "Fast-paced — see everything", "Flexible — decide on the go"];

const BUDGET_OPTIONS = [
  { id: "Economy", label: "Economy", desc: "Under PKR 15k" },
  { id: "Mid-Range", label: "Mid-Range", desc: "PKR 15k–50k" },
  { id: "Comfortable", label: "Comfortable", desc: "PKR 50k–1.5L" },
  { id: "Luxury", label: "Luxury", desc: "PKR 1.5L+" },
];

const INTERESTS = [
  { id: "History & Culture", icon: "🏛" },
  { id: "Nature & Scenery", icon: "🏔" },
  { id: "Adventure & Sports", icon: "🧗" },
  { id: "Food & Cuisine", icon: "🍜" },
  { id: "Photography", icon: "📸" },
  { id: "Shopping & Bazaars", icon: "🛍" },
  { id: "Religious / Spiritual", icon: "🕌" },
  { id: "Wildlife & Birds", icon: "🦅" },
  { id: "Relaxation", icon: "🧘" }
];

const formSchema = z.object({
  destination: z.string().min(1, 'Please select or enter a destination.'),
  departingFrom: z.string().min(1, 'Please enter your departure city.'),
  startDate: z.string().min(1, 'Please choose a start date.'),
  returnDate: z.string().min(1, 'Please choose a return date.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day.').max(60, 'Duration cannot exceed 60 days.'),
  adults: z.coerce.number().min(1, 'At least 1 adult is required.'),
  children: z.coerce.number().min(0),
  toddlers: z.coerce.number().min(0),
  travelStyle: z.string().min(1, 'Please select a travel style.'),
  tripPace: z.string().min(1, 'Please select trip pace.'),
  budgetTier: z.string().min(1, 'Please pick a budget.'),
  interests: z.array(z.string()).min(1, 'Pick at least one interest so the AI can personalise your plan.'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

function getFutureDateString(daysToAdd: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().slice(0, 10);
}

function calculateDuration(start: string, end: string) {
  if (!start || !end) return '';
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : '';
}

function calculateEndDate(start: string, duration: number) {
  if (!start || !duration) return '';
  const d = new Date(start);
  d.setDate(d.getDate() + duration);
  return d.toISOString().slice(0, 10);
}

import { useAuth } from '@/components/auth-context';
import { saveTrip } from '@/lib/trips';
import { AuthDialog } from '@/components/auth-dialog';

function PlannerPageContent() {
  const { user, loginWithGoogle } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvince, setSelectedProvince] = useState("All Pakistan");
  
  const [presetLabel, setPresetLabel] = useState<string | null>(null);
  const [plan, setPlan] = useState<TravelPlannerOutput | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<string>('');
  const [ratesError, setRatesError] = useState<string | null>(null);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const handleSaveTrip = async () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (!plan) return;

    try {
      setIsSaving(true);
      await saveTrip(user.uid, {
        tripTitle: plan.tripTitle,
        destination: plan.destination,
        duration: String(plan.duration),
        tripData: plan,
      });
      setHasSaved(true);
      toast({
        title: "Trip Saved!",
        description: "You can find your saved trips in the 'My Trips' section.",
      });
    } catch (err) {
      toast({
        title: "Save Failed",
        description: "Could not save your trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      departingFrom: '',
      startDate: getTodayString(),
      returnDate: getFutureDateString(7),
      duration: 7,
      adults: 2,
      children: 0,
      toddlers: 0,
      travelStyle: 'Family trip',
      tripPace: 'Balanced',
      budgetTier: '',
      interests: [],
      notes: '',
    },
    mode: 'onChange',
  });

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
    form.setValue('destination', trip.plannerDefaults.destination);
    // Other defaults could be mapped here if we expanded the mock data
  }, [presetParam, form]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    form.setValue('startDate', newStart, { shouldValidate: true });
    const dur = form.getValues('duration');
    if (dur) {
      form.setValue('returnDate', calculateEndDate(newStart, dur), { shouldValidate: true });
    }
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newReturn = e.target.value;
    form.setValue('returnDate', newReturn, { shouldValidate: true });
    const newDuration = calculateDuration(form.getValues('startDate'), newReturn);
    if (newDuration) {
      form.setValue('duration', Number(newDuration), { shouldValidate: true });
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newDuration = val === '' ? ('' as any) : parseInt(val, 10);
    form.setValue('duration', newDuration, { shouldValidate: true });
    if (typeof newDuration === 'number' && !isNaN(newDuration) && newDuration > 0 && form.getValues('startDate')) {
      form.setValue('returnDate', calculateEndDate(form.getValues('startDate'), newDuration), { shouldValidate: true });
    }
  };

  const checkNextStep1 = async () => {
    const valid = await form.trigger(["destination", "departingFrom", "startDate", "returnDate", "duration"]);
    if (valid) setCurrentStep(2);
    else toast({ title: "Please fill all required fields to continue.", variant: "destructive" });
  };

  const checkNextStep2 = async () => {
    const valid = await form.trigger(["adults", "children", "toddlers", "travelStyle", "tripPace"]);
    if (valid) setCurrentStep(3);
    else toast({ title: "Please fill all required fields to continue.", variant: "destructive" });
  };

  const onSubmit = (data: FormData) => {
    const interestsList = data.interests.join(", ");
    let promptString = `Plan a ${data.duration}-day trip to ${data.destination} starting from ${data.departingFrom} on ${data.startDate}. Travelers: ${data.adults} adults, ${data.children} children, ${data.toddlers} toddlers. Style: ${data.travelStyle}. Pace: ${data.tripPace}. Budget: ${data.budgetTier}. Interests: ${interestsList}.`;
    
    if (data.notes) {
      promptString += ` Special notes: ${data.notes}`;
    }
    
    promptString += ` Give a detailed day-by-day itinerary with local tips, estimated PKR costs, accommodation suggestions, and must-see highlights.`;

    startTransition(async () => {
      try {
        setError(null);
        setPlan(null);
        const result = await getTravelPlan({
          promptString,
          duration: data.duration,
          adults: data.adults,
          children: data.children,
          toddlers: data.toddlers,
          budgetTier: data.budgetTier,
          destination: data.destination,
        });
        setPlan(result);
        
        // Scroll to results
        setTimeout(() => {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 300);
      } catch (e: any) {
        setError(e.message || 'An error occurred while generating the plan.');
      }
    });
  };

  // Check if start date is in July or August
  const startDateStr = form.watch('startDate');
  const isSummerPeak = startDateStr && (startDateStr.includes('-07-') || startDateStr.includes('-08-'));

  const inputClass = "h-11 rounded-lg border-[0.5px] border-border px-[12px] py-[10px] text-[14px] focus-visible:ring-0 focus-visible:border-[#0F6E56] focus-visible:shadow-[0_0_0_1px_rgba(15,110,86,0.3)] transition-all";
  const labelClass = "text-[12px] font-semibold text-foreground/80 mb-1.5 inline-block";
  const sectionTitleClass = "text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-4";

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#00798C_0%,#30638E_55%,#003D5B_100%)]">
      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
      <div className="container mx-auto px-4 py-12 md:py-16 pt-24 md:pt-32">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] xl:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden rounded-2xl">
              <CardHeader className="text-center pb-6 bg-gradient-to-b from-primary/5 to-transparent">
                <Wand2 className="mx-auto h-12 w-12 text-[#0F6E56] mb-4" />
                <CardTitle className="text-3xl md:text-4xl font-headline text-foreground">
                  AI Smart Travel Planner
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Let our AI craft the perfect Pakistani adventure for you.
                </CardDescription>
                
                {/* Progress Indicator */}
                <div className="flex items-center justify-center mt-8 max-w-md mx-auto w-full px-4">
                  {[1, 2, 3].map((step, idx) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                          currentStep === step ? 'bg-[#0F6E56] text-white border-2 border-[#0F6E56]' :
                          currentStep > step ? 'bg-[#E1F5EE] text-[#0F6E56] border-2 border-[#E1F5EE]' :
                          'bg-transparent text-muted-foreground border-2 border-muted-foreground/30'
                        }`}>
                          {step}
                        </div>
                        <span className={`text-[11px] font-semibold mt-2 uppercase tracking-wide ${
                          currentStep === step ? 'text-[#0F6E56]' :
                          currentStep > step ? 'text-[#0F6E56]' :
                          'text-muted-foreground'
                        }`}>
                          {step === 1 ? 'Where' : step === 2 ? 'Who' : 'Vibe'}
                        </span>
                      </div>
                      {idx < 2 && (
                        <div className={`flex-1 h-[2px] mx-2 -mt-6 transition-colors ${
                          currentStep > step ? 'bg-[#0F6E56]' : 'bg-muted-foreground/20'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="px-6 md:px-10 pb-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    
                    {/* STEP 1: WHERE */}
                    <div className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                      
                      {/* Province Tabs */}
                      <div className="overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex gap-2">
                          {PROVINCES.map(prov => (
                            <button
                              key={prov}
                              type="button"
                              onClick={() => setSelectedProvince(prov)}
                              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                selectedProvince === prov
                                  ? 'bg-[#0F6E56] text-white'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {prov}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chip Grid */}
                      <div className="mt-4 flex flex-wrap gap-2 p-4 bg-muted/30 rounded-xl border border-border/50">
                        {PROVINCE_DESTINATIONS[selectedProvince]?.map(dest => (
                          <button
                            key={dest}
                            type="button"
                            onClick={() => {
                              form.setValue('destination', dest, { shouldValidate: true });
                            }}
                            className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                              form.watch('destination') === dest
                                ? 'bg-[#E1F5EE] border-[#0F6E56] text-[#0F6E56] font-medium'
                                : 'bg-background border-border text-foreground hover:border-[#0F6E56]/50'
                            }`}
                          >
                            {dest}
                          </button>
                        ))}
                      </div>

                      {/* Inputs Row 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mt-6">
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Destination</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g. Hunza Valley" 
                                  {...field} 
                                  className={`${inputClass} ${form.formState.errors.destination ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                                />
                              </FormControl>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="departingFrom"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Departing from</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your city e.g. Karachi" 
                                  {...field} 
                                  className={`${inputClass} ${form.formState.errors.departingFrom ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                                />
                              </FormControl>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Inputs Row 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px] mt-[14px]">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Start date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  min={getTodayString()}
                                  {...field} 
                                  onChange={handleStartDateChange}
                                  className={`${inputClass} ${form.formState.errors.startDate ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                                />
                              </FormControl>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="returnDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Return date</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  min={form.watch('startDate') || getTodayString()}
                                  {...field} 
                                  onChange={handleReturnDateChange}
                                  className={`${inputClass} ${form.formState.errors.returnDate ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                                />
                              </FormControl>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Trip duration (days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  max={60}
                                  {...field} 
                                  value={Number.isNaN(field.value as any) ? '' : field.value}
                                  onChange={handleDurationChange}
                                  className={`${inputClass} ${form.formState.errors.duration ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                                />
                              </FormControl>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Warning Banner */}
                      {isSummerPeak && (
                        <div className="mt-4 p-3 rounded-lg bg-[#FAEEDA] border border-[#EF9F27] text-[#633806] text-sm flex items-start gap-2">
                          <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[#EF9F27]" />
                          <p>Peak summer — northern areas get very crowded Jul–Aug. Book accommodations early!</p>
                        </div>
                      )}

                      <div className="flex justify-end mt-8 border-t border-border pt-6">
                        <Button type="button" onClick={checkNextStep1} className="bg-[#0F6E56] hover:bg-[#0b5341] text-white h-11 px-6 rounded-lg font-semibold">
                          Next: Who's coming? &rarr;
                        </Button>
                      </div>
                    </div>

                    {/* STEP 2: WHO */}
                    <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                      
                      <h3 className={sectionTitleClass}>How many travelers?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-muted/20 rounded-xl border border-border/50">
                        {/* Adults */}
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="font-semibold text-sm">Adults</p>
                            <p className="text-xs text-muted-foreground">Age 18+</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button type="button" onClick={() => form.setValue('adults', Math.max(1, form.getValues('adults') - 1), { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&minus;</button>
                            <span className="text-xl font-bold w-4 text-center">{form.watch('adults')}</span>
                            <button type="button" onClick={() => form.setValue('adults', form.getValues('adults') + 1, { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&#43;</button>
                          </div>
                        </div>
                        {/* Children */}
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="font-semibold text-sm">Children</p>
                            <p className="text-xs text-muted-foreground">Age 5–17</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button type="button" onClick={() => form.setValue('children', Math.max(0, form.getValues('children') - 1), { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&minus;</button>
                            <span className="text-xl font-bold w-4 text-center">{form.watch('children')}</span>
                            <button type="button" onClick={() => form.setValue('children', form.getValues('children') + 1, { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&#43;</button>
                          </div>
                        </div>
                        {/* Toddlers */}
                        <div className="flex flex-col gap-3">
                          <div>
                            <p className="font-semibold text-sm">Toddlers</p>
                            <p className="text-xs text-muted-foreground">Under 5</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button type="button" onClick={() => form.setValue('toddlers', Math.max(0, form.getValues('toddlers') - 1), { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&minus;</button>
                            <span className="text-xl font-bold w-4 text-center">{form.watch('toddlers')}</span>
                            <button type="button" onClick={() => form.setValue('toddlers', form.getValues('toddlers') + 1, { shouldValidate: true })} className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background hover:bg-muted text-lg text-foreground transition-colors">&#43;</button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px] mt-[14px]">
                        <FormField
                          control={form.control}
                          name="travelStyle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Travel Style</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Select style" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TRAVEL_STYLES.map(style => (
                                    <SelectItem key={style} value={style}>{style}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="tripPace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Trip Pace</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className={inputClass}>
                                    <SelectValue placeholder="Select pace" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {TRIP_PACES.map(pace => (
                                    <SelectItem key={pace} value={pace}>{pace}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-[#791F1F] text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-between mt-8 border-t border-border pt-6">
                        <Button type="button" onClick={() => setCurrentStep(1)} variant="outline" className="h-11 px-6 rounded-lg bg-white border-border/60 hover:bg-muted">
                          &larr; Back
                        </Button>
                        <Button type="button" onClick={checkNextStep2} className="bg-[#0F6E56] hover:bg-[#0b5341] text-white h-11 px-6 rounded-lg font-semibold">
                          Next: Pick your vibe &rarr;
                        </Button>
                      </div>
                    </div>

                    {/* STEP 3: VIBE */}
                    <div className={currentStep === 3 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
                      
                      <div className="mb-6">
                        <h3 className={sectionTitleClass}>Budget range (per person)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                          {BUDGET_OPTIONS.map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => form.setValue('budgetTier', opt.id, { shouldValidate: true })}
                              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all text-center ${
                                form.watch('budgetTier') === opt.id
                                  ? 'bg-[#E1F5EE] border-[#0F6E56] text-[#0F6E56]'
                                  : 'bg-background border-border hover:border-[#0F6E56]/40'
                              } ${form.formState.errors.budgetTier ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                            >
                              <span className="font-bold text-sm mb-1">{opt.label}</span>
                              <span className={`text-xs ${form.watch('budgetTier') === opt.id ? 'text-[#0F6E56]/80' : 'text-muted-foreground'}`}>{opt.desc}</span>
                            </button>
                          ))}
                        </div>
                        {form.formState.errors.budgetTier && (
                          <p className="text-[#791F1F] text-xs mt-2">{form.formState.errors.budgetTier.message}</p>
                        )}
                      </div>

                      <div className="mb-6 pt-6 border-t border-border/50">
                        <h3 className={sectionTitleClass}>What do you enjoy? (pick all that apply)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {INTERESTS.map(int => {
                            const isSelected = form.watch('interests').includes(int.id);
                            return (
                              <button
                                key={int.id}
                                type="button"
                                onClick={() => {
                                  const current = form.getValues('interests');
                                  if (isSelected) {
                                    form.setValue('interests', current.filter(id => id !== int.id), { shouldValidate: true });
                                  } else {
                                    form.setValue('interests', [...current, int.id], { shouldValidate: true });
                                  }
                                }}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                  isSelected
                                    ? 'bg-[#E1F5EE] border-[#0F6E56] text-[#0F6E56]'
                                    : 'bg-background border-border hover:border-[#0F6E56]/40'
                                } ${form.formState.errors.interests ? 'border-[#E24B4A] shadow-[0_0_0_1px_rgba(226,75,74,0.2)]' : ''}`}
                              >
                                <span className="text-xl">{int.icon}</span>
                                <span className="text-sm font-medium leading-tight">{int.id}</span>
                              </button>
                            );
                          })}
                        </div>
                        {form.formState.errors.interests && (
                          <p className="text-[#791F1F] text-xs mt-2">{form.formState.errors.interests.message}</p>
                        )}
                      </div>

                      <div className="mb-6 pt-6 border-t border-border/50">
                        <FormField
                          control={form.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelClass}>Anything special? (optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  rows={3}
                                  placeholder="e.g. wheelchair access, kids need frequent breaks, halal food only, photography at sunrise, permit needed for Khunjerab..."
                                  className="rounded-lg border-[0.5px] border-border p-3 text-[14px] focus-visible:ring-0 focus-visible:border-[#0F6E56] focus-visible:shadow-[0_0_0_1px_rgba(15,110,86,0.3)] resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mb-8 pt-6 border-t border-border/50">
                        <h3 className={sectionTitleClass}>Your trip summary</h3>
                        <div className="bg-muted/30 border border-border/60 rounded-xl p-5 space-y-3 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Trip</span>
                            <span className="font-medium">{form.watch('departingFrom') || '?'} &rarr; {form.watch('destination') || '?'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Date & Duration</span>
                            <span className="font-medium">{form.watch('startDate')} &middot; {form.watch('duration')} days</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Travelers</span>
                            <span className="font-medium">{form.watch('adults')} adults, {form.watch('children')} children, {form.watch('toddlers')} toddlers</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Style & Pace</span>
                            <span className="font-medium text-right">{form.watch('travelStyle')} &middot; {form.watch('tripPace')}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Budget</span>
                            <span className="font-medium">{BUDGET_OPTIONS.find(b => b.id === form.watch('budgetTier'))?.label || '?'}</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between py-1">
                            <span className="text-muted-foreground whitespace-nowrap mr-4">Interests</span>
                            <span className="font-medium text-right leading-tight max-w-[200px]">
                              {form.watch('interests').length > 0 ? form.watch('interests').join(', ') : '?'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-6">
                        <Button type="button" onClick={() => setCurrentStep(2)} variant="outline" className="h-11 px-6 rounded-lg bg-white border-border/60 hover:bg-muted">
                          &larr; Back
                        </Button>
                        <span className="text-xs text-muted-foreground">Takes ~10 seconds</span>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isPending || isOffline} 
                        className="w-full bg-[#0F6E56] hover:bg-[#0b5341] text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-[#0F6E56]/20 transition-all hover:shadow-[#0F6E56]/30 disabled:opacity-50 disabled:grayscale"
                      >
                        {isPending ? (
                          <>
                            <Loader className="mr-3 h-5 w-5 animate-spin" />
                            Generating Your Plan...
                          </>
                        ) : isOffline ? (
                          <>
                            <WifiOff className="mr-2 h-5 w-5" />
                            Offline: Check Connection
                          </>
                        ) : (
                           <>
                            <Wand2 className="mr-2 h-5 w-5" />
                            &#10022; Generate My Travel Plan
                          </>
                        )}
                      </Button>

                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
                  <AlertTitle className="font-bold">Error generating plan</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {plan && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                <Card className="bg-card/95 backdrop-blur-sm border-0 shadow-xl overflow-hidden rounded-2xl">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-3xl font-headline text-foreground">
                          {plan.tripTitle}
                        </CardTitle>
                        <CardDescription className="mt-1 text-base text-muted-foreground">
                          {plan.duration}-day trip{' \u00b7 '}{plan.destination}
                        </CardDescription>
                      </div>
                      <Button
                        onClick={handleSaveTrip}
                        disabled={isSaving || hasSaved}
                        className={cn(
                          "rounded-full gap-2 transition-all",
                          hasSaved ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100" : "bg-primary text-white"
                        )}
                        variant={hasSaved ? "outline" : "default"}
                      >
                        {isSaving ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : hasSaved ? (
                          <>&#10003; Saved</>
                        ) : (
                          <>Save Trip</>
                        )}
                      </Button>
                    </div>
                    {plan.summary && (
                      <p className="mt-4 rounded-xl bg-background border border-border p-4 text-sm text-foreground/90 leading-relaxed shadow-sm">
                        {plan.summary}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-8 p-6 md:p-8">

                    {/* Budget + Transport overview */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border bg-muted/20 p-5">
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          <Wallet className="h-4 w-4" /> Budget Summary
                        </h4>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{plan.budgetSummary}</p>
                      </div>
                      <div className="rounded-xl border bg-muted/20 p-5">
                        <h4 className="font-bold text-primary flex items-center gap-2">
                          <MapPin className="h-4 w-4" /> Transport Plan
                        </h4>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{plan.transportPlan}</p>
                      </div>
                    </div>

                    {/* Budget Breakdown */}
                    {plan.budgetBreakdown ? (
                      <div className="rounded-xl border bg-muted/20 p-5">
                        <h4 className="font-bold text-primary mb-4">Budget Breakdown ({plan.budgetBreakdown.currency})</h4>
                        {plan.budgetBreakdown.estimatedRouteKm != null && plan.budgetBreakdown.estimatedRouteKm > 0 && (
                          <div className="mb-4 inline-block bg-background px-3 py-1.5 rounded-md border text-xs text-muted-foreground">
                            Estimated route distance:{' '}
                            <span className="font-semibold text-foreground">
                              ~{plan.budgetBreakdown.estimatedRouteKm} km
                            </span>
                          </div>
                        )}
                        <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2 bg-background rounded-lg border p-4">
                          <div className="flex justify-between border-b pb-2"><span className="text-foreground/70">Accommodation</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.accommodation.toLocaleString('en-PK')}</span></div>
                          <div className="flex justify-between border-b pb-2"><span className="text-foreground/70">Food</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.food.toLocaleString('en-PK')}</span></div>
                          <div className="flex justify-between border-b md:border-b-0 pb-2 md:pb-0"><span className="text-foreground/70">Transport</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.transport.toLocaleString('en-PK')}</span></div>
                          <div className="flex justify-between border-b md:border-b-0 pb-2 md:pb-0"><span className="text-foreground/70">Activities</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.activities.toLocaleString('en-PK')}</span></div>
                          <div className="flex justify-between"><span className="text-foreground/70">Contingency (10%)</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.contingency.toLocaleString('en-PK')}</span></div>
                          <div className="flex justify-between"><span className="text-foreground/70">Per Person</span> <span className="font-semibold text-foreground">{plan.budgetBreakdown.perPersonTotal.toLocaleString('en-PK')}</span></div>
                        </div>
                        <div className="mt-4 flex items-center justify-between bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                          <span className="font-bold text-primary">Grand Total</span>
                          <span className="font-bold text-xl text-primary">{plan.budgetBreakdown.total.toLocaleString('en-PK')} {plan.budgetBreakdown.currency}</span>
                        </div>
                      </div>
                    ) : null}

                    {/* Daily Itinerary */}
                    <div className="space-y-6">
                      <h4 className="font-bold text-primary text-xl border-b pb-2">Day-by-Day Itinerary</h4>
                      {plan.dailyPlan.map((day, index) => (
                        <div key={index} className="rounded-xl border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          {/* Day header */}
                          <div className="bg-primary/5 border-b px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <h3 className="text-lg font-bold text-primary">
                              Day {day.day}: {day.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground bg-white/50 px-3 py-1.5 rounded-full">
                              {day.drivingTime && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-primary/60" />
                                  {day.drivingTime}
                                </span>
                              )}
                              {day.overnight && (
                                <span className="flex items-center gap-1.5">
                                  <BedDouble className="h-4 w-4 text-primary/60" />
                                  {day.overnight}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="px-5 py-5 space-y-4">
                            {/* Highlights chips */}
                            {day.highlights?.length ? (
                              <div className="flex flex-wrap gap-2">
                                {day.highlights.map((h, hi) => (
                                  <span
                                    key={hi}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20"
                                  >
                                    <Star className="h-3.5 w-3.5 fill-primary/20" />
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

                    {/* Local Tips & Safety */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {plan.localTips?.length ? (
                        <div className="rounded-xl border bg-background p-5 shadow-sm">
                          <h4 className="flex items-center gap-2 font-bold text-primary mb-3">
                            <Lightbulb className="h-5 w-5" />
                            Local Tips
                          </h4>
                          <ul className="list-none space-y-2 text-sm text-muted-foreground">
                            {plan.localTips.map((tip, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary mt-0.5">&bull;</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {plan.safetyNotes?.length ? (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm">
                          <h4 className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400 mb-3">
                            <ShieldAlert className="h-5 w-5" />
                            Safety Notes
                          </h4>
                          <ul className="list-none space-y-2 text-sm text-amber-800/80 dark:text-amber-300/80">
                            {plan.safetyNotes.map((note, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-amber-500 mt-0.5">&bull;</span>
                                <span>{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>

                  </CardContent>
                  <CardFooter className="bg-muted/30 border-t justify-center py-4">
                    <p className="text-xs text-muted-foreground">
                      This plan is AI-generated. Always verify local conditions, road closures, and weather before travel.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>

          <aside className="h-fit w-full xl:max-w-[min(100%,320px)] xl:justify-self-end sticky top-24">
            <Card className="shadow-lg border-0 rounded-2xl overflow-hidden bg-card/95 backdrop-blur-sm">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-bold">Live Rates</CardTitle>
                  <Button variant="outline" size="sm" onClick={loadRates} disabled={ratesLoading} className="h-8 rounded-md bg-background">
                    <RefreshCw className={`mr-1.5 h-3 w-3 ${ratesLoading ? 'animate-spin' : ''}`} />
                    <span className="text-xs">Refresh</span>
                  </Button>
                </div>
                <CardDescription className="text-xs">Real-time reference against PKR</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {ratesError ? (
                  <p className="text-destructive text-sm font-medium">{ratesError}</p>
                ) : rates ? (
                  <div className="space-y-1.5">
                    {Object.entries(rates).map(([code, value]) => (
                      <div key={code} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                        <span className="font-bold text-muted-foreground">{code}</span>
                        <span className="font-medium text-foreground">
                          {value && value > 0
                            ? `1 ${code} = ${(1 / value).toFixed(2)}`
                            : '-'}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 px-1">
                      <p className="text-[10px] text-muted-foreground">Updated: {ratesUpdatedAt}</p>
                      <a
                        href="https://open.er-api.com/v6/latest/PKR"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-[10px] font-medium text-primary hover:underline"
                      >
                        Source
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4 animate-spin" /> Fetching...
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
                <div className="rounded-2xl bg-card/80 backdrop-blur-sm p-6 shadow-xl animate-pulse min-h-[600px] flex flex-col items-center pt-12">
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
              <div className="rounded-2xl bg-card p-6 shadow-xl animate-pulse h-64" />
            </div>
          </div>
        </div>
      }
    >
      <PlannerPageContent />
    </Suspense>
  );
}

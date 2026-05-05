'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-context';
import { getUserTrips, deleteTrip, type SavedTrip } from '@/lib/trips';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, MapPin, Calendar, Trash2, Eye, Compass } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function MyTrips() {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<SavedTrip | null>(null);
  const { toast } = useToast();

  const fetchTrips = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userTrips = await getUserTrips(user.uid);
      setTrips(userTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchTrips();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      await deleteTrip(id);
      setTrips(trips.filter(t => t.id !== id));
      toast({ title: "Trip deleted", description: "The trip has been removed from your saved list." });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete the trip.", variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your trips...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="bg-amber-50 border-amber-200 p-8 text-center max-w-2xl mx-auto mt-10">
        <Compass className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <CardTitle className="text-amber-900">Login to See Your Trips</CardTitle>
        <CardDescription className="text-amber-800 mt-2">
          Your personalized AI-generated travel plans are stored securely in your account. 
          Login with Google to access them anytime.
        </CardDescription>
        <div className="mt-6">
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No saved trips yet</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Start planning your next adventure with our AI Smart Planner and save your favorite itineraries here.
        </p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
          <Link href="/planner">Start Planning</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-10">
      {trips.map((trip) => (
        <Card key={trip.id} className="group overflow-hidden border-slate-200 hover:border-primary/50 transition-all hover:shadow-lg">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-[#003D5B]" />
          <CardHeader>
            <CardTitle className="line-clamp-1">{trip.tripTitle}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <MapPin className="h-3.5 w-3.5" /> {trip.destination}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {trip.duration} Days
                </div>
                <span>Saved on {new Date(trip.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="grid grid-cols-2 gap-2 border-t bg-slate-50/50 p-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  onClick={() => setSelectedTrip(trip)}
                >
                  <Eye className="h-4 w-4" /> View Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">{trip.tripTitle}</DialogTitle>
                  <DialogDescription>
                    {trip.duration} Day Trip to {trip.destination}
                  </DialogDescription>
                </DialogHeader>
                {trip.tripData && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-xl bg-slate-50 p-6 border border-slate-200">
                      <h4 className="font-bold text-lg mb-2">Summary</h4>
                      <p className="text-slate-700 leading-relaxed">{trip.tripData.summary}</p>
                    </div>
                    
                    <div className="space-y-8">
                      {trip.tripData.itinerary?.map((day: any) => (
                        <div key={day.day} className="relative pl-8 border-l-2 border-primary/20 pb-2 last:pb-0">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm" />
                          <h3 className="text-xl font-bold text-primary mb-4">Day {day.day}: {day.theme}</h3>
                          <div className="grid gap-4">
                            {day.activities?.map((act: any, idx: number) => (
                              <div key={idx} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">{act.time}</span>
                                  {act.pkrCost && <span className="text-xs font-semibold text-slate-500">{act.pkrCost} PKR</span>}
                                </div>
                                <h4 className="font-bold text-slate-900">{act.activity}</h4>
                                <p className="text-sm text-slate-600 mt-1">{act.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700"
              onClick={() => handleDelete(trip.id)}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

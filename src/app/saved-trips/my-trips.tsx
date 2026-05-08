'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-context';
import { getUserTrips, deleteTrip, type SavedTrip } from '@/lib/trips';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, MapPin, Calendar, Trash2, Eye, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AuthDialog } from '@/components/auth-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function MyTrips() {
  const { user, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchTrips = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userTrips = await getUserTrips(user.uid);
      setTrips(userTrips);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        void fetchTrips();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    try {
      await deleteTrip(id);
      setTrips((current) => current.filter((trip) => trip.id !== id));
      toast({ title: "Trip deleted", description: "The trip has been removed from your saved list." });
    } catch {
      toast({ title: "Delete failed", description: "Could not delete the trip.", variant: "destructive" });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your trips...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
        <Card className="mx-auto mt-10 max-w-2xl border-amber-200 bg-amber-50 p-8 text-center">
          <Compass className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <CardTitle className="text-amber-900">Login to See Your Saved Plans</CardTitle>
          <CardDescription className="mt-2 text-amber-800">
            Sign in to view your saved AI-generated itineraries and continue planning anytime.
          </CardDescription>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={() => setIsAuthDialogOpen(true)} className="bg-amber-600 text-white hover:bg-amber-700">
              Log In With Google
            </Button>
            <Button asChild variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-100">
              <Link href="/planner">Open Planner</Link>
            </Button>
          </div>
        </Card>
      </>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No saved plans yet</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Generate a trip in the planner, then save it to your account so it appears here.
        </p>
        <Button asChild className="mt-8 bg-primary hover:bg-primary/90">
          <Link href="/planner">Start Planning</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <Card key={trip.id} className="group overflow-hidden border-slate-200 transition-all hover:border-primary/50 hover:shadow-lg">
          <div className="h-2 w-full bg-gradient-to-r from-primary to-[#003D5B]" />
          <CardHeader>
            <CardTitle className="line-clamp-1">{trip.tripTitle}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
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
                <Button variant="outline" size="sm" className="w-full gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                  <Eye className="h-4 w-4" /> View Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-primary">{trip.tripTitle}</DialogTitle>
                  <DialogDescription>
                    {trip.duration} Day Trip to {trip.destination}
                  </DialogDescription>
                </DialogHeader>
                {trip.tripData && (
                  <div className="mt-6 space-y-6">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                      <h4 className="mb-2 text-lg font-bold">Summary</h4>
                      <p className="leading-relaxed text-slate-700">{trip.tripData.summary}</p>
                    </div>

                    <div className="space-y-6">
                      {(trip.tripData.dailyPlan ?? []).map((day: any) => (
                        <div key={day.day} className="relative border-l-2 border-primary/20 pb-2 pl-8 last:pb-0">
                          <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-white bg-primary shadow-sm" />
                          <h3 className="mb-3 text-xl font-bold text-primary">Day {day.day}: {day.title}</h3>
                          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">{day.drivingTime}</p>
                            <p className="mt-2 text-slate-800">{day.details}</p>
                            {day.highlights?.length ? (
                              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                                {day.highlights.map((highlight: string) => (
                                  <li key={highlight}>{highlight}</li>
                                ))}
                              </ul>
                            ) : null}
                            <p className="mt-3 text-sm font-medium text-slate-600">Overnight: {day.overnight}</p>
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
              className="w-full gap-2 border-slate-200 bg-white text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
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

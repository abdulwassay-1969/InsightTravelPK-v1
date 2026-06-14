'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, Calendar, Compass, Truck, Hotel, CheckCircle2, BadgePercent } from 'lucide-react';
import { getUserBookings, type Booking } from '../actions';

interface BookingPanelProps {
  userId: string;
}

export function BookingPanel({ userId }: BookingPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getUserBookings(userId);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <Loader className="h-8 w-8 animate-spin text-teal-500 mb-2" />
        <p>Loading reservations...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-800/20 rounded-2xl border border-slate-700/50">
        <BadgePercent className="h-12 w-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Bookings Yet</h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mb-4">
          Explore and book hotels, transport, or local guide activities directly alongside your itineraries.
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <Hotel className="h-5 w-5 text-teal-400" />;
      case 'transport': return <Truck className="h-5 w-5 text-indigo-400" />;
      default: return <Compass className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Your Booked Services</h2>
        <Button size="sm" variant="outline" onClick={fetchBookings} className="text-xs">
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {bookings.map((booking) => (
          <Card key={booking.id} className="bg-slate-800/40 border-slate-700 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-slate-700/50 p-2 rounded-xl">
                  {getIcon(booking.bookingType)}
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-white capitalize">
                    {booking.bookingType} Reservation
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Booked on {booking.date}
                  </CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                {booking.status}
              </span>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-sm font-semibold text-slate-200 mb-3">
                {booking.itemName}
              </div>
              <div className="flex items-center justify-between border-t border-slate-700/50 pt-3 text-xs">
                <div>
                  <span className="text-slate-400">Total Price:</span>
                  <p className="text-base font-black text-white mt-0.5">
                    PKR {booking.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-teal-400 font-medium">Commission Saved</span>
                  <p className="text-slate-300 mt-0.5">
                    PKR {booking.commission.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

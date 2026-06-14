'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarHalf, StarOff, MessageSquare, User, Loader, Calendar, Upload, CheckCircle2, Copy } from 'lucide-react';
import { submitReview, getLocationReviews, type LocationReview } from '../actions';

interface ReviewsPanelProps {
  userId: string;
  userName: string;
  locationId: string;
  locationName: string;
}

export function ReviewsPanel({ userId, userName, locationId, locationName }: ReviewsPanelProps) {
  const [reviews, setReviews] = useState<LocationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getLocationReviews(locationId);
      setReviews(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadReviews(); }, [locationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !text.trim()) return;
    try {
      setSubmitting(true);
      // Photo upload omitted for simplicity; can be extended later.
      await submitReview(userId, userName, locationId, locationName, rating, text);
      setRating(0);
      setText('');
      setPhoto(null);
      await loadReviews();
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const copyReview = async (rev: LocationReview) => {
    await navigator.clipboard.writeText(`${rev.userName}: ${rev.rating}★ - ${rev.text}`);
    setCopied(rev.id ?? rev.userId);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderStars = (value: number) => {
    const full = Math.floor(value);
    const half = value - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5 text-yellow-400">
        {Array.from({ length: full }).map((_, i) => <Star key={`full-${i}`} className="h-4 w-4" />)}
        {half && <StarHalf className="h-4 w-4" />}
        {Array.from({ length: empty }).map((_, i) => <StarOff key={`empty-${i}`} className="h-4 w-4" />)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Review Form */}
      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-teal-400" /> Write a Review for {locationName}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">Share your experience. Your review helps fellow travelers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 items-center">
              <label className="text-xs text-slate-300 font-medium">Rating:</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(val => (
                  <button type="button" key={val} onClick={() => setRating(val)}
                    className={`h-6 w-6 ${rating >= val ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-300`}
                  >
                    <Star className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Textarea placeholder="Your review..." value={text} onChange={e => setText(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-white focus:ring-teal-500" rows={4} />
            </div>
            {/* Photo upload optional */}
            <Button type="submit" disabled={submitting || rating===0 || !text.trim()}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold">
              {submitting ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="bg-slate-800/40 border-slate-700 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <User className="h-4 w-4 text-teal-400" /> {reviews.length} Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6"><Loader className="h-5 w-5 animate-spin text-teal-500" /></div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-slate-400 text-xs">No reviews yet. Be the first to share!</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map(rev => (
                <li key={rev.id ?? rev.userId} className="border-b border-slate-700 pb-3 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{rev.userName}</span>
                    {renderStars(rev.rating)}
                  </div>
                  <p className="text-sm text-slate-300 mb-1">{rev.text}</p>
                  {rev.photoUrl && (
                    <img src={rev.photoUrl} alt="review" className="w-full h-40 object-cover rounded" />
                  )}
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{rev.createdAt ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                    <button onClick={() => copyReview(rev)} className="flex items-center hover:text-teal-400">
                      {copied === (rev.id ?? rev.userId) ? <CheckCircle2 className="h-3 w-3 text-teal-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

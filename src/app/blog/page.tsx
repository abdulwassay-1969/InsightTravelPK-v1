import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog | InsightTravelPK',
  description: 'Latest travel stories, guides, and updates from Pakistan.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-4">
            Travel Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the latest travel stories, destination guides, and practical tips for your next adventure in Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Coming Soon Placeholder */}
          <Card className="h-full flex flex-col hover:shadow-lg transition-shadow bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-[#0F6E56]/10 text-[#0F6E56] hover:bg-[#0F6E56]/20">Updates</Badge>
              </div>
              <CardTitle className="text-xl leading-tight">
                Exciting New Stories Coming Soon
              </CardTitle>
              <CardDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Coming Soon</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 1 min read</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground text-sm mb-6">
                We're working on gathering the most amazing travel stories and practical guides to help you explore Pakistan. Stay tuned for our first batch of articles!
              </p>
              <div className="flex items-center text-[#0F6E56] font-medium text-sm">
                Check back later <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function VendorCtaSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-slate-100/70 via-primary/5 to-slate-50/70">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-headline">
            Become A Vendor
          </h2>
          <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed">
            Become a vendor and register your hotel, event planning service or tour planning and booking service with us today to boost your business' visibility and gain lots of new customers.
          </p>
          <Link href="/partners">
            <Button className="gap-2 px-8 py-6 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90">
              Become A Vendor
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

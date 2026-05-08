"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Send, MapPin } from 'lucide-react';
import Logo from './logo';
import { Button } from './ui/button';
import { Input } from './ui/input';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Pakistan' },
  { href: '/#provinces', label: 'Explore Provinces' },
  { href: '/#destinations', label: 'Top Destinations' },
  { href: '/gallery', label: 'Traveler Gallery' },
  { href: '/planner', label: 'Smart Trip Planner' },
  { href: '/weather', label: 'Weather Updates' },
  { href: '/blog', label: 'Travel Blog' },
];

export default function Footer() {
  const provinceLinks = [
    { label: "Gilgit-Baltistan" },
    { label: "Khyber Pakhtunkhwa" },
    { label: "Punjab" },
    { label: "Sindh" },
    { label: "Balochistan" },
    { label: "Azad Kashmir" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & About */}
          <div className="flex flex-col items-start lg:pr-4">
            <Link href="/" className="flex items-center gap-3 font-bold text-2xl mb-6 text-white group">
              <div className="p-2 rounded-xl bg-primary group-hover:bg-primary/80 transition-colors">
                <Logo className="h-6 w-6 text-white" />
              </div>
              <span className="tracking-tight">InsightTravelPK</span>
            </Link>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Your ultimate guide to discovering the untold beauty, rich culture, and breathtaking landscapes of Pakistan. Let the adventure begin.
            </p>
            <div className="flex gap-4" aria-label="Social links coming soon">
              <button type="button" disabled title="Coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-70 cursor-not-allowed">
                <Instagram className="w-5 h-5" />
              </button>
              <button type="button" disabled title="Coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-70 cursor-not-allowed">
                <Facebook className="w-5 h-5" />
              </button>
              <button type="button" disabled title="Coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-70 cursor-not-allowed">
                <Twitter className="w-5 h-5" />
              </button>
              <button type="button" disabled title="Coming soon" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center opacity-70 cursor-not-allowed">
                <Youtube className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h3>
            <ul className="space-y-3 font-medium">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Provinces */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Top Regions</h3>
            <ul className="space-y-3 font-medium">
              {provinceLinks.map((province) => (
                <li key={province.label}>
                  <Link href="/#provinces" className="hover:text-primary transition-colors flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" /> {province.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Stay Inspired</h3>
            <p className="text-slate-400 mb-6 font-medium">
              Newsletter signup is coming soon. For now, use the planner and destination pages to start your trip.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Your email address" 
                disabled
                className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 h-12 focus-visible:ring-primary opacity-70 cursor-not-allowed"
              />
              <Button type="submit" disabled className="w-full h-12 gap-2 bg-primary/70 text-white font-bold cursor-not-allowed">
                Coming Soon <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
          <p>© {new Date().getFullYear()} InsightTravelPK. Crafted with love for Pakistan.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

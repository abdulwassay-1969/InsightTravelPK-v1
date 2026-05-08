"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, Search, Home, Map,
  ImageIcon, Compass, CloudSun, Target, BookOpen, Info, Camera, ShieldCheck, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import Logo from './logo';

const primaryNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/#provinces', label: 'Provinces', icon: Compass },
  { href: '/map', label: 'Map', icon: Map },
  { href: '/virtual-tour', label: 'Tours', icon: Camera },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/weather', label: 'Weather', icon: CloudSun },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/about', label: 'About', icon: Info },
];

const utilityLinks = [
  { href: '/partners', label: 'Partners', icon: Target },
  { href: '/pro/login', label: 'Pro', icon: Target },
  { href: '/admin/login', label: 'Admin', icon: ShieldCheck },
];

import { useAuth } from './auth-context';

import { AuthDialog } from './auth-dialog';

export default function Header() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    ...primaryNavLinks,
    ...(user ? [{ href: '/saved-trips', label: 'My Trips', icon: ImageIcon }] : []),
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ease-in-out px-4 py-4',
      )}
    >
      <AuthDialog isOpen={isAuthDialogOpen} onClose={() => setIsAuthDialogOpen(false)} />
      <div className={cn(
        "container mx-auto rounded-3xl transition-all duration-500 border overflow-hidden shadow-2xl ",
        isScrolled
          ? "bg-[#003D5B]/85 backdrop-blur-xl border-white/20 h-16"
          : isHomePage
            ? "bg-white/10 backdrop-blur-md border-white/20 h-20"
            : "bg-white/90 backdrop-blur-md border-[#30638E]/25 h-20"
      )}>
        <div className="flex h-full items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <div className={cn(
              "p-2 rounded-xl border transition-all duration-500",
              isScrolled ? "bg-primary border-primary/20" : "bg-white border-white/20"
            )}>
              <Logo className={cn('h-5 w-5', isScrolled ? 'text-white' : 'text-slate-900')} />
            </div>
            <span className={cn(
              'text-xl font-bold tracking-tighter transition-colors',
              isScrolled ? 'text-white' : isHomePage ? 'text-white' : 'text-slate-900'
            )}>
              InsightTravelPK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                    isScrolled
                      ? 'text-[#74AFDB] hover:text-white hover:bg-white/10'
                      : isHomePage
                        ? 'text-white/80 hover:text-white hover:bg-white/20'
                        : 'text-[#003D5B] hover:text-[#00798C] hover:bg-[#74AFDB]/15'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={() => logout()}
                  variant="ghost"
                  className={cn(
                    "rounded-full font-semibold transition-all",
                    isScrolled ? "text-white hover:bg-white/10" : isHomePage ? "text-white hover:bg-white/20" : "text-[#003D5B] hover:bg-[#74AFDB]/15"
                  )}
                >
                  Logout
                </Button>
              ) : (
                <div
                  className={cn(
                    "group relative w-[108px] overflow-hidden rounded-full border px-2 py-1 transition-all duration-300 hover:w-[292px] focus-within:w-[292px]",
                    isScrolled
                      ? "border-white/15 bg-white/5"
                      : isHomePage
                        ? "border-white/15 bg-white/10"
                        : "border-[#30638E]/15 bg-[#74AFDB]/10"
                  )}
                >
                  <button
                    onClick={() => setIsAuthDialogOpen(true)}
                    className={cn(
                      "flex items-center justify-center w-full rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 group-hover:opacity-0 group-focus-within:opacity-0",
                      isScrolled
                        ? "text-white/85"
                        : isHomePage
                          ? "text-white/90"
                          : "text-[#003D5B]"
                    )}
                  >
                    Login
                  </button>

                  <div className="absolute inset-0 flex items-center gap-1 px-2 py-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    {utilityLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                          isScrolled
                            ? "text-white/80 hover:bg-white/10 hover:text-white"
                            : isHomePage
                              ? "text-white/85 hover:bg-white/15 hover:text-white"
                              : "text-[#003D5B] hover:bg-white hover:text-[#00798C]"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <button 
                      onClick={() => setIsAuthDialogOpen(true)}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                        isScrolled ? "text-white/80 hover:bg-white/10" : isHomePage ? "text-white/85 hover:bg-white/15" : "text-[#003D5B] hover:bg-white"
                      )}
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}

              <Button
                asChild
                className={cn(
                  "rounded-full font-bold shadow-md transition-all",
                  isScrolled
                    ? "bg-primary text-white hover:bg-primary/90"
                    : isHomePage
                      ? "bg-white text-primary hover:bg-neutral-100"
                      : "bg-primary text-white hover:bg-primary/90"
                )}
              >
                <Link href="/planner">Plan Your Trip</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-11 w-11",
                isScrolled
                  ? "text-white hover:bg-white/10"
                  : isHomePage
                    ? "text-white hover:bg-white/10"
                    : "text-[#003D5B] hover:bg-[#74AFDB]/15"
              )}
            >
              <Link href="/map" aria-label="Open map page">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full h-11 w-11 border",
                    isScrolled
                      ? "bg-white/10 border-white/20 text-white"
                      : isHomePage
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-[#74AFDB]/15 border-[#30638E]/25 text-[#003D5B]"
                  )}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent title="Navigation menu" side="right" className="w-[85%] sm:max-w-xs bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 p-0 text-white">
                <div className="flex flex-col h-full">
                  <div className="p-8 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary">
                        <Logo className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold tracking-tighter">InsightTravelPK</span>
                    </Link>
                  </div>

                  <div className="border-b border-white/10 px-4 py-5">
                    <p className="px-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Explore
                    </p>
                    <nav className="mt-3 space-y-2">
                      {primaryNavLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                          >
                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                              <link.icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                    </nav>
                  </div>

                  <div className="flex-1 overflow-y-auto py-5 px-4">
                    <p className="px-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                      Access
                    </p>
                    <div className="mt-3 space-y-2">
                      {utilityLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                          >
                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                              <link.icon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            {link.label}
                          </Link>
                        </SheetClose>
                      ))}
                      {!user && (
                        <Button
                          onClick={() => setIsAuthDialogOpen(true)}
                          variant="ghost"
                          className="w-full flex items-center justify-start gap-4 px-5 py-7 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                        >
                          <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                            <LogIn className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                          </div>
                          Login / Register
                        </Button>
                      )}
                      {user && (
                        <Button
                          onClick={() => logout()}
                          variant="ghost"
                          className="w-full flex items-center justify-start gap-4 px-5 py-7 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-red-400 active:scale-95 group"
                        >
                          <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-red-500/20 transition-colors">
                            <LogIn className="h-5 w-5 text-slate-500 group-hover:text-red-400 transition-colors" />
                          </div>
                          Logout
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="p-8 mt-auto border-t border-white/10 bg-black/40 text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] mb-6">
                      Truly Pakistan
                    </p>
                    <SheetClose asChild>
                      <Button asChild className="w-full py-7 rounded-2xl bg-primary hover:bg-primary/90 text-white font-extrabold text-lg shadow-2xl shadow-primary/30 active:scale-[0.98] transition-transform">
                        <Link href="/planner">Plan Your Trip</Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

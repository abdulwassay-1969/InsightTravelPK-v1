"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu, Search, Home, Map,
  ImageIcon, Compass, CloudSun, BookOpen, Info, Camera, LogIn, Users
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
  { href: '/partners', label: 'Partners', icon: Users },
];

const utilityLinks: { href: string; label: string; icon?: any }[] = [];

import { useAuth } from './auth-context';

export default function Header() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ease-in-out px-4 py-4',
      )}
    >
      <div className={cn(
        "container mx-auto rounded-3xl transition-all duration-500 border overflow-visible shadow-2xl ",
        isScrolled
          ? "bg-[#003D5B]/85 backdrop-blur-xl border-white/20 h-16"
          : isHomePage
            ? "bg-white/10 backdrop-blur-md border-white/20 h-20"
            : "bg-white/90 backdrop-blur-md border-[#30638E]/25 h-20"
      )}>
        <div className="flex h-full items-center justify-between px-4 md:px-6">
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
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-0">
              {primaryNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-2 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap',
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

            <div className="flex items-center gap-2">
              {user ? (
                <div className="group relative">
                  <button
                    aria-label="User menu"
                    className={cn(
                      "flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-all",
                      isScrolled
                        ? "text-white hover:bg-white/10"
                        : isHomePage
                          ? "text-white hover:bg-white/10"
                          : "text-[#003D5B] hover:bg-[#74AFDB]/15"
                    )}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full object-cover ring-2 ring-white/20" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-700">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline">{user.displayName || user.email?.split('@')[0]}</span>
                  </button>
                  <div className="absolute right-0 top-full z-50 hidden pt-2 group-hover:block group-focus-within:block">
                    <div
                      className={cn(
                        "min-w-[190px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl",
                        isScrolled
                          ? "border-white/10 bg-[#042835]/95 text-white"
                          : isHomePage
                            ? "border-white/10 bg-[#0c2f42]/95 text-white"
                            : "border-slate-200 bg-white/95 text-slate-900"
                      )}
                    >
                      <div className="border-b border-white/10 px-4 py-3">
                        <p className="text-sm font-semibold">{user.displayName || 'Traveler'}</p>
                        <p className={cn("text-xs", isScrolled || isHomePage ? "text-white/65" : "text-slate-500")}>
                          {user.email}
                        </p>
                      </div>
                      <nav className="flex flex-col p-2">
                        <Link
                          href="/saved-trips"
                          className={cn(
                            "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                            isScrolled || isHomePage
                              ? "hover:bg-white/10"
                              : "hover:bg-slate-100"
                          )}
                        >
                          Saved Plans
                        </Link>
                        <button
                          type="button"
                          onClick={() => logout()}
                          className={cn(
                            "rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors",
                            isScrolled || isHomePage
                              ? "hover:bg-white/10 hover:text-red-300"
                              : "hover:bg-red-50 hover:text-red-600"
                          )}
                        >
                          Logout
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "group relative w-[124px] overflow-hidden rounded-full border px-2 py-1 transition-all duration-500 ease-out hover:w-[320px] focus-within:w-[320px]",
                    isScrolled
                      ? "border-white/15 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                      : isHomePage
                        ? "border-white/15 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
                        : "border-[#30638E]/15 bg-[#74AFDB]/10 shadow-[0_8px_24px_rgba(48,99,142,0.12)]"
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-0",
                      isScrolled
                        ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]"
                        : isHomePage
                          ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]"
                          : "bg-[radial-gradient(circle_at_top_left,rgba(116,175,219,0.22),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.78),rgba(226,240,251,0.92))]"
                    )}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-1 left-[18px] w-20 rounded-full border border-current/10 opacity-0 blur-[1px] transition-all duration-500 group-hover:left-[92px] group-hover:opacity-100 group-focus-within:left-[92px] group-focus-within:opacity-100"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-white/20 blur-2xl opacity-0 transition-all duration-500 group-hover:left-8 group-hover:opacity-100 group-focus-within:left-8 group-focus-within:opacity-100"
                  />
                  <Link href="/login"
                    className={cn(
                      "relative z-10 flex items-center justify-center w-full rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 group-hover:-translate-x-6 group-hover:opacity-0 group-focus-within:-translate-x-6 group-focus-within:opacity-0",
                      isScrolled
                        ? "text-white/85"
                        : isHomePage
                          ? "text-white/90"
                          : "text-[#003D5B]"
                    )}
                  >
                    Login
                  </Link>

                  <div className="absolute inset-0 z-10 flex items-center justify-between gap-3 px-3 py-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                          isScrolled
                            ? "border-white/15 bg-white/10 text-white"
                            : isHomePage
                              ? "border-white/20 bg-white/15 text-white"
                              : "border-[#30638E]/15 bg-white/70 text-[#003D5B]"
                        )}
                      >
                        <LogIn className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-sm font-semibold leading-none",
                            isScrolled ? "text-white" : isHomePage ? "text-white" : "text-[#003D5B]"
                          )}
                        >
                          Member Access
                        </p>
                        <p
                          className={cn(
                            "truncate text-[11px] leading-none mt-1",
                            isScrolled
                              ? "text-white/60"
                              : isHomePage
                                ? "text-white/70"
                                : "text-[#30638E]"
                          )}
                        >
                          Secure login
                        </p>
                      </div>
                    </div>
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
                    <Link href="/login"
                      className={cn(
                        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]",
                        isScrolled
                          ? "bg-white text-[#003D5B] hover:bg-white/90"
                          : isHomePage
                            ? "bg-white text-primary hover:bg-white/90"
                            : "bg-[#003D5B] text-white hover:bg-[#005173]"
                      )}
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}

              <Button
                asChild
                className={cn(
                  "rounded-full font-bold shadow-md transition-all text-sm whitespace-nowrap px-4 py-2",
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
                        <SheetClose asChild>
                          <Link href="/login"
                            className="w-full flex items-center justify-start gap-4 px-5 py-7 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                          >
                            <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                              <LogIn className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                            </div>
                            Login / Register
                          </Link>
                        </SheetClose>
                      )}
                      {user && (
                        <>
                          <SheetClose asChild>
                            <Link
                              href="/saved-trips"
                              className="w-full flex items-center justify-start gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-slate-400 transition-all hover:bg-white/5 hover:text-white active:scale-95 group"
                            >
                              <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                                <ImageIcon className="h-5 w-5 text-slate-500 group-hover:text-primary transition-colors" />
                              </div>
                              Saved Plans
                            </Link>
                          </SheetClose>
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
                        </>
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

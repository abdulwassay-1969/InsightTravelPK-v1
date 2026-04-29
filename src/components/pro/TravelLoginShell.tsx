"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Compass, MapPinned, Mountain, Orbit, ShieldCheck } from "lucide-react";
import Logo from "@/components/logo";

type TravelLoginShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  leadBadgeText?: string;
  heroTitle?: string;
  heroDescription?: string;
  accentClassName: string;
  accentSoftClassName: string;
  panelGlowClassName: string;
  switchLabel: string;
  switchHref: string;
  switchText: string;
  credentialTitle: string;
  credentialText: string;
  stats: Array<{ label: string; value: string }>;
  children: ReactNode;
};

export default function TravelLoginShell({
  eyebrow,
  title,
  description,
  leadBadgeText = "Travel Access",
  heroTitle = "Step into a smarter travel control deck.",
  heroDescription = "Built for modern travel workflows with shared supplier data, route signals, and immersive Pakistan destination planning.",
  accentClassName,
  accentSoftClassName,
  panelGlowClassName,
  switchLabel,
  switchHref,
  switchText,
  credentialTitle,
  credentialText,
  stats,
  children,
}: TravelLoginShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4efe7] px-4 py-32 text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute left-[8%] top-[16%] h-48 w-48 rounded-full blur-3xl ${panelGlowClassName}`} />
        <div className="absolute right-[10%] top-[22%] h-64 w-64 rounded-full bg-[#74AFDB]/20 blur-3xl" />
        <div className="absolute bottom-[8%] left-[18%] h-56 w-56 rounded-full bg-[#00798C]/12 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-72 bg-[radial-gradient(circle_at_bottom,rgba(0,61,91,0.16),transparent_55%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="relative hidden min-h-[680px] overflow-hidden rounded-[2.5rem] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(231,243,247,0.88))] p-10 shadow-[0_30px_90px_rgba(0,61,91,0.14)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.15),transparent)]" />
          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl ${accentClassName}`}>
                <Logo className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">PakVista</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{eyebrow}</p>
              </div>
            </div>

            <div className="mt-14 max-w-xl">
              <p className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] ${accentSoftClassName}`}>
                {leadBadgeText}
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900">
                {heroTitle}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
                {heroDescription}
              </p>
            </div>

            <div className="relative mt-14 flex-1 [perspective:1600px]">
              <div className="absolute left-0 top-4 h-52 w-[74%] rounded-[2rem] border border-white/70 bg-[linear-gradient(155deg,rgba(0,61,91,0.96),rgba(0,121,140,0.88))] p-6 text-white shadow-[0_28px_60px_rgba(0,61,91,0.25)] [transform:rotateX(14deg)_rotateY(-14deg)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/65">Journey Layer</p>
                    <p className="mt-3 text-2xl font-semibold">Northbound itineraries</p>
                  </div>
                  <Mountain className="h-9 w-9 text-white/80" />
                </div>
                <div className="mt-10 grid grid-cols-3 gap-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                      <p className="text-xl font-semibold">{stat.value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/65">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute right-4 top-32 w-[44%] rounded-[1.8rem] border border-white/80 bg-white/88 p-5 shadow-[0_24px_50px_rgba(0,61,91,0.12)] backdrop-blur [transform:rotateX(10deg)_rotateY(18deg)]">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-white ${accentClassName}`}>
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Experience</p>
                    <p className="text-sm font-semibold text-slate-900">Live travel intelligence</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4 text-[#00798C]" />
                    Province-aware partner access
                  </div>
                  <div className="flex items-center gap-2">
                    <Orbit className="h-4 w-4 text-[#00798C]" />
                    Shared supply and route visibility
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#00798C]" />
                    Role-based workspace control
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-10 w-[52%] rounded-[1.8rem] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(240,247,249,0.88))] p-6 shadow-[0_24px_50px_rgba(0,61,91,0.10)] [transform:rotateX(8deg)_rotateY(-10deg)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Flight Path</p>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">From discovery to booking</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Designed to feel like a premium travel command lounge instead of a plain utility form.
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${accentClassName}`}>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative">
          <div className="absolute inset-0 rounded-[2.5rem] bg-white/45 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(249,249,248,0.92))] p-6 shadow-[0_28px_70px_rgba(0,61,91,0.14)] backdrop-blur md:p-8">
            <div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.6),transparent)]" />
            <div className="relative">
              <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentSoftClassName}`}>{eyebrow}</p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
              <p className="mt-4 text-sm text-slate-600">
                {switchLabel}{" "}
                <Link href={switchHref} className={`font-semibold ${accentSoftClassName}`}>
                  {switchText}
                </Link>
                .
              </p>
            </div>

            <div className="relative mt-8">{children}</div>

            <div className="relative mt-8 rounded-[1.6rem] border border-white/80 bg-[linear-gradient(180deg,rgba(247,250,251,0.96),rgba(255,255,255,0.9))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">{credentialTitle}</p>
              <p className="mt-3 text-sm font-medium text-slate-700">{credentialText}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

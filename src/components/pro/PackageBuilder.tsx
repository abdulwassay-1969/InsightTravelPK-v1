"use client";

import { useMemo, useState } from "react";
import type { Region, PackageItineraryDay } from "@/lib/pro/types";

const DESTINATIONS: Region[] = [
  "Islamabad Capital Territory",
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Gilgit-Baltistan",
  "Azad Kashmir",
];

const DURATIONS = [3, 5, 7, 10, 14] as const;

function buildItinerary(destination: Region, days: number): PackageItineraryDay[] {
  return Array.from({ length: days }, (_, idx) => {
    const day = idx + 1;
    return {
      day,
      title: `Day ${day} - ${destination} Experience`,
      activities: [
        "Arrival and transfer",
        "Guided local sightseeing",
        "Cultural food and market walk",
      ],
    };
  });
}

export default function PackageBuilder() {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState<Region>("Gilgit-Baltistan");
  const [duration, setDuration] = useState<number>(7);
  const [agencyName, setAgencyName] = useState("InsightTravelPK Partner Agency");
  const [logo, setLogo] = useState("Logo Placeholder");

  const itinerary = useMemo(() => buildItinerary(destination, duration), [destination, duration]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs uppercase tracking-wide text-violet-600 dark:text-violet-400">Package Builder</p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">Create Agent-ready Itinerary</h3>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={[
              "rounded-full border px-2.5 py-1",
              step === s
                ? "border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
                : "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400",
            ].join(" ")}
          >
            Step {s}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-2 block text-sm font-medium">Select destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value as Region)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
          >
            {DESTINATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <label className="mb-2 block text-sm font-medium">Select duration</label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={[
                  "rounded-lg border px-3 py-1.5 text-sm",
                  duration === d
                    ? "border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
                    : "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
                ].join(" ")}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-sm font-semibold">Auto-generated itinerary</h4>
          <ul className="mt-3 space-y-3">
            {itinerary.map((day) => (
              <li key={day.day} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <p className="font-medium">{day.title}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{day.activities.join(" • ")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 4 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Agency name</label>
              <input
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Logo</label>
              <input
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              />
            </div>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h4 className="text-sm font-semibold">Preview</h4>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{agencyName}</p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">{logo}</p>
          <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
            {destination} • {duration} days
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Export as PDF (Print)
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
          disabled={step === 1}
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(5, s + 1))}
          className="rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-violet-700"
          disabled={step === 5}
        >
          Next
        </button>
      </div>
    </div>
  );
}

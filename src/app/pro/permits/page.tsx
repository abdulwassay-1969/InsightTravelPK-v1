"use client";

import { useEffect, useMemo, useState } from "react";
import { MOCK_PERMITS } from "@/lib/pro/mockData";
import type { Permit } from "@/lib/pro/types";

export default function ProPermitsPage() {
  const [permits, setPermits] = useState<Permit[]>(MOCK_PERMITS);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/pro/permits", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Permit[]) => {
        if (mounted && Array.isArray(data) && data.length) {
          setPermits(data);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const filtered = permits.filter((permit) => {
      const q = search.toLowerCase();
      return (
        permit.name.toLowerCase().includes(q) ||
        permit.region.toLowerCase().includes(q)
      );
    });

    return filtered.reduce<Record<string, typeof filtered>>((acc, permit) => {
      if (!acc[permit.region]) acc[permit.region] = [];
      acc[permit.region].push(permit);
      return acc;
    }, {});
  }, [permits, search]);

  const regions = Object.keys(grouped);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Permits and NOC Requirements</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Search permits by name or region.</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by permit name or region"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      />

      <div className="space-y-5">
        {regions.map((region) => (
          <section key={region}>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
              {region}
            </h3>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {grouped[region].map((permit) => (
                <article key={permit.id} className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{permit.name}</h4>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Issuing body: {permit.issuingBody}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Processing: {permit.processingDays}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Cost: {permit.cost}</p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Required for: {permit.requiredFor}</p>
                  {permit.notes ? (
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Notes: {permit.notes}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

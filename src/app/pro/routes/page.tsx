"use client";

import { useEffect, useMemo, useState } from "react";
import RouteStatusBadge from "@/components/pro/RouteStatusBadge";
import { MOCK_ROUTES } from "@/lib/pro/mockData";
import type { RouteCondition, RouteStatus } from "@/lib/pro/types";

const FILTERS: Array<"all" | RouteStatus> = ["all", "open", "restricted", "closed", "seasonal"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProRoutesPage() {
  const [routes, setRoutes] = useState<RouteCondition[]>(MOCK_ROUTES);
  const [status, setStatus] = useState<(typeof FILTERS)[number]>("all");

  useEffect(() => {
    let mounted = true;
    fetch("/api/pro/routes", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: RouteCondition[]) => {
        if (mounted && Array.isArray(data) && data.length) {
          setRoutes(data);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    return routes.filter((route) => (status === "all" ? true : route.status === status));
  }, [routes, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Route Conditions</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track road status before confirming itineraries.</p>
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as (typeof FILTERS)[number])}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3 font-semibold">Route name</th>
              <th className="px-4 py-3 font-semibold">From</th>
              <th className="px-4 py-3 font-semibold">To</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Last updated</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((route) => (
              <tr key={route.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{route.name}</td>
                <td className="px-4 py-3">{route.from}</td>
                <td className="px-4 py-3">{route.to}</td>
                <td className="px-4 py-3">
                  <RouteStatusBadge status={route.status} />
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatDate(route.lastUpdated)}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{route.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

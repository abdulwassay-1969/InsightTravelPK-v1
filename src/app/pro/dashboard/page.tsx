import {
  PRO_METRICS,
} from "@/lib/pro/mockData";
import MetricCard from "@/components/pro/MetricCard";
import RouteStatusBadge from "@/components/pro/RouteStatusBadge";
import { getPermits, getRoutes, getSuppliers } from "@/lib/pro/supabase";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ProDashboardPage() {
  const [suppliers, routes, permits] = await Promise.all([
    getSuppliers(),
    getRoutes(),
    getPermits(),
  ]);

  const topSuppliers = suppliers.filter((s) => s.verified).slice(0, 3);
  const topRoutes = routes.slice(0, 5);
  const topPermits = permits.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 md:text-2xl">
          Dashboard Overview
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Start with verified suppliers, then move to routes and permits before publishing anything new.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Verified Suppliers" value={PRO_METRICS.verifiedSuppliers} />
        <MetricCard label="Open Routes" value={PRO_METRICS.openRoutesLabel} />
        <MetricCard label="Packages Built" value={PRO_METRICS.packagesBuilt} />
        <MetricCard label="Avg Supplier Response" value={PRO_METRICS.avgSupplierResponse} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Top Verified Suppliers</h3>
          <ul className="mt-3 space-y-3">
            {topSuppliers.map((supplier) => (
              <li key={supplier.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.name}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {supplier.type} • {supplier.region}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Route Conditions</h3>
          <ul className="mt-3 space-y-3">
            {topRoutes.map((route) => (
              <li key={route.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{route.name}</p>
                  <RouteStatusBadge status={route.status} />
                </div>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {route.from} to {route.to}
                </p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Permits Quick View</h3>
          <ul className="mt-3 space-y-3">
            {topPermits.map((permit) => (
              <li key={permit.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{permit.name}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {permit.issuingBody} • {permit.processingDays}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Latest Route Update</h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Last synced: {formatDate(routes[0]?.lastUpdated ?? new Date().toISOString())}
        </p>
      </section>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgency, getSupplierById } from "@/lib/pro/supabase";

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supplier, agency] = await Promise.all([getSupplierById(id), getAgency()]);
  if (!supplier) notFound();

  const isStarter = agency.plan === "starter";

  return (
    <div className="space-y-4">
      <div>
        <Link href="/pro/suppliers" className="text-sm text-violet-700 hover:underline dark:text-violet-300">
          Back to suppliers
        </Link>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{supplier.name}</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {supplier.type} • {supplier.region}
          {supplier.district ? ` • ${supplier.district}` : ""}
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Status</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.status}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Location</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.location || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Pricing Tier</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.pricingTier}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Contact Person</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.contactPerson || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Languages</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{supplier.languages.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Contact</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {isStarter ? <span className="blur-[2px] select-none">{supplier.contactPrivate}</span> : supplier.contactPrivate}
            </dd>
          </div>
        </dl>

        {supplier.description ? (
          <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">About</p>
            <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{supplier.description}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

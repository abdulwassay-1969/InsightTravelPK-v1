import Link from "next/link";
import type { Supplier } from "@/lib/pro/types";

type SupplierCardProps = {
  supplier: Supplier;
  isStarterPlan?: boolean;
};

function typeLabel(type: Supplier["type"]) {
  if (type === "city-tours") return "city tours";
  if (type === "trekking-operator") return "trekking operator";
  if (type === "guesthouse") return "guesthouse";
  return type;
}

export default function SupplierCard({ supplier, isStarterPlan = false }: SupplierCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link
            href={`/pro/suppliers/${supplier.id}`}
            className="text-sm font-semibold text-zinc-900 hover:text-violet-700 dark:text-zinc-100 dark:hover:text-violet-300"
          >
            {supplier.name}
          </Link>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            {typeLabel(supplier.type)}
          </p>
        </div>

        <span
          className={[
            "inline-flex h-2.5 w-2.5 rounded-full",
            supplier.verified ? "bg-emerald-500" : "bg-amber-500",
          ].join(" ")}
          title={supplier.verified ? "Verified" : "Pending"}
        />
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
          {supplier.region}
        </span>
        {supplier.district ? (
          <span className="rounded-full bg-sky-100 px-2 py-1 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
            {supplier.district}
          </span>
        ) : null}
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {supplier.status}
        </span>
      </div>

      {supplier.location ? (
        <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">Location: {supplier.location}</p>
      ) : null}

      {supplier.description ? (
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{supplier.description}</p>
      ) : null}

      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
        Languages: {supplier.languages.join(", ")}
      </p>

      <div className="mt-4">
        <button
          type="button"
          className={[
            "inline-flex w-full items-center justify-center rounded-lg border px-3 py-2 text-xs font-semibold",
            "border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200",
            "hover:bg-zinc-100 dark:hover:bg-zinc-800",
          ].join(" ")}
        >
          {isStarterPlan ? (
            <span className="blur-[2px] select-none">{supplier.contactPrivate}</span>
          ) : (
            supplier.contactPrivate
          )}
        </button>
      </div>
    </article>
  );
}

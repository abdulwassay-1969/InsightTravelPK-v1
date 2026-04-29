import Link from "next/link";
import PackageBuilder from "@/components/pro/PackageBuilder";

export default function ProPackagesPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Package Builder</h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Select destination and duration to generate itinerary drafts.
          </p>
        </div>
        <Link
          href="/pro/packages/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
        >
          Open Full Wizard
        </Link>
      </div>

      <PackageBuilder />
    </div>
  );
}

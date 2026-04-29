import PackageBuilder from "@/components/pro/PackageBuilder";

export default function ProNewPackagePage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Create New Package</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Follow the 5-step wizard to generate and export client-ready itinerary proposals.
        </p>
      </div>

      <PackageBuilder />
    </div>
  );
}

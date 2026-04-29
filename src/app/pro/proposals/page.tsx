import { getPackages } from "@/lib/pro/supabase";

export default async function ProProposalsPage() {
  const packages = await getPackages();
  const proposals = packages.map((pkg, idx) => ({
    id: `prop-${idx + 1}`,
    title: `${pkg.title} Proposal`,
    destination: pkg.destination,
    duration: pkg.duration,
    updatedAt: pkg.createdAt,
    status: idx % 2 === 0 ? "draft" : "sent",
  }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Saved Client Proposals</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Manage draft and sent package proposals.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Destination</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{proposal.title}</td>
                <td className="px-4 py-3">{proposal.destination}</td>
                <td className="px-4 py-3">{proposal.duration} days</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-violet-100 px-2 py-1 text-[11px] font-semibold uppercase text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                    {proposal.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {new Date(proposal.updatedAt).toLocaleDateString("en-PK")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string | number;
  trend?: string;
};

export default function MetricCard({ label, value, trend }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
      {trend ? (
        <p className="mt-1 text-xs text-violet-600 dark:text-violet-400">{trend}</p>
      ) : null}
    </article>
  );
}

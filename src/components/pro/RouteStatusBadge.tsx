import type { RouteStatus } from "@/lib/pro/types";

type RouteStatusBadgeProps = {
  status: RouteStatus;
};

const statusStyles: Record<RouteStatus, string> = {
  open: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  restricted: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  closed: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  seasonal: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
};

export default function RouteStatusBadge({ status }: RouteStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        statusStyles[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}

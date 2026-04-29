import Link from "next/link";
import PortalLogoutButton from "@/components/pro/PortalLogoutButton";

type ProTopbarProps = {
  agencyName: string;
  plan: "starter" | "pro" | "enterprise";
};

const planStyles: Record<ProTopbarProps["plan"], string> = {
  starter:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200",
  pro: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  enterprise:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
};

export default function ProTopbar({ agencyName, plan }: ProTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/90 dark:supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Agency Workspace
          </p>
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 md:text-base">
            {agencyName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="text-sm font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            Admin login
          </Link>
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              planStyles[plan],
            ].join(" ")}
          >
            {plan} Plan
          </span>
          <PortalLogoutButton
            redirectTo="/pro/login"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          />
        </div>
      </div>
    </header>
  );
}

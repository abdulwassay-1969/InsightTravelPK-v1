import Link from "next/link";

export default function AdminForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
          Access denied
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          This area is for platform admins only
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Agency users should use the Pro workspace. Platform management tools live in the separate admin portal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/pro/dashboard"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Go to agency portal
          </Link>
          <Link
            href="/admin/login"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            Admin login
          </Link>
        </div>
      </div>
    </div>
  );
}

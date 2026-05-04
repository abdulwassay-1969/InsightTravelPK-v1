"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRO_ADMIN_CREDENTIALS } from "@/lib/pro/auth";
import { loginAction } from "@/app/actions/auth";
import TravelLoginShell from "@/components/pro/TravelLoginShell";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>(PRO_ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState<string>(PRO_ADMIN_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("type", "admin");

      const result = await loginAction(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(searchParams.get("from") || "/admin");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TravelLoginShell
      eyebrow="InsightTravelPK Admin"
      title="Travel Control Tower"
      description="Review partner applications, manage marketplace supply, and keep routes and permits synchronized from one elevated admin deck."
      accentClassName="bg-[linear-gradient(135deg,#14532d,#059669)]"
      accentSoftClassName="text-emerald-600"
      panelGlowClassName="bg-emerald-500/18"
      switchLabel="Agency user?"
      switchHref="/pro/login"
      switchText="Use agency login"
      credentialTitle="Admin credentials"
      credentialText={`${PRO_ADMIN_CREDENTIALS.email} / ${PRO_ADMIN_CREDENTIALS.password}`}
      stats={[
        { label: "Queue", value: "12" },
        { label: "Routes", value: "44" },
        { label: "Permits", value: "18" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/20 transition focus:ring"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-emerald-500/20 transition focus:ring"
            required
          />
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[linear-gradient(135deg,#14532d,#059669)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(5,150,105,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_46px_rgba(5,150,105,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Opening control tower..." : "Enter Admin Portal"}
        </button>
      </form>
    </TravelLoginShell>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PRO_DEMO_CREDENTIALS,
  PRO_ROLE_COOKIE,
  PRO_SESSION_COOKIE,
  isValidAgentLogin,
} from "@/lib/pro/auth";
import TravelLoginShell from "@/components/pro/TravelLoginShell";

export default function ProLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>(PRO_DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState<string>(PRO_DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isValid = isValidAgentLogin(email, password);

      if (!isValid) {
        setError("Invalid agency credentials. Use the provided agency demo account.");
        return;
      }

      document.cookie = `${PRO_SESSION_COOKIE}=demo; Path=/; Max-Age=86400; SameSite=Lax`;
      document.cookie = `${PRO_ROLE_COOKIE}=agent; Path=/; Max-Age=86400; SameSite=Lax`;
      router.push(searchParams.get("from") || "/pro/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <TravelLoginShell
      eyebrow="PakVista Pro"
      title="Agency Travel Deck"
      description="Access suppliers, routes, permits, and itinerary tools through a modern B2B workspace made for fast-moving travel teams."
      accentClassName="bg-[linear-gradient(135deg,#0b7285,#00798C)]"
      accentSoftClassName="text-[#00798C]"
      panelGlowClassName="bg-[#00798C]/18"
      switchLabel="Platform admin?"
      switchHref="/admin/login"
      switchText="Use admin login"
      credentialTitle="Agency demo credentials"
      credentialText={`${PRO_DEMO_CREDENTIALS.email} / ${PRO_DEMO_CREDENTIALS.password}`}
      stats={[
        { label: "Regions", value: "08" },
        { label: "Partners", value: "214" },
        { label: "Routes", value: "44" },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
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
          className="w-full rounded-2xl bg-[linear-gradient(135deg,#0b7285,#00798C)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,121,140,0.28)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_46px_rgba(0,121,140,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Opening workspace..." : "Enter Pro Workspace"}
        </button>
      </form>
    </TravelLoginShell>
  );
}

"use client";

import { useMemo, useState } from "react";
import { getDistrictOptionsForRegion } from "@/lib/partners";
import { PRO_REGIONS } from "@/lib/pro/mockData";
import type { Region, SupplierType } from "@/lib/pro/types";
import TravelLoginShell from "@/components/pro/TravelLoginShell";

const PARTNER_TYPES: SupplierType[] = [
  "hotel",
  "guesthouse",
  "restaurant",
  "cafe",
  "guide",
  "transport",
  "activity",
  "city-tours",
  "trekking-operator",
];

export default function PartnersPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState<SupplierType>("hotel");
  const [region, setRegion] = useState<Region>("Punjab");
  const [district, setDistrict] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const districtOptions = useMemo(() => getDistrictOptionsForRegion(region), [region]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/partners/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          region,
          district,
          location,
          description,
          contactPerson,
          phone,
          email,
          website,
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setSuccess(data.message || "Application submitted.");
      setName("");
      setType("hotel");
      setRegion("Punjab");
      setDistrict("");
      setLocation("");
      setDescription("");
      setContactPerson("");
      setPhone("");
      setEmail("");
      setWebsite("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <TravelLoginShell
      eyebrow="PakVista Partners"
      title="Travel Partner Gateway"
      description="Bring your hotel, guesthouse, cafe, restaurant, guide service, or activity brand into the PakVista network and get discovered across destination pages."
      leadBadgeText="Partner Onboarding"
      heroTitle="Launch your travel business into the spotlight."
      heroDescription="Designed for modern tourism brands that want a premium presence, admin-reviewed publishing, and visibility across both agency tools and public destination discovery."
      accentClassName="bg-[linear-gradient(135deg,#003D5B,#00798C)]"
      accentSoftClassName="text-[#00798C]"
      panelGlowClassName="bg-[#003D5B]/18"
      switchLabel="Already in the network?"
      switchHref="/pro/login"
      switchText="Open Pro login"
      credentialTitle="How partner onboarding works"
      credentialText="Apply here, get reviewed by admin, and once approved your listing goes live across PakVista."
      stats={[
        { label: "Types", value: "09" },
        { label: "Regions", value: "08" },
        { label: "Reach", value: "Public" },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Business name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Serena Hunza Guesthouse"
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Partner type</label>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as SupplierType)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
            >
              {PARTNER_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Province</label>
            <select
              value={region}
              onChange={(event) => {
                setRegion(event.target.value as Region);
                setDistrict("");
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
            >
              {PRO_REGIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">District</label>
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
              required
            >
              <option value="">Select district</option>
              {districtOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Location</label>
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Main Bazaar, Karimabad"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Share what makes your place or service worth discovering."
            rows={4}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Contact person</label>
            <input
              value={contactPerson}
              onChange={(event) => setContactPerson(event.target.value)}
              placeholder="Reservation Manager"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Phone</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+92-300-0000000"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Business email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="stay@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">Website or social link</label>
            <input
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              placeholder="https://..."
              className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none ring-[#00798C]/20 transition focus:ring"
            />
          </div>
        </div>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[linear-gradient(135deg,#003D5B,#00798C)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,61,91,0.24)] transition hover:translate-y-[-1px] hover:shadow-[0_22px_46px_rgba(0,61,91,0.30)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending application..." : "Submit Partner Application"}
        </button>
      </form>
    </TravelLoginShell>
  );
}

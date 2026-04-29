"use client";

import { useEffect, useMemo, useState } from "react";
import SupplierCard from "@/components/pro/SupplierCard";
import { MOCK_AGENCY, MOCK_SUPPLIERS, PRO_REGIONS } from "@/lib/pro/mockData";
import type { Supplier } from "@/lib/pro/types";

const TYPE_OPTIONS = ["all", "hotel", "guesthouse", "restaurant", "cafe", "guide", "transport", "activity"] as const;
const STATUS_OPTIONS = ["all", "verified", "pending"] as const;

export default function ProSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [type, setType] = useState<(typeof TYPE_OPTIONS)[number]>("all");
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>("all");

  useEffect(() => {
    let mounted = true;
    fetch("/api/pro/suppliers", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Supplier[]) => {
        if (mounted && Array.isArray(data) && data.length) {
          setSuppliers(data);
        }
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchSearch = supplier.name.toLowerCase().includes(search.toLowerCase());
      const matchRegion = region === "all" ? true : supplier.region === region;
      const matchType =
        type === "all"
          ? true
          : type === "activity"
          ? supplier.type === "activity" || supplier.type === "city-tours" || supplier.type === "trekking-operator"
          : supplier.type === type;
      const matchStatus = status === "all" ? true : supplier.status === status;
      return matchSearch && matchRegion && matchType && matchStatus;
    });
  }, [suppliers, search, region, type, status]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Supplier Directory</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Search and filter suppliers by name, region, type, and status.
        </p>
      </div>

      <section className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search supplier by name"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          <option value="all">All regions</option>
          {PRO_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value as (typeof TYPE_OPTIONS)[number])}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {TYPE_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((supplier) => (
          <SupplierCard
            key={supplier.id}
            supplier={supplier}
            isStarterPlan={MOCK_AGENCY.plan === "starter"}
          />
        ))}
      </section>
    </div>
  );
}

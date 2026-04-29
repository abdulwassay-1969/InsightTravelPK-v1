"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDistrictOptionsForRegion } from "@/lib/partners";
import { PRO_REGIONS } from "@/lib/pro/mockData";
import { supabase } from "@/lib/pro/supabase-client";
import type { Permit, RouteCondition, RouteStatus, Supplier, SupplierType } from "@/lib/pro/types";

type Tab = "applications" | "suppliers" | "routes" | "permits";

const SUPPLIER_TYPES: SupplierType[] = [
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

const ROUTE_STATUSES: RouteStatus[] = ["open", "restricted", "closed", "seasonal"];

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

async function sendJson<T>(url: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as T;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("applications");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [routes, setRoutes] = useState<RouteCondition[]>([]);
  const [permits, setPermits] = useState<Permit[]>([]);

  const [supplierName, setSupplierName] = useState("");
  const [supplierRegion, setSupplierRegion] = useState<Supplier["region"]>("Punjab");
  const [supplierDistrict, setSupplierDistrict] = useState("");
  const [supplierLocation, setSupplierLocation] = useState("");
  const [supplierType, setSupplierType] = useState<SupplierType>("activity");
  const [supplierDescription, setSupplierDescription] = useState("");
  const [supplierContactPerson, setSupplierContactPerson] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [supplierWebsite, setSupplierWebsite] = useState("");
  const [supplierPrivateContact, setSupplierPrivateContact] = useState("");

  const [routeName, setRouteName] = useState("");
  const [routeFrom, setRouteFrom] = useState("");
  const [routeTo, setRouteTo] = useState("");
  const [routeStatus, setRouteStatus] = useState<RouteStatus>("open");
  const [routeNotes, setRouteNotes] = useState("");

  const [permitName, setPermitName] = useState("");
  const [permitRegion, setPermitRegion] = useState<Permit["region"]>("Punjab");
  const [permitIssuingBody, setPermitIssuingBody] = useState("");
  const [permitProcessingDays, setPermitProcessingDays] = useState("");
  const [permitCost, setPermitCost] = useState("");
  const [permitRequiredFor, setPermitRequiredFor] = useState("");
  const [permitNotes, setPermitNotes] = useState("");

  const supplierDistrictOptions = useMemo(() => getDistrictOptionsForRegion(supplierRegion), [supplierRegion]);
  const pendingApplications = useMemo(
    () => suppliers.filter((supplier) => supplier.status === "pending" || !supplier.verified),
    [suppliers]
  );

  const title = useMemo(() => {
    if (tab === "applications") return "Partner application review queue";
    if (tab === "suppliers") return "Marketplace supplier management";
    if (tab === "routes") return "Shared route condition management";
    return "Shared permit management";
  }, [tab]);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [supplierRows, routeRows, permitRows] = await Promise.all([
        getJson<Supplier[]>("/api/admin/pro/suppliers"),
        getJson<RouteCondition[]>("/api/admin/pro/routes"),
        getJson<Permit[]>("/api/admin/pro/permits"),
      ]);
      setSuppliers(supplierRows);
      setRoutes(routeRows);
      setPermits(permitRows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const supplierSub = client
      .channel("admin-suppliers-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "suppliers" }, () => {
        void refreshAll();
      })
      .subscribe();

    const routeSub = client
      .channel("admin-routes-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "routes" }, () => {
        void refreshAll();
      })
      .subscribe();

    const permitSub = client
      .channel("admin-permits-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "permits" }, () => {
        void refreshAll();
      })
      .subscribe();

    return () => {
      void client.removeChannel(supplierSub);
      void client.removeChannel(routeSub);
      void client.removeChannel(permitSub);
    };
  }, [refreshAll]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      void refreshAll();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshAll]);

  async function handleCreateSupplier() {
    if (!supplierName.trim()) return;
    setError(null);
    setSuccess(null);
    try {
      await sendJson<Supplier>("/api/admin/pro/suppliers", "POST", {
        name: supplierName.trim(),
        region: supplierRegion,
        district: supplierDistrict.trim(),
        location: supplierLocation.trim(),
        type: supplierType,
        verified: true,
        status: "verified",
        contactPublic: "Contact available for Pro plans",
        contactPrivate: supplierPrivateContact.trim() || `${supplierEmail.trim()} | ${supplierPhone.trim()}`,
        languages: ["English", "Urdu"],
        pricingTier: "mid",
        description: supplierDescription.trim(),
        contactPerson: supplierContactPerson.trim(),
        phone: supplierPhone.trim(),
        email: supplierEmail.trim(),
        website: supplierWebsite.trim() || undefined,
        listedPublicly: true,
        applicationSource: "admin",
        submittedAt: new Date().toISOString(),
      });
      setSupplierName("");
      setSupplierDistrict("");
      setSupplierLocation("");
      setSupplierDescription("");
      setSupplierContactPerson("");
      setSupplierPhone("");
      setSupplierEmail("");
      setSupplierWebsite("");
      setSupplierPrivateContact("");
      setSuccess("Supplier created.");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create supplier");
    }
  }

  async function handleCreateRoute() {
    if (!routeName.trim() || !routeFrom.trim() || !routeTo.trim()) return;
    setError(null);
    setSuccess(null);
    try {
      await sendJson<RouteCondition>("/api/admin/pro/routes", "POST", {
        name: routeName.trim(),
        from: routeFrom.trim(),
        to: routeTo.trim(),
        status: routeStatus,
        notes: routeNotes.trim() || "-",
        lastUpdated: new Date().toISOString(),
      });
      setRouteName("");
      setRouteFrom("");
      setRouteTo("");
      setRouteStatus("open");
      setRouteNotes("");
      setSuccess("Route created.");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create route");
    }
  }

  async function handleCreatePermit() {
    if (!permitName.trim() || !permitIssuingBody.trim()) return;
    setError(null);
    setSuccess(null);
    try {
      await sendJson<Permit>("/api/admin/pro/permits", "POST", {
        name: permitName.trim(),
        region: permitRegion,
        issuingBody: permitIssuingBody.trim(),
        processingDays: permitProcessingDays.trim() || "N/A",
        cost: permitCost.trim() || "N/A",
        requiredFor: permitRequiredFor.trim() || "N/A",
        notes: permitNotes.trim() || undefined,
      });
      setPermitName("");
      setPermitIssuingBody("");
      setPermitProcessingDays("");
      setPermitCost("");
      setPermitRequiredFor("");
      setPermitNotes("");
      setSuccess("Permit created.");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create permit");
    }
  }

  async function handleDelete(tabName: Tab, id: string, label: string) {
    if (!window.confirm(`Delete "${label}"?`)) return;
    setError(null);
    setSuccess(null);
    const endpoint =
      tabName === "suppliers"
        ? `/api/admin/pro/suppliers/${id}`
        : tabName === "routes"
          ? `/api/admin/pro/routes/${id}`
          : `/api/admin/pro/permits/${id}`;

    try {
      await sendJson<{ ok: true }>(endpoint, "DELETE");
      setSuccess("Entry deleted.");
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete entry");
    }
  }

  async function handleApproveSupplier(supplier: Supplier) {
    setError(null);
    setSuccess(null);
    try {
      await sendJson<Supplier>(`/api/admin/pro/suppliers/${supplier.id}`, "PATCH", {
        ...supplier,
        verified: true,
        status: "verified",
        listedPublicly: true,
      });
      setSuccess(`${supplier.name} approved and published.`);
      await refreshAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to approve supplier");
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Admin Control Panel</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Auto refresh
            </label>
            <button
              type="button"
              onClick={() => void refreshAll()}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(["applications", "suppliers", "routes", "permits"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === item
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {success ? <p className="mt-2 text-sm text-emerald-600">{success}</p> : null}
        {loading ? <p className="mt-2 text-sm text-zinc-500">Loading latest admin data...</p> : null}
      </section>

      {tab === "applications" ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pending partner applications</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Review new hotels, guesthouses, restaurants, cafes, and guides before they go live.
              </p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              {pendingApplications.length} pending
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {pendingApplications.length ? (
              pendingApplications.map((supplier) => (
                <article
                  key={supplier.id}
                  className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{supplier.name}</h4>
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {supplier.type}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                          {supplier.applicationSource}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {supplier.region} • {supplier.district || "District not set"} • {supplier.location || "Location not set"}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Contact: {supplier.contactPerson || "N/A"} • {supplier.email || "N/A"} • {supplier.phone || "N/A"}
                      </p>
                      {supplier.description ? (
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">{supplier.description}</p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleApproveSupplier(supplier)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                      >
                        Approve and publish
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete("suppliers", supplier.id, supplier.name)}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                No pending partner applications right now.
              </div>
            )}
          </div>
        </section>
      ) : null}

      {tab === "suppliers" ? (
        <>
          <section className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900">
            <input
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="Supplier name"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <select
              value={supplierRegion}
              onChange={(e) => setSupplierRegion(e.target.value as Supplier["region"])}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {PRO_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select
              value={supplierDistrict}
              onChange={(e) => setSupplierDistrict(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">Select district</option>
              {supplierDistrictOptions.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <select
              value={supplierType}
              onChange={(e) => setSupplierType(e.target.value as SupplierType)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {SUPPLIER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              value={supplierLocation}
              onChange={(e) => setSupplierLocation(e.target.value)}
              placeholder="Location"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierContactPerson}
              onChange={(e) => setSupplierContactPerson(e.target.value)}
              placeholder="Contact person"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierPhone}
              onChange={(e) => setSupplierPhone(e.target.value)}
              placeholder="Phone"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierEmail}
              onChange={(e) => setSupplierEmail(e.target.value)}
              placeholder="Email"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierWebsite}
              onChange={(e) => setSupplierWebsite(e.target.value)}
              placeholder="Website"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierDescription}
              onChange={(e) => setSupplierDescription(e.target.value)}
              placeholder="Description"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={supplierPrivateContact}
              onChange={(e) => setSupplierPrivateContact(e.target.value)}
              placeholder="Private contact"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="button"
              onClick={() => void handleCreateSupplier()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Add supplier
            </button>
          </section>

          <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Region</th>
                  <th className="px-4 py-3 font-semibold">District</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Pricing</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-zinc-100 dark:border-zinc-900">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.type}</td>
                    <td className="px-4 py-3">{supplier.region}</td>
                    <td className="px-4 py-3">{supplier.district || "-"}</td>
                    <td className="px-4 py-3">{supplier.status}</td>
                    <td className="px-4 py-3">{supplier.pricingTier}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete("suppliers", supplier.id, supplier.name)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      {tab === "routes" ? (
        <>
          <section className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-5 dark:border-zinc-800 dark:bg-zinc-900">
            <input
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Route name"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={routeFrom}
              onChange={(e) => setRouteFrom(e.target.value)}
              placeholder="From"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={routeTo}
              onChange={(e) => setRouteTo(e.target.value)}
              placeholder="To"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <select
              value={routeStatus}
              onChange={(e) => setRouteStatus(e.target.value as RouteStatus)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {ROUTE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <input
              value={routeNotes}
              onChange={(e) => setRouteNotes(e.target.value)}
              placeholder="Notes"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="button"
              onClick={() => void handleCreateRoute()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Add route
            </button>
          </section>

          <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 font-semibold">Route</th>
                  <th className="px-4 py-3 font-semibold">From</th>
                  <th className="px-4 py-3 font-semibold">To</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-zinc-100 dark:border-zinc-900">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{route.name}</td>
                    <td className="px-4 py-3">{route.from}</td>
                    <td className="px-4 py-3">{route.to}</td>
                    <td className="px-4 py-3">{route.status}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{formatDate(route.lastUpdated)}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{route.notes}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete("routes", route.id, route.name)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}

      {tab === "permits" ? (
        <>
          <section className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900">
            <input
              value={permitName}
              onChange={(e) => setPermitName(e.target.value)}
              placeholder="Permit name"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <select
              value={permitRegion}
              onChange={(e) => setPermitRegion(e.target.value as Permit["region"])}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              {PRO_REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <input
              value={permitIssuingBody}
              onChange={(e) => setPermitIssuingBody(e.target.value)}
              placeholder="Issuing body"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={permitProcessingDays}
              onChange={(e) => setPermitProcessingDays(e.target.value)}
              placeholder="Processing days"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={permitCost}
              onChange={(e) => setPermitCost(e.target.value)}
              placeholder="Cost"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={permitRequiredFor}
              onChange={(e) => setPermitRequiredFor(e.target.value)}
              placeholder="Required for"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <input
              value={permitNotes}
              onChange={(e) => setPermitNotes(e.target.value)}
              placeholder="Notes"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            />
            <button
              type="button"
              onClick={() => void handleCreatePermit()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Add permit
            </button>
          </section>

          <section className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 font-semibold">Permit</th>
                  <th className="px-4 py-3 font-semibold">Region</th>
                  <th className="px-4 py-3 font-semibold">Issuing body</th>
                  <th className="px-4 py-3 font-semibold">Processing</th>
                  <th className="px-4 py-3 font-semibold">Cost</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {permits.map((permit) => (
                  <tr key={permit.id} className="border-b border-zinc-100 dark:border-zinc-900">
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{permit.name}</td>
                    <td className="px-4 py-3">{permit.region}</td>
                    <td className="px-4 py-3">{permit.issuingBody}</td>
                    <td className="px-4 py-3">{permit.processingDays}</td>
                    <td className="px-4 py-3">{permit.cost}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => void handleDelete("permits", permit.id, permit.name)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      ) : null}
    </div>
  );
}

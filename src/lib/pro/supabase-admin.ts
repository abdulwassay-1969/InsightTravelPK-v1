import type { Permit, ProPackage, RouteCondition, Supplier } from "@/lib/pro/types";
import { MOCK_PACKAGES, MOCK_PERMITS, MOCK_ROUTES, MOCK_SUPPLIERS } from "@/lib/pro/mockData";

const mem = {
  suppliers: [...MOCK_SUPPLIERS],
  routes: [...MOCK_ROUTES],
  permits: [...MOCK_PERMITS],
  packages: [...MOCK_PACKAGES],
};

type Json = Record<string, unknown>;

function cfg() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";
  return { url, serviceKey, enabled: Boolean(url && serviceKey) };
}

async function restSelect(table: string): Promise<Json[]> {
  const { url, serviceKey, enabled } = cfg();
  if (!enabled) throw new Error("Supabase write config missing");
  const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Json[];
}

async function restInsert(table: string, payload: Json): Promise<Json> {
  const { url, serviceKey, enabled } = cfg();
  if (!enabled) throw new Error("Supabase write config missing");
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as Json[];
  return data[0] || payload;
}

async function restUpdate(table: string, id: string, payload: Json): Promise<Json> {
  const { url, serviceKey, enabled } = cfg();
  if (!enabled) throw new Error("Supabase write config missing");
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}&select=*`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
  const data = (await res.json()) as Json[];
  return data[0] || payload;
}

async function restDelete(table: string, id: string): Promise<void> {
  const { url, serviceKey, enabled } = cfg();
  if (!enabled) throw new Error("Supabase write config missing");
  const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(await res.text());
}

function mapSupplier(row: Json): Supplier {
  const typeRaw = String(row.type ?? "activity");
  const type: Supplier["type"] =
    typeRaw === "hotel" ||
    typeRaw === "guesthouse" ||
    typeRaw === "restaurant" ||
    typeRaw === "cafe" ||
    typeRaw === "guide" ||
    typeRaw === "transport" ||
    typeRaw === "activity" ||
    typeRaw === "city-tours" ||
    typeRaw === "trekking-operator"
      ? typeRaw
      : "activity";

  return {
    id: String(row.id ?? crypto.randomUUID()),
    name: String(row.name ?? "Unknown supplier"),
    type,
    region: String(row.region ?? "Punjab") as Supplier["region"],
    district: String(row.district ?? ""),
    location: String(row.location ?? ""),
    verified: Boolean(row.verified),
    status: Boolean(row.verified) ? "verified" : "pending",
    contactPublic: String(row.contact_public ?? "Contact available for Pro plans"),
    contactPrivate: String(row.contact_private ?? "Locked"),
    languages: Array.isArray(row.languages) ? row.languages.map((x) => String(x)) : ["English"],
    pricingTier:
      row.pricing_tier === "budget" || row.pricing_tier === "mid" || row.pricing_tier === "premium"
        ? row.pricing_tier
        : "mid",
    description: String(row.description ?? ""),
    contactPerson: String(row.contact_person ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    website: row.website ? String(row.website) : undefined,
    listedPublicly: Boolean(row.listed_publicly),
    applicationSource: row.application_source === "partner" ? "partner" : "admin",
    submittedAt: String(row.submitted_at ?? new Date().toISOString()),
  };
}

function supplierPayload(input: Partial<Supplier>): Json {
  return {
    name: input.name,
    type: input.type,
    region: input.region,
    district: input.district,
    location: input.location,
    verified: input.verified,
    contact_public: input.contactPublic,
    contact_private: input.contactPrivate,
    languages: input.languages,
    pricing_tier: input.pricingTier,
    description: input.description,
    contact_person: input.contactPerson,
    phone: input.phone,
    email: input.email,
    website: input.website,
    listed_publicly: input.listedPublicly,
    application_source: input.applicationSource,
    submitted_at: input.submittedAt,
  };
}

function mapRoute(row: Json): RouteCondition {
  const statusRaw = String(row.status ?? "open");
  const status: RouteCondition["status"] =
    statusRaw === "open" || statusRaw === "restricted" || statusRaw === "closed" || statusRaw === "seasonal"
      ? statusRaw
      : "open";

  return {
    id: String(row.id ?? crypto.randomUUID()),
    name: String(row.name ?? "Unnamed route"),
    from: String(row.from ?? "Unknown"),
    to: String(row.to ?? "Unknown"),
    status,
    lastUpdated: String(row.last_updated ?? new Date().toISOString()),
    notes: String(row.notes ?? "-"),
  };
}

function routePayload(input: Partial<RouteCondition>): Json {
  return {
    name: input.name,
    from: input.from,
    to: input.to,
    status: input.status,
    last_updated: input.lastUpdated,
    notes: input.notes,
  };
}

function mapPermit(row: Json): Permit {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    name: String(row.name ?? "Unknown permit"),
    region: String(row.region ?? "Punjab") as Permit["region"],
    issuingBody: String(row.issuing_body ?? "Unknown"),
    processingDays: String(row.processing_days ?? "N/A"),
    cost: String(row.cost ?? "N/A"),
    requiredFor: String(row.required_for ?? "N/A"),
    notes: row.notes ? String(row.notes) : undefined,
  };
}

function permitPayload(input: Partial<Permit>): Json {
  return {
    name: input.name,
    region: input.region,
    issuing_body: input.issuingBody,
    processing_days: input.processingDays,
    cost: input.cost,
    required_for: input.requiredFor,
    notes: input.notes,
  };
}

function mapPackage(row: Json): ProPackage {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    agencyId: String(row.agency_id ?? "agency-demo-1"),
    title: String(row.title ?? "Untitled package"),
    destination: String(row.destination ?? "Punjab") as ProPackage["destination"],
    duration: Number(row.duration ?? 3),
    itinerary: Array.isArray(row.itinerary_json)
      ? (row.itinerary_json as ProPackage["itinerary"])
      : [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function packagePayload(input: Partial<ProPackage>): Json {
  return {
    agency_id: input.agencyId,
    title: input.title,
    destination: input.destination,
    duration: input.duration,
    itinerary_json: input.itinerary,
    created_at: input.createdAt,
  };
}

export async function adminListSuppliers(): Promise<Supplier[]> {
  try {
    return (await restSelect("suppliers")).map(mapSupplier);
  } catch {
    return mem.suppliers;
  }
}

export async function adminCreateSupplier(input: Partial<Supplier>): Promise<Supplier> {
  try {
    const created = await restInsert("suppliers", supplierPayload(input));
    return mapSupplier(created);
  } catch {
    const fallback: Supplier = {
      id: crypto.randomUUID(),
      name: input.name || "New supplier",
      type: (input.type as Supplier["type"]) || "activity",
      region: (input.region as Supplier["region"]) || "Punjab",
      district: input.district || "",
      location: input.location || "",
      verified: Boolean(input.verified),
      status: input.verified ? "verified" : "pending",
      contactPublic: input.contactPublic || "Contact available for Pro plans",
      contactPrivate: input.contactPrivate || "Locked",
      languages: input.languages || ["English"],
      pricingTier: input.pricingTier || "mid",
      description: input.description || "",
      contactPerson: input.contactPerson || "",
      phone: input.phone || "",
      email: input.email || "",
      website: input.website,
      listedPublicly: Boolean(input.listedPublicly),
      applicationSource: input.applicationSource || "admin",
      submittedAt: input.submittedAt || new Date().toISOString(),
    };
    mem.suppliers = [fallback, ...mem.suppliers];
    return fallback;
  }
}

export async function adminUpdateSupplier(id: string, input: Partial<Supplier>): Promise<Supplier> {
  try {
    const updated = await restUpdate("suppliers", id, supplierPayload(input));
    return mapSupplier(updated);
  } catch {
    const current = mem.suppliers.find((s) => s.id === id);
    if (!current) throw new Error("Supplier not found");
    const updated: Supplier = {
      ...current,
      ...input,
      status: input.verified === undefined ? current.status : input.verified ? "verified" : "pending",
    };
    mem.suppliers = mem.suppliers.map((s) => (s.id === id ? updated : s));
    return updated;
  }
}

export async function adminDeleteSupplier(id: string): Promise<void> {
  try {
    await restDelete("suppliers", id);
  } catch {
    mem.suppliers = mem.suppliers.filter((s) => s.id !== id);
  }
}

export async function adminListRoutes(): Promise<RouteCondition[]> {
  try {
    return (await restSelect("routes")).map(mapRoute);
  } catch {
    return mem.routes;
  }
}

export async function adminCreateRoute(input: Partial<RouteCondition>): Promise<RouteCondition> {
  const payload = routePayload({ ...input, lastUpdated: input.lastUpdated || new Date().toISOString() });
  try {
    const created = await restInsert("routes", payload);
    return mapRoute(created);
  } catch {
    const fallback: RouteCondition = {
      id: crypto.randomUUID(),
      name: input.name || "New route",
      from: input.from || "Unknown",
      to: input.to || "Unknown",
      status: input.status || "open",
      lastUpdated: input.lastUpdated || new Date().toISOString(),
      notes: input.notes || "-",
    };
    mem.routes = [fallback, ...mem.routes];
    return fallback;
  }
}

export async function adminUpdateRoute(id: string, input: Partial<RouteCondition>): Promise<RouteCondition> {
  const payload = routePayload({ ...input, lastUpdated: input.lastUpdated || new Date().toISOString() });
  try {
    const updated = await restUpdate("routes", id, payload);
    return mapRoute(updated);
  } catch {
    const current = mem.routes.find((r) => r.id === id);
    if (!current) throw new Error("Route not found");
    const updated: RouteCondition = { ...current, ...input, lastUpdated: new Date().toISOString() };
    mem.routes = mem.routes.map((r) => (r.id === id ? updated : r));
    return updated;
  }
}

export async function adminDeleteRoute(id: string): Promise<void> {
  try {
    await restDelete("routes", id);
  } catch {
    mem.routes = mem.routes.filter((r) => r.id !== id);
  }
}

export async function adminListPermits(): Promise<Permit[]> {
  try {
    return (await restSelect("permits")).map(mapPermit);
  } catch {
    return mem.permits;
  }
}

export async function adminCreatePermit(input: Partial<Permit>): Promise<Permit> {
  try {
    const created = await restInsert("permits", permitPayload(input));
    return mapPermit(created);
  } catch {
    const fallback: Permit = {
      id: crypto.randomUUID(),
      name: input.name || "New permit",
      region: (input.region as Permit["region"]) || "Punjab",
      issuingBody: input.issuingBody || "Unknown",
      processingDays: input.processingDays || "N/A",
      cost: input.cost || "N/A",
      requiredFor: input.requiredFor || "N/A",
      notes: input.notes,
    };
    mem.permits = [fallback, ...mem.permits];
    return fallback;
  }
}

export async function adminUpdatePermit(id: string, input: Partial<Permit>): Promise<Permit> {
  try {
    const updated = await restUpdate("permits", id, permitPayload(input));
    return mapPermit(updated);
  } catch {
    const current = mem.permits.find((p) => p.id === id);
    if (!current) throw new Error("Permit not found");
    const updated: Permit = { ...current, ...input };
    mem.permits = mem.permits.map((p) => (p.id === id ? updated : p));
    return updated;
  }
}

export async function adminDeletePermit(id: string): Promise<void> {
  try {
    await restDelete("permits", id);
  } catch {
    mem.permits = mem.permits.filter((p) => p.id !== id);
  }
}

export async function adminListPackages(): Promise<ProPackage[]> {
  try {
    return (await restSelect("packages")).map(mapPackage);
  } catch {
    return mem.packages;
  }
}

export async function adminCreatePackage(input: Partial<ProPackage>): Promise<ProPackage> {
  const payload = packagePayload({
    ...input,
    agencyId: input.agencyId || "agency-demo-1",
    createdAt: input.createdAt || new Date().toISOString(),
    itinerary: input.itinerary || [],
  });

  try {
    const created = await restInsert("packages", payload);
    return mapPackage(created);
  } catch {
    const fallback: ProPackage = {
      id: crypto.randomUUID(),
      agencyId: input.agencyId || "agency-demo-1",
      title: input.title || "New package",
      destination: (input.destination as ProPackage["destination"]) || "Punjab",
      duration: input.duration || 3,
      itinerary: input.itinerary || [],
      createdAt: input.createdAt || new Date().toISOString(),
    };
    mem.packages = [fallback, ...mem.packages];
    return fallback;
  }
}

export async function adminUpdatePackage(id: string, input: Partial<ProPackage>): Promise<ProPackage> {
  try {
    const updated = await restUpdate("packages", id, packagePayload(input));
    return mapPackage(updated);
  } catch {
    const current = mem.packages.find((p) => p.id === id);
    if (!current) throw new Error("Package not found");
    const updated: ProPackage = { ...current, ...input };
    mem.packages = mem.packages.map((p) => (p.id === id ? updated : p));
    return updated;
  }
}

export async function adminDeletePackage(id: string): Promise<void> {
  try {
    await restDelete("packages", id);
  } catch {
    mem.packages = mem.packages.filter((p) => p.id !== id);
  }
}

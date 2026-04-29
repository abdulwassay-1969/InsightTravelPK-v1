import type { Agency, Permit, ProPackage, RouteCondition, Supplier } from "@/lib/pro/types";
import {
  MOCK_AGENCY,
  MOCK_PACKAGES,
  MOCK_PERMITS,
  MOCK_ROUTES,
  MOCK_SUPPLIERS,
} from "@/lib/pro/mockData";
import { isPublicPartner, regionToProvinceSlug } from "@/lib/partners";

type Json = Record<string, unknown>;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
  return { url, anonKey, enabled: Boolean(url && anonKey) };
}

async function selectAll<T>(table: string): Promise<T[]> {
  const { url, anonKey, enabled } = getSupabaseConfig();
  if (!enabled) throw new Error("Supabase config missing");

  const endpoint = `${url}/rest/v1/${table}?select=*`;
  const res = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Supabase ${table} query failed: ${message}`);
  }

  return (await res.json()) as T[];
}

function mapSupplier(row: Json): Supplier {
  const typeRaw = String(row.type ?? "activity");
  const normalizedType =
    typeRaw === "city-tours" ||
    typeRaw === "trekking-operator" ||
    typeRaw === "hotel" ||
    typeRaw === "guesthouse" ||
    typeRaw === "restaurant" ||
    typeRaw === "cafe" ||
    typeRaw === "guide" ||
    typeRaw === "transport" ||
    typeRaw === "activity"
      ? typeRaw
      : "activity";

  return {
    id: String(row.id),
    name: String(row.name ?? "Unknown supplier"),
    type: normalizedType,
    region: String(row.region ?? "Punjab") as Supplier["region"],
    district: String(row.district ?? ""),
    location: String(row.location ?? ""),
    verified: Boolean(row.verified),
    status: Boolean(row.verified) ? "verified" : "pending",
    contactPublic: String(row.contact_public ?? "Contact available for Pro plans"),
    contactPrivate: String(row.contact_private ?? "Locked"),
    languages: Array.isArray(row.languages)
      ? row.languages.map((v) => String(v))
      : ["English"],
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

function mapRoute(row: Json): RouteCondition {
  const rawStatus = String(row.status ?? "open");
  const status: RouteCondition["status"] =
    rawStatus === "open" || rawStatus === "restricted" || rawStatus === "closed" || rawStatus === "seasonal"
      ? rawStatus
      : "open";

  return {
    id: String(row.id),
    name: String(row.name ?? "Unnamed route"),
    from: String(row.from ?? "Unknown"),
    to: String(row.to ?? "Unknown"),
    status,
    lastUpdated: String(row.last_updated ?? new Date().toISOString()),
    notes: String(row.notes ?? "-"),
  };
}

function mapPermit(row: Json): Permit {
  return {
    id: String(row.id),
    name: String(row.name ?? "Unknown permit"),
    region: String(row.region ?? "Punjab") as Permit["region"],
    issuingBody: String(row.issuing_body ?? "Unknown body"),
    processingDays: String(row.processing_days ?? "N/A"),
    cost: String(row.cost ?? "N/A"),
    requiredFor: String(row.required_for ?? "N/A"),
    notes: row.notes ? String(row.notes) : undefined,
  };
}

function mapPackage(row: Json): ProPackage {
  return {
    id: String(row.id),
    agencyId: String(row.agency_id ?? ""),
    title: String(row.title ?? "Untitled"),
    destination: String(row.destination ?? "Punjab") as ProPackage["destination"],
    duration: Number(row.duration ?? 0),
    itinerary: Array.isArray(row.itinerary_json)
      ? (row.itinerary_json as ProPackage["itinerary"])
      : [],
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function mapAgency(row: Json): Agency {
  const planRaw = String(row.plan ?? "starter");
  const plan =
    planRaw === "starter" || planRaw === "pro" || planRaw === "enterprise"
      ? planRaw
      : "starter";

  return {
    id: String(row.id),
    name: String(row.name ?? "PakVista Partner Agency"),
    country: String(row.country ?? "Pakistan"),
    plan,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const rows = await selectAll<Json>("suppliers");
    return rows.map(mapSupplier);
  } catch {
    return MOCK_SUPPLIERS;
  }
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const suppliers = await getSuppliers();
  return suppliers.find((s) => s.id === id) ?? null;
}

export async function getPublicPartnersByProvinceSlug(provinceSlug: string): Promise<Supplier[]> {
  const suppliers = await getSuppliers();
  return suppliers.filter((supplier) => isPublicPartner(supplier) && regionToProvinceSlug(supplier.region) === provinceSlug);
}

export async function getRoutes(): Promise<RouteCondition[]> {
  try {
    const rows = await selectAll<Json>("routes");
    return rows.map(mapRoute);
  } catch {
    return MOCK_ROUTES;
  }
}

export async function getPermits(): Promise<Permit[]> {
  try {
    const rows = await selectAll<Json>("permits");
    return rows.map(mapPermit);
  } catch {
    return MOCK_PERMITS;
  }
}

export async function getPackages(): Promise<ProPackage[]> {
  try {
    const rows = await selectAll<Json>("packages");
    return rows.map(mapPackage);
  } catch {
    return MOCK_PACKAGES;
  }
}

export async function getAgency(): Promise<Agency> {
  try {
    const rows = await selectAll<Json>("agencies");
    if (!rows.length) return MOCK_AGENCY;
    return mapAgency(rows[0]);
  } catch {
    return MOCK_AGENCY;
  }
}

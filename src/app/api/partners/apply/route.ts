import { NextResponse, type NextRequest } from "next/server";
import { adminCreateSupplier } from "@/lib/pro/supabase-admin";
import type { Supplier, SupplierType } from "@/lib/pro/types";

type PartnerApplicationBody = {
  name?: string;
  type?: SupplierType;
  region?: Supplier["region"];
  district?: string;
  location?: string;
  description?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  website?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json()) as PartnerApplicationBody;

  if (!body.name || !body.type || !body.region || !body.district || !body.location || !body.contactPerson || !body.phone || !body.email) {
    return NextResponse.json({ error: "Missing required partner application fields." }, { status: 400 });
  }

  const created = await adminCreateSupplier({
    name: body.name,
    type: body.type,
    region: body.region,
    district: body.district,
    location: body.location,
    description: body.description || "",
    verified: false,
    status: "pending",
    contactPublic: `${body.type} listing pending approval`,
    contactPrivate: `${body.email} | ${body.phone}`,
    languages: ["English", "Urdu"],
    pricingTier: "mid",
    contactPerson: body.contactPerson,
    phone: body.phone,
    email: body.email,
    website: body.website,
    listedPublicly: false,
    applicationSource: "partner",
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json(
    {
      ok: true,
      id: created.id,
      message: "Partner application received. Our team will review it before publishing it to InsightTravelPK.",
    },
    { status: 201 }
  );
}

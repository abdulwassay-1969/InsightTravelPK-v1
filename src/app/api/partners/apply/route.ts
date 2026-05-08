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

import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const { success, error } = checkRateLimit(ip, 'partner-apply', {
      maxAttempts: 5,
      windowMs: 5 * 60 * 1000,
      errorMessage: "Too many application attempts. Please try again in 5 minutes."
    });

    if (!success) {
      return NextResponse.json({ error }, { status: 429 });
    }

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
  } catch (error) {
    console.error("Partner application error:", error);
    return NextResponse.json(
      { error: "Partner applications are temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }
}

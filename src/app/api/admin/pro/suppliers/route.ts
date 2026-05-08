import { NextResponse, type NextRequest } from "next/server";
import { hasPlatformAdminAccess } from "@/lib/admin/access";
import { adminCreateSupplier, adminListSuppliers } from "@/lib/pro/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    if (!(await hasPlatformAdminAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await adminListSuppliers();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin suppliers list error:", error);
    return NextResponse.json({ error: "Unable to load suppliers right now." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await hasPlatformAdminAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const created = await adminCreateSupplier(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Admin suppliers create error:", error);
    return NextResponse.json({ error: "Unable to create supplier right now." }, { status: 503 });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { hasPlatformAdminAccess } from "@/lib/admin/access";
import { adminCreatePermit, adminListPermits } from "@/lib/pro/supabase-admin";

export async function GET(request: NextRequest) {
  try {
    if (!(await hasPlatformAdminAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await adminListPermits();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Admin permits list error:", error);
    return NextResponse.json({ error: "Unable to load permits right now." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await hasPlatformAdminAccess(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const created = await adminCreatePermit(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Admin permits create error:", error);
    return NextResponse.json({ error: "Unable to create permit right now." }, { status: 503 });
  }
}

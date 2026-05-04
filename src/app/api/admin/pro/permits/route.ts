import { NextResponse, type NextRequest } from "next/server";
import { hasPlatformAdminAccess } from "@/lib/admin/access";
import { adminCreatePermit, adminListPermits } from "@/lib/pro/supabase-admin";

export async function GET(request: NextRequest) {
  if (!(await hasPlatformAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const rows = await adminListPermits();
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  if (!(await hasPlatformAdminAccess(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const created = await adminCreatePermit(body);
  return NextResponse.json(created, { status: 201 });
}

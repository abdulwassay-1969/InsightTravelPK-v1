import { NextResponse, type NextRequest } from "next/server";
import { hasPlatformAdminAccess } from "@/lib/admin/access";
import { adminDeleteSupplier, adminUpdateSupplier } from "@/lib/pro/supabase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasPlatformAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const updated = await adminUpdateSupplier(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!hasPlatformAdminAccess(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await adminDeleteSupplier(id);
  return NextResponse.json({ ok: true });
}

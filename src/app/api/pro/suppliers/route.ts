import { NextResponse } from "next/server";
import { getSuppliers } from "@/lib/pro/supabase";

export async function GET() {
  const data = await getSuppliers();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { getAgency } from "@/lib/pro/supabase";

export async function GET() {
  const data = await getAgency();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { getPermits } from "@/lib/pro/supabase";

export async function GET() {
  const data = await getPermits();
  return NextResponse.json(data);
}

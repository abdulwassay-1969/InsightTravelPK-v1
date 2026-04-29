import { NextResponse } from "next/server";
import { getRoutes } from "@/lib/pro/supabase";

export async function GET() {
  const data = await getRoutes();
  return NextResponse.json(data);
}

import type { NextRequest } from "next/server";
import { PRO_SESSION_COOKIE, verifyToken } from "@/lib/pro/auth";

export async function hasPlatformAdminAccess(request: NextRequest): Promise<boolean> {
  const sessionToken = request.cookies.get(PRO_SESSION_COOKIE)?.value;
  if (!sessionToken) return false;

  const payload = await verifyToken(sessionToken);
  return !!payload && payload.sessionType === "pro" && payload.role === "admin";
}

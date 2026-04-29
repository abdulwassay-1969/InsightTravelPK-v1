import type { NextRequest } from "next/server";
import { isProAdmin, isProUser, PRO_ROLE_COOKIE, PRO_SESSION_COOKIE } from "@/lib/pro/auth";

export function hasPlatformAdminAccess(request: NextRequest): boolean {
  const session = request.cookies.get(PRO_SESSION_COOKIE)?.value;
  const role = request.cookies.get(PRO_ROLE_COOKIE)?.value;
  return isProUser(session) && isProAdmin(role);
}

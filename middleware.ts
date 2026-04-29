import { NextResponse, type NextRequest } from "next/server";
import { isProAdmin, isProAgent, isProUser, PRO_ROLE_COOKIE, PRO_SESSION_COOKIE } from "@/lib/pro/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/pro") && !pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/pro/login" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(PRO_SESSION_COOKIE)?.value;
  const role = request.cookies.get(PRO_ROLE_COOKIE)?.value;

  if (!isProUser(session)) {
    const loginUrl = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/pro/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(PRO_SESSION_COOKIE);
    response.cookies.delete(PRO_ROLE_COOKIE);
    return response;
  }

  if (pathname.startsWith("/admin")) {
    if (!isProAdmin(role)) {
      const forbiddenUrl = new URL("/admin/forbidden", request.url);
      return NextResponse.redirect(forbiddenUrl);
    }
    return NextResponse.next();
  }

  if (!isProAgent(role)) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pro/:path*", "/admin/:path*"],
};

import { NextResponse, type NextRequest } from "next/server";
import { PRO_SESSION_COOKIE, verifyToken } from "@/lib/pro/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/pro") && !pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/pro/login" || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(PRO_SESSION_COOKIE)?.value;
  
  if (!sessionToken) {
    return redirectUnauthenticated(request, pathname);
  }

  const payload = await verifyToken(sessionToken);

  if (!payload || payload.sessionType !== "pro") {
    return redirectUnauthenticated(request, pathname);
  }

  const role = payload.role as string;

  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      const forbiddenUrl = new URL("/admin/forbidden", request.url);
      return NextResponse.redirect(forbiddenUrl);
    }
    return NextResponse.next();
  }

  if (role !== "agent" && role !== "admin") {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

function redirectUnauthenticated(request: NextRequest, pathname: string) {
  const loginUrl = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/pro/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(PRO_SESSION_COOKIE);
  return response;
}

export const config = {
  matcher: ["/pro/:path*", "/admin/:path*"],
};

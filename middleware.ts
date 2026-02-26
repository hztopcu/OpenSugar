import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protects routes except login, signup, and API (including /api/auth for NextAuth callbacks).
 * Does not run on api, _next/static, _next/image, favicon.ico so auth API and login completion are unaffected.
 */
export function middleware(request: NextRequest) {
  const session =
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value;

  const pathname = request.nextUrl.pathname;

  const isPublicPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next");

  if (!session && !isPublicPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude api (incl. /api/auth), _next/static, _next/image, favicon.ico
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
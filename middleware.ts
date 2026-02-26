/**
 * STRICT ISOLATION: Only "next/server" → NextResponse is imported.
 * No @/auth, @/lib/db, path, fs, or app code. Cookie-only session check (avoids next-auth/jwt / __dirname).
 */
import { NextResponse } from "next/server";

type RequestWithCookies = Request & {
  cookies: { get(name: string): { value?: string } | undefined };
};

export default function middleware(request: Request) {
  const req = request as RequestWithCookies;
  const session =
    req.cookies?.get?.("__Secure-authjs.session-token")?.value ??
    req.cookies?.get?.("authjs.session-token")?.value;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", new URL(request.url).pathname);
    return Response.redirect(loginUrl, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};

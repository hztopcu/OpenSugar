import { NextResponse } from "next/server";

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookieHeader = request.headers.get("cookie") || "";
  const hasSession =
    cookieHeader.includes("authjs.session-token") ||
    cookieHeader.includes("__Secure-authjs.session-token");

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)"],
};

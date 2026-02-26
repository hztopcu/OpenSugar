// middleware.ts
export function middleware(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const hasSession = cookieHeader.includes("authjs.session-token") ||
    cookieHeader.includes("__Secure-authjs.session-token");

  if (!hasSession) {
    const url = new URL(request.url);

    if (!["/login", "/signup", "/api", "/_next"].some(p => url.pathname.startsWith(p))) {
      return Response.redirect(new URL("/login", request.url), 302);
    }
  }


  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)"]
};
// NextResponse importunu tamamen kaldır ve şunları kullan:
export default function middleware(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const session = cookieHeader.includes("__Secure-authjs.session-token") ||
    cookieHeader.includes("authjs.session-token");

  if (!session) {
    const url = new URL(request.url);
    if (!["/api", "/_next", "/favicon.ico", "/login", "/signup"].some(path => url.pathname.startsWith(path))) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", url.pathname);
      return Response.redirect(loginUrl, 302);
    }
  }

  return new Response(null, {
    headers: { 'x-middleware-next': '1' } // Next.js'e devam et komutu
  });
}
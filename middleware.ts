
 */
export function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  //
  const cookieHeader = request.headers.get("cookie") || "";
  const hasSession =
    cookieHeader.includes("__Secure-authjs.session-token") ||
    cookieHeader.includes("authjs.session-token") ||
    cookieHeader.includes("next-auth.session-token"); // 

  // E
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl, 302);
  }

  // 
  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|signup).*)"]
};
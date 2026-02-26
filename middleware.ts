import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup", "/api/auth"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );
  if (isPublic) return NextResponse.next();

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  if (!token?.sub) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", path);
    return Response.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon-|sw.js|manifest.json).*)",
  ],
};

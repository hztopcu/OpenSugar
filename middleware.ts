import { auth } from "@/auth";

const publicPaths = ["/login", "/api/auth"];

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isPublic = publicPaths.some((p) => path === p || path.startsWith(p + "/"));
  if (isPublic) return;
  if (!req.auth?.user?.id) {
    const url = new URL("/login", req.nextUrl.origin);
    url.searchParams.set("callbackUrl", path);
    return Response.redirect(url);
  }
});

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-|sw.js|manifest.json).*)"] };

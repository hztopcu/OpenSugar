import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    const session =
        request.cookies.get("__Secure-authjs.session-token")?.value ||
        request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("next-auth.session-token")?.value;

    const url = request.nextUrl.clone();


    if (!session) {

        const isPublicPage =
            url.pathname.startsWith("/login") ||
            url.pathname.startsWith("/signup") ||
            url.pathname.startsWith("/api") ||
            url.pathname.startsWith("/_next");

        if (!isPublicPage) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", url.pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        /*
         * - api (API rotaları)
         * - _next/static (statik dosyalar)
         * - _next/image (resim optimize edici)
         * - favicon.ico (ikon dosyası)
         * dışındaki tüm yolları yakala
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
import { NextRequest, NextResponse } from "next/server";

const protectedRoute = ["/main"];
const authPaths = ["/login", "/signup", "/otp-verify", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
    const hasToken = request.cookies.has("refreshToken");

    const { pathname } = request.nextUrl;

    if(hasToken) {
        if(authPaths.some((path) => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL("/main", request.url));
        }
    } else {
        if(protectedRoute.some((path) => pathname.startsWith(path))) {
            const loginurl = new URL("/login", request.url);

            loginurl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginurl);
        }
    }

    return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

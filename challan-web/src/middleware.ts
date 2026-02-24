import { NextRequest, NextResponse } from "next/server";

const protectedRoute = ["/main"];
const authPaths = [
  "/login",
  "/signup",
  "/otp-verify",
  "/forgot-password",
  "/reset-password",
  "/guest",
];

export function middleware(request: NextRequest) {
  // `auth_session` is a non-httpOnly flag cookie written on the frontend
  // domain (Vercel) by the browser after every successful auth event.
  // We cannot use `refreshToken` here because that httpOnly cookie is set
  // by the backend (Render domain) and is invisible to this middleware.
  const hasToken = request.cookies.has("auth_session");

  const { pathname } = request.nextUrl;

  if (hasToken) {
    if (authPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/main", request.url));
    }
  } else {
    if (protectedRoute.some((path) => pathname.startsWith(path))) {
      const loginurl = new URL("/login", request.url);

      loginurl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginurl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

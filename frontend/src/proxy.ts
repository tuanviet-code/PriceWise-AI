import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, isProtectedPath } from "@/shared/config/access";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isSignedIn = request.cookies.has(DEMO_SESSION_COOKIE);

  if (isProtectedPath(pathname) && !isSignedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && isSignedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/alerts/:path*", "/chat/:path*", "/login"],
};

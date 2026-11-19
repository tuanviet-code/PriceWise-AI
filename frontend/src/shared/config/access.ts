export const DEMO_SESSION_COOKIE = "pricewise_demo_session";

export const PROTECTED_ROUTES = ["/dashboard", "/alerts", "/chat"] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

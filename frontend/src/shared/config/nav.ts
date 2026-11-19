export interface NavItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
}

export const MAIN_NAV: readonly NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", requiresAuth: true },
  { href: "/today", label: "Hôm nay" },
  { href: "/gold", label: "Giá vàng" },
  { href: "/fuel", label: "Giá xăng dầu" },
  { href: "/alerts", label: "Thông báo giá", requiresAuth: true },
  { href: "/chat", label: "Chatbot dữ liệu", requiresAuth: true },
];

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

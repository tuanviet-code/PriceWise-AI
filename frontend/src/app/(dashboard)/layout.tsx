"use client";

import { AppShell } from "@/shared/ui/app-shell";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return children;
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-10">
        {children}
      </div>
    </AppShell>
  );
}

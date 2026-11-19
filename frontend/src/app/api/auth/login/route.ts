import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/shared/config/access";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/dashboard");

  if (!email.includes("@") || password.length < 6) {
    return NextResponse.redirect(
      new URL("/login?error=invalid", request.url),
      303,
    );
  }

  const safeNext =
    nextPath.startsWith("/") && !nextPath.startsWith("//")
      ? nextPath
      : "/dashboard";
  const response = NextResponse.redirect(new URL(safeNext, request.url), 303);
  response.cookies.set(DEMO_SESSION_COOKIE, "demo-user", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

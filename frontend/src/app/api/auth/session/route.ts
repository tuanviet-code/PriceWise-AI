import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "@/shared/config/access";

export async function GET() {
  const cookieStore = await cookies();
  return Response.json({ signedIn: cookieStore.has(DEMO_SESSION_COOKIE) });
}

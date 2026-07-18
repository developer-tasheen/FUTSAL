import { getCurrentSession } from "@/lib/auth/session";
import { jsonOk } from "@/lib/api/http";

export async function GET() {
  const user = await getCurrentSession();
  return jsonOk({ user });
}

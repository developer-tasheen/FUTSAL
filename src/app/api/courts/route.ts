import { eq } from "drizzle-orm";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { courts } from "@/lib/db/schema";

export async function GET() {
  try {
    const db = getDatabase();
    const rows = await db
      .select({
        id: courts.id,
        name: courts.name,
        isActive: courts.isActive,
      })
      .from(courts)
      .where(eq(courts.isActive, true));

    return jsonOk({ courts: rows });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { desc, eq, sql } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { bookings, users } from "@/lib/db/schema";

export async function GET() {
  try {
    await requireAdminSession();
    const db = getDatabase();

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        mobileNumber: users.mobileNumber,
        email: users.email,
        createdAt: users.createdAt,
        bookingsCount: sql<number>`count(${bookings.id})::int`,
      })
      .from(users)
      .leftJoin(bookings, eq(bookings.userId, users.id))
      .where(eq(users.role, "CUSTOMER"))
      .groupBy(users.id)
      .orderBy(desc(users.createdAt));

    return jsonOk({ customers: rows });
  } catch (error) {
    return handleRouteError(error);
  }
}

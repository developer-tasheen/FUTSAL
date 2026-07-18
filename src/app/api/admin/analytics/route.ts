import { and, eq, gte, sql } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { bookings } from "@/lib/db/schema";

function startOfDay(date = new Date()) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function daysAgo(days: number) {
  const value = startOfDay();
  value.setDate(value.getDate() - days);
  return value;
}

export async function GET() {
  try {
    await requireAdminSession();
    const db = getDatabase();
    const today = startOfDay().toISOString().slice(0, 10);
    const weekStart = daysAgo(6).toISOString().slice(0, 10);
    const monthStart = daysAgo(29).toISOString().slice(0, 10);

    const [todayCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookings)
      .where(
        and(
          eq(bookings.bookingDate, today),
          eq(bookings.status, "CONFIRMED"),
        ),
      );

    const [weekStats] = await db
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<string>`coalesce(sum(${bookings.amountFjd}), 0)`,
      })
      .from(bookings)
      .where(
        and(
          gte(bookings.bookingDate, weekStart),
          eq(bookings.status, "CONFIRMED"),
        ),
      );

    const [monthStats] = await db
      .select({
        count: sql<number>`count(*)::int`,
        revenue: sql<string>`coalesce(sum(${bookings.amountFjd}), 0)`,
      })
      .from(bookings)
      .where(
        and(
          gte(bookings.bookingDate, monthStart),
          eq(bookings.status, "CONFIRMED"),
        ),
      );

    return jsonOk({
      todayBookings: todayCount?.count ?? 0,
      weekBookings: weekStats?.count ?? 0,
      weekRevenue: Number(weekStats?.revenue ?? 0),
      monthBookings: monthStats?.count ?? 0,
      monthRevenue: Number(monthStats?.revenue ?? 0),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

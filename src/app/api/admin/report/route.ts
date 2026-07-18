import { and, asc, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { toDisplayTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courts } from "@/lib/db/schema";

const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Provide a month as YYYY-MM");

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(request.url);
    const month = monthSchema.parse(searchParams.get("month"));

    const [yearPart, monthPart] = month.split("-").map(Number);
    const start = `${month}-01`;
    const endDate = new Date(Date.UTC(yearPart, monthPart, 1));
    const end = endDate.toISOString().slice(0, 10);

    const db = getDatabase();
    const rows = await db
      .select({
        reference: bookings.reference,
        customerName: bookings.customerName,
        customerMobile: bookings.customerMobile,
        courtName: courts.name,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        amountFjd: bookings.amountFjd,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(courts, eq(bookings.courtId, courts.id))
      .where(
        and(gte(bookings.bookingDate, start), lt(bookings.bookingDate, end)),
      )
      .orderBy(asc(bookings.bookingDate), asc(bookings.startTime));

    const totals = {
      total: rows.length,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      revenue: 0,
    };

    for (const row of rows) {
      if (row.status === "CONFIRMED") {
        totals.confirmed += 1;
        totals.revenue += Number(row.amountFjd);
      } else if (row.status === "PENDING_PAYMENT") {
        totals.pending += 1;
      } else if (row.status === "CANCELLED") {
        totals.cancelled += 1;
      }
    }

    return jsonOk({
      month,
      totals,
      bookings: rows.map((row) => ({
        ...row,
        amountFjd: Number(row.amountFjd),
        timeLabel: `${toDisplayTime(row.startTime)} – ${toDisplayTime(row.endTime)}`,
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

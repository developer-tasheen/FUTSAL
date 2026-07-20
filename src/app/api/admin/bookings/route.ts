import { and, desc, eq, ilike, or } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { toDisplayTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courts } from "@/lib/db/schema";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status")?.trim();

    const filters = [];
    if (q) {
      filters.push(
        or(
          ilike(bookings.reference, `%${q}%`),
          ilike(bookings.customerName, `%${q}%`),
          ilike(bookings.customerMobile, `%${q}%`),
        ),
      );
    }
    if (
      status &&
      ["PENDING_PAYMENT", "CONFIRMED", "FAILED", "CANCELLED", "EXPIRED"].includes(
        status,
      )
    ) {
      filters.push(
        eq(
          bookings.status,
          status as
            | "PENDING_PAYMENT"
            | "CONFIRMED"
            | "FAILED"
            | "CANCELLED"
            | "EXPIRED",
        ),
      );
    }

    const rows = await db
      .select({
        id: bookings.id,
        reference: bookings.reference,
        customerName: bookings.customerName,
        customerMobile: bookings.customerMobile,
        customerEmail: bookings.customerEmail,
        courtId: bookings.courtId,
        courtName: courts.name,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        amountFjd: bookings.amountFjd,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(courts, eq(bookings.courtId, courts.id))
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(bookings.createdAt))
      .limit(100);

    return jsonOk({
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

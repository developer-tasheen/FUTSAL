import { and, eq } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { toDisplayTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courts } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await getCurrentSession();
    const db = getDatabase();

    const [row] = await db
      .select({
        id: bookings.id,
        reference: bookings.reference,
        courtName: courts.name,
        bookingDate: bookings.bookingDate,
        startTime: bookings.startTime,
        endTime: bookings.endTime,
        amountFjd: bookings.amountFjd,
        status: bookings.status,
        customerName: bookings.customerName,
        customerMobile: bookings.customerMobile,
        customerEmail: bookings.customerEmail,
        userId: bookings.userId,
      })
      .from(bookings)
      .innerJoin(courts, eq(bookings.courtId, courts.id))
      .where(eq(bookings.id, id))
      .limit(1);

    if (!row) {
      throw new Error("Booking not found");
    }

    // Guests can view their own booking by ID; logged-in users must own it
    // unless they are an admin.
    if (
      session &&
      session.role !== "ADMIN" &&
      row.userId &&
      row.userId !== session.id
    ) {
      throw new Error("FORBIDDEN");
    }

    return jsonOk({
      booking: {
        ...row,
        amountFjd: Number(row.amountFjd),
        timeLabel: `${toDisplayTime(row.startTime)} – ${toDisplayTime(row.endTime)}`,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  // Cancel booking (customer or guest with matching booking id).
  try {
    const { id } = await context.params;
    const session = await getCurrentSession();
    const db = getDatabase();
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
    };

    if (body.action !== "cancel") {
      throw new Error("Unsupported action");
    }

    const existing = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!existing) {
      throw new Error("Booking not found");
    }

    if (
      session &&
      session.role !== "ADMIN" &&
      existing.userId &&
      existing.userId !== session.id
    ) {
      throw new Error("FORBIDDEN");
    }

    if (
      existing.status === "CANCELLED" ||
      existing.status === "EXPIRED" ||
      existing.status === "FAILED"
    ) {
      throw new Error("This booking cannot be cancelled");
    }

    const [updated] = await db
      .update(bookings)
      .set({
        status: "CANCELLED",
        updatedAt: new Date(),
      })
      .where(and(eq(bookings.id, id)))
      .returning({
        id: bookings.id,
        reference: bookings.reference,
        status: bookings.status,
      });

    return jsonOk({ booking: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { and, desc, eq, inArray } from "drizzle-orm";
import { getCurrentSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { createBookingReference } from "@/lib/booking/reference";
import { getPricingRules } from "@/lib/booking/pricing";
import {
  getPriceForStart,
  getSlotEndTime,
  toDisplayTime,
} from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courts } from "@/lib/db/schema";
import { createBookingSchema } from "@/lib/validators/booking";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      throw new Error("UNAUTHORIZED");
    }

    const db = getDatabase();
    const rows = await db
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
      })
      .from(bookings)
      .innerJoin(courts, eq(bookings.courtId, courts.id))
      .where(eq(bookings.userId, session.id))
      .orderBy(desc(bookings.bookingDate), desc(bookings.startTime));

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

export async function POST(request: Request) {
  try {
    const body = createBookingSchema.parse(await request.json());
    const session = await getCurrentSession();
    const db = getDatabase();

    // Bookings open a rolling 7 days ahead. The max is +7 (not +6) to be
    // lenient across timezones — the UI only offers the strict 7-day window.
    const now = new Date();
    const minDate = now.toISOString().slice(0, 10);
    const maxDateValue = new Date(now);
    maxDateValue.setUTCDate(maxDateValue.getUTCDate() + 7);
    const maxDate = maxDateValue.toISOString().slice(0, 10);

    if (body.bookingDate < minDate) {
      throw new Error("That date has already passed");
    }
    if (body.bookingDate > maxDate) {
      throw new Error(
        "Bookings open 7 days in advance. Please pick a date within the next week",
      );
    }

    const startTime = body.startTime.length === 5
      ? `${body.startTime}:00`
      : body.startTime;
    const endTime = getSlotEndTime(startTime);
    const pricingRules = await getPricingRules();
    const amountFjd = getPriceForStart(pricingRules, startTime);

    const court = await db.query.courts.findFirst({
      where: and(eq(courts.id, body.courtId), eq(courts.isActive, true)),
    });

    if (!court) {
      throw new Error("Selected court is not available");
    }

    const clash = await db.query.bookings.findFirst({
      where: and(
        eq(bookings.courtId, body.courtId),
        eq(bookings.bookingDate, body.bookingDate),
        eq(bookings.startTime, startTime),
        inArray(bookings.status, ["PENDING_PAYMENT", "CONFIRMED"]),
      ),
    });

    if (clash) {
      throw new Error("That time slot is already booked");
    }

    let created;
    try {
      [created] = await db
        .insert(bookings)
        .values({
          reference: createBookingReference(),
          userId: session?.id,
          courtId: body.courtId,
          customerName: body.customerName,
          customerMobile: body.customerMobile.replace(/\s+/g, ""),
          customerEmail: body.customerEmail?.trim()
            ? body.customerEmail.trim().toLowerCase()
            : null,
          bookingDate: body.bookingDate,
          startTime,
          endTime,
          amountFjd: amountFjd.toFixed(2),
          // Bookings confirm only after successful payment.
          status: "PENDING_PAYMENT",
        })
        .returning();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unique")
      ) {
        throw new Error("That time slot is already booked");
      }
      throw error;
    }

    return jsonOk(
      {
        booking: {
          id: created.id,
          reference: created.reference,
          courtName: court.name,
          bookingDate: created.bookingDate,
          startTime: created.startTime,
          endTime: created.endTime,
          timeLabel: `${toDisplayTime(created.startTime)} – ${toDisplayTime(created.endTime)}`,
          amountFjd: Number(created.amountFjd),
          status: created.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

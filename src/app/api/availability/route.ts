import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getPricingRules } from "@/lib/booking/pricing";
import { generateSlotsFromRules, toDisplayTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courtBlocks } from "@/lib/db/schema";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  courtId: z.string().uuid(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse({
      date: searchParams.get("date"),
      courtId: searchParams.get("courtId"),
    });

    const db = getDatabase();
    const activeStatuses = ["PENDING_PAYMENT", "CONFIRMED"] as const;

    const [pricingRules, existingBookings, blocks] = await Promise.all([
      getPricingRules(),
      db
        .select({
          startTime: bookings.startTime,
        })
        .from(bookings)
        .where(
          and(
            eq(bookings.courtId, query.courtId),
            eq(bookings.bookingDate, query.date),
            inArray(bookings.status, [...activeStatuses]),
          ),
        ),
      db
        .select()
        .from(courtBlocks)
        .where(
          and(
            eq(courtBlocks.courtId, query.courtId),
            eq(courtBlocks.blockDate, query.date),
          ),
        ),
    ]);

    const bookedStarts = new Set(
      existingBookings.map((row) => row.startTime.slice(0, 8)),
    );

    const dayFullyBlocked = blocks.some(
      (block) => !block.startTime && !block.endTime,
    );

    const slots = generateSlotsFromRules(pricingRules).map((slot) => {
      const blockedByMaintenance = blocks.some((block) => {
        if (!block.startTime || !block.endTime) {
          return false;
        }
        return (
          slot.startTime >= block.startTime.slice(0, 8) &&
          slot.startTime < block.endTime.slice(0, 8)
        );
      });

      const isAvailable =
        !dayFullyBlocked &&
        !bookedStarts.has(slot.startTime) &&
        !blockedByMaintenance;

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        label: `${toDisplayTime(slot.startTime)} – ${toDisplayTime(slot.endTime)}`,
        amountFjd: slot.amountFjd,
        isAvailable,
      };
    });

    return jsonOk({ date: query.date, courtId: query.courtId, slots });
  } catch (error) {
    return handleRouteError(error);
  }
}

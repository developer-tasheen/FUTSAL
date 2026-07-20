import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getSlotEndTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { updateBookingSchema } from "@/lib/validators/booking";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = updateBookingSchema.parse(await request.json());
    const db = getDatabase();

    const existing = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!existing) {
      throw new Error("Booking not found");
    }

    const [updated] = await db
      .update(bookings)
      .set({
        ...body,
        customerEmail:
          body.customerEmail === "" ? null : body.customerEmail,
        amountFjd:
          body.amountFjd === undefined ? undefined : String(body.amountFjd),
        endTime:
          body.startTime === undefined
            ? undefined
            : getSlotEndTime(body.startTime),
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, id))
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

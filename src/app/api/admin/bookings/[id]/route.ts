import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { updateBookingStatusSchema } from "@/lib/validators/booking";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = updateBookingStatusSchema.parse(await request.json());
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
        status: body.status,
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

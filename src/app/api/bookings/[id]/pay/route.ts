import { eq } from "drizzle-orm";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { bookings, payments } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * Simulated M-PAiSA payment (sandbox). When the real gateway is connected,
 * this becomes: initiate -> redirect to M-PAiSA -> verify callback -> confirm.
 */
export async function POST(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = getDatabase();

    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    if (booking.status === "CONFIRMED") {
      throw new Error("This booking is already paid and confirmed");
    }

    if (booking.status !== "PENDING_PAYMENT") {
      throw new Error("This booking can no longer be paid");
    }

    const mockTransactionId = `MPAISA-${Date.now()}`;

    await db.insert(payments).values({
      bookingId: booking.id,
      amountFjd: booking.amountFjd,
      status: "COMPLETED",
      mpaisaRequestId: `REQ-${booking.reference}`,
      mpaisaTransactionId: mockTransactionId,
      responseCode: 0,
    });

    const [updated] = await db
      .update(bookings)
      .set({ status: "CONFIRMED", updatedAt: new Date() })
      .where(eq(bookings.id, booking.id))
      .returning();

    return jsonOk({
      booking: { id: updated.id, status: updated.status },
      payment: { transactionId: mockTransactionId },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

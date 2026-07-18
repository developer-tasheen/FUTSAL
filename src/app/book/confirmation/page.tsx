import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { CheckCircle2, Clock3 } from "lucide-react";
import { toDisplayTime } from "@/lib/booking/slots";
import { getDatabase } from "@/lib/db";
import { bookings, courts, payments } from "@/lib/db/schema";
import { PayButton } from "./pay-button";

export const metadata: Metadata = {
  title: "Booking confirmation",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function BookingConfirmationPage({
  searchParams,
}: PageProps) {
  const { id } = await searchParams;
  if (!id) {
    redirect("/book");
  }

  const db = getDatabase();
  const [booking] = await db
    .select({
      id: bookings.id,
      reference: bookings.reference,
      customerName: bookings.customerName,
      courtName: courts.name,
      bookingDate: bookings.bookingDate,
      startTime: bookings.startTime,
      endTime: bookings.endTime,
      amountFjd: bookings.amountFjd,
      status: bookings.status,
    })
    .from(bookings)
    .innerJoin(courts, eq(bookings.courtId, courts.id))
    .where(eq(bookings.id, id))
    .limit(1);

  if (!booking) {
    redirect("/book");
  }

  const isPending = booking.status === "PENDING_PAYMENT";
  const isConfirmed = booking.status === "CONFIRMED";
  const amountLabel = `FJD $${Number(booking.amountFjd).toFixed(2)}`;

  const payment = isConfirmed
    ? await db.query.payments.findFirst({
        where: eq(payments.bookingId, booking.id),
      })
    : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <span
          className={`inline-flex h-16 w-16 items-center justify-center rounded-full ${
            isConfirmed
              ? "bg-accent/10 text-accent"
              : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
          }`}
        >
          {isConfirmed ? <CheckCircle2 size={34} /> : <Clock3 size={34} />}
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight">
          {isConfirmed
            ? "Booking confirmed, see you on the court!"
            : isPending
              ? "Slot reserved, complete payment to confirm"
              : "Booking details"}
        </h1>
        <p className="mt-3 max-w-md text-muted">
          {isConfirmed
            ? "Your payment was received and your slot is locked in."
            : isPending
              ? "Your slot is held for you. Pay with M-PAiSA below to confirm the booking."
              : `This booking is ${booking.status.replaceAll("_", " ").toLowerCase()}.`}
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-subtle px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Booking reference
            </p>
            <p className="text-lg font-bold">{booking.reference}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isConfirmed
                ? "bg-accent/10 text-accent"
                : isPending
                  ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                  : "bg-subtle text-muted"
            }`}
          >
            {booking.status.replaceAll("_", " ")}
          </span>
        </div>
        <div className="space-y-3 px-6 py-5">
          <Row label="Customer" value={booking.customerName} />
          <Row label="Court" value={booking.courtName} />
          <Row label="Date" value={booking.bookingDate} />
          <Row
            label="Time"
            value={`${toDisplayTime(booking.startTime)} – ${toDisplayTime(booking.endTime)}`}
          />
          {payment?.mpaisaTransactionId ? (
            <Row label="Transaction" value={payment.mpaisaTransactionId} />
          ) : null}
          <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-accent">{amountLabel}</span>
          </div>
        </div>
      </div>

      {isPending ? (
        <div className="mt-6">
          <PayButton amountLabel={amountLabel} bookingId={booking.id} />
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link className="button button-secondary" href="/dashboard">
          View my bookings
        </Link>
        <Link className="button button-secondary" href="/book">
          Book another slot
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

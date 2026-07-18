import type { Metadata } from "next";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Book a court",
};

export default function BookingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        Booking
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Book your court
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Pick a day within the next week, choose your court and time, then pay
        with M-PAiSA to lock in your slot.
      </p>
      <div className="mt-10">
        <BookingForm />
      </div>
    </main>
  );
}

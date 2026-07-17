import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Book a court",
};

export default function BookingPage() {
  return (
    <PageShell
      eyebrow="Booking"
      title="Choose your court and time"
      description="The weekly availability calendar and mobile booking steps will live here."
    >
      <section className="rounded-2xl border border-dashed border-border bg-surface p-6">
        <p className="font-semibold">Booking module placeholder</p>
        <p className="mt-2 text-sm text-muted">
          Date → court → available time → customer details → review → payment
        </p>
      </section>
    </PageShell>
  );
}

import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "My bookings",
};

export default function CustomerDashboardPage() {
  return (
    <PageShell
      eyebrow="Customer dashboard"
      title="Your bookings"
      description="Upcoming bookings, booking history, receipts, cancellations, and profile settings will live here."
    />
  );
}

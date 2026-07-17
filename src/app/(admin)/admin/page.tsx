import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminDashboardPage() {
  return (
    <PageShell
      eyebrow="Administration"
      title="Venue dashboard"
      description="Bookings, courts, schedules, pricing, customers, payments, and revenue analytics will be managed here."
    />
  );
}

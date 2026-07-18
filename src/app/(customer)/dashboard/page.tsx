import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "My bookings",
};

export default function CustomerDashboardPage() {
  return <DashboardClient />;
}

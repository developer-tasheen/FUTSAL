"use client";

import {
  CalendarOff,
  ClipboardList,
  FileText,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ErrorNote, StatusBadge } from "./ui";

type Booking = {
  id: string;
  reference: string;
  customerName: string;
  courtName: string;
  bookingDate: string;
  timeLabel: string;
  amountFjd: number;
  status: string;
};

type Analytics = {
  todayBookings: number;
  weekBookings: number;
  weekRevenue: number;
  monthRevenue: number;
};

const quickLinks = [
  {
    href: "/admin/bookings",
    label: "Manage bookings",
    description: "Search, confirm, and cancel",
    icon: ClipboardList,
  },
  {
    href: "/admin/pricing",
    label: "Update pricing",
    description: "Changes show on the homepage",
    icon: Tag,
  },
  {
    href: "/admin/availability",
    label: "Block time slots",
    description: "Maintenance and events",
    icon: CalendarOff,
  },
  {
    href: "/admin/report",
    label: "Monthly report",
    description: "Print or save as PDF",
    icon: FileText,
  },
];

export function AdminClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bookingsRes, analyticsRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/analytics"),
        ]);
        const bookingsData = await bookingsRes.json();
        const analyticsData = await analyticsRes.json();
        if (!bookingsRes.ok) {
          throw new Error(bookingsData.error ?? "Could not load bookings");
        }
        if (!analyticsRes.ok) {
          throw new Error(analyticsData.error ?? "Could not load analytics");
        }
        setBookings((bookingsData.bookings ?? []).slice(0, 6));
        setAnalytics(analyticsData);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load admin data",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const stats = [
    { label: "Today's bookings", value: String(analytics?.todayBookings ?? 0) },
    { label: "This week", value: String(analytics?.weekBookings ?? 0) },
    {
      label: "Revenue (week)",
      value: `FJD $${(analytics?.weekRevenue ?? 0).toFixed(2)}`,
    },
    {
      label: "Revenue (month)",
      value: `FJD $${(analytics?.monthRevenue ?? 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Venue dashboard
      </h1>
      <ErrorNote message={error} />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            className="rounded-2xl border border-border bg-surface p-5"
            key={stat.label}
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-xl font-bold sm:text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-accent"
            href={link.href}
            key={link.href}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <link.icon size={20} />
            </span>
            <span>
              <span className="block font-semibold group-hover:text-accent">
                {link.label}
              </span>
              <span className="mt-0.5 block text-sm text-muted">
                {link.description}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Latest bookings</h2>
          <Link
            className="text-sm font-semibold text-accent hover:underline"
            href="/admin/bookings"
          >
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-subtle text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr className="border-t border-border" key={booking.id}>
                  <td className="px-4 py-3 font-medium">{booking.reference}</td>
                  <td className="px-4 py-3">{booking.customerName}</td>
                  <td className="px-4 py-3">{booking.bookingDate}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {booking.timeLabel}
                  </td>
                  <td className="px-4 py-3">
                    FJD ${booking.amountFjd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
              {!loading && bookings.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={6}>
                    No bookings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

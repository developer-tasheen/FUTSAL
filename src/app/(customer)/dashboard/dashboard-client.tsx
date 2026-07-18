"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Booking = {
  id: string;
  reference: string;
  courtName: string;
  bookingDate: string;
  timeLabel: string;
  amountFjd: number;
  status: string;
};

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "CONFIRMED" || status === "COMPLETED"
      ? "bg-accent/10 text-accent"
      : status === "PENDING_PAYMENT"
        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        : "bg-subtle text-muted";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function DashboardClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    setLoading(true);
    setError("");
    try {
      const me = await fetch("/api/auth/me");
      const meData = await me.json();
      if (!meData.user) {
        setError("Please log in to view your bookings.");
        setBookings([]);
        return;
      }

      const response = await fetch("/api/bookings");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not load bookings");
      }
      setBookings(data.bookings ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load bookings",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Fetch after mount; intentional client-side load for interactive dashboard.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- data fetch on mount
    void loadBookings();
  }, []);

  const upcoming = useMemo(
    () =>
      bookings.filter((booking) =>
        ["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status),
      ),
    [bookings],
  );

  const history = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          !["PENDING_PAYMENT", "CONFIRMED"].includes(booking.status),
      ),
    [bookings],
  );

  async function cancelBooking(id: string) {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not cancel booking");
      return;
    }
    await loadBookings();
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            My account
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Your bookings
          </h1>
        </div>
        <Link className="button button-primary" href="/book">
          BOOK NOW
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}{" "}
          {error.includes("log in") ? (
            <Link className="font-semibold underline" href="/login">
              Go to login
            </Link>
          ) : null}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Upcoming</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No upcoming bookings yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {upcoming.map((booking) => (
              <div
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
                key={booking.id}
              >
                <div>
                  <p className="text-sm text-muted">{booking.reference}</p>
                  <p className="mt-1 text-lg font-semibold">
                    {booking.bookingDate} · {booking.timeLabel}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {booking.courtName} · FJD ${booking.amountFjd.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={booking.status} />
                  {booking.status === "PENDING_PAYMENT" ? (
                    <Link
                      className="button button-primary min-h-10 px-4 py-2 text-sm"
                      href={`/book/confirmation?id=${booking.id}`}
                    >
                      Pay now
                    </Link>
                  ) : null}
                  <button
                    className="button button-secondary min-h-10 px-4 py-2 text-sm"
                    onClick={() => void cancelBooking(booking.id)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">Booking history</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-subtle text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Court</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((booking) => (
                <tr className="border-t border-border" key={booking.id}>
                  <td className="px-4 py-3 font-medium">{booking.reference}</td>
                  <td className="px-4 py-3">{booking.courtName}</td>
                  <td className="px-4 py-3">{booking.bookingDate}</td>
                  <td className="px-4 py-3">{booking.timeLabel}</td>
                  <td className="px-4 py-3">
                    FJD ${booking.amountFjd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
              {!loading && history.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={6}>
                    No past bookings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

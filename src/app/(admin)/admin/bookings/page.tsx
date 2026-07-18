"use client";

import { useEffect, useState } from "react";
import { ErrorNote, PageTitle, StatusBadge } from "../ui";

type Booking = {
  id: string;
  reference: string;
  customerName: string;
  customerMobile: string;
  courtName: string;
  bookingDate: string;
  timeLabel: string;
  amountFjd: number;
  status: string;
};

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "PENDING_PAYMENT", label: "Pending payment" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "FAILED", label: "Failed" },
  { value: "EXPIRED", label: "Expired" },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query.trim()) {
          params.set("q", query.trim());
        }
        if (status) {
          params.set("status", status);
        }
        const response = await fetch(
          `/api/admin/bookings${params.size ? `?${params}` : ""}`,
        );
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
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on demand via reloadKey
  }, [reloadKey, status]);

  async function updateStatus(id: string, newStatus: string) {
    setError("");
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not update booking");
      return;
    }
    setReloadKey((key) => key + 1);
  }

  return (
    <div>
      <PageTitle
        description="Search, filter, confirm, and cancel court bookings."
        title="Bookings"
      />
      <ErrorNote message={error} />

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Search bookings"
          className="input sm:max-w-xs"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setReloadKey((key) => key + 1);
            }
          }}
          placeholder="Search name, mobile, or reference…"
          type="search"
          value={query}
        />
        <select
          aria-label="Filter by status"
          className="input sm:max-w-48"
          onChange={(event) => setStatus(event.target.value)}
          value={status}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className="button button-secondary"
          onClick={() => setReloadKey((key) => key + 1)}
          type="button"
        >
          Search
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-subtle text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Reference</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Mobile</th>
              <th className="px-4 py-3 font-semibold">Court</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr className="border-t border-border" key={booking.id}>
                <td className="px-4 py-3 font-medium">{booking.reference}</td>
                <td className="px-4 py-3">{booking.customerName}</td>
                <td className="px-4 py-3">{booking.customerMobile}</td>
                <td className="px-4 py-3">{booking.courtName}</td>
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
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {booking.status !== "CONFIRMED" ? (
                      <button
                        className="font-medium text-accent hover:underline"
                        onClick={() =>
                          void updateStatus(booking.id, "CONFIRMED")
                        }
                        type="button"
                      >
                        Confirm
                      </button>
                    ) : null}
                    {booking.status !== "CANCELLED" ? (
                      <button
                        className="font-medium text-muted hover:underline"
                        onClick={() =>
                          void updateStatus(booking.id, "CANCELLED")
                        }
                        type="button"
                      >
                        Cancel
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={9}>
                  No bookings found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

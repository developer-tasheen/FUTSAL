"use client";

import { ClipboardList, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ActionMenu,
  CountBadge,
  ErrorNote,
  Pagination,
  PageHeader,
  SectionCard,
  StatusBadge,
  type ActionItem,
  usePagination,
} from "../ui";

type Booking = {
  id: string;
  reference: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string | null;
  courtId: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  timeLabel: string;
  amountFjd: number;
  status: string;
};
type Court = { id: string; name: string };

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
  const [courts, setCourts] = useState<Court[]>([]);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, pageItems, setPage, totalPages } = usePagination(bookings);

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
        const [response, courtsResponse] = await Promise.all([
          fetch(`/api/admin/bookings${params.size ? `?${params}` : ""}`),
          fetch("/api/admin/courts"),
        ]);
        const [data, courtsData] = await Promise.all([
          response.json(),
          courtsResponse.json(),
        ]);
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load bookings");
        }
        if (!courtsResponse.ok) {
          throw new Error(courtsData.error ?? "Could not load courts");
        }
        setBookings(data.bookings ?? []);
        setCourts(courtsData.courts ?? []);
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

  async function saveBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    setError("");
    const response = await fetch(`/api/admin/bookings/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: editing.customerName,
        customerMobile: editing.customerMobile,
        customerEmail: editing.customerEmail ?? "",
        courtId: editing.courtId,
        bookingDate: editing.bookingDate,
        startTime: editing.startTime.slice(0, 5),
        amountFjd: editing.amountFjd,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not update booking");
      return;
    }
    setEditing(null);
    setReloadKey((key) => key + 1);
  }

  return (
    <>
      <PageHeader
        description="Search, filter, confirm, and cancel court bookings."
        icon={ClipboardList}
        title="Bookings"
      />
      <ErrorNote message={error} />

      <SectionCard
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <CountBadge count={bookings.length} label="results" />
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                size={14}
              />
              <input
                aria-label="Search bookings"
                className="input input-icon-left w-52 py-2 text-sm"
                id="bookingSearch"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setReloadKey((key) => key + 1);
                  }
                }}
                placeholder="Name, mobile, or reference…"
                type="search"
                value={query}
              />
            </div>
            <select
              aria-label="Filter booking status"
              className="input w-40 py-2 text-sm"
              id="bookingStatus"
              onChange={(event) => setStatus(event.target.value)}
              value={status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        }
        flush
        title="All bookings"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-subtle/40 text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Reference</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Mobile</th>
                <th className="px-5 py-3 font-semibold">Court</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((booking) => (
                <tr className="border-t border-border" key={booking.id}>
                  <td className="px-5 py-3 font-medium">{booking.reference}</td>
                  <td className="px-5 py-3">{booking.customerName}</td>
                  <td className="px-5 py-3">{booking.customerMobile}</td>
                  <td className="px-5 py-3">{booking.courtName}</td>
                  <td className="px-5 py-3">{booking.bookingDate}</td>
                  <td className="whitespace-nowrap px-5 py-3">
                    {booking.timeLabel}
                  </td>
                  <td className="px-5 py-3">
                    FJD ${booking.amountFjd.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-5 py-3">
                    <ActionMenu
                      items={
                        [
                          booking.status !== "CONFIRMED"
                            ? {
                                label: "Confirm booking",
                                tone: "accent",
                                onSelect: () =>
                                  void updateStatus(booking.id, "CONFIRMED"),
                              }
                            : null,
                          {
                            label: "Edit booking",
                            onSelect: () => setEditing({ ...booking }),
                          },
                          booking.status !== "CANCELLED"
                            ? {
                                label: "Cancel booking",
                                tone: "danger",
                                onSelect: () =>
                                  void updateStatus(booking.id, "CANCELLED"),
                              }
                            : null,
                        ].filter(Boolean) as ActionItem[]
                      }
                    />
                  </td>
                </tr>
              ))}
              {!loading && bookings.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-muted" colSpan={9}>
                    No bookings found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <Pagination
          onPageChange={setPage}
          page={page}
          totalItems={bookings.length}
          totalPages={totalPages}
        />
      </SectionCard>

      {editing ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <form
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl"
            onSubmit={(event) => void saveBooking(event)}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-semibold">Edit booking</h2>
                <p className="text-xs text-muted">{editing.reference}</p>
              </div>
              <button
                aria-label="Close"
                className="rounded-lg p-2 text-muted hover:bg-subtle"
                onClick={() => setEditing(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="editName">Customer name</label>
                <input
                  className="input"
                  id="editName"
                  onChange={(event) =>
                    setEditing({ ...editing, customerName: event.target.value })
                  }
                  required
                  value={editing.customerName}
                />
              </div>
              <div>
                <label className="label" htmlFor="editMobile">Mobile</label>
                <input
                  className="input"
                  id="editMobile"
                  onChange={(event) =>
                    setEditing({ ...editing, customerMobile: event.target.value })
                  }
                  required
                  value={editing.customerMobile}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label" htmlFor="editEmail">Email (optional)</label>
                <input
                  className="input"
                  id="editEmail"
                  onChange={(event) =>
                    setEditing({ ...editing, customerEmail: event.target.value })
                  }
                  type="email"
                  value={editing.customerEmail ?? ""}
                />
              </div>
              <div>
                <label className="label" htmlFor="editCourt">Court</label>
                <select
                  className="input"
                  id="editCourt"
                  onChange={(event) =>
                    setEditing({ ...editing, courtId: event.target.value })
                  }
                  value={editing.courtId}
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="editDate">Date</label>
                <input
                  className="input"
                  id="editDate"
                  onChange={(event) =>
                    setEditing({ ...editing, bookingDate: event.target.value })
                  }
                  required
                  type="date"
                  value={editing.bookingDate}
                />
              </div>
              <div>
                <label className="label" htmlFor="editTime">Start time</label>
                <input
                  className="input"
                  id="editTime"
                  onChange={(event) =>
                    setEditing({ ...editing, startTime: event.target.value })
                  }
                  required
                  type="time"
                  value={editing.startTime.slice(0, 5)}
                />
              </div>
              <div>
                <label className="label" htmlFor="editAmount">Amount (FJD)</label>
                <input
                  className="input"
                  id="editAmount"
                  min="1"
                  onChange={(event) =>
                    setEditing({ ...editing, amountFjd: Number(event.target.value) })
                  }
                  required
                  step="0.01"
                  type="number"
                  value={editing.amountFjd}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-5 py-4">
              <button
                className="button button-secondary"
                onClick={() => setEditing(null)}
                type="button"
              >
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                Save changes
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}

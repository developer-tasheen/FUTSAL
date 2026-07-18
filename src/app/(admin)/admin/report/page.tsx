"use client";

import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorNote, PageTitle, StatusBadge } from "../ui";

type ReportBooking = {
  reference: string;
  customerName: string;
  customerMobile: string;
  courtName: string;
  bookingDate: string;
  timeLabel: string;
  amountFjd: number;
  status: string;
};

type Report = {
  month: string;
  totals: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    revenue: number;
  };
  bookings: ReportBooking[];
};

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function monthLabel(month: string) {
  const [year, monthPart] = month.split("-").map(Number);
  return new Date(year, monthPart - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function AdminReportPage() {
  const [month, setMonth] = useState(currentMonth());
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/admin/report?month=${month}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load report");
        }
        setReport(data);
      } catch (loadError) {
        setReport(null);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load report",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [month]);

  const summary = [
    { label: "Total bookings", value: String(report?.totals.total ?? 0) },
    { label: "Confirmed", value: String(report?.totals.confirmed ?? 0) },
    { label: "Pending", value: String(report?.totals.pending ?? 0) },
    { label: "Cancelled", value: String(report?.totals.cancelled ?? 0) },
    {
      label: "Revenue (confirmed)",
      value: `FJD $${(report?.totals.revenue ?? 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <div className="no-print">
        <PageTitle
          description="Pick a month, review the numbers, then print or save as PDF."
          title="Monthly report"
        />
        <ErrorNote message={error} />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            aria-label="Report month"
            className="input max-w-52"
            onChange={(event) => setMonth(event.target.value)}
            type="month"
            value={month}
          />
          <button
            className="button button-primary"
            onClick={() => window.print()}
            type="button"
          >
            <Printer className="mr-2" size={18} />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable report */}
      <div className="mt-8 print:mt-0">
        <div className="hidden print:block">
          <h1 className="text-2xl font-bold">Naikabula Futsal Court</h1>
          <p className="mt-1 text-sm">
            Monthly booking report for {monthLabel(month)}
          </p>
          <hr className="my-4" />
        </div>

        <h2 className="text-lg font-semibold print:hidden">
          {monthLabel(month)} summary
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {summary.map((item) => (
            <div
              className="rounded-2xl border border-border bg-surface p-4 print:rounded-none print:border-black/20"
              key={item.label}
            >
              <p className="text-xs text-muted sm:text-sm">{item.label}</p>
              <p className="mt-1 text-lg font-bold sm:text-xl">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border print:rounded-none print:border-black/20">
          <table className="w-full min-w-[720px] text-left text-sm print:min-w-0">
            <thead className="bg-subtle text-muted print:bg-transparent print:text-black">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Court</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {(report?.bookings ?? []).map((booking) => (
                <tr className="border-t border-border" key={booking.reference}>
                  <td className="px-4 py-3 font-medium">{booking.reference}</td>
                  <td className="px-4 py-3">{booking.customerName}</td>
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
                </tr>
              ))}
              {!loading && (report?.bookings.length ?? 0) === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted" colSpan={7}>
                    No bookings in this month.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <p className="mt-4 hidden text-xs print:block">
          Generated on {new Date().toLocaleString()} by the Naikabula Futsal
          Court booking system.
        </p>
      </div>
    </div>
  );
}

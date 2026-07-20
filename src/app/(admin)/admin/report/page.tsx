"use client";

import { FileText, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CountBadge,
  ErrorNote,
  Pagination,
  PageHeader,
  SectionCard,
  StatusBadge,
  usePagination,
} from "../ui";

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
  const reportBookings = report?.bookings ?? [];
  const { page, setPage, totalPages } = usePagination(reportBookings);

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
    <>
      <div className="no-print">
        <PageHeader
          actions={
            <button
              className="button button-primary"
              onClick={() => window.print()}
              type="button"
            >
              <Printer className="mr-2" size={18} />
              Print / Save as PDF
            </button>
          }
          description="Pick a month, review the numbers, then print or save as PDF."
          icon={FileText}
          title="Monthly report"
        />
        <ErrorNote message={error} />

        <SectionCard title="Report period">
          <div className="max-w-xs">
            <label className="label" htmlFor="reportMonth">
              Month
            </label>
            <input
              className="input"
              id="reportMonth"
              onChange={(event) => setMonth(event.target.value)}
              type="month"
              value={month}
            />
          </div>
        </SectionCard>
      </div>

      <div className="print:mt-0">
        <div className="mb-6 hidden print:block">
          <h1 className="text-2xl font-bold">Naikabula Futsal Court</h1>
          <p className="mt-1 text-sm">
            Monthly booking report for {monthLabel(month)}
          </p>
          <hr className="my-4" />
        </div>

        <SectionCard title={`${monthLabel(month)} summary`}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summary.map((item) => (
              <div
                className="rounded-xl border border-border bg-background p-4 print:rounded-none print:border-black/20"
                key={item.label}
              >
                <p className="text-xs text-muted sm:text-sm">{item.label}</p>
                <p className="mt-1 text-lg font-bold sm:text-xl">{item.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          actions={
            <CountBadge
              count={report?.bookings.length ?? 0}
              label="bookings"
            />
          }
          flush
          title="Booking details"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm print:min-w-0">
              <thead className="bg-subtle/40 text-muted print:bg-transparent print:text-black">
                <tr>
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Court</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportBookings.map((booking, index) => (
                  <tr
                    className={`border-t border-border print:table-row ${
                      index < (page - 1) * 10 || index >= page * 10
                        ? "hidden"
                        : ""
                    }`}
                    key={booking.reference}
                  >
                    <td className="px-5 py-3 font-medium">{booking.reference}</td>
                    <td className="px-5 py-3">{booking.customerName}</td>
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
                  </tr>
                ))}
                {!loading && (report?.bookings.length ?? 0) === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-muted" colSpan={7}>
                      No bookings in this month.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className="print:hidden">
            <Pagination
              onPageChange={setPage}
              page={page}
              totalItems={reportBookings.length}
              totalPages={totalPages}
            />
          </div>
        </SectionCard>

        <p className="mt-4 hidden text-xs print:block">
          Generated on {new Date().toLocaleString()} by the Naikabula Futsal
          Court booking system.
        </p>
      </div>
    </>
  );
}

"use client";

import { Users } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CountBadge,
  ErrorNote,
  Pagination,
  PageHeader,
  SectionCard,
  usePagination,
} from "../ui";

type Customer = {
  id: string;
  name: string;
  mobileNumber: string;
  email: string | null;
  createdAt: string;
  bookingsCount: number;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, pageItems, setPage, totalPages } = usePagination(customers);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/customers");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load customers");
        }
        setCustomers(data.customers ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load customers",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <>
      <PageHeader
        description="Registered customer accounts and their booking activity."
        icon={Users}
        title="Customers"
      />
      <ErrorNote message={error} />

      <SectionCard
        actions={<CountBadge count={customers.length} label="customers" />}
        flush
        title="Registered customers"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-subtle/40 text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Mobile</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Bookings</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((customer) => (
                <tr className="border-t border-border" key={customer.id}>
                  <td className="px-5 py-3 font-medium">{customer.name}</td>
                  <td className="px-5 py-3">{customer.mobileNumber}</td>
                  <td className="px-5 py-3 text-muted">
                    {customer.email ?? "—"}
                  </td>
                  <td className="px-5 py-3">{customer.bookingsCount}</td>
                  <td className="px-5 py-3 text-muted">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!loading && customers.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-muted" colSpan={5}>
                    No registered customers yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <Pagination
          onPageChange={setPage}
          page={page}
          totalItems={customers.length}
          totalPages={totalPages}
        />
      </SectionCard>
    </>
  );
}

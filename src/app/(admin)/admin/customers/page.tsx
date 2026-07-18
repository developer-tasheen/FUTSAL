"use client";

import { useEffect, useState } from "react";
import { ErrorNote, PageTitle } from "../ui";

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
    <div>
      <PageTitle
        description="Registered customer accounts and their booking activity."
        title="Customers"
      />
      <ErrorNote message={error} />

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-subtle text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Mobile</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Bookings</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr className="border-t border-border" key={customer.id}>
                <td className="px-4 py-3 font-medium">{customer.name}</td>
                <td className="px-4 py-3">{customer.mobileNumber}</td>
                <td className="px-4 py-3 text-muted">
                  {customer.email ?? "—"}
                </td>
                <td className="px-4 py-3">{customer.bookingsCount}</td>
                <td className="px-4 py-3 text-muted">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {!loading && customers.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={5}>
                  No registered customers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { Warehouse } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  ActionMenu,
  CountBadge,
  ErrorNote,
  Pagination,
  PageHeader,
  SectionCard,
  SuccessNote,
  usePagination,
} from "../ui";

type Court = {
  id: string;
  name: string;
  isActive: boolean;
  notes: string | null;
};

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const { page, pageItems, setPage, totalPages } = usePagination(courts);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/courts");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load courts");
        }
        setCourts(data.courts ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load courts",
        );
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [reloadKey]);

  async function createCourt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const response = await fetch("/api/admin/courts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, notes }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not create court");
      return;
    }
    setName("");
    setNotes("");
    setSuccess(`Court "${data.court.name}" added.`);
    setReloadKey((key) => key + 1);
  }

  async function toggleActive(court: Court) {
    setError("");
    setSuccess("");
    const response = await fetch(`/api/admin/courts/${court.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !court.isActive }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not update court");
      return;
    }
    setReloadKey((key) => key + 1);
  }

  async function renameCourt(court: Court) {
    const newName = window.prompt("Rename court", court.name);
    if (!newName || newName.trim() === court.name) {
      return;
    }
    setError("");
    setSuccess("");
    const response = await fetch(`/api/admin/courts/${court.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not rename court");
      return;
    }
    setReloadKey((key) => key + 1);
  }

  async function deleteCourt(court: Court) {
    const confirmed = window.confirm(
      `Delete "${court.name}"? Courts with bookings cannot be deleted.`,
    );
    if (!confirmed) {
      return;
    }
    setError("");
    setSuccess("");
    const response = await fetch(`/api/admin/courts/${court.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not delete court");
      return;
    }
    setSuccess(`Court "${court.name}" deleted.`);
    setReloadKey((key) => key + 1);
  }

  return (
    <>
      <PageHeader
        description="Add, rename, activate, or remove courts. Inactive courts cannot be booked."
        icon={Warehouse}
        title="Courts"
      />
      <ErrorNote message={error} />
      <SuccessNote message={success} />

      <SectionCard
        description="New courts appear on the booking page once active."
        title="Add a court"
      >
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => void createCourt(event)}
        >
          <div className="flex-1">
            <label className="label" htmlFor="courtName">
              Court name
            </label>
            <input
              className="input"
              id="courtName"
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Court 2"
              required
              type="text"
              value={name}
            />
          </div>
          <div className="flex-1">
            <label className="label" htmlFor="courtNotes">
              Notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              className="input"
              id="courtNotes"
              onChange={(event) => setNotes(event.target.value)}
              placeholder="e.g. Outdoor court"
              type="text"
              value={notes}
            />
          </div>
          <button className="button button-primary" type="submit">
            Add court
          </button>
        </form>
      </SectionCard>

      <SectionCard
        actions={<CountBadge count={courts.length} label="courts" />}
        flush
        title="Your courts"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-subtle/40 text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Notes</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((court) => (
                <tr className="border-t border-border" key={court.id}>
                  <td className="px-5 py-3 font-medium">{court.name}</td>
                  <td className="px-5 py-3 text-muted">{court.notes ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        court.isActive
                          ? "bg-accent/10 text-accent"
                          : "bg-subtle text-muted"
                      }`}
                    >
                      {court.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <ActionMenu
                      items={[
                        {
                          label: court.isActive ? "Deactivate" : "Activate",
                          tone: "accent",
                          onSelect: () => void toggleActive(court),
                        },
                        {
                          label: "Rename",
                          onSelect: () => void renameCourt(court),
                        },
                        {
                          label: "Delete",
                          tone: "danger",
                          onSelect: () => void deleteCourt(court),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {!loading && courts.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-muted" colSpan={4}>
                    No courts yet. Add your first court above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <Pagination
          onPageChange={setPage}
          page={page}
          totalItems={courts.length}
          totalPages={totalPages}
        />
      </SectionCard>
    </>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ErrorNote, PageTitle, SuccessNote } from "../ui";

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
    <div>
      <PageTitle
        description="Add, rename, activate, or remove courts. Inactive courts cannot be booked."
        title="Courts"
      />
      <ErrorNote message={error} />
      <SuccessNote message={success} />

      <form
        className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-end"
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

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-subtle text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Notes</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courts.map((court) => (
              <tr className="border-t border-border" key={court.id}>
                <td className="px-4 py-3 font-medium">{court.name}</td>
                <td className="px-4 py-3 text-muted">{court.notes ?? "—"}</td>
                <td className="px-4 py-3">
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
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      className="font-medium text-accent hover:underline"
                      onClick={() => void toggleActive(court)}
                      type="button"
                    >
                      {court.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="font-medium hover:underline"
                      onClick={() => void renameCourt(court)}
                      type="button"
                    >
                      Rename
                    </button>
                    <button
                      className="font-medium text-red-500 hover:underline"
                      onClick={() => void deleteCourt(court)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && courts.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={4}>
                  No courts yet. Add your first court above.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { ErrorNote, PageTitle, SuccessNote } from "../ui";

type Court = { id: string; name: string };
type Block = {
  id: string;
  courtName: string;
  blockDate: string;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

export default function AdminAvailabilityPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [courtId, setCourtId] = useState("");
  const [blockDate, setBlockDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [courtsRes, blocksRes] = await Promise.all([
          fetch("/api/admin/courts"),
          fetch("/api/admin/blocks"),
        ]);
        const courtsData = await courtsRes.json();
        const blocksData = await blocksRes.json();
        if (!courtsRes.ok) {
          throw new Error(courtsData.error ?? "Could not load courts");
        }
        if (!blocksRes.ok) {
          throw new Error(blocksData.error ?? "Could not load blocks");
        }
        setCourts(courtsData.courts ?? []);
        setBlocks(blocksData.blocks ?? []);
        if (!courtId && courtsData.courts?.length) {
          setCourtId(courtsData.courts[0].id);
        }
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load availability data",
        );
      }
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload on demand via reloadKey
  }, [reloadKey]);

  async function createBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    const response = await fetch("/api/admin/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courtId,
        blockDate,
        startTime,
        endTime,
        reason,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not create block");
      return;
    }
    setBlockDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setSuccess("Block added. Those slots are now unavailable for booking.");
    setReloadKey((key) => key + 1);
  }

  async function removeBlock(id: string) {
    setError("");
    setSuccess("");
    const response = await fetch(`/api/admin/blocks/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not remove block");
      return;
    }
    setSuccess("Block removed. Those slots are bookable again.");
    setReloadKey((key) => key + 1);
  }

  return (
    <div>
      <PageTitle
        description="Block a whole day or specific hours for maintenance or events. Blocked slots disappear from the booking calendar."
        title="Availability"
      />
      <ErrorNote message={error} />
      <SuccessNote message={success} />

      <form
        className="mt-6 grid gap-3 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-6"
        onSubmit={(event) => void createBlock(event)}
      >
        <div className="lg:col-span-2">
          <label className="label" htmlFor="blockCourt">
            Court
          </label>
          <select
            className="input"
            id="blockCourt"
            onChange={(event) => setCourtId(event.target.value)}
            required
            value={courtId}
          >
            {courts.map((court) => (
              <option key={court.id} value={court.id}>
                {court.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="blockDate">
            Date
          </label>
          <input
            className="input"
            id="blockDate"
            onChange={(event) => setBlockDate(event.target.value)}
            required
            type="date"
            value={blockDate}
          />
        </div>
        <div>
          <label className="label" htmlFor="blockStart">
            From <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            className="input"
            id="blockStart"
            onChange={(event) => setStartTime(event.target.value)}
            type="time"
            value={startTime}
          />
        </div>
        <div>
          <label className="label" htmlFor="blockEnd">
            To <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            className="input"
            id="blockEnd"
            onChange={(event) => setEndTime(event.target.value)}
            type="time"
            value={endTime}
          />
        </div>
        <div className="flex items-end">
          <button className="button button-primary w-full" type="submit">
            Block
          </button>
        </div>
        <div className="sm:col-span-2 lg:col-span-6">
          <label className="label" htmlFor="blockReason">
            Reason <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            className="input"
            id="blockReason"
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. Court maintenance, private event…"
            type="text"
            value={reason}
          />
        </div>
        <p className="text-xs text-muted sm:col-span-2 lg:col-span-6">
          Leave the times empty to block the entire day.
        </p>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-subtle text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Court</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Reason</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr className="border-t border-border" key={block.id}>
                <td className="px-4 py-3 font-medium">{block.courtName}</td>
                <td className="px-4 py-3">{block.blockDate}</td>
                <td className="px-4 py-3">
                  {block.startTime && block.endTime
                    ? `${block.startTime.slice(0, 5)} – ${block.endTime.slice(0, 5)}`
                    : "Full day"}
                </td>
                <td className="px-4 py-3 text-muted">{block.reason ?? "—"}</td>
                <td className="px-4 py-3">
                  <button
                    className="font-medium text-red-500 hover:underline"
                    onClick={() => void removeBlock(block.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {blocks.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted" colSpan={5}>
                  No blocks. All slots are open for booking.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

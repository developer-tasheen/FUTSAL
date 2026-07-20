"use client";

import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

export const ADMIN_PAGE_SIZE = 10;

export function usePagination<T>(items: T[], pageSize = ADMIN_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  return { page: safePage, pageItems, setPage, totalPages };
}

export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize = ADMIN_PAGE_SIZE,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}) {
  if (!totalItems) {
    return null;
  }

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted">
        Showing {first}–{last} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          Previous
        </button>
        <span className="min-w-20 text-center text-xs font-medium text-muted">
          Page {page} of {totalPages}
        </span>
        <button
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export type ActionItem = {
  label: string;
  onSelect: () => void;
  tone?: "default" | "accent" | "danger";
};

/** Native select dropdown used for row CRUD actions. */
export function ActionMenu({ items }: { items: ActionItem[] }) {
  if (!items.length) {
    return <span className="text-xs text-muted">—</span>;
  }

  return (
    <div className="relative inline-block min-w-[8.5rem]">
      <select
        aria-label="Row actions"
        className="input cursor-pointer appearance-none py-2 pr-9 text-sm font-medium"
        defaultValue=""
        onChange={(event) => {
          const selected = items.find(
            (item) => item.label === event.target.value,
          );
          event.target.value = "";
          selected?.onSelect();
        }}
      >
        <option disabled value="">
          Actions
        </option>
        {items.map((item) => (
          <option key={item.label} value={item.label}>
            {item.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        size={14}
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "CONFIRMED"
      ? "bg-accent/10 text-accent"
      : status === "PENDING_PAYMENT"
        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        : "bg-subtle text-muted";
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon size={22} />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  actions,
  flush = false,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  /** Render children without padding, e.g. for tables. */
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-subtle/60 px-5 py-3.5">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted">{description}</p>
          ) : null}
        </div>
        {actions}
      </div>
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}

export function CountBadge({ count, label }: { count: number; label: string }) {
  return (
    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
      {count} {label}
    </span>
  );
}

export function ErrorNote({ message }: { message: string }) {
  if (!message) {
    return null;
  }
  return (
    <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export function SuccessNote({ message }: { message: string }) {
  if (!message) {
    return null;
  }
  return (
    <p className="mt-4 rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
      {message}
    </p>
  );
}

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

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
      {description ? (
        <p className="mt-2 text-sm text-muted">{description}</p>
      ) : null}
    </div>
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

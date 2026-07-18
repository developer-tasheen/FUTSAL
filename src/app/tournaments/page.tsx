import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tournaments",
};

const steps = [
  {
    title: "Get in touch",
    description:
      "Call or email us with your preferred dates, number of teams, and tournament format.",
  },
  {
    title: "Confirm the details",
    description:
      "We will check court availability and confirm the schedule, pricing, and any special requirements with you.",
  },
  {
    title: "Lock it in",
    description:
      "Once confirmed, the court is reserved for your tournament and blocked from regular bookings.",
  },
];

export default function TournamentsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        Tournaments
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
        Host your tournament at Naikabula Futsal Court
      </h1>
      <p className="mt-4 max-w-2xl leading-7 text-muted">
        Tournament bookings are arranged manually so we can plan the full day
        around your event: court time, scheduling, and setup. Contact us and
        we will organise everything with you directly.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            className="rounded-2xl border border-border bg-surface p-6"
            key={step.title}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
              {index + 1}
            </span>
            <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-subtle p-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          Planning a tournament?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-muted">
          Reach out with your dates and we will take care of the rest.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="button button-primary" href="/contact">
            Contact us to book
          </Link>
          <Link className="button button-secondary" href="/book">
            Regular court booking
          </Link>
        </div>
      </div>
    </main>
  );
}

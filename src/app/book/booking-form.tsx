"use client";

import {
  CalendarDays,
  Clock,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Court = { id: string; name: string };
type Slot = {
  startTime: string;
  endTime: string;
  label: string;
  amountFjd: number;
  isAvailable: boolean;
};
type Account = {
  name: string;
  mobileNumber: string;
  email: string | null;
};

function toLocalIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Customers can book up to 7 days ahead — today through 6 days from now. */
function getBookingDays() {
  const now = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() + index);
    return {
      iso: toLocalIso(day),
      weekday:
        index === 0
          ? "Today"
          : day.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: day.getDate(),
      month: day.toLocaleDateString("en-US", { month: "short" }),
      dateLabel: day.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
    };
  });
}

function StepHeading({
  step,
  title,
  hint,
}: {
  step: number;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
        {step}
      </span>
      <div>
        <h2 className="min-w-0 text-base font-semibold leading-7 sm:text-lg">{title}</h2>
        {hint ? <p className="mt-0.5 text-sm text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}

export function BookingForm() {
  const router = useRouter();
  const bookingDays = useMemo(() => getBookingDays(), []);

  const [courts, setCourts] = useState<Court[]>([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState(bookingDays[0].iso);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [account, setAccount] = useState<Account | null>(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadInitial() {
      const [courtsRes, meRes] = await Promise.all([
        fetch("/api/courts"),
        fetch("/api/auth/me"),
      ]);
      const courtsData = await courtsRes.json();
      const meData = await meRes.json();

      if (courtsRes.ok && courtsData.courts?.length) {
        setCourts(courtsData.courts);
        setCourtId(courtsData.courts[0].id);
      }

      if (meData.user) {
        setAccount(meData.user);
        setFullName(meData.user.name);
        setMobile(meData.user.mobileNumber);
        setEmail(meData.user.email ?? "");
      }
    }
    void loadInitial();
  }, []);

  useEffect(() => {
    async function loadSlots() {
      if (!courtId || !date) {
        return;
      }
      setLoadingSlots(true);
      setSelectedSlot(null);
      setError("");
      try {
        const response = await fetch(
          `/api/availability?date=${date}&courtId=${courtId}`,
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load availability");
        }
        setSlots(data.slots ?? []);
      } catch (loadError) {
        setSlots([]);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load availability",
        );
      } finally {
        setLoadingSlots(false);
      }
    }
    void loadSlots();
  }, [courtId, date]);

  const selectedCourtName = useMemo(
    () => courts.find((court) => court.id === courtId)?.name ?? "—",
    [courts, courtId],
  );

  const selectedDay = useMemo(
    () => bookingDays.find((day) => day.iso === date),
    [bookingDays, date],
  );

  const isToday = date === bookingDays[0].iso;
  const currentHour = new Date().getHours();

  function slotHasPassed(slot: Slot) {
    return isToday && Number(slot.startTime.slice(0, 2)) <= currentHour;
  }

  const detailsComplete = account
    ? true
    : Boolean(fullName.trim() && mobile.trim());

  async function submitBooking() {
    if (!selectedSlot) {
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId,
          bookingDate: date,
          startTime: selectedSlot.startTime,
          customerName: account ? account.name : fullName,
          customerMobile: account ? account.mobileNumber : mobile,
          customerEmail: account ? (account.email ?? "") : email,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create booking");
      }
      router.push(`/book/confirmation?id=${data.booking.id}`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create booking",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-w-0 w-full gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      <div className="min-w-0 space-y-4 sm:space-y-5">
        <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <StepHeading
            hint="Bookings open up to 7 days in advance."
            step={1}
            title="Pick a day"
          />
          <div className="mt-4 max-w-full overflow-x-auto overscroll-x-contain pb-1 sm:mt-5 sm:overflow-visible sm:pb-0">
            <div className="flex w-max gap-2 sm:grid sm:w-full sm:grid-cols-7 sm:gap-2.5">
              {bookingDays.map((day) => {
                const isSelected = date === day.iso;
                return (
                  <button
                    className={`flex w-[4.25rem] shrink-0 flex-col items-center rounded-xl border py-2.5 text-center transition sm:w-auto sm:py-3 ${
                    isSelected
                      ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                      : "border-border bg-background hover:border-accent"
                  }`}
                  key={day.iso}
                  onClick={() => setDate(day.iso)}
                  type="button"
                >
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      isSelected ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {day.weekday}
                  </span>
                  <span className="mt-1 text-lg font-bold leading-6">
                    {day.dayNumber}
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      isSelected ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {day.month}
                  </span>
                </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <StepHeading step={2} title="Pick a court" />
          <div className="mt-5 flex flex-wrap gap-3">
            {courts.map((court) => (
              <button
                className={`button ${
                  courtId === court.id ? "button-primary" : "button-secondary"
                }`}
                key={court.id}
                onClick={() => setCourtId(court.id)}
                type="button"
              >
                {court.name}
              </button>
            ))}
            {!courts.length ? (
              <p className="text-sm text-muted">Loading courts…</p>
            ) : null}
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <StepHeading
            hint="Prices are per one-hour slot. Booked or past slots are greyed out."
            step={3}
            title="Pick a time"
          />
          {loadingSlots ? (
            <p className="mt-5 text-sm text-muted">Loading available slots…</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((slot) => {
                const passed = slotHasPassed(slot);
                const available = slot.isAvailable && !passed;
                const isSelected = selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    className={`rounded-xl border p-3 text-left transition sm:p-4 ${
                      !available
                        ? "cursor-not-allowed border-border bg-subtle opacity-50"
                        : isSelected
                          ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                          : "border-border bg-background hover:border-accent"
                    }`}
                    disabled={!available}
                    key={slot.startTime}
                    onClick={() => setSelectedSlot(slot)}
                    type="button"
                  >
                    <span className="block text-sm font-semibold sm:text-base">
                      {slot.label}
                    </span>
                    <span
                      className={`mt-1 block text-sm font-medium ${
                        isSelected ? "text-white/90" : "text-accent"
                      }`}
                    >
                      {passed
                        ? "Ended"
                        : slot.isAvailable
                          ? `FJD $${slot.amountFjd}`
                          : "Booked"}
                    </span>
                  </button>
                );
              })}
              {!slots.length ? (
                <p className="col-span-full text-sm text-muted">
                  No slots for this day.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-6">
          <StepHeading
            hint={
              account
                ? "Taken from your account automatically."
                : "We use these to confirm your booking."
            }
            step={4}
            title="Your details"
          />
          {account ? (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <UserRound size={22} />
                </span>
                <div>
                  <p className="font-semibold">{account.name}</p>
                  <p className="text-sm text-muted">
                    {account.mobileNumber}
                    {account.email ? ` · ${account.email}` : ""}
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-accent">
                <ShieldCheck size={14} />
                From your account
              </span>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="fullName">
                  Full name
                </label>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    autoComplete="name"
                    className="input input-icon-left"
                    id="fullName"
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    type="text"
                    value={fullName}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="mobile">
                  Mobile number
                </label>
                <div className="relative">
                  <Smartphone
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    autoComplete="tel"
                    className="input input-icon-left"
                    id="mobile"
                    inputMode="tel"
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="e.g. 9XX XXXX"
                    type="tel"
                    value={mobile}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email{" "}
                  <span className="font-normal text-muted">(optional)</span>
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    size={18}
                  />
                  <input
                    autoComplete="email"
                    className="input input-icon-left"
                    id="email"
                    inputMode="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <aside className="h-fit min-w-0 overflow-hidden rounded-2xl border border-border bg-surface lg:sticky lg:top-24">
        <div className="border-b border-border bg-subtle px-4 py-3.5 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold sm:text-lg">Booking summary</h2>
        </div>

        <div className="p-4 sm:p-6">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2.5 text-muted">
                <CalendarDays className="text-accent" size={16} />
                Date
              </dt>
              <dd className="text-right font-semibold">
                {selectedDay
                  ? `${selectedDay.weekday}, ${selectedDay.dateLabel}`
                  : date}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2.5 text-muted">
                <Warehouse className="text-accent" size={16} />
                Court
              </dt>
              <dd className="text-right font-semibold">{selectedCourtName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2.5 text-muted">
                <Clock className="text-accent" size={16} />
                Time
              </dt>
              <dd className="text-right font-semibold">
                {selectedSlot ? `${selectedSlot.label} (1 hr)` : "Not selected"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2.5 text-muted">
                <UserRound className="text-accent" size={16} />
                Booked by
              </dt>
              <dd className="max-w-[55%] truncate text-right font-semibold">
                {account ? account.name : fullName.trim() || "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between rounded-xl bg-accent/10 px-4 py-3.5">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-extrabold text-accent">
              {selectedSlot ? `FJD $${selectedSlot.amountFjd}.00` : "FJD $0.00"}
            </span>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}

          <button
            className="button button-primary mt-5 w-full shadow-lg shadow-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!selectedSlot || !detailsComplete || submitting}
            onClick={() => void submitBooking()}
            type="button"
          >
            {submitting ? "Reserving your slot…" : "Reserve & pay"}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <ShieldCheck className="shrink-0 text-accent" size={14} />
            Confirmed once M-PAiSA payment is complete.
          </p>
          {!account ? (
            <p className="mt-4 text-center text-xs text-muted">
              Have an account?{" "}
              <Link
                className="font-semibold text-accent hover:underline"
                href="/login"
              >
                Log in
              </Link>{" "}
              to skip filling your details.
            </p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

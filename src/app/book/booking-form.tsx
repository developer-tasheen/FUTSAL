"use client";

import { CalendarDays, Clock, ShieldCheck, UserRound } from "lucide-react";
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
          : index === 1
            ? "Tomorrow"
            : day.toLocaleDateString("en-US", { weekday: "short" }),
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
        <h2 className="text-lg font-semibold leading-7">{title}</h2>
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
  const [useOtherDetails, setUseOtherDetails] = useState(false);
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

  const detailsComplete = account && !useOtherDetails
    ? true
    : Boolean(fullName.trim() && mobile.trim());

  async function submitBooking() {
    if (!selectedSlot) {
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const usingAccount = account && !useOtherDetails;
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courtId,
          bookingDate: date,
          startTime: selectedSlot.startTime,
          customerName: usingAccount ? account.name : fullName,
          customerMobile: usingAccount ? account.mobileNumber : mobile,
          customerEmail: usingAccount ? (account.email ?? "") : email,
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
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-10">
        <section>
          <StepHeading
            hint="Bookings open up to 7 days in advance."
            step={1}
            title="Pick a day"
          />
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
            {bookingDays.map((day) => {
              const isSelected = date === day.iso;
              return (
                <button
                  className={`rounded-xl border px-2 py-3 text-center transition ${
                    isSelected
                      ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                      : "border-border bg-surface hover:border-accent"
                  }`}
                  key={day.iso}
                  onClick={() => setDate(day.iso)}
                  type="button"
                >
                  <span
                    className={`block text-xs font-semibold uppercase tracking-wide ${
                      isSelected ? "text-white/85" : "text-muted"
                    }`}
                  >
                    {day.weekday}
                  </span>
                  <span className="mt-1 block text-sm font-bold">
                    {day.dateLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <StepHeading step={2} title="Pick a court" />
          <div className="mt-4 flex flex-wrap gap-3">
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

        <section>
          <StepHeading
            hint="Prices are per one-hour slot. Booked or past slots are greyed out."
            step={3}
            title="Pick a time"
          />
          {loadingSlots ? (
            <p className="mt-4 text-sm text-muted">Loading available slots…</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {slots.map((slot) => {
                const passed = slotHasPassed(slot);
                const available = slot.isAvailable && !passed;
                const isSelected = selectedSlot?.startTime === slot.startTime;
                return (
                  <button
                    className={`rounded-xl border p-4 text-left transition ${
                      !available
                        ? "cursor-not-allowed border-border bg-subtle opacity-50"
                        : isSelected
                          ? "border-accent bg-accent text-white shadow-lg shadow-accent/25"
                          : "border-border bg-surface hover:border-accent"
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

        <section>
          <StepHeading step={4} title="Your details" />
          {account && !useOtherDetails ? (
            <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-accent/30 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
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
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                  <ShieldCheck size={14} />
                  From your account
                </span>
                <button
                  className="text-sm font-semibold text-muted underline-offset-2 hover:underline"
                  onClick={() => setUseOtherDetails(true)}
                  type="button"
                >
                  Book for someone else
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              {account ? (
                <button
                  className="mb-4 text-sm font-semibold text-accent underline-offset-2 hover:underline"
                  onClick={() => {
                    setUseOtherDetails(false);
                    setFullName(account.name);
                    setMobile(account.mobileNumber);
                    setEmail(account.email ?? "");
                  }}
                  type="button"
                >
                  ← Use my account details instead
                </button>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="fullName">
                    Full name
                  </label>
                  <input
                    autoComplete="name"
                    className="input"
                    id="fullName"
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your full name"
                    type="text"
                    value={fullName}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="mobile">
                    Mobile number
                  </label>
                  <input
                    autoComplete="tel"
                    className="input"
                    id="mobile"
                    inputMode="tel"
                    onChange={(event) => setMobile(event.target.value)}
                    placeholder="e.g. 9XX XXXX"
                    type="tel"
                    value={mobile}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="email">
                    Email{" "}
                    <span className="font-normal text-muted">(optional)</span>
                  </label>
                  <input
                    autoComplete="email"
                    className="input"
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

      <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Booking summary</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-muted">
              <CalendarDays size={15} />
              Date
            </dt>
            <dd className="font-medium">
              {selectedDay
                ? `${selectedDay.weekday}, ${selectedDay.dateLabel}`
                : date}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Court</dt>
            <dd className="font-medium">{selectedCourtName}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-muted">
              <Clock size={15} />
              Time
            </dt>
            <dd className="font-medium">
              {selectedSlot ? selectedSlot.label : "Not selected"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Duration</dt>
            <dd className="font-medium">{selectedSlot ? "1 hour" : "—"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Booked by</dt>
            <dd className="max-w-[55%] truncate font-medium">
              {account && !useOtherDetails
                ? account.name
                : fullName.trim() || "—"}
            </dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-bold text-accent">
              {selectedSlot
                ? `FJD $${selectedSlot.amountFjd}.00`
                : "FJD $0.00"}
            </dd>
          </div>
        </dl>

        {error ? (
          <p className="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        <button
          className="button button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedSlot || !detailsComplete || submitting}
          onClick={() => void submitBooking()}
          type="button"
        >
          {submitting ? "Reserving your slot…" : "Reserve & pay"}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
          <ShieldCheck className="shrink-0 text-accent" size={14} />
          Your booking is confirmed once M-PAiSA payment is complete.
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
      </aside>
    </div>
  );
}

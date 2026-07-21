import {
  CalendarDays,
  Car,
  Check,
  Clock,
  CreditCard,
  Lightbulb,
  MapPin,
  Shirt,
  Trophy,
  Warehouse,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { formatHourDisplay, getPricingRules } from "@/lib/booking/pricing";

// Pricing is read from the database so admin changes show immediately.
export const dynamic = "force-dynamic";

const steps = [
  {
    icon: CalendarDays,
    title: "Pick your date",
    description: "Choose a day on the calendar and see real availability.",
  },
  {
    icon: Clock,
    title: "Choose your slot",
    description: "Only free time slots are shown, so no double bookings ever.",
  },
  {
    icon: CreditCard,
    title: "Pay & play",
    description: "Confirm with secure M-PAiSA payment and get your booking ID.",
  },
];

const tierFeatures: Record<string, string[]> = {
  DAY: ["Full court hire", "1 hour per slot", "Perfect for training"],
  NIGHT: ["Full court hire", "1 hour per slot", "Floodlit matches"],
};

const facilities = [
  { icon: Warehouse, label: "Indoor futsal court" },
  { icon: Lightbulb, label: "Night lighting" },
  { icon: Shirt, label: "Changing area" },
  { icon: Car, label: "Parking on site" },
];

export default async function Home() {
  const pricingRules = await getPricingRules();
  const minPrice = Math.min(...pricingRules.map((rule) => rule.priceFjd));
  const openStart = Math.min(...pricingRules.map((rule) => rule.startHour));
  const openEnd = Math.max(...pricingRules.map((rule) => rule.endHour));

  // Short hour labels ("12 PM") keep the stats strip on one line.
  const shortHour = (hour: number) =>
    formatHourDisplay(hour).replace(":00", "");

  const stats = [
    { value: "7 Days", label: "Open every week" },
    {
      value: `${shortHour(openStart)} – ${shortHour(openEnd)}`,
      label: "Daily playing hours",
    },
    { value: `FJD $${minPrice}`, label: "Sessions from" },
    { value: "M-PAiSA", label: "Secure payment" },
  ];

  const pricing = pricingRules.map((rule, index) => ({
    label: rule.label,
    slot: `${formatHourDisplay(rule.startHour)} – ${formatHourDisplay(rule.endHour)}`,
    price: `$${rule.priceFjd}`,
    features: tierFeatures[rule.code] ?? [
      "Full court hire",
      "1 hour per slot",
    ],
    highlighted: index === pricingRules.length - 1,
  }));

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border text-white">
        <Image
          alt="Naikabula Futsal Court under lights"
          className="animate-hero-zoom object-cover object-center"
          fill
          priority
          sizes="100vw"
          src="/court-hero.png"
        />
        {/* Dark gradient so the headline stays readable over the photo */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start px-4 pb-24 pt-28 sm:px-6 sm:pb-32 sm:pt-40 lg:px-8">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open 7 days · {formatHourDisplay(openStart)} –{" "}
            {formatHourDisplay(openEnd)}
          </span>

          <h1
            className="animate-fade-up mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.15s" }}
          >
            Naikabula <span className="text-accent">Futsal</span> Court
          </h1>
          <p
            className="animate-fade-up mt-4 text-lg font-semibold uppercase tracking-[0.3em] text-white/90 drop-shadow sm:text-xl"
            style={{ animationDelay: "0.3s" }}
          >
            Book. Play. <span className="text-accent">Win.</span>
          </p>
          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-8 text-white/85 drop-shadow sm:text-lg"
            style={{ animationDelay: "0.45s" }}
          >
            Your court, your time. Check live availability, book online in
            minutes, and pay securely with M-PAiSA from any device.
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.6s" }}
          >
            <Link
              className="button button-primary px-10 shadow-xl shadow-accent/30"
              href="/book"
            >
              BOOK NOW
            </Link>
            <Link
              className="button border border-white/40 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
              href="/tournaments"
            >
              <Trophy className="mr-2" size={18} />
              Host a tournament
            </Link>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="animate-fade-up relative border-t border-white/15 bg-black/50 backdrop-blur-sm"
          style={{ animationDelay: "0.75s" }}
        >
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                className={`flex flex-col items-center justify-center px-4 py-6 text-center sm:py-7 ${
                  index % 2 === 1 ? "border-l border-white/10" : ""
                } ${index >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${
                  index === 2 ? "lg:border-l" : ""
                }`}
                key={stat.label}
              >
                <p className="whitespace-nowrap text-lg font-bold text-accent sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-1 whitespace-nowrap text-[11px] uppercase tracking-wider text-white/70 sm:text-xs">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Booked in three easy steps
            </h2>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal delay={index * 0.15} key={step.title}>
              <div className="group relative h-full rounded-2xl border border-border bg-surface p-8 transition duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-xl hover:shadow-accent/10">
                <span className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent/40 text-lg font-extrabold text-accent transition duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                  {index + 1}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                  <step.icon size={24} />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border bg-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Pricing
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
                Simple, per-hour court hire
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted">
                Pick a slot that suits you, pay online, and the court is yours.
              </p>
            </div>
          </Reveal>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            {pricing.map((tier, index) => (
              <Reveal delay={index * 0.15} key={tier.label}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    tier.highlighted
                      ? "border-accent ring-1 ring-accent/30"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  <div
                    className={`border-b px-5 py-4 ${
                      tier.highlighted
                        ? "border-accent/20 bg-accent/10"
                        : "border-border bg-subtle/80"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                          {tier.label}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                          <Clock
                            className="shrink-0 text-accent"
                            size={15}
                          />
                          <span>{tier.slot}</span>
                        </p>
                      </div>
                      {tier.highlighted ? (
                        <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          Popular
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="px-5 py-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Court hire
                    </p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-4xl font-extrabold leading-none tracking-tight sm:text-[2.75rem]">
                        {tier.price}
                      </span>
                      <span className="pb-1 text-sm font-medium text-muted">
                        FJD / hour
                      </span>
                    </div>
                  </div>

                  <ul className="flex-1 space-y-2.5 px-5 pb-5 text-sm">
                    {tier.features.map((feature) => (
                      <li className="flex items-start gap-2.5" key={feature}>
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                          <Check className="text-accent" size={12} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-border bg-subtle/40 p-5">
                    <Link
                      className={`button w-full ${
                        tier.highlighted ? "button-primary" : "button-secondary"
                      }`}
                      href="/book"
                    >
                      Book this slot
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About + facilities */}
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              About us
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-4xl">
              Your local home of futsal
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Naikabula Futsal Court is a local futsal venue for players of all
              levels. Whether it&apos;s a casual game with friends, regular
              team training, or a full tournament, our court is ready for you
              day and night.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted">
              <MapPin className="text-accent" size={18} />
              Naikabula, Lautoka, Fiji
              <Link
                className="ml-1 font-semibold text-accent hover:underline"
                href="/contact"
              >
                Get directions →
              </Link>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {facilities.map((facility, index) => (
            <Reveal delay={0.15 + index * 0.1} key={facility.label}>
              <div className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/10">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition duration-300 group-hover:scale-110">
                  <facility.icon size={22} />
                </span>
                <p className="font-semibold leading-tight">{facility.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bottom call to action */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center text-background dark:bg-surface dark:text-foreground sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-[#16a34a]/25 blur-3xl"
          />
          <h2 className="relative text-2xl font-bold tracking-tight sm:text-4xl">
            Ready to play?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-80">
            Secure your court now. Real-time availability, instant
            confirmation, no double bookings.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="button button-primary px-10" href="/book">
              BOOK NOW
            </Link>
            <Link
              className="button border border-current bg-transparent"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </div>
        </Reveal>
      </section>
    </main>
  );
}

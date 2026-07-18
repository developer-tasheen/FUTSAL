import type { Metadata } from "next";
import { CalendarDays, Camera, Medal, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

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

const gallery = [
  {
    src: "/tournament-group.png",
    alt: "Players and organisers celebrating at a recent Naikabula tournament",
    className: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/tournament-winners.png",
    alt: "Tournament winners holding the championship trophy",
    className: "",
  },
  {
    src: "/tournament-team.png",
    alt: "Tournament team posing together on the futsal court",
    className: "",
  },
  {
    src: "/tournament-award.png",
    alt: "Player receiving an individual tournament award",
    className: "",
  },
  {
    src: "/tournament-champions.png",
    alt: "Champion receiving the tournament trophy",
    className: "",
  },
];

export default function TournamentsPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          <Trophy size={16} />
          Tournaments
        </span>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Where teams compete and{" "}
          <span className="text-accent">champions are made</span>
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Bring your teams together for a memorable futsal tournament. We help
          organise the court schedule, event setup, and playing times. Contact
          us with your dates and we will plan everything with you directly.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link className="button button-primary px-8" href="/contact">
            Plan your tournament
          </Link>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        id="recent-tournament"
      >
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Recently at Naikabula
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A day of football, friendship, and celebration
              </h2>
            </div>
            <p className="leading-7 text-muted">
              Our recent tournament brought players, teams, and supporters
              together on the court. From the opening match to the trophy
              presentation, the venue was full of competitive energy and
              memorable moments.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-4 sm:gap-4">
          {gallery.map((photo, index) => (
            <Reveal
              className={`min-h-48 ${photo.className}`}
              delay={index * 0.08}
              key={photo.src}
            >
              <div className="group relative h-full min-h-48 overflow-hidden rounded-2xl bg-subtle">
                <Image
                  alt={photo.alt}
                  className="object-cover transition duration-700 group-hover:scale-105"
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 640px) 50vw, 100vw"
                      : "(min-width: 640px) 25vw, 50vw"
                  }
                  src={photo.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Users, value: "Teams together", label: "Community spirit" },
              { icon: Trophy, value: "Trophy moments", label: "Celebrate winners" },
              { icon: Camera, value: "Great memories", label: "On and off the court" },
            ].map((highlight) => (
              <div
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5"
                key={highlight.value}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <highlight.icon size={22} />
                </span>
                <div>
                  <p className="font-bold">{highlight.value}</p>
                  <p className="mt-0.5 text-sm text-muted">{highlight.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-border bg-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <Reveal>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Host with us
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From your idea to match day
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-muted">
                Tournament bookings are planned directly with our team so
                every detail fits your event.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal delay={index * 0.15} key={step.title}>
                <div className="group h-full rounded-2xl border border-border bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                      {index === 0 ? (
                        <Users size={23} />
                      ) : index === 1 ? (
                        <CalendarDays size={23} />
                      ) : (
                        <Medal size={23} />
                      )}
                    </span>
                    <span className="text-4xl font-black text-accent/20">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-foreground px-6 py-14 text-center text-background dark:bg-surface dark:text-foreground sm:px-12">
            <div
              aria-hidden
              className="absolute -top-32 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
            />
            <Trophy className="relative mx-auto text-accent" size={38} />
            <h2 className="relative mt-4 text-3xl font-bold tracking-tight">
              Ready to bring your tournament to life?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl opacity-75">
              Tell us your preferred date, expected teams, and event format.
              We will help you plan the rest.
            </p>
            <div className="relative mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="button button-primary px-8" href="/contact">
                Contact us to book
              </Link>
              <Link
                className="button border border-current bg-transparent"
                href="/book"
              >
                Regular court booking
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

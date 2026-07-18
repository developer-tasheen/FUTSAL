import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contact us",
};

const contact = {
  phone: "9042660",
  phoneHref: "tel:+6799042660",
  email: "info@naikabulafutsal.com",
  location: "Naikabula, Lautoka, Fiji",
};

const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  contact.location,
)}&output=embed`;

const details = [
  {
    icon: Phone,
    label: "Call or Viber",
    value: contact.phone,
    href: contact.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: contact.location,
    href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.location)}`,
  },
  {
    icon: Clock,
    label: "Playing hours",
    value: "12 PM – 11 PM, 7 days a week",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
          Contact us
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
          Get in touch, <span className="text-accent">get on the court</span>
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">
          Questions about bookings, tournaments, or the venue? Call, Viber,
          email, or visit us. You can also book your slot online any time.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
        {/* Contact details */}
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-2 sm:p-4">
            {details.map((item) => {
              const row = (
                <>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <item.icon size={21} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-muted">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block break-words text-base font-bold sm:text-lg">
                      {item.value}
                    </span>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  className="flex items-center gap-4 rounded-xl p-4 transition hover:bg-subtle"
                  href={item.href}
                  key={item.label}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {row}
                </a>
              ) : (
                <div
                  className="flex items-center gap-4 rounded-xl p-4"
                  key={item.label}
                >
                  {row}
                </div>
              );
            })}

            <div className="border-t border-border p-4">
              <Link className="button button-primary w-full" href="/book">
                BOOK NOW
              </Link>
              <p className="mt-3 text-center text-sm text-muted">
                Book online and pay securely with M-PAiSA.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Booking flyer */}
        <Reveal delay={0.15}>
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/5">
            <Image
              alt="Naikabula Futsal Court booking flyer: $30 per hour from 12 PM to 5 PM, $50 per hour from 6 PM to 11 PM, call 9042660 to book, M-PAiSA accepted"
              className="h-auto w-full"
              height={720}
              priority
              quality={95}
              sizes="(min-width: 1024px) 50vw, 100vw"
              src="/booking-flyer.png"
              width={1024}
            />
          </div>
        </Reveal>
      </div>

      {/* Map */}
      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            allowFullScreen
            className="h-[380px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapEmbedUrl}
            title="Naikabula Futsal Court location map"
          />
        </div>
      </Reveal>
    </main>
  );
}

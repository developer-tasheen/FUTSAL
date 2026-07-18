import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact us",
};

// Update these once the final contact details are confirmed.
const contact = {
  phone: "+679 000 0000",
  email: "info@naikabulafutsal.com",
  location: "Naikabula, Lautoka, Fiji",
};

const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  contact.location,
)}&output=embed`;

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Contact us
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Questions about bookings, tournaments, or the court? Call, email, or
        visit us.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Phone
            </p>
            <a
              className="mt-2 block text-xl font-semibold hover:underline"
              href={`tel:${contact.phone.replace(/\s/g, "")}`}
            >
              {contact.phone}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Email
            </p>
            <a
              className="mt-2 block text-xl font-semibold hover:underline"
              href={`mailto:${contact.email}`}
            >
              {contact.email}
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Location
            </p>
            <p className="mt-2 text-xl font-semibold">{contact.location}</p>
            <a
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contact.location)}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Get directions →
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-accent">
              Ready to play?
            </p>
            <Link className="button button-primary mt-3" href="/book">
              BOOK NOW
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe
            allowFullScreen
            className="h-full min-h-[400px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={mapEmbedUrl}
            title="Naikabula Futsal Court location map"
          />
        </div>
      </div>
    </main>
  );
}

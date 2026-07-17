import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Futsal court booking
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Book your court from any device.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Ready for live availability, secure M-PAiSA checkout, customer
          accounts, and venue administration.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="button button-primary" href="/book">
            Book a court
          </Link>
          <Link className="button button-secondary" href="/login">
            Customer login
          </Link>
        </div>
      </div>
    </main>
  );
}

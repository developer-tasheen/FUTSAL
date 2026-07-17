import Link from "next/link";

const navigation = [
  { href: "/book", label: "Book" },
  { href: "/dashboard", label: "My bookings" },
  { href: "/login", label: "Login" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <Link className="text-base font-bold tracking-tight sm:text-lg" href="/">
          Futsal Platform
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          {navigation.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-subtle"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

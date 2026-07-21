"use client";

import { LogIn, Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/contact", label: "Contact" },
];

type SessionUser = {
  name: string;
  role: "CUSTOMER" | "ADMIN";
};

export function MainNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch("/api/auth/me");
        const data = await response.json();
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    }
    void loadSession();
  }, [pathname]);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  const accountHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const accountLabel =
    user?.role === "ADMIN" ? "Admin" : user ? "My bookings" : "Log in";

  if (pathname.startsWith("/admin")) {
    return (
      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 sm:inline-block">
          Admin dashboard
        </span>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <div className="relative flex shrink-0 items-center gap-2 sm:gap-3">
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-white text-black shadow-md shadow-black/20"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <ThemeToggle />
        {user ? (
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            href={accountHref}
          >
            <UserRound size={16} />
            {accountLabel}
          </Link>
        ) : (
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-md shadow-black/20 transition hover:bg-white/90"
            href="/login"
          >
            <LogIn size={16} />
            Log in
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        {user ? (
          <Link
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white"
            href={accountHref}
          >
            <UserRound size={14} />
            {user.role === "ADMIN" ? "Admin" : "Bookings"}
          </Link>
        ) : (
          <Link
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-black shadow-md shadow-black/20"
            href="/login"
          >
            <LogIn size={14} />
            Log in
          </Link>
        )}
        <ThemeToggle />
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(calc(100vw-2rem),18rem)] overflow-hidden rounded-2xl border border-white/10 bg-black shadow-xl md:hidden">
          <div className="flex flex-col gap-1 p-2">
            {links.map((link) => (
              <Link
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-white text-black"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!user ? (
              <Link
                className="mt-1 rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white/90"
                href="/register"
                onClick={() => setMenuOpen(false)}
              >
                Create account
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

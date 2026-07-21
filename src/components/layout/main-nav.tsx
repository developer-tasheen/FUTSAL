"use client";

import { LogIn, UserRound } from "lucide-react";
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
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
      </div>
    </div>
  );
}

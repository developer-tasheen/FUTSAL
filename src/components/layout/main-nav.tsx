"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/contact", label: "Contact" },
];

export function MainNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop navigation */}
      <div className="hidden items-center gap-3 md:flex">
        <div className="flex items-center gap-1 rounded-full border border-border bg-subtle/70 p-1">
          {links.map((link) => (
            <Link
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive(link.href)
                  ? "bg-accent text-white shadow-md shadow-accent/25"
                  : "text-muted hover:bg-surface hover:text-foreground"
              }`}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            isActive("/login") || isActive("/dashboard")
              ? "text-accent"
              : "text-muted hover:text-foreground"
          }`}
          href="/login"
        >
          Login
        </Link>
        <ThemeToggle />
        <Link
          className="button button-primary min-h-0 rounded-full px-5 py-2.5 text-sm shadow-lg shadow-accent/25"
          href="/book"
        >
          BOOK NOW
        </Link>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen ? (
        <div className="w-full basis-full border-t border-border pt-3 md:hidden">
          <div className="flex flex-col gap-1 pb-3">
            {links.map((link) => (
              <Link
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-accent/10 text-accent"
                    : "hover:bg-subtle"
                }`}
                href={link.href}
                key={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive("/login") ? "bg-accent/10 text-accent" : "hover:bg-subtle"
              }`}
              href="/login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              className="button button-primary mt-2 w-full rounded-xl"
              href="/book"
              onClick={() => setMenuOpen(false)}
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}

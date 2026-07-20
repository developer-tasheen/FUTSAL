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
  { href: "/login", label: "Login" },
];

export function MainNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  // Inside the admin dashboard the sidebar handles navigation, so keep the
  // header minimal: no public links, just the theme toggle.
  if (pathname.startsWith("/admin")) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 sm:inline-block">
          Admin dashboard
        </span>
        <ThemeToggle />
      </div>
    );
  }

  return (
    <>
      {/* Desktop navigation */}
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
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-2 md:hidden">
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

      {/* Mobile menu panel */}
      {menuOpen ? (
        <div className="w-full basis-full border-t border-white/10 pt-3 md:hidden">
          <div className="flex flex-col gap-1 pb-3">
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
          </div>
        </div>
      ) : null}
    </>
  );
}

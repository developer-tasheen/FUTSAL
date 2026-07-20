"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Naikabula Futsal Court. All rights
          reserved.
        </p>
        <div className="flex gap-4">
          <Link className="hover:text-foreground" href="/book">
            Book a court
          </Link>
          <Link className="hover:text-foreground" href="/tournaments">
            Tournaments
          </Link>
          <Link className="hover:text-foreground" href="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </footer>
  );
}

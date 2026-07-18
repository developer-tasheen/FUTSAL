import Image from "next/image";
import Link from "next/link";
import { MainNav } from "./main-nav";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-border bg-background/90 shadow-sm shadow-black/5 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2 sm:px-6 lg:px-8"
      >
        <Link
          className="group flex items-center gap-2 text-base font-bold tracking-tight sm:gap-3 sm:text-lg"
          href="/"
        >
          <Image
            alt="Naikabula Futsal Court logo"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-110 sm:h-11"
            height={44}
            priority
            src="/logo.png"
            width={44}
          />
          <span>
            Naikabula <span className="text-accent">Futsal</span> Court
          </span>
        </Link>
        <MainNav />
      </nav>
    </header>
  );
}

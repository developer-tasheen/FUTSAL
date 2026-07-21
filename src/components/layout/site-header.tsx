import Image from "next/image";
import Link from "next/link";
import { MainNav } from "./main-nav";
import { MobileNavTabs } from "./mobile-nav-tabs";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-50 border-b border-white/10 bg-black text-white shadow-md shadow-black/20">
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex w-full min-w-0 max-w-6xl flex-col px-4 py-2 sm:px-6 lg:px-8"
      >
        <div className="flex min-h-12 min-w-0 items-center justify-between gap-3">
          <Link
            className="group flex shrink-0 items-center gap-2 sm:gap-3"
            href="/"
          >
            <Image
              alt="Naikabula Futsal Court logo"
              className="h-10 w-auto shrink-0 transition-transform duration-300 group-hover:scale-110 sm:h-12"
              height={48}
              priority
              src="/logo.png"
              width={46}
            />
            <span className="hidden text-base font-bold tracking-tight sm:inline sm:text-lg">
              Naikabula <span className="text-accent">Futsal</span> Court
            </span>
          </Link>
          <MainNav />
        </div>
        <MobileNavTabs />
      </nav>
    </header>
  );
}

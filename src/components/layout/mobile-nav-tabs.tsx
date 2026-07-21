"use client";

import { Home, Mail, Trophy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileNavTabs() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className="border-t border-white/10 md:hidden">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              className={`flex flex-col items-center gap-1 py-2.5 transition ${
                active ? "text-white" : "text-white/55 hover:text-white/80"
              }`}
              href={tab.href}
              key={tab.href}
            >
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition ${
                  active ? "bg-white text-black" : "bg-white/10"
                }`}
              >
                <tab.icon size={17} strokeWidth={active ? 2.25 : 2} />
              </span>
              <span className="text-[10px] font-semibold leading-none">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

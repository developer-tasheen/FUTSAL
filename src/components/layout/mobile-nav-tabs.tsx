"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/contact", label: "Contact" },
  { href: "/book", label: "Book" },
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
      <div className="flex gap-2 overflow-x-auto px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <Link
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              isActive(tab.href)
                ? "bg-white text-black"
                : "bg-white/10 text-white/85 hover:bg-white/15 hover:text-white"
            }`}
            href={tab.href}
            key={tab.href}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

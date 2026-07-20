"use client";

import {
  CalendarOff,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Shield,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const groups = [
  {
    label: "Main",
    links: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    links: [
      { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
      { href: "/admin/courts", label: "Courts", icon: Warehouse },
      { href: "/admin/availability", label: "Availability", icon: CalendarOff },
    ],
  },
  {
    label: "Settings",
    links: [{ href: "/admin/pricing", label: "Pricing", icon: Tag }],
  },
  {
    label: "People & reports",
    links: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/report", label: "Monthly report", icon: FileText },
    ],
  },
];

export function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="no-print w-full shrink-0 bg-black text-white lg:flex lg:w-64 lg:flex-col lg:self-stretch">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
          <Shield size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/55">
            Admin panel
          </p>
          <p className="truncate text-sm font-semibold">{adminName}</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:p-4">
        {groups.map((group, groupIndex) => (
          <div
            className={`flex shrink-0 gap-1 lg:flex-col ${
              groupIndex > 0
                ? "lg:mt-4 lg:border-t lg:border-white/10 lg:pt-4"
                : ""
            }`}
            key={group.label}
          >
            <p className="mb-1.5 hidden px-3 text-[11px] font-semibold uppercase tracking-wide text-white/45 lg:block">
              {group.label}
            </p>
            {group.links.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  className={`flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-semibold transition lg:rounded-xl ${
                    isActive
                      ? "bg-white text-black"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                  href={link.href}
                  key={link.href}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3 lg:mt-auto lg:p-4">
        <button
          className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          onClick={() => void logout()}
          type="button"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}

"use client";

import {
  CalendarOff,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  { href: "/admin/courts", label: "Courts", icon: Warehouse },
  { href: "/admin/pricing", label: "Pricing", icon: Tag },
  { href: "/admin/availability", label: "Availability", icon: CalendarOff },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/report", label: "Monthly report", icon: FileText },
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
    <aside className="no-print w-full shrink-0 lg:w-56">
      <div className="rounded-2xl border border-border bg-surface p-4">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Signed in as
        </p>
        <p className="mt-1 truncate px-2 font-semibold">{adminName}</p>

        <nav className="mt-4 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {links.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-white"
                    : "hover:bg-subtle"
                }`}
                href={link.href}
                key={link.href}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-subtle hover:text-foreground"
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

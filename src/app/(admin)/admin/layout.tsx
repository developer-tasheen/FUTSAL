import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth/session";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="flex w-full flex-1 flex-col lg:min-h-[calc(100vh-4.5rem)] lg:flex-row">
      <AdminNav adminName={session.name} />
      <div className="min-w-0 w-full flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

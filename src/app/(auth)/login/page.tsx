import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Customer login",
};

export default function LoginPage() {
  return (
    <PageShell
      eyebrow="Account"
      title="Customer login"
      description="Authentication forms and account recovery will be implemented in this route group."
    />
  );
}

import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell
      heading="Welcome back"
      subheading="Log in to book courts and view your bookings."
    >
      <LoginForm />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Create your account"
      subheading="Register once and book courts in seconds every time."
    >
      <RegisterForm />
    </AuthShell>
  );
}

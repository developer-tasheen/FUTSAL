import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Register to manage bookings, view history, and download receipts.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}

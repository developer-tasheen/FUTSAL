import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <Image
            alt="Naikabula Futsal Court logo"
            className="h-20 w-auto"
            height={80}
            src="/logo.png"
            width={76}
          />
          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Log in to book courts and view your bookings.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted">
          Just want to book quickly?{" "}
          <Link
            className="font-semibold text-accent hover:underline"
            href="/book"
          >
            Book as guest
          </Link>
        </p>
      </div>
    </main>
  );
}

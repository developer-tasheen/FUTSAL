"use client";

import { Mail, Smartphone, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("fullName"),
          mobileNumber: formData.get("mobile"),
          email: formData.get("email"),
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Registration failed");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      <div>
        <label className="label" htmlFor="fullName">
          Full name
        </label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            autoComplete="name"
            className="input input-icon-left"
            id="fullName"
            name="fullName"
            placeholder="Your full name"
            required
            type="text"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="mobile">
            Mobile number
          </label>
          <div className="relative">
            <Smartphone
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              autoComplete="tel"
              className="input input-icon-left"
              id="mobile"
              inputMode="tel"
              name="mobile"
              placeholder="e.g. 9XX XXXX"
              required
              type="tel"
            />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email <span className="font-normal text-muted">(optional)</span>
          </label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              autoComplete="email"
              className="input input-icon-left"
              id="email"
              inputMode="email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <PasswordInput
            autoComplete="new-password"
            id="password"
            name="password"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            Confirm password
          </label>
          <PasswordInput
            autoComplete="new-password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repeat your password"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        className="button button-primary w-full shadow-lg shadow-accent/20 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          className="font-semibold text-accent hover:underline"
          href="/login"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

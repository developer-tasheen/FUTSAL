"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

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
    <form
      className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6 sm:p-8"
      onSubmit={onSubmit}
    >
      <div>
        <label className="label" htmlFor="fullName">
          Full name
        </label>
        <input
          autoComplete="name"
          className="input"
          id="fullName"
          name="fullName"
          placeholder="Your full name"
          required
          type="text"
        />
      </div>

      <div>
        <label className="label" htmlFor="mobile">
          Mobile number
        </label>
        <input
          autoComplete="tel"
          className="input"
          id="mobile"
          inputMode="tel"
          name="mobile"
          placeholder="e.g. 9XX XXXX"
          required
          type="tel"
        />
      </div>

      <div>
        <label className="label" htmlFor="email">
          Email <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          autoComplete="email"
          className="input"
          id="email"
          inputMode="email"
          name="email"
          placeholder="you@example.com"
          type="email"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="new-password"
          className="input"
          id="password"
          name="password"
          placeholder="Choose a strong password"
          required
          type="password"
        />
      </div>

      <div>
        <label className="label" htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          autoComplete="new-password"
          className="input"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Repeat your password"
          required
          type="password"
        />
      </div>

      {error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        className="button button-primary w-full disabled:opacity-60"
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

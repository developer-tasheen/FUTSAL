"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: formData.get("identifier"),
          password: formData.get("password"),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Login failed");
      }

      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Login failed",
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
        <label className="label" htmlFor="identifier">
          Mobile number or email
        </label>
        <input
          autoComplete="username"
          className="input"
          id="identifier"
          name="identifier"
          placeholder="e.g. 9XX XXXX"
          required
          type="text"
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          autoComplete="current-password"
          className="input"
          id="password"
          name="password"
          placeholder="Your password"
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
        {loading ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          className="font-semibold text-accent hover:underline"
          href="/register"
        >
          Register
        </Link>
      </p>
    </form>
  );
}

"use client";

import { UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";

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
    <form className="mt-8 space-y-5" onSubmit={onSubmit}>
      <div>
        <label className="label" htmlFor="identifier">
          Mobile number or email
        </label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            size={18}
          />
          <input
            autoComplete="username"
            className="input input-icon-left"
            id="identifier"
            name="identifier"
            placeholder="e.g. 9XX XXXX"
            required
            type="text"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <PasswordInput
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Your password"
        />
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
        {loading ? "Logging in…" : "Log in"}
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          New here?
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Link className="button button-secondary w-full" href="/register">
        Create an account
      </Link>

      <p className="text-center text-sm text-muted">
        Just want to book quickly?{" "}
        <Link className="font-semibold text-accent hover:underline" href="/book">
          Book as guest
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function PayButton({
  bookingId,
  amountLabel,
}: {
  bookingId: string;
  amountLabel: string;
}) {
  const router = useRouter();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  async function pay() {
    setPaying(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${bookingId}/pay`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Payment failed, please try again");
      }
      router.refresh();
    } catch (payError) {
      setError(
        payError instanceof Error
          ? payError.message
          : "Payment failed, please try again",
      );
      setPaying(false);
    }
  }

  return (
    <div>
      <button
        className="button button-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        disabled={paying}
        onClick={() => void pay()}
        type="button"
      >
        {paying ? "Processing payment…" : `Pay ${amountLabel} with M-PAiSA`}
      </button>
      {error ? (
        <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <p className="mt-3 text-center text-xs text-muted">
        Sandbox payment for now. The live M-PAiSA gateway will replace this
        step.
      </p>
    </div>
  );
}

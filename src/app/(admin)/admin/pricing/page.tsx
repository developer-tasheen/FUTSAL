"use client";

import { Tag } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import {
  ErrorNote,
  PageHeader,
  SectionCard,
  SuccessNote,
} from "../ui";

type PricingRule = {
  code: string;
  label: string;
  startHour: number;
  endHour: number;
  priceFjd: number;
};

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${suffix}`;
}

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/pricing");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load pricing");
        }
        setRules(data.rules ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load pricing",
        );
      }
    }
    void load();
  }, []);

  function updateRule(code: string, patch: Partial<PricingRule>) {
    setRules((current) =>
      current.map((rule) =>
        rule.code === code ? { ...rule, ...patch } : rule,
      ),
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not save pricing");
      }
      setSuccess(
        "Pricing saved. The homepage and booking calendar now show the new prices.",
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save pricing",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        actions={
          rules.length ? (
            <button
              className="button button-primary disabled:opacity-60"
              disabled={saving}
              form="pricing-form"
              type="submit"
            >
              {saving ? "Saving…" : "Save pricing"}
            </button>
          ) : null
        }
        description="Set session times and hourly prices. Changes apply instantly to the homepage and booking calendar."
        icon={Tag}
        title="Pricing"
      />
      <ErrorNote message={error} />
      <SuccessNote message={success} />

      <form
        className="space-y-4"
        id="pricing-form"
        onSubmit={(event) => void save(event)}
      >
        {rules.map((rule) => (
          <SectionCard
            description={`Code: ${rule.code}`}
            key={rule.code}
            title={rule.label || "Session"}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="label" htmlFor={`label-${rule.code}`}>
                  Session name
                </label>
                <input
                  className="input"
                  id={`label-${rule.code}`}
                  onChange={(event) =>
                    updateRule(rule.code, { label: event.target.value })
                  }
                  type="text"
                  value={rule.label}
                />
              </div>
              <div>
                <label className="label" htmlFor={`start-${rule.code}`}>
                  Start hour
                </label>
                <select
                  className="input"
                  id={`start-${rule.code}`}
                  onChange={(event) =>
                    updateRule(rule.code, {
                      startHour: Number(event.target.value),
                    })
                  }
                  value={rule.startHour}
                >
                  {Array.from({ length: 24 }, (_, hour) => (
                    <option key={hour} value={hour}>
                      {formatHour(hour)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor={`end-${rule.code}`}>
                  End hour
                </label>
                <select
                  className="input"
                  id={`end-${rule.code}`}
                  onChange={(event) =>
                    updateRule(rule.code, {
                      endHour: Number(event.target.value),
                    })
                  }
                  value={rule.endHour}
                >
                  {Array.from({ length: 24 }, (_, index) => index + 1).map(
                    (hour) => (
                      <option key={hour} value={hour}>
                        {formatHour(hour)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="label" htmlFor={`price-${rule.code}`}>
                  Price per hour (FJD)
                </label>
                <input
                  className="input"
                  id={`price-${rule.code}`}
                  min={1}
                  onChange={(event) =>
                    updateRule(rule.code, {
                      priceFjd: Number(event.target.value),
                    })
                  }
                  step="0.01"
                  type="number"
                  value={rule.priceFjd}
                />
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-accent/5 px-4 py-3 text-sm text-muted">
              Customers see: <strong className="text-foreground">{rule.label}</strong>{" "}
              · {formatHour(rule.startHour)} – {formatHour(rule.endHour)} ·{" "}
              <strong className="text-accent">
                FJD ${rule.priceFjd || 0}/hour
              </strong>
            </p>
          </SectionCard>
        ))}

        {!rules.length ? (
          <p className="text-sm text-muted">Loading pricing…</p>
        ) : null}
      </form>
    </>
  );
}

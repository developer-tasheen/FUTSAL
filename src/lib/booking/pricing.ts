import { asc } from "drizzle-orm";
import { getDatabase } from "@/lib/db";
import { pricingRules } from "@/lib/db/schema";

export type PricingRuleData = {
  code: string;
  label: string;
  startHour: number;
  endHour: number;
  priceFjd: number;
};

export const defaultPricingRules: PricingRuleData[] = [
  { code: "DAY", label: "Day session", startHour: 12, endHour: 17, priceFjd: 30 },
  { code: "NIGHT", label: "Night session", startHour: 18, endHour: 23, priceFjd: 50 },
];

/** Loads pricing from the database, falling back to defaults if unavailable. */
export async function getPricingRules(): Promise<PricingRuleData[]> {
  try {
    const db = getDatabase();
    const rows = await db
      .select()
      .from(pricingRules)
      .orderBy(asc(pricingRules.startHour));

    if (!rows.length) {
      return defaultPricingRules;
    }

    return rows.map((row) => ({
      code: row.code,
      label: row.label,
      startHour: row.startHour,
      endHour: row.endHour,
      priceFjd: Number(row.priceFjd),
    }));
  } catch {
    return defaultPricingRules;
  }
}

export function formatHourDisplay(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:00 ${suffix}`;
}

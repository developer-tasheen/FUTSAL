import type { PricingRuleData } from "./pricing";

export type GeneratedSlot = {
  startTime: string;
  endTime: string;
  amountFjd: number;
};

export function generateSlotsFromRules(
  rules: PricingRuleData[],
): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];

  for (const rule of rules) {
    for (let hour = rule.startHour; hour < rule.endHour; hour += 1) {
      slots.push({
        startTime: formatHour(hour),
        endTime: formatHour(hour + 1),
        amountFjd: rule.priceFjd,
      });
    }
  }

  return slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function getPriceForStart(
  rules: PricingRuleData[],
  startTime: string,
): number {
  const hour = Number(startTime.slice(0, 2));
  const rule = rules.find(
    (candidate) => hour >= candidate.startHour && hour < candidate.endHour,
  );
  if (!rule) {
    throw new Error("Selected time is outside opening hours");
  }
  return rule.priceFjd;
}

export function getSlotEndTime(startTime: string) {
  const hour = Number(startTime.slice(0, 2));
  if (Number.isNaN(hour)) {
    throw new Error("Invalid start time");
  }
  return formatHour(hour + 1);
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00:00`;
}

export function toDisplayTime(value: string) {
  const [hourPart, minutePart = "00"] = value.slice(0, 5).split(":");
  const hour = Number(hourPart);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minutePart} ${suffix}`;
}

import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { pricingRules } from "@/lib/db/schema";

const updatePricingSchema = z.object({
  rules: z
    .array(
      z.object({
        code: z.string().min(1),
        label: z.string().trim().min(2).max(80),
        priceFjd: z.number().positive().max(9999),
        startHour: z.number().int().min(0).max(23),
        endHour: z.number().int().min(1).max(24),
      }),
    )
    .min(1),
});

export async function GET() {
  try {
    await requireAdminSession();
    const db = getDatabase();
    const rows = await db
      .select()
      .from(pricingRules)
      .orderBy(asc(pricingRules.startHour));

    return jsonOk({
      rules: rows.map((row) => ({
        code: row.code,
        label: row.label,
        startHour: row.startHour,
        endHour: row.endHour,
        priceFjd: Number(row.priceFjd),
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdminSession();
    const body = updatePricingSchema.parse(await request.json());
    const db = getDatabase();

    for (const rule of body.rules) {
      if (rule.endHour <= rule.startHour) {
        throw new Error(`${rule.label}: end hour must be after start hour`);
      }
      await db
        .update(pricingRules)
        .set({
          label: rule.label,
          priceFjd: rule.priceFjd.toFixed(2),
          startHour: rule.startHour,
          endHour: rule.endHour,
          updatedAt: new Date(),
        })
        .where(eq(pricingRules.code, rule.code));
    }

    return jsonOk({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

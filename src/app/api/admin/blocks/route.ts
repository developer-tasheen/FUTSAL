import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { courtBlocks, courts } from "@/lib/db/schema";

const createBlockSchema = z
  .object({
    courtId: z.string().uuid("Select a court"),
    blockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Select a valid date"),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional()
      .or(z.literal("")),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/)
      .optional()
      .or(z.literal("")),
    reason: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .refine(
    (value) => Boolean(value.startTime) === Boolean(value.endTime),
    "Provide both start and end time, or neither for a full-day block",
  );

export async function GET() {
  try {
    await requireAdminSession();
    const db = getDatabase();
    const rows = await db
      .select({
        id: courtBlocks.id,
        courtId: courtBlocks.courtId,
        courtName: courts.name,
        blockDate: courtBlocks.blockDate,
        startTime: courtBlocks.startTime,
        endTime: courtBlocks.endTime,
        reason: courtBlocks.reason,
      })
      .from(courtBlocks)
      .innerJoin(courts, eq(courtBlocks.courtId, courts.id))
      .orderBy(desc(courtBlocks.blockDate));

    return jsonOk({ blocks: rows });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = createBlockSchema.parse(await request.json());
    const db = getDatabase();

    const [created] = await db
      .insert(courtBlocks)
      .values({
        courtId: body.courtId,
        blockDate: body.blockDate,
        startTime: body.startTime ? `${body.startTime}:00` : null,
        endTime: body.endTime ? `${body.endTime}:00` : null,
        reason: body.reason?.trim() ? body.reason.trim() : null,
      })
      .returning();

    return jsonOk({ block: created }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

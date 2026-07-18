import { asc } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { courts } from "@/lib/db/schema";

const createCourtSchema = z.object({
  name: z.string().trim().min(2, "Court name is required").max(80),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function GET() {
  try {
    await requireAdminSession();
    const db = getDatabase();
    const rows = await db.select().from(courts).orderBy(asc(courts.name));
    return jsonOk({ courts: rows });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = createCourtSchema.parse(await request.json());
    const db = getDatabase();

    let created;
    try {
      [created] = await db
        .insert(courts)
        .values({
          name: body.name,
          notes: body.notes?.trim() ? body.notes.trim() : null,
          isActive: true,
        })
        .returning();
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("unique")
      ) {
        throw new Error("A court with that name already exists");
      }
      throw error;
    }

    return jsonOk({ court: created }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

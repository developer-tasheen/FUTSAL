import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { courts } from "@/lib/db/schema";

const updateCourtSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const body = updateCourtSchema.parse(await request.json());
    const db = getDatabase();

    const updates: Partial<typeof courts.$inferInsert> = {};
    if (body.name !== undefined) {
      updates.name = body.name;
    }
    if (body.notes !== undefined) {
      updates.notes = body.notes.trim() ? body.notes.trim() : null;
    }
    if (body.isActive !== undefined) {
      updates.isActive = body.isActive;
    }

    if (!Object.keys(updates).length) {
      throw new Error("Nothing to update");
    }

    const [updated] = await db
      .update(courts)
      .set(updates)
      .where(eq(courts.id, id))
      .returning();

    if (!updated) {
      throw new Error("Court not found");
    }

    return jsonOk({ court: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const db = getDatabase();

    try {
      const [deleted] = await db
        .delete(courts)
        .where(eq(courts.id, id))
        .returning({ id: courts.id });

      if (!deleted) {
        throw new Error("Court not found");
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("foreign key") ||
          error.message.includes("violates"))
      ) {
        throw new Error(
          "This court has bookings. Set it inactive instead of deleting.",
        );
      }
      throw error;
    }

    return jsonOk({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

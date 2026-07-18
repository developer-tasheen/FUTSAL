import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { courtBlocks } from "@/lib/db/schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdminSession();
    const { id } = await context.params;
    const db = getDatabase();

    const [deleted] = await db
      .delete(courtBlocks)
      .where(eq(courtBlocks.id, id))
      .returning({ id: courtBlocks.id });

    if (!deleted) {
      throw new Error("Block not found");
    }

    return jsonOk({ success: true });
  } catch (error) {
    return handleRouteError(error);
  }
}

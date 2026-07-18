import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const db = getDatabase();
    const mobileNumber = body.mobileNumber.replace(/\s+/g, "");
    const email = body.email?.trim() ? body.email.trim().toLowerCase() : null;

    const existing = await db.query.users.findFirst({
      where: eq(users.mobileNumber, mobileNumber),
    });

    if (existing) {
      throw new Error("An account with this mobile number already exists");
    }

    const passwordHash = await hash(body.password, 10);
    const [created] = await db
      .insert(users)
      .values({
        name: body.name,
        mobileNumber,
        email,
        passwordHash,
        role: "CUSTOMER",
      })
      .returning({
        id: users.id,
        name: users.name,
        mobileNumber: users.mobileNumber,
        email: users.email,
        role: users.role,
      });

    const token = await createSessionToken(created);
    await setSessionCookie(token);

    return jsonOk({ user: created }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { compare } from "bcryptjs";
import { eq, or } from "drizzle-orm";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { handleRouteError, jsonOk } from "@/lib/api/http";
import { getDatabase } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const db = getDatabase();
    const identifier = body.identifier.trim();
    const normalizedMobile = identifier.replace(/\s+/g, "");
    const normalizedEmail = identifier.toLowerCase();

    const user = await db.query.users.findFirst({
      where: or(
        eq(users.mobileNumber, normalizedMobile),
        eq(users.email, normalizedEmail),
      ),
    });

    if (!user) {
      throw new Error("Invalid mobile number/email or password");
    }

    const passwordMatches = await compare(body.password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error("Invalid mobile number/email or password");
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return jsonOk({ user: sessionUser });
  } catch (error) {
    return handleRouteError(error);
  }
}

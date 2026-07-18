import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError(error.issues[0]?.message ?? "Invalid request", 400);
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Please log in to continue", 401);
    }
    if (error.message === "FORBIDDEN") {
      return jsonError("You do not have permission to do that", 403);
    }
    return jsonError(error.message, 400);
  }

  return jsonError("Something went wrong", 500);
}

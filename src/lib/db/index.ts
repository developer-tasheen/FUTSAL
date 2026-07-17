import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

/**
 * Works with local Docker Postgres now and Neon later.
 * Pass the connection string from DATABASE_URL.
 */
export function createDatabase(databaseUrl: string) {
  const client = postgres(databaseUrl, { prepare: false });
  return drizzle(client);
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  futsalDb?: Database;
  futsalSql?: ReturnType<typeof postgres>;
};

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!globalForDb.futsalSql) {
    globalForDb.futsalSql = postgres(databaseUrl, { prepare: false });
  }

  if (!globalForDb.futsalDb) {
    globalForDb.futsalDb = drizzle(globalForDb.futsalSql, { schema });
  }

  return globalForDb.futsalDb;
}

export type { Database };

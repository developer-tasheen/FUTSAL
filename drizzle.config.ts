import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Host-side connection (Docker Compose maps Postgres to localhost:5432).
    url:
      process.env.DATABASE_URL?.replace("@db:", "@localhost:") ??
      "postgresql://futsal:futsal@localhost:5432/futsal",
  },
});

import { z } from "zod";

const serverEnvironmentSchema = z.object({
  DATABASE_URL: z.url(),
  MPAISA_BASE_URL: z.url(),
  MPAISA_CLIENT_ID: z.string().min(1),
  MPAISA_CLIENT_SECRET: z.string().min(1),
  MPAISA_MERCHANT_TID: z.string().min(1),
  MPAISA_MERCHANT_SECRET: z.string().min(1),
});

export function getServerEnvironment() {
  return serverEnvironmentSchema.parse(process.env);
}

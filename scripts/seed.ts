import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/schema";

async function main() {
  const databaseUrl =
    process.env.DATABASE_URL?.replace("@db:", "@localhost:") ??
    "postgresql://futsal:futsal@localhost:5432/futsal";

  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client, { schema });

  const existingCourt = await db.query.courts.findFirst({
    where: eq(schema.courts.name, "Court 1"),
  });

  if (!existingCourt) {
    await db.insert(schema.courts).values({
      name: "Court 1",
      isActive: true,
      notes: "Main indoor court",
    });
    console.log("Seeded Court 1");
  } else {
    console.log("Court 1 already exists");
  }

  const defaultPricing = [
    { code: "DAY", label: "Day session", startHour: 12, endHour: 17, priceFjd: "30.00" },
    { code: "NIGHT", label: "Night session", startHour: 18, endHour: 23, priceFjd: "50.00" },
  ];

  for (const rule of defaultPricing) {
    const existingRule = await db.query.pricingRules.findFirst({
      where: eq(schema.pricingRules.code, rule.code),
    });
    if (!existingRule) {
      await db.insert(schema.pricingRules).values(rule);
      console.log(`Seeded pricing rule ${rule.code}`);
    } else {
      console.log(`Pricing rule ${rule.code} already exists`);
    }
  }

  const adminMobile = "9000000";
  const existingAdmin = await db.query.users.findFirst({
    where: eq(schema.users.mobileNumber, adminMobile),
  });

  if (!existingAdmin) {
    await db.insert(schema.users).values({
      name: "Naikabula Admin",
      mobileNumber: adminMobile,
      email: "admin@naikabulafutsal.com",
      passwordHash: await hash("admin123", 10),
      role: "ADMIN",
    });
    console.log("Seeded admin user (mobile 9000000 / password admin123)");
  } else {
    console.log("Admin user already exists");
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

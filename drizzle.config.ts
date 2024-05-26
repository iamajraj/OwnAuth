import { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schema.ts",
  verbose: true,
  strict: true,
  dialect: "sqlite",
  dbCredentials: {
    url: "mydb.db",
  },
} satisfies Config;

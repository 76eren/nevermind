import { drizzle } from "drizzle-orm/node-postgres";

import * as authSchema from "./auth-schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(databaseUrl, {
  schema: {
    ...authSchema,
  },
});

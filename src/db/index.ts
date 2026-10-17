import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Cache database client across hot-reloads in Next.js development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL || "";

const isLocal = connectionString.includes("127.0.0.1") || connectionString.includes("localhost");

// Disable prefetch as it's not supported by Supabase Transaction pooler (port 6543)
const client =
  globalForDb.conn ??
  postgres(connectionString, {
    prepare: false,
    max: 10,
    ssl: isLocal ? false : "require",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = client;
}

export const db = drizzle(client, { schema });

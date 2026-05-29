import * as schema from "./schema";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:./local.db";

function createDb() {
  // Production / Vercel: use Turso HTTP client (pure JS, no native bindings)
  if (dbUrl.startsWith("libsql://") || dbUrl.startsWith("https://")) {
    const { createClient } = require("@libsql/client/web") as typeof import("@libsql/client/web");
    const { drizzle } = require("drizzle-orm/libsql") as typeof import("drizzle-orm/libsql");
    const client = createClient({
      url: dbUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return drizzle(client, { schema });
  }

  // Local development: use better-sqlite3 (fast, native, local file)
  const Database = require("better-sqlite3") as typeof import("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3") as typeof import("drizzle-orm/better-sqlite3");
  const filePath = dbUrl.replace("file:", "");
  const sqlite = new Database(filePath);
  return drizzle(sqlite, { schema });
}

export const db = createDb();
export type DbClient = typeof db;

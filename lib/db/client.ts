import * as schema from "./schema";

function createDb() {
  const url = process.env.TURSO_DATABASE_URL;

  // Production / Vercel: use Turso HTTP client (pure JS, no native bindings)
  if (url?.startsWith("libsql://") || url?.startsWith("https://")) {
    try {
      const { createClient } = require("@libsql/client/web");
      const { drizzle } = require("drizzle-orm/libsql");
      const client = createClient({
        url,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });
      console.log("[DB] Connected to Turso:", url);
      return drizzle(client, { schema });
    } catch (e: any) {
      console.error("[DB] Failed to connect to Turso:", e.message);
      throw new Error(`Turso connection failed: ${e.message}`);
    }
  }

  // If on Vercel without Turso URL, give a clear error
  if (process.env.VERCEL === "1") {
    throw new Error(
      "Vercel deployment requires TURSO_DATABASE_URL environment variable. " +
      "Please create a database at https://turso.tech, then add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to your Vercel environment variables."
    );
  }

  // Local development: use better-sqlite3 (fast, native, local file)
  try {
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const filePath = url?.replace("file:", "") || "./local.db";
    console.log("[DB] Using local SQLite:", filePath);
    return drizzle(new Database(filePath), { schema });
  } catch (e: any) {
    console.error("[DB] Failed to load better-sqlite3:", e.message);
    throw new Error(`Local SQLite failed: ${e.message}`);
  }
}

let _db: any;

// Lazy proxy: only creates the DB when first accessed.
// This prevents build-time crashes on Vercel and lets API routes catch errors gracefully.
export const db = new Proxy({} as any, {
  get(_, prop) {
    if (!_db) {
      _db = createDb();
    }
    const value = _db[prop];
    return typeof value === "function" ? value.bind(_db) : value;
  },
});

export type DbClient = any;

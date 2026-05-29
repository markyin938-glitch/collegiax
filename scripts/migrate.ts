import { createClient } from "@libsql/client/web";
import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

async function main() {
  // Load .env locally; on Vercel env vars are injected automatically
  if (existsSync(path.join(process.cwd(), ".env"))) {
    const { config } = require("dotenv");
    config({ path: ".env" });
  }

  const url = process.env.TURSO_DATABASE_URL;

  if (!url?.startsWith("libsql://") && !url?.startsWith("https://")) {
    console.log("[migrate] Skipping — not a Turso URL:", url ?? "(none)");
    return;
  }

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("[migrate] Connected to:", url);

  // Ensure migrations tracking table exists
  await client.execute(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL UNIQUE,
      created_at INTEGER
    )
  `);

  const migrationsDir = path.join(process.cwd(), "drizzle");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const applied = await client.execute("SELECT hash FROM __drizzle_migrations");
  const appliedHashes = new Set(applied.rows.map((r) => r.hash as string));

  let ran = 0;
  for (const file of files) {
    if (appliedHashes.has(file)) continue;

    const sql = readFileSync(path.join(migrationsDir, file), "utf8");
    const statements = sql
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`[migrate] Applying ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      await client.execute(stmt);
    }

    await client.execute({
      sql: "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
      args: [file, Date.now()],
    });
    ran++;
  }

  if (ran === 0) {
    console.log("[migrate] Already up to date.");
  } else {
    console.log(`[migrate] Applied ${ran} migration(s). Done.`);
  }

  client.close();
}

main().catch((e) => {
  console.error("[migrate] Fatal:", e.message);
  process.exit(1);
});

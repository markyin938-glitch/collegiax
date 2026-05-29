import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const dbUrl = process.env.TURSO_DATABASE_URL || "file:./local.db";
const filePath = dbUrl.replace("file:", "");

const sqlite = new Database(filePath);
export const db = drizzle(sqlite, { schema });
export type DbClient = typeof db;

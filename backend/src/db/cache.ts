import sqlite3, { Database } from "sqlite3";
import { open } from "sqlite";

// open a database connection

let db: Database | null = null;

export async function initDB() {
  const db = await open({
    filename: "./cache.db",
    driver: sqlite3.Database,
  });

  // ensure table exists
  await db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updatedAt INTEGER NOT NULL
      )
    `);

  return db;
}

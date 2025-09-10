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
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        semester TEXT NOT NULL,
        updatedAt INTEGER NOT NULL,
        PRIMARY KEY (key, semester)
      )
    `);

  return db;
}

export async function getAllCourses(): Promise<string[]> {
  const database = await initDB();
  const rows = await database.all<{ key: string}[]>(`SELECT key FROM cache`);
  const list = rows.map((r) => r.key)
  return [...new Set(list)] // remove dupes
}

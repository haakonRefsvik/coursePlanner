import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { initDB } from "./db/cache";
import { fetchCourse } from "./fetchCourse";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/course/:id", async (req, res) => {
  const db = await initDB();
  const { id } = req.params;

  const row = await db.get(`SELECT value FROM cache WHERE key = ?`, [id]);
  if (row) {
    return res.json(JSON.parse(row.value));
  }

  const data = await fetchCourse(id);
  await db.run(
    `INSERT INTO cache (key, value, updatedAt) VALUES (?, ?, ?) 
     ON CONFLICT(key) DO UPDATE SET value=excluded.value, updatedAt=excluded.updatedAt`,
    [id, JSON.stringify(data), Date.now()]
  );

  res.json(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

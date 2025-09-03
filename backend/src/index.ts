import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import { initDB } from "./db/cache";
import { fetchCourse } from "./fetchCourse";
import { getAllCourses } from "./db/cache";
import { getSuggestions } from "./utils/search";
import { hasNoEvents, invalidCourse } from "./utils/isEmpty";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/course/:id/:semester", async (req, res) => {
  const db = await initDB();
  let { id, semester } = req.params;
  // db.run(`DELETE FROM cache`); reset db

  const row = await db.get(`SELECT value FROM cache WHERE key = ?`, [id]);

  if (row) {
    return res.json(JSON.parse(row.value));
  }

  let data = await fetchCourse(id, semester);

  // courses that dont exist have null as events
  if (invalidCourse(data)) {
    const uppercaseId = id.toUpperCase();
    console.log("error, trying uppercase id: " + uppercaseId);

    const row = await db.get(`SELECT value FROM cache WHERE key = ?`, [
      uppercaseId,
    ]);

    if (row) {
      console.log("uppercase id existed in cache");
      return res.json(JSON.parse(row.value));
    }

    data = await fetchCourse(uppercaseId, semester);

    if (invalidCourse(data)) {
      return res.status(404).json({ error: "Course is invalid" });
    }

    id = uppercaseId;
  }

  // empty events may mean that wrong semester is given
  if (hasNoEvents(data)) {
    let otherSemester = "";
    if (semester.includes("v")) otherSemester = semester.substring(0, 2) + "h";
    if (semester.includes("h")) otherSemester = semester.substring(0, 2) + "v";
    data = await fetchCourse(id, otherSemester);

    if (hasNoEvents(data)) {
      return res.status(404).json({ error: "Course has no events" });
    }
  }

  // override the value if the course exists in the cache
  await db.run(
    `INSERT INTO cache (key, value, updatedAt) VALUES (?, ?, ?) 
     ON CONFLICT(key) DO UPDATE SET value=excluded.value, updatedAt=excluded.updatedAt`,
    [id, JSON.stringify(data), Date.now()]
  );

  res.json(data);
});

app.get("/api/courses/suggestions", async (req, res) => {
  const userinput = req.query.query as string;
  try {
    const courses = await getAllCourses();
    const suggestions = getSuggestions(courses, userinput, 5);
    res.json(suggestions);
  } catch (err) {
    console.error("Failed to fetch courses", err);
    res.status(500).json({ error: "Could not fetch courses" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

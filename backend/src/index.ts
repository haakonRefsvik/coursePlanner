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
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days invalidation
app.use(cors());
app.use(express.json());

app.get("/api/course/:id/:semester", async (req, res) => {
  const db = await initDB();
  let { id, semester } = req.params;

  // Load from cache
  const row = await db.get(
    `SELECT value, updatedAt FROM cache WHERE key = ? AND semester = ?`,
    [id, semester]
  );

  const now = Date.now();

  // If cached and not stale → return it
  if (row) {
    const age = now - row.updatedAt;
    if (age < CACHE_MAX_AGE_MS) {
      return res.json(JSON.parse(row.value));
    } else {
      console.log(`Cache stale for ${id} (${semester}), refreshing...`);
    }
  }

  let data = await fetchCourse(id, semester);

  // invalid course handling
  if (invalidCourse(data)) {
    const uppercaseId = id.toUpperCase();
    console.log("error, trying uppercase id: " + uppercaseId);

    const row = await db.get(
      `SELECT value, updatedAt FROM cache WHERE key = ? AND semester = ?`,
      [uppercaseId, semester]
    );

    // check cache age on uppercase
    if (row) {
      const age = now - row.updatedAt;
      if (age < CACHE_MAX_AGE_MS) {
        console.log("uppercase id existed in cache + fresh");
        return res.json(JSON.parse(row.value));
      }
    }

    data = await fetchCourse(uppercaseId, semester);

    if (invalidCourse(data)) {
      return res.status(404).json({ error: "Course is invalid" });
    }

    id = uppercaseId;
  }

  // empty events semester fix
  if (hasNoEvents(data)) {
    let otherSemester = "";
    if (semester.includes("v")) otherSemester = semester.substring(0, 2) + "h";
    if (semester.includes("h")) otherSemester = semester.substring(0, 2) + "v";

    console.log(
      "wrong semester " + semester + " trying other: " + otherSemester
    );

    const altData = await fetchCourse(id, otherSemester);

    if (!hasNoEvents(altData)) {
      data = altData;
      semester = otherSemester;
    } else {
      return res.status(404).json({ error: "Course has no events" });
    }
  }

  // save new or refreshed cache entry
  await db.run(
    `INSERT INTO cache (key, value, semester, updatedAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(key, semester) DO UPDATE
     SET value = excluded.value, updatedAt = excluded.updatedAt`,
    [id, JSON.stringify(data), semester, now]
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

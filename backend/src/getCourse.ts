import { Request, Response } from "express";
import { fetchCourse } from "./fetchCourse";

export async function getCourse(req: Request, res: Response) {
  const { id, semester } = req.params;
  try {
    const data = await fetchCourse(id, semester);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course" });
  }
}

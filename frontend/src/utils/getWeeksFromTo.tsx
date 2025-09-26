import type { Course } from "../types/Course";

export default function getWeeksFromTo(courses: Course[]): [number, number] {
  const starting = courses.flatMap((c) => c.events[0].weeknr);
  const ending = courses.flatMap((c) => c.events.at(-1)?.weeknr ?? Infinity);
  let from = Math.min(...starting);
  let to = Math.max(...ending);

  if (from < 0 || from == Infinity) from = 0;

  if (to < 0 || to == Infinity) to = 0;

  return [from, to];
}

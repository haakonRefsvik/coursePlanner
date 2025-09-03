import type { Event } from "../types/Course";
import { safeDate } from "./parseDate";

export function isOverlapping(a: Event, b: Event) {
  const startA = safeDate(a.dtstart);
  const endA = safeDate(a.dtend);
  const startB = safeDate(b.dtstart);
  const endB = safeDate(b.dtend);

  return startA < endB && endA > startB;
}

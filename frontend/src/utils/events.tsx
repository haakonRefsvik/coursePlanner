import type { Event } from "../types/Course";

export function isOverlapping(a: Event, b: Event) {
  const startA = new Date(a.dtstart);
  const endA = new Date(a.dtend);
  const startB = new Date(b.dtstart);
  const endB = new Date(b.dtend);

  return startA < endB && endA > startB;
}

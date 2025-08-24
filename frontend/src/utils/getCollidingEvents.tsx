import type { Event } from "../types/Course";

export function getCollidingEvents(events: Event[]): Event[] {
  const collisions: Event[] = [];
  const seen = [];

  for (const event of events) {
    const c = seen.find(
      (e) =>
        e.dtstart == event.dtstart &&
        e.courseid !== event.courseid &&
        event.teachingMethod === "Forelesninger"
    );

    if (c !== undefined) {
      collisions.push(c);
    }

    seen.push(event);
  }

  return collisions;
}

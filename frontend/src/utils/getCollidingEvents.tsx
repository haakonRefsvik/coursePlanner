import type { Event } from "../types/Course";

export type EventPair = [Event, Event]; // a tuple of two events

export function getCollidingEvents(events: Event[]): EventPair[] {
  const collisions: EventPair[] = [];
  const seen = [];

  for (const event of events) {
    const c = seen.find(
      (e) =>
        e.dtstart == event.dtstart &&
        e.courseid !== event.courseid &&
        event.teachingMethod === "Forelesninger"
    );

    if (c !== undefined) {
      collisions.push([event, c]);
    }

    seen.push(event);
  }

  return collisions;
}

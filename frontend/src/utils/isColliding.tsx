import type { Event } from "../types/Course";
import { isOverlapping } from "./events";

export function isColliding(event: Event, eventsSameDay: Event[]): boolean {
  return eventsSameDay.some(
    (e) =>
      isOverlapping(e, event) &&
      e.courseid !== event.courseid &&
      e.disabled === false
  );
}

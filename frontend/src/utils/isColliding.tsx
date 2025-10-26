import type { Event } from "../types/Course";
import { isOverlapping } from "./events";

/**
 * Returns true if event collides with an event in eventsSameDay if and only if event has a different courseId and is not disabled
 */
export function isColliding(
  event: Event,
  eventsSameDay: Event[],
  ignoreDisabled: boolean = false
): boolean {
  return eventsSameDay.some((e) => {
    const disableCheck = ignoreDisabled ? true : !e.disabled;
    return isOverlapping(e, event) && disableCheck && e != event;
  });
}

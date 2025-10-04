import { isOverlapping } from "./events";
import type { Event } from "../types/Course";

export function getCollisionList(
  event: Event,
  eventsSameDay: Event[],
  ignoreDisabled: boolean = false
): Event[] {
  return eventsSameDay.filter((e) => {
    const disableCheck = ignoreDisabled ? true : !e.disabled;
    return (
      isOverlapping(e, event) && e.courseid !== event.courseid && disableCheck
    );
  });
}

import { isOverlapping } from "./events";
import type { Event } from "../types/Course";

export function getCollisionList(
  event: Event,
  eventsSameDay: Event[],
  ignoreDisabled: boolean = false
): Event[] {
  return eventsSameDay.filter((e) => {
    const disableCheck = ignoreDisabled ? true : !e.disabled;
    // an x event is considered overlapping with event y if
    // they overlap, AND: they are from different courses or y
    // doesnt have a party, meaning it might be an obligatory event
    const oneCourseCrashing = e.courseid !== event.courseid || !e.party;
    return isOverlapping(e, event) && oneCourseCrashing && disableCheck;
  });
}

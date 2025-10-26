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
    // x and y overlap in time, AND:
    // x.course != y.course
    // OR
    // y party == null, meaning y might be an obligatory event)
    const oneCourseCrashing =
      e.courseid !== event.courseid ||
      (!e.party && e.courseid == event.courseid);
    return isOverlapping(e, event) && oneCourseCrashing && disableCheck;
  });
}

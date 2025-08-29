import type { Event } from "../types/Course";

export function filterEvents(
  events: Event[],
  showLessons: boolean,
  showOther: boolean
): Event[] {
  return events.filter(
    (event) =>
      (event.teachingMethod == "Forelesninger" && showLessons) ||
      (event.teachingMethod != "Forelesninger" && showOther)
  );
}

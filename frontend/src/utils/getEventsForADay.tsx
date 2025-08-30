import type { Event } from "../types/Course";
import { parseDate } from "./parseDate";

export function getEventsForADay(
  isoString: string,
  events: Event[] | undefined,
  showLessons: boolean,
  showOther: boolean
): Event[] {
  if (!events) return [];
  return events.filter((event) => {
    const isSameDay = parseDate(event.dtstart) === isoString;

    if (!isSameDay) return false;

    if (event.teachingMethod === "Forelesninger" && showLessons) return true;
    if (event.teachingMethod !== "Forelesninger" && showOther) return true;

    return false;
  });
}

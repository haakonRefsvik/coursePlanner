import type { Event } from "../types/Course";
import { parseDate } from "./parseDate";

export function getEventsForADay(
  isoString: string,
  events: Event[] | undefined,
  showLessons: boolean,
  showOther: boolean
): Event[] {
  if (events == undefined) {
    return [];
  }
  const relevantEvents: Event[] = [];

  events.map((event) => {
    if (
      parseDate(event.dtstart) == isoString &&
      event.teachingMethod === "Forelesninger" &&
      showLessons
    ) {
      relevantEvents.push(event);
    }
    if (
      parseDate(event.dtstart) == isoString &&
      event.teachingMethod !== "Forelesninger" &&
      showOther
    ) {
      relevantEvents.push(event);
    }
  });

  return relevantEvents;
}

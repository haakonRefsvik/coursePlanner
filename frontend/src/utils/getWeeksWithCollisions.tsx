import type { Event } from "../types/Course";
import { isColliding } from "./isColliding";

export function getWeeksWithCollisions(events: Event[]): number[] {
  const collidingWeeks: number[] = [];
  const eventsByDay: Record<string, Event[]> = {};

  events
    .filter((event) => !event.disabled)
    .forEach((event) => {
      const day = event.dtstart.split("T")[0]; // extract the date part
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(event);
    });

  // Loop over each day and its events

  outer: for (const day in eventsByDay) {
    for (const event of eventsByDay[day]) {
      if (collidingWeeks.includes(event.weeknr)) {
        continue outer;
      }
      if (isColliding(event, eventsByDay[day])) {
        collidingWeeks.push(event.weeknr);
        continue outer;
      }
    }
  }

  return collidingWeeks;
}

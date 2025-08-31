import type { Event } from "../types/Course";
import { isColliding } from "./isColliding";
import { shuffle } from "./shuffleList";
import { toggleSimilarEvents } from "./toggleSImilarEvents";

export function fitParties(events: Event[], allCourses: string[]) {
  const eventsByDay: Record<string, Event[]> = {};
  var nonCollidingParties: Event[] = [];

  events.forEach((event) => {
    const day = event.dtstart.split("T")[0]; // extract the date part
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(event);
  });

  // Loop over each day and its events

  for (const day in eventsByDay) {
    for (const event of eventsByDay[day]) {
      if (!isColliding(event, eventsByDay[day]) && event.party !== null) {
        nonCollidingParties.push(event);
      } else if (nonCollidingParties.includes(event)) {
        // event that previosuly didnt collide, is colliding
        nonCollidingParties = nonCollidingParties.filter(
          (e) => e.party !== event.party
        );
      }
    }
  }

  events.forEach((e) => {
    if (e.party !== null) {
      e.disabled = true;
    }
  });
  shuffle(nonCollidingParties);
  // choose the parties for each course
  allCourses.forEach((c) => {
    const p = nonCollidingParties.find((event) => event.courseid === c);
    if (p) {
      toggleSimilarEvents(p, events);
    }
  });
}

import type { Event } from "../types/Course";
import { isColliding } from "./isColliding";

export function fitParties(events: Event[], allCourses: string[]) {
  const partyMap = new Map<string, Event[]>();
  const partiesPerCourse = new Map<string, string[]>();
  const chosenEvents: Event[] = [];

  events.forEach((event) => {
    const courseid = event.courseid;
    const partyid = event.party;

    if (!partyid) {
      chosenEvents.push(event);
      return;
    }
    const mapkey = courseid + "/" + partyid;

    if (!partiesPerCourse.has(courseid)) {
      partiesPerCourse.set(courseid, []);
    }

    if (partyMap.has(mapkey)) {
      partyMap.get(mapkey)?.push(event);
    } else {
      partyMap.set(mapkey, [event]);
      partiesPerCourse.get(courseid)?.push(partyid);
    }
  });

  allCourses.sort(
    (a, b) =>
      partiesPerCourse.get(a)?.length! - partiesPerCourse.get(b)?.length!
  );

  // take the courses with fewest parties first
  // then, pick a party that fits with the already added events
  outer: for (const course of allCourses) {
    let parties = partiesPerCourse.get(course) ?? [];
    if (parties.length === 0) continue;
    parties = [...parties].sort(() => Math.random() - 0.5);
    inner: for (const party of parties) {
      const key = course + "/" + party;
      const newEvents = partyMap.get(key) ?? [];

      // check if ALL events are non-colliding
      const isValidParty = newEvents.every(
        (event) => !isColliding(event, chosenEvents, true)
      );

      if (!isValidParty) {
        // try next party
        continue inner;
      }

      // no collisions -> accept this party
      chosenEvents.push(...newEvents);
      continue outer;
    }
  }

  events.forEach((event) => (event.disabled = true));
  chosenEvents.forEach((event) => (event.disabled = false));
}

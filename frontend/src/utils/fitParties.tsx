import type { Event } from "../types/Course";
import { isColliding } from "./isColliding";

export function fitParties(events: Event[], allCourses: string[]): string[] {
  const partyMap = new Map<string, Event[]>();
  const partiesPerCourse = new Map<string, string[]>();
  let chosenEvents: Event[] = [];
  let chosenParties: string[] = [];

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

  allCourses.sort(() => Math.random() - 0.5);

  outer: for (let j = 0; j < allCourses.length; j++) {
    let parties = partiesPerCourse.get(allCourses[j]) ?? [];
    if (parties.length === 0) continue;
    parties = [...parties].sort(() => Math.random() - 0.5);
    inner: for (let i = 0; i < parties.length; i++) {
      const party = parties[i];
      const key = allCourses[j] + "/" + party;
      const newEvents = partyMap.get(key) ?? [];

      // check if ALL events are non-colliding
      const isValidParty = newEvents.every(
        (event) => !isColliding(event, chosenEvents, true)
      );

      if (!isValidParty) {
        if (parties.length - 1 === i) {
          console.log("BALLE");
        }
        continue inner;
      }

      // accept this party
      chosenEvents.push(...newEvents);
      chosenParties.push(allCourses[j] + ":" + party);
      continue outer;
    }
  }

  events.forEach((event) => (event.disabled = true));
  chosenEvents.forEach((event) => (event.disabled = false));

  return chosenParties;
}

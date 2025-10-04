import type { Event } from "../types/Course";
import { getCollisionList } from "./getCollisionList";
import { isDifferentDay } from "./parseDate";
const allPartiesMap = new Map<string, Party>();
const partyMap = new Map<string, string[]>();
const courseParties = new Map<string, string[]>();
let deadParties: string[] = [];

export function getKey(courseId: string, partyId: string): string {
  return `${courseId}:${partyId}`;
}

function* dayEvents(events: Event[]) {
  let day: Event[] = [];
  for (let event of events) {
    if (day[0]) {
      if (isDifferentDay(day[0].dtstart, event.dtstart)) {
        yield day;
        day = [];
      }
    }
    day.push(event);
  }
}

function removeCollidingParties(events: Event[]) {
  const dayGenerator = dayEvents(events);
  for (let eventsInADay of dayGenerator) {
    for (const dayEvent of eventsInADay) {
      if (!dayEvent.party) continue;
      let key = getKey(dayEvent.courseid, dayEvent.party);
      let list = partyMap.get(key);
      if (!list || list.length === 0) continue;
      const collisions = getCollisionList(dayEvent, eventsInADay, true);
      if (collisions.filter((e) => !e.party).length > 0) {
        // ignore party if it collides with forelesning
        partyMap.set(key, []);
        deadParties.push(key);
        continue;
      }
      const keysToRemove = new Set(
        collisions.map((col) => getKey(col.courseid, col.party))
      );
      list = list!.filter((item) => !keysToRemove.has(item));

      if (list.length === 0) deadParties.push(key);

      partyMap.set(key, list);
    }
  }
}

export function fitParties(events: Event[], allCourses: string[]): string[] {
  // First, populate allPartiesMap and initialize courseParties
  allPartiesMap.clear();
  partyMap.clear();
  courseParties.clear();
  deadParties = [];

  for (const event of events) {
    if (!event.party) continue;

    const key = getKey(event.courseid, event.party);
    allPartiesMap.set(key, {
      course: event.courseid,
      id: event.party,
    });

    if (!courseParties.has(event.courseid)) {
      courseParties.set(event.courseid, []);
    }
  }

  events.sort((a, b) => {
    const da = new Date(a.dtstart);
    da.setHours(0, 0, 0, 0);
    const db = new Date(b.dtstart);
    db.setHours(0, 0, 0, 0);
    return da.getTime() - db.getTime();
  });

  // Populate partyMap and courseParties
  for (const [key, party] of allPartiesMap.entries()) {
    // All parties from OTHER courses
    const otherCourseParties = [...allPartiesMap.keys()].filter(
      (p) => !p.includes(party.course)
    );
    partyMap.set(key, otherCourseParties);

    // Add to courseParties
    courseParties.get(party.course)?.push(party.id);
  }

  removeCollidingParties(events);
  // remove references of empty lists
  partyMap.forEach((nonCollidingParties, party) => {
    const filtered = nonCollidingParties.filter(
      (item) => !deadParties.includes(item)
    );

    if (filtered.length === 0) {
      partyMap.delete(party);
    } else {
      partyMap.set(party, filtered);
    }
  });

  // sort keys from smallest to largest
  const sortedKeys = [...partyMap.keys()].sort((k1, k2) => {
    return (
      courseParties.get(k1.split(":")[0])!.length -
      courseParties.get(k2.split(":")[0])!.length
    );
  });

  const solutions: string[][] = [];
  const seen = new Set<string>(); // to track unique combinations

  for (const key of sortedKeys) {
    const compatibleParties = new Set(partyMap.get(key));
    const foundSolutions = recursiveTraverseAll(
      key,
      new Set(),
      compatibleParties,
      allCourses.length
    );

    for (const sol of foundSolutions) {
      const solArray = [...sol];
      if (solArray.length === allCourses.length) {
        const keyStr = solArray.slice().sort().join(","); // Normalize for uniqueness
        if (!seen.has(keyStr)) {
          seen.add(keyStr);
          solutions.push(solArray);
        }
      }
    }
  }

  solutions.sort(() => Math.random() - 0.5);
  if (solutions[0]) return [...solutions[0]];

  return [];
}

function recursiveTraverseAll(
  key: string,
  parties: Set<string>,
  compatibleparties: Set<string>,
  targetSize: number
): Set<string>[] {
  const courseId = key.split(":")[0];

  // Don't allow more than one party from the same course
  if ([...parties].some((p) => p.startsWith(courseId + ":"))) {
    return [];
  }

  // Create a new set with the current key added
  const newParties = new Set(parties);
  newParties.add(key);

  // If we've added as many parties as we have courses, it's a valid solution
  if (newParties.size >= targetSize) {
    return [newParties];
  }

  const newKeys = partyMap.get(key)?.filter((p) => compatibleparties.has(p));
  if (!newKeys || newKeys.length === 0) {
    return [];
  }

  const newCompatible = new Set(newKeys);
  const results: Set<string>[] = [];

  // Explore all compatible next keys
  for (const nextKey of newKeys) {
    const subResults = recursiveTraverseAll(
      nextKey,
      newParties,
      newCompatible,
      targetSize
    );
    results.push(...subResults);
  }

  return results;
}

type Party = {
  course: string;
  id: string;
};

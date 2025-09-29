import type { Event } from "../types/Course";
import { isColliding } from "./isColliding";

function getParties(events: Event[], course: string) {
  const partyMap = new Map<string, Event[]>();
  const parties: Party[] = [];
  events.forEach((e) => {
    if (e.courseid === course && e.party) {
      if (partyMap.has(e.party)) {
        partyMap.get(e.party)!.push(e);
      } else {
        partyMap.set(e.party, []);
      }
    } else if (e.courseid === course && !e.party) {
      nonPartyEvents.push(e);
    }
  });

  partyMap.forEach((events, partyId) => {
    parties.push({ course: course, id: partyId });
    partyEvents.set(`${course}:${partyId}`, events);
  });

  return parties;
}
const partyMap = new Map<string, Party[]>();
const partyEvents = new Map<string, Event[]>();
const courses: string[] = [];
const nonPartyEvents: Event[] = [];
const MAX_TRIES = 1000;
let tries = 0;

export function fitParties(events: Event[], allCourses: string[]): Party[] {
  allCourses.forEach((course) => {
    let parties = getParties(events, course);
    partyMap.set(course, parties);
  });

  courses.push(...allCourses);

  for (const course of allCourses) {
    let parties: Party[] = partyMap.get(course)!;
    parties.sort(() => Math.random() - 0.5);

    for (const party of parties) {
      tries = 0;
      const partiesChosen = recursiveSearch(
        allCourses.length,
        party,
        new Set()
      );
      if (partiesChosen) {
        console.log(partiesChosen);
        return [...partiesChosen];
      }
    }
  }
  return [];
}

function recursiveSearch(
  n: number,
  party: Party,
  partiesAdded: Set<Party>
): Set<Party> | null {
  tries += 1;
  if (tries > MAX_TRIES) return null;
  const currentCourses = [...partiesAdded].flatMap((p) => p.course);
  if (currentCourses.includes(party.course)) return null;
  const currentEvents: Event[] = [];
  partiesAdded.forEach((p) => {
    const events = partyEvents.get(`${p.course}:${p.id}`);
    if (events) {
      currentEvents.push(...events);
    }
  });

  currentEvents.push(...nonPartyEvents);

  const validParty = partyEvents
    .get(`${party.course}:${party.id}`)
    ?.every((e) => !isColliding(e, currentEvents, true));
  if (!validParty) return null;

  const newPartiesAdded = new Set(partiesAdded);
  newPartiesAdded.add(party);
  if (newPartiesAdded.size >= n) return newPartiesAdded;

  const nextcourse = courses.find(
    (c) => ![...newPartiesAdded].some((p) => p.course === c)
  );
  if (!nextcourse) return null;

  const parties = partyMap.get(nextcourse);

  if (!parties) return null;

  for (const nextParty of parties) {
    const res: Set<Party> | null = recursiveSearch(
      n,
      nextParty,
      newPartiesAdded
    );
    if (res) return res;
  }

  return null;
}

type Party = {
  course: string;
  id: string;
};

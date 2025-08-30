import type { Event } from "../types/Course";

export function mergeSimilarEvents(events: Event[]): Event[] {
  const merged: Event[] = [];
  const visited = new Set<Event>();

  events.sort(
    (a, b) => new Date(a.dtstart).getTime() - new Date(b.dtstart).getTime()
  );

  events.forEach((event) => {
    if (visited.has(event)) {
      return;
    }

    visited.add(event);
    const parallellEvents = events.filter((otherEvent) => {
      return (
        !visited.has(otherEvent) &&
        otherEvent.dtstart == event.dtstart &&
        otherEvent.dtend == event.dtend &&
        otherEvent.teachingMethod == event.teachingMethod &&
        otherEvent.courseid == event.courseid
      );
    });

    parallellEvents.forEach((e) => {
      visited.add(e);
    });

    if (parallellEvents.length != 0) {
      const disable =
        parallellEvents.find((e) => e.disabled) != undefined ||
        event.disabled == true;

      const mergedEvent: Event = {
        disabled: disable,
        id: parallellEvents[0].id,
        crashesWithEvents: [],
        widthPercent: 100,
        leftOffset: 0,
        eventid: parallellEvents[0].eventid,
        courseid: parallellEvents[0].courseid,
        title: parallellEvents[0].title,
        summary: parallellEvents[0].summary,
        dtstart: parallellEvents[0].dtstart,
        dtend: parallellEvents[0].dtend,
        teachingMethod: parallellEvents[0].teachingMethod,
        staffs: parallellEvents[0].staffs,
        room: parallellEvents.map((e) => e.room[0]),
        weeknr: parallellEvents[0].weeknr,
        color: parallellEvents[0].color,
        party: parallellEvents.map((e) => e.party).join(", "),
      };
      merged.push(mergedEvent);
    } else {
      merged.push(event);
    }
  });

  return merged;
}

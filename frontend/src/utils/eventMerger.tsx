import type { Event } from "../types/Course";
import { isOverlapping } from "./events";

export function groupNonOverlappingEvents(events: Event[]): Event[][] {
  const remaining = [...events].sort(
    (a, b) => new Date(a.dtstart).getTime() - new Date(b.dtstart).getTime()
  );

  const result: Event[][] = [];

  while (remaining.length > 0) {
    const added: Event[] = [];
    const queue: Event[] = [];

    remaining.forEach((e) => {
      if (added.length === 0) {
        added.push(e);
      } else if (!isOverlapping(added.at(-1)!, e)) {
        added.push(e);
      } else {
        queue.push(e);
      }
    });

    result.push(added);
    remaining.splice(0, remaining.length, ...queue); // prepare for next iteration
  }

  result.forEach((r, index) =>
    r.forEach((e) => {
      var collisions = 1;

      result.forEach((o) => {
        o.forEach((i) => {
          if (isOverlapping(i, e) && i != e) {
            console.log(e == i);
            collisions++;
          }
        });
      });

      console.log(e.courseid + " has " + collisions + " collisions ");

      e.widthPercent = 100 / collisions;
      e.leftOffset = index;
    })
  );

  return result;
}

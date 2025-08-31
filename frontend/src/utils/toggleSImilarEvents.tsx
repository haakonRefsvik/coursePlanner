import type { Event } from "../types/Course";

export function toggleSimilarEvents(event: Event, events: Event[]) {
  var parties: string[] = [];

  if (event.party) {
    parties = event.party.split(",").map((p) => p.trim());
  }

  events?.forEach((e) => {
    if (e.courseid != event.courseid) return;
    if (event.party == null) {
      if (e.teachingMethod === event.teachingMethod) {
        e.disabled = !e.disabled;
      }
    } else if (parties.includes(e.party)) {
      e.disabled = !e.disabled;
    }
  });
}

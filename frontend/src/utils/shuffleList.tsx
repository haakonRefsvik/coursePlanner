import type { Event } from "../types/Course";

export function shuffle(events: Event[]) {
  let currentIndex = events.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [events[currentIndex], events[randomIndex]] = [
      events[randomIndex],
      events[currentIndex],
    ];
  }
}

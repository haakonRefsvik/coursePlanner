
import type { Event } from "../types/Course";
import { getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import { HourTicks } from "./HourTicks";
import "./WeekContainer.scss";
import { toggleSimilarEvents } from "../utils/toggleSImilarEvents";
import { useState, useEffect } from "react";

type WeekContainerProps = {
  weekNumber: number;
  events: Event[] | undefined;
  onChange: () => void;
};


export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Update state on change
    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}



export function WeekContainer({
  weekNumber,
  events,
  onChange,
}: WeekContainerProps) {
  const dates = getDatesForWeek(2025, weekNumber);
  const [_, forceUpdate] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");
  console.log(isMobile)
  const pixelHeight = isMobile ? 70 : 70;
  const pixelWidth = isMobile ? 90 : 140;


  function handleDisable(event: Event) {
    toggleSimilarEvents(event, events ?? []);
    forceUpdate((n) => n + 1);
    onChange();
  }

  return (
    <>
      <div className="weekcontainer">
        <div>
          <p className="date"> _</p>
          <HourTicks from={8} to={17} width={50} height={pixelHeight}></HourTicks>
        </div>
        {dates.map((date) => (
          <div key={date}>
            <DayContainer
              key={date}
              allEvents={events ?? []}
              date={date}
              onDisable={handleDisable}
              hourPixelHeight={pixelHeight}
              dayPixelWidth={pixelWidth}
            ></DayContainer>
          </div>
        ))}
      </div>
    </>
  );
}

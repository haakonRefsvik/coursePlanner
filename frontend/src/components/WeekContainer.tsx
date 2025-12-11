
import type { Event } from "../types/Course";
import { getCurrentYear, getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import { HourTicks } from "./HourTicks";
import "./WeekContainer.scss";
import { toggleSimilarEvents } from "../utils/toggleSImilarEvents";
import { useState, useEffect } from "react";

type WeekContainerProps = {
  semester: string;
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
  semester,
  weekNumber,
  events,
  onChange,
}: WeekContainerProps) {  
  const semesterYear = parseInt(getCurrentYear().toString().substring(0, 2) + semester.replace("v", "").replace("h", ""))
  const dates = getDatesForWeek(semesterYear, weekNumber);
  const [_, forceUpdate] = useState(0);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const pixelHeight = isMobile ? 70 : 70;
  const pixelWidth = isMobile ? 100 : 160;

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

import { useState } from "react";
import type { Event } from "../types/Course";
import { formatDateToDayMonth, getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import { HourTicks } from "./HourTicks";
import "./WeekContainer.scss";
import { toggleSimilarEvents } from "../utils/toggleSImilarEvents";

type WeekContainerProps = {
  weekNumber: number;
  events: Event[] | undefined;
  onChange: () => void;
};

export function WeekContainer({
  weekNumber,
  events,
  onChange,
}: WeekContainerProps) {
  const dates = getDatesForWeek(2025, weekNumber);
  const [_, forceUpdate] = useState(0);

  function handleDisable(event: Event) {
    toggleSimilarEvents(event, events ?? []);
    forceUpdate((n) => n + 1);
    onChange();
  }

  return (
    <>
      <div className="weekcontainer">
        <div>
          <HourTicks from={8} to={17}></HourTicks>
        </div>
        {dates.map((date) => (
          <div key={date}>
            <p className="date">{formatDateToDayMonth(date)}</p>
            <DayContainer
              key={date}
              allEvents={events ?? []}
              date={date}
              onDisable={handleDisable}
            ></DayContainer>
          </div>
        ))}
      </div>
    </>
  );
}

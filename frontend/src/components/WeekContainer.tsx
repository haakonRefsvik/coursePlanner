import { useEffect, useState } from "react";
import type { Event } from "../types/Course";
import { getEventsForADay } from "../utils/getEventsForADay";
import { formatDateToDayMonth, getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import { HourTicks } from "./HourTicks";
import "./WeekContainer.scss";
import { getWeeksWithCollisions } from "../utils/getWeeksWithCollisions";

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

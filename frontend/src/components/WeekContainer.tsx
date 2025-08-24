import type { Event } from "../types/Course";
import { getEventsForADay } from "../utils/getEventsForADay";
import { getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import "./WeekContainer.scss";

type WeekContainerProps = {
  weekNumber: number;
  events: Event[] | undefined;
  showLessons: boolean;
  showOther: boolean;
};

export function WeekContainer({
  weekNumber,
  events,
  showLessons,
  showOther,
}: WeekContainerProps) {
  const dates = getDatesForWeek(2025, weekNumber);
  return (
    <>
      <div className="weekcontainer">
        {dates.map((date) => (
          <DayContainer
            key={date}
            events={getEventsForADay(date, events, showLessons, showOther)}
          ></DayContainer>
        ))}
      </div>
    </>
  );
}

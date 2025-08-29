import type { Event } from "../types/Course";
import { getEventsForADay } from "../utils/getEventsForADay";
import { formatDateToDayMonth, getDatesForWeek } from "../utils/parseDate";
import { DayContainer } from "./DayContainer";
import { HourTicks } from "./HourTicks";
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
        <div>
          <HourTicks from={8} to={17}></HourTicks>
        </div>
        {dates.map((date) => (
          <div key={date}>
            <p className="date">{formatDateToDayMonth(date)}</p>
            <DayContainer
              key={date}
              events={getEventsForADay(date, events, true, true)}
            ></DayContainer>
          </div>
        ))}
      </div>
    </>
  );
}

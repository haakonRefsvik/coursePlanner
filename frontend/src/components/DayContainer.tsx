import "./DayContainer.scss";
import type { Event } from "../types/Course";
import { groupNonOverlappingEvents } from "../utils/groupNonOverlappingEvents";
import { GoStack } from "react-icons/go";
import { getEventsForADay } from "../utils/getEventsForADay";
import { isColliding } from "../utils/isColliding";
import { safeDate } from "../utils/parseDate";

type DayContainerProps = {
  allEvents: Event[];
  date: string;
  onDisable: (event: Event) => void;
};

export function DayContainer({
  allEvents,
  date,
  onDisable,
}: DayContainerProps) {
  const events = getEventsForADay(date, allEvents, true, true);
  const hourstart = 8;
  const hours = Array.from({ length: 10 }, (_, i) => i + hourstart);
  const hourPixelHeight = 50;
  const dayPixelWidth = 160;
  const groupOverlap = groupNonOverlappingEvents(events); // group the overlaps after merging

  return (
    <div className="daycontainer" style={{ width: `${dayPixelWidth}px` }}>
      {hours.map((hour, index) => (
        <div
          key={date + hour}
          className="hour"
          style={{
            height: `${hourPixelHeight}px`,
            width: `${dayPixelWidth}px`,
            backgroundColor:
              index % 2 === 0 ? `var(--gray)` : `var(--gray-darker)`,
          }}
        ></div>
      ))}

      {groupOverlap.map((event) => {
        const start = safeDate(event.dtstart);
        const end = safeDate(event.dtend);
        const eventHour = start.getHours();
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const durationPixelOffset = (hourPixelHeight / 60) * durationMinutes;
        const minuteOffset = start.getMinutes();
        const minutePixelOffset = (hourPixelHeight / 60) * minuteOffset;
        const colliding =
          isColliding(event, events, true) && event.disabled === false;
        const topPx =
          (eventHour - hourstart) * hourPixelHeight + minutePixelOffset;

        return (
          <div
            onClick={() => {
              onDisable(event);
            }}
            key={event.id + event.dtstart + event.party + event.courseid}
            className={`event 
            ${colliding ? "colliding" : ""} 
            ${event.disabled ? "disabled" : ""}`}
            style={{
              top: `${topPx}px`,
              height: `${durationPixelOffset}px`,
              width: `${event.widthPercent * (dayPixelWidth / 100) - 5}px`,
              left: `${event.leftOffset * event.widthPercent * (dayPixelWidth / 100) + 1}px`,
              cursor: "pointer",
            }} // position it over the hour
          >
            <div
              className="eventthumb"
              style={{ backgroundColor: `${event.color}` }}
            ></div>

            <div className="eventcontainer">
              <p className="eventtitle">{event.courseid}</p>
              <p className="eventcontent">{event.teachingMethod}</p>

              {event.party && event.party.includes(",") && (
                <div className="eventparty">
                  <GoStack />
                  <p style={{ margin: "0px" }}>{event.party}</p>
                </div>
              )}

              {event.party && !event.party.includes(",") && (
                <div className="eventparty">
                  <p style={{ margin: "0px" }}>Gruppe {event.party}</p>
                </div>
              )}
            </div>
            <div className="event-tooltip">
              <strong>{event.courseid}</strong> <br />
              {event.teachingMethod} <br />
              {event.party &&
                (event.party.includes(",")
                  ? event.party
                  : `Gruppe ${event.party}`)}{" "}
              <br />
              Høyretrykk for å fjerne
            </div>
          </div>
        );
      })}
    </div>
  );
}

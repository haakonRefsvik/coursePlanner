import "./DayContainer.scss";
import type { Event } from "../types/Course";
import { groupNonOverlappingEvents } from "../utils/eventMerger";

type DayContainerProps = {
  events: Event[];
};

export function DayContainer({ events }: DayContainerProps) {
  const hourstart = 8;
  const hours = Array.from({ length: 10 }, (_, i) => i + hourstart);
  const hourPixelHeight = 50;
  const dayPixelWidth = 160;
  groupNonOverlappingEvents(events);

  return (
    <div className="daycontainer" style={{ width: `${dayPixelWidth}px` }}>
      {hours.map((hour, index) => (
        <div
          key={hour}
          className="hour"
          style={{
            height: `${hourPixelHeight}px`,
            width: `${dayPixelWidth}px`,
            backgroundColor:
              index % 2 === 0 ? `var(--gray)` : `var(--gray-darker)`,
          }}
        ></div>
      ))}

      {events.map((event) => {
        const start = new Date(event.dtstart);
        const end = new Date(event.dtend);
        const eventHour = start.getHours();
        const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        const durationPixelOffset = (hourPixelHeight / 60) * durationMinutes;
        const minuteOffset = new Date(event.dtstart).getMinutes();
        const minutePixelOffset = (hourPixelHeight / 60) * minuteOffset;

        return (
          <div
            key={event.id}
            className="event"
            style={{
              top: `${(eventHour - hourstart) * hourPixelHeight + minutePixelOffset}px`,
              height: `${durationPixelOffset}px`,
              width: `${event.widthPercent * (dayPixelWidth / 100) - 5}px`,
              left: `${event.leftOffset * event.widthPercent * (dayPixelWidth / 100) + 1}px`,
            }} // position it over the hour
          >
            <div
              className="eventthumb"
              style={{ backgroundColor: `${event.color}` }}
            ></div>

            <p className="eventtitle">{event.courseid}</p>
          </div>
        );
      })}
    </div>
  );
}

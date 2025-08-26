import "./DayContainer.scss";
import type { Event } from "../types/Course";

type DayContainerProps = {
  events: Event[];
};

export function DayContainer({ events }: DayContainerProps) {
  const hours = Array.from({ length: 10 }, (_, i) => i + 8);

  return (
    <div className="daycontainer">
      {hours.map((hour) => {
        const eventsThisHour = events.filter((e) => {
          const startHour = new Date(e.dtstart).getHours();
          const endHour = new Date(e.dtend).getHours();
          return startHour < hour + 1 && endHour > hour;
        });

        return (
          <div
            key={hour}
            className={`hour-block ${
              eventsThisHour.some(
                (e) =>
                  new Date(e.dtstart).getHours() === hour &&
                  new Date(e.dtend).getHours() > hour + 1
              )
                ? "has-multi-hour-start"
                : ""
            }`}
          >
            <div className="events">
              {eventsThisHour.map((e) => {
                const startHour = new Date(e.dtstart).getHours();
                const isStart = startHour === hour;
                return (
                  <div
                    key={e.id}
                    className={`event-card ${isStart ? "start" : "continuation"}`}
                    style={{ backgroundColor: "gray" }}
                  >
                    {isStart && (
                      <>
                        <div className="eventcontainer">
                          <div
                            className="thumb"
                            style={{ backgroundColor: e.color }}
                          ></div>
                          <div className="courseinfo">
                            <strong className="coursetitle">
                              {e.courseid}
                            </strong>
                            <div className="coursemethod">
                              {e.teachingMethod}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

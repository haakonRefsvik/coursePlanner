import type { EventPair } from "../utils/getCollidingEvents";
import "./WeekSelector.scss";

type WeekSelectorProps = {
  selectedWeek: number;
  onChange: (week: number) => void;
  weeks: number[];
  collidingEvents: EventPair[];
};

export function WeekSelector({
  weeks,
  selectedWeek,
  onChange,
  collidingEvents,
}: WeekSelectorProps) {
  const collidingWeeks = collidingEvents.map((ep) => ep[0].weeknr);

  return (
    <div className="week-selector">
      {weeks.map((week) => {
        const isSelected = week === selectedWeek;
        const hasCollision = collidingWeeks.includes(week);

        return (
          <button
            key={week}
            onClick={() => onChange(week)}
            className={`
              ${isSelected ? "selected" : ""} 
              ${hasCollision && isSelected ? "collision-selected" : ""}
              ${hasCollision && !isSelected ? "collision" : ""}
            `}
          >
            {week}
          </button>
        );
      })}
    </div>
  );
}

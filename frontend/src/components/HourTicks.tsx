import "./HourTicks.scss";

export function HourTicks({ from, to }: { from: number; to: number }) {
  const hours = Array.from({ length: to - from + 1 }, (_, i) => i + from);

  return (
    <div className="hourticks">
      {hours.map((hour) => (
        <div className="hour-block">
          <p className="hour-text" key={hour}>
            {hour}:00
          </p>
        </div>
      ))}
    </div>
  );
}

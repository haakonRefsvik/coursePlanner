import "./HourTicks.scss";

export function HourTicks({ from, to, width, height }: { from: number; to: number, width: number, height: number}) {
  const hours = Array.from({ length: to - from + 1 }, (_, i) => i + from);
  
  return (
    <div className="daycontainer" style={{ width: `${width}px` }}>
      {hours.map((hour, _) => (
        <div
          key={hour}
          className="hourticks"
          style={{
            height: `${height}px`,
            width: `${width}px`,
          }}
        >
          <p className="hourtext">{hour}:00</p>
        </div>
      ))}
      </div>
  );
}

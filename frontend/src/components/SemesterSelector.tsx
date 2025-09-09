import "./SemesterSelector.scss"

export function SemesterSelector({ year, value, onChange }: { year: number, value: string; onChange: (val: string) => void }) {

    return (
      <div className="selector">
        <button className={`selectorbutton ${value.includes("v") ? "selected" : ""}`} onClick={() => onChange(year + "v")}>Vår</button>
        <button className={`selectorbutton ${value.includes("h") ? "selected" : ""}`} onClick={() => onChange(year + "h")}>Høst</button>
      </div>

    );
  }
  
import "./SemesterSelector.scss"

export function SemesterSelector({ year, value, onChange, disabled }: { year: number, value: string; onChange: (val: string) => void, disabled: boolean }) {

    return (
      <div className="selector">
        <button className={`
          selectorbutton ${disabled ? "disabled" : ""}
          selectorbutton ${value.includes("v") ? "selected" : ""}
          `} onClick={() => {
            if (!disabled){
              onChange(year + "v")}}
            }
            >Vår</button>
        <button className={`
          selectorbutton ${disabled ? "disabled" : ""}
          selectorbutton ${value.includes("h") ? "selected" : ""}
          `} onClick={() => {
            if (!disabled){
              onChange(year + "h")}}
            }
            >Høst</button>
      </div>

    );
  }
  
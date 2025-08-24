import "./WeekSelector.scss"

type WeekSelectorProps = {
    selectedWeek: number;
    onChange: (week: number) => void;
    weeks: number[];
}

export function WeekSelector({weeks, selectedWeek, onChange}: WeekSelectorProps){


    return (
    <>
        <div className="week-selector">
            {weeks.map((week) => (
                <button 
                    className={week === selectedWeek ? "selected" : ""}
                    key={week} 
                    onClick={() => onChange(week)}>{week}
                </button>
            ))}
        </div>
    </>)
}
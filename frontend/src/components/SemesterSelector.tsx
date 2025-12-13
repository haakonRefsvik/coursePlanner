import { useEffect, useState } from "react";
import "./SemesterSelector.scss";
import { getHumanReadableSemester, getSemesterString } from "../utils/getSemesterString";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

export function SemesterSelector({
  year,
  value,
  onChange,
  disabled,
}: {
  year: number;
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  let initSemester = (parseInt(value.replace("h", "").replace("v", "")))
  if(value.includes("h")){
    initSemester += 0.5
  }
  
  const [yearSelected, setYearSelected] = useState(initSemester);

  function changeSemester(difference: number){
    if(!disabled && (yearSelected + difference) >= 0 && yearSelected < 99){setYearSelected(prev => prev +difference)}
  }
  useEffect(() => {
    setYearSelected(initSemester)
  }, [value])

  useEffect(() => {
    if(!disabled){
      onChange(getSemesterString(yearSelected))
    }
  }, [yearSelected])
  
  return (
    <div className="selector">
      <button
        className={`
          selectorbutton ${disabled ? "disabled" : ""}
          `}

        onClick={() => {
          changeSemester(-0.5)
        }}
      >
        {<MdKeyboardDoubleArrowLeft />}
      </button>
      <div className="semesterlabelcontainer">
        <p className="label">
        {getHumanReadableSemester(yearSelected)}
        </p>
      </div>
      <button
        className={`
          selectorbutton ${disabled ? "disabled" : ""}
          `}
        onClick={() => {
          changeSemester(+0.5)
        }}
      >
        {<MdKeyboardDoubleArrowRight />}
      </button>
    </div>
  );
}

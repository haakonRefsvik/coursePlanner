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
  const [yearSelected, setYearSelected] = useState(year);

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
          setYearSelected(prev => prev - 0.5)
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
          setYearSelected(prev => prev + 0.5)
        }}
      >
        {<MdKeyboardDoubleArrowRight />}
      </button>
    </div>
  );
}

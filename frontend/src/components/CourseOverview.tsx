import type { Course } from "../types/Course";
import "./CourseOverview.scss";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { FiChevronUp } from "react-icons/fi";
import { useState } from "react";

type CourseOverviewProps = {
  courses: Course[];
  onRemoveCOurse: (id: string) => void;
};

export function CourseOverview({
  courses,
  onRemoveCOurse,
}: CourseOverviewProps) {
  const [toggled, setToggled] = useState(false);

  const handleToggle = () => setToggled(!toggled);
  return (
    <>
      {courses.map((course) => (
        <div key={course.id} className="course">
          <div
            className="thumb"
            style={{ backgroundColor: course.events[0].color }}
          ></div>
          <div className="coursetext">{course.id}</div>
          <FiChevronUp
            size={20}
            className={`dropdownbutton ${toggled ? "toggled" : ""}`}
            onClick={handleToggle}
          />
          <IoIosRemoveCircleOutline
            size={20}
            className="closebutton"
            onClick={() => onRemoveCOurse(course.id)}
          />
        </div>
      ))}
    </>
  );
}

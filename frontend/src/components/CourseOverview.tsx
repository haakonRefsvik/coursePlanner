import type { Course } from "../types/Course";
import "./CourseOverview.scss";
import { IoIosRemoveCircleOutline } from "react-icons/io";

type CourseOverviewProps = {
  courses: Course[];
  onRemoveCOurse: (id: string) => void;
};

export function CourseOverview({
  courses,
  onRemoveCOurse,
}: CourseOverviewProps) {
  return (
    <>
      {courses.map((course) => (
        <div key={course.id} className="course">
          <div
            className="thumb"
            style={{ backgroundColor: course.events[0].color }}
          ></div>
          <div className="coursetext">{course.id}</div>
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

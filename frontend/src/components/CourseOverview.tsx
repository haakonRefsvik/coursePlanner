import type { Course } from "../types/Course";
import "./CourseOverview.scss";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { FiChevronUp } from "react-icons/fi";
import { useState } from "react";
import { getCollidingEvents } from "../utils/getCollidingEvents";

type CourseOverviewProps = {
  courses: Course[];
  onRemoveCOurse: (id: string) => void;
};

export function CourseOverview({
  courses,
  onRemoveCOurse,
}: CourseOverviewProps) {
  const [toggled, setToggled] = useState(false);
  const collidingEvents = getCollidingEvents(
    courses.flatMap((c) => c.events),
    true
  );
  const collidingCourses = new Set();
  collidingEvents.forEach((ep) => {
    collidingCourses.add(ep[0].courseid);
    collidingCourses.add(ep[1].courseid);
  });

  const coursesWithoutParties = new Set();
  outer: for (const c of courses) {
    for (const e of c.events) {
      if (e.party && !e.disabled) continue outer;
    }
    coursesWithoutParties.add(c.id);
  }

  const handleToggle = () => setToggled(!toggled);
  return (
    <>
      {courses
        .filter(
          (c) => collidingCourses.has(c.id) || coursesWithoutParties.has(c.id)
        )
        .map((course) => (
          <div key={course.id} className="course colliding">
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
      {courses
        .filter(
          (c) => !collidingCourses.has(c.id) && !coursesWithoutParties.has(c.id)
        )
        .map((course) => (
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

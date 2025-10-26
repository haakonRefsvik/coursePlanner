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

  const coursesWithDeselectedEvents = new Set();
  outer: for (const c of courses) {
    for (const e of c.events) {
      if (!e.party && e.disabled) {
        coursesWithDeselectedEvents.add(c.id);
        continue outer;
      }
    }
  }

  const problemCourses = new Set([
    ...coursesWithDeselectedEvents,
    ...collidingCourses,
    ...coursesWithoutParties,
  ]);

  return (
    <>
      {coursesWithDeselectedEvents.size > 0 && (
        <p className="coursestatustext">
          Emner med uvalgte <br />
          obligatoriske hendelser
        </p>
      )}
      {courses
        .filter((c) => coursesWithDeselectedEvents.has(c.id))
        .map((course) => (
          <div key={course.id} className="course colliding">
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
      {collidingCourses.size > 0 && (
        <p className="coursestatustext">Emner som kolliderer</p>
      )}
      {courses
        .filter((c) => collidingCourses.has(c.id))
        .map((course) => (
          <div key={course.id} className="course colliding">
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
      {coursesWithoutParties.size > 0 && (
        <p className="coursestatustext">Emner uten valgt gruppe</p>
      )}
      {courses
        .filter((c) => coursesWithoutParties.has(c.id))
        .map((course) => (
          <div key={course.id} className="course colliding">
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
      {problemCourses.size < courses.length && (
        <p className="coursestatustext">Problemfrie emner</p>
      )}
      {courses
        .filter(
          (c) =>
            !collidingCourses.has(c.id) &&
            !coursesWithoutParties.has(c.id) &&
            !coursesWithDeselectedEvents.has(c.id)
        )
        .map((course) => (
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

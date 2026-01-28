import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getNextSemester, getSemesterString } from "./getSemesterString";

type CourseSearch = {
  course: string;
  party?: string;
};

export function useCourseParties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const semester =
    searchParams.get("semester") ?? getSemesterString(getNextSemester());
  const courses = parseCoursesParam(searchParams.get("courses"));

  const setCourses = useCallback(
    (updated: CourseSearch[], newSemester: string) => {
      setSearchParams({
        semester: newSemester,
        courses: stringifyCourses(updated),
      });
    },
    [semester, setSearchParams]
  );

  const setSemester = useCallback(
    (newSemester: string) => {
      setSearchParams((prev) => {
        const currentCourses = prev.get("courses");
        return {
          semester: newSemester,
          courses: currentCourses ?? "",
        };
      });
    },
    [setSearchParams]
  );

  const upsertCourse = useCallback(
    (course: string, newSemester: string, party?: string) => {
      setSearchParams((prev) => {
        const currentCourses = parseCoursesParam(prev.get("courses"));

        const updated = [
          ...currentCourses.filter((c) => c.course !== course),
          { course, party },
        ];

        return {
          semester: newSemester,
          courses: stringifyCourses(updated),
        };
      });
    },
    [setSearchParams]
  );

  return { courses, semester, setCourses, upsertCourse, setSemester };
}

function parseCoursesParam(param: string | null): CourseSearch[] {
  if (!param) return [];
  return param.split(",").map((entry) => {
    const [course, party] = entry.split(":");
    return { course, party };
  });
}

function stringifyCourses(courses: CourseSearch[]): string {
  return courses
    .map((c) => (c.party ? `${c.course}:${c.party}` : c.course))
    .join(",");
}

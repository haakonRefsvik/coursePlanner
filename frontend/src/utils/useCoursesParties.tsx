import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type CourseSearch = {
  course: string;
  party?: string;
};

export function useCourseParties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const semester = searchParams.get("semester") ?? "25h";
  const courses = parseCoursesParam(searchParams.get("courses"));

  const setCourses = useCallback(
    (updated: CourseSearch[]) => {
      setSearchParams({
        semester,
        courses: stringifyCourses(updated),
      });
    },
    [semester, setSearchParams]
  );

  const setSemester = useCallback((newSemester: string) => {
    setSearchParams({
      semester: newSemester,
      courses: stringifyCourses(courses),
    });
  }, []);

  const upsertCourse = useCallback(
    (course: string, party?: string) => {
      const updated = [
        ...courses.filter((c) => c.course !== course),
        { course, party },
      ];
      setSearchParams({
        semester,
        courses: stringifyCourses(updated),
      });
    },
    [courses, semester, setSearchParams]
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

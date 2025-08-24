import { useEffect, useState } from "react";
import "./App.css";
import { fetchCourse } from "./utils/api";
import type { Course } from "./types/Course";
import { WeekContainer } from "./components/WeekContainer";
import { WeekSelector } from "./components/WeekSelector";
import { getNextColor } from "./utils/getNextColor";

function App() {
  const [courseInput, setCourseInput] = useState("");
  const [coursesAdded, setCoursesAdded] = useState<Course[]>([]);
  const [weekSelected, setWeekSelected] = useState<number>(34);
  const [loading, setLoading] = useState(false);
  const [firstWeekNr, setFirstWeekNr] = useState(0);
  const [lastWeekNr, setLastWeekNr] = useState(0);
  const [checkFor, setCheckedFor] = useState(true);
  const [checkAnn, setCheckedAnn] = useState(true);

  const addCourse = async (id: string) => {
    try {
      setLoading(true);
      const newCourse = await fetchCourse(id);
      setCoursesAdded((prevCourses) => [...prevCourses, newCourse]);
      setCheckedAnn(true);
      setCheckedFor(true);
      const color = getNextColor();
      newCourse.events.forEach((e) => (e.color = color));

      if (newCourse.events[0].weeknr < firstWeekNr || firstWeekNr === 0) {
        setFirstWeekNr(newCourse.events[0].weeknr);
      }
      if (newCourse.events[0].weeknr > lastWeekNr || lastWeekNr === 0) {
        setLastWeekNr(newCourse.events.at(-1)?.weeknr ?? 0);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstWeekNr !== 0) {
      setWeekSelected(firstWeekNr);
    }
  }, [firstWeekNr]);

  const allWeekNr = Array.from(
    { length: lastWeekNr - firstWeekNr + 1 },
    (_, i) => firstWeekNr + i
  );

  return (
    <>
      <div className="card">
        <div className="header">
          <input
            type="text"
            value={courseInput}
            onChange={(e) => setCourseInput(e.target.value)}
            placeholder="Kurskode"
          />
          <button onClick={() => addCourse(courseInput)}>Legg til</button>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={checkFor}
                onChange={() => setCheckedFor(!checkFor)}
              />
              Forelesninger
            </label>
            <label>
              <input
                type="checkbox"
                checked={checkAnn}
                onChange={() => setCheckedAnn(!checkAnn)}
              />
              Annet
            </label>
          </div>
          <div className="loader-container">
            {loading ? <p>Laster ...</p> : null}
          </div>
        </div>
        <div>
          <WeekSelector
            weeks={allWeekNr}
            selectedWeek={weekSelected}
            onChange={(week) => setWeekSelected(week)}
          ></WeekSelector>
          <WeekContainer
            showLessons={checkFor}
            showOther={checkAnn}
            weekNumber={weekSelected}
            events={coursesAdded.flatMap((course) => course.events)}
          ></WeekContainer>
        </div>
      </div>
      <a href="https://github.com/haakonRefsvik" className="read-the-docs">
        GitHub
      </a>
    </>
  );
}

export default App;

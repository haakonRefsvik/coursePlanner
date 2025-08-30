import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { fetchCourse } from "./utils/api";
import type { Course } from "./types/Course";
import { WeekContainer } from "./components/WeekContainer";
import { WeekSelector } from "./components/WeekSelector";
import { getNextColor } from "./utils/getNextColor";
import { getCollidingEvents } from "./utils/getCollidingEvents";
import { CourseOverview } from "./components/CourseOverview";
import { testEvents } from "./utils/dummyEvents";
import { filterEvents } from "./utils/filterEvents";
import { getWeeksWithCollisions } from "./utils/getWeeksWithCollisions";

function App() {
  const [courseInput, setCourseInput] = useState("");
  const [coursesAdded, setCoursesAdded] = useState<Course[]>([]);
  const [weekSelected, setWeekSelected] = useState<number>(34);
  const [loading, setLoading] = useState(false);
  const [firstWeekNr, setFirstWeekNr] = useState(0);
  const [lastWeekNr, setLastWeekNr] = useState(0);
  const [checkFor, setCheckedFor] = useState(true);
  const [checkAnn, setCheckedAnn] = useState(true);
  const [checkShowDisabled, setShowDisabled] = useState(true);
  const [collidingWeeks, setCollidingWeeks] = useState<number[]>([]);
  const [weekEventsChanged, setWeekEventsChanged] = useState(0);

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

  const allEvents = coursesAdded.flatMap((course) => course.events);
  const filteredEvents = useMemo(() => {
    return filterEvents(allEvents, checkFor, checkAnn).filter(
      (e) => checkShowDisabled || e.disabled === false
    );
  }, [allEvents, checkFor, checkAnn, checkShowDisabled]);

  useEffect(() => {
    const weeks = getWeeksWithCollisions(filteredEvents);

    setCollidingWeeks((prev) => {
      const isSame =
        prev.length === weeks.length &&
        prev.every((week, i) => week === weeks[i]);
      return isSame ? prev : weeks;
    });
  }, [filteredEvents, weekEventsChanged]);

  function handleCourseRemoval(id: string) {
    setCoursesAdded((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <div className="card">
        <div className="dashboard">
          <div className="header">
            <input
              type="text"
              value={courseInput}
              onChange={(e) => setCourseInput(e.target.value)}
              placeholder="Kurskode"
            />
            <button onClick={() => addCourse(courseInput)}>Legg til</button>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={checkShowDisabled}
                onChange={() => setShowDisabled(!checkShowDisabled)}
              />
              Vis umarkerte
            </label>
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
          <CourseOverview
            courses={coursesAdded}
            onRemoveCOurse={(id) => handleCourseRemoval(id)}
          ></CourseOverview>
        </div>
        <div>
          <WeekSelector
            collidingWeeks={collidingWeeks}
            weeks={allWeekNr}
            selectedWeek={weekSelected}
            onChange={(week) => setWeekSelected(week)}
          ></WeekSelector>
          <WeekContainer
            weekNumber={weekSelected}
            onChange={() => setWeekEventsChanged((n) => n + 1)}
            events={filteredEvents}
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

import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { fetchCourse, fetchSuggestions } from "./utils/api";
import type { Course } from "./types/Course";
import { WeekContainer } from "./components/WeekContainer";
import { WeekSelector } from "./components/WeekSelector";
import { getNextColor } from "./utils/getNextColor";
import { CourseOverview } from "./components/CourseOverview";
import { filterEvents } from "./utils/filterEvents";
import { getWeeksWithCollisions } from "./utils/getWeeksWithCollisions";
import { fitParties } from "./utils/fitParties";
import { CiSearch } from "react-icons/ci";
import { FaDice } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { Toast } from "./components/Toast";

function App() {
  const [courseInput, setCourseInput] = useState("");
  const [coursesAdded, setCoursesAdded] = useState<Course[]>([]);
  const [weekSelected, setWeekSelected] = useState<number>(34);
  const [loading, setLoading] = useState(false);
  const [firstWeekNr, setFirstWeekNr] = useState(0);
  const [lastWeekNr, setLastWeekNr] = useState(0);
  const [checkFor, setCheckedFor] = useState(true);
  const [checkAnn, setCheckedAnn] = useState(true);
  const [checkShowDisabled, setShowDisabled] = useState(false);
  const [collidingWeeks, setCollidingWeeks] = useState<number[]>([]);
  const [weekEventsChanged, setWeekEventsChanged] = useState(0);
  const [amountDisabled, setAmountDisabled] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  var [chosenSemester, setChosenSemester] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const DEBOUNCE_DELAY = 300; // milliseconds

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const getSuggestions = async (input: string) => {
    const suggestions = await fetchSuggestions(input);
    setSuggestions(suggestions);
  };

  useEffect(() => {
    if (courseInput.length <= 1) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      getSuggestions(courseInput);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [courseInput]);

  const addCourse = async (id: string, semester: string = "25h") => {
    try {
      if (coursesAdded.map((course) => course.id).includes(id)) {
        showToast("Du kan ikke legge til det samme emne flere ganger");
        return;
      }
      setLoading(true);
      var newCourse = await fetchCourse(id, semester);
      if (chosenSemester !== "" && chosenSemester !== newCourse.semester) {
        showToast("Du kan ikke velge kurs fra forskjellige semestre");
        return;
      }
      setCoursesAdded((prevCourses) => [...prevCourses, newCourse]);
      setCheckedAnn(true);
      setCheckedFor(true);
      const color = getNextColor();
      newCourse.events.forEach((e) => (e.color = color));
      setChosenSemester(newCourse.semester);
      if (newCourse.events[0].weeknr < firstWeekNr || firstWeekNr === 0) {
        setFirstWeekNr(newCourse.events[0].weeknr);
      }
      if (newCourse.events[0].weeknr > lastWeekNr || lastWeekNr === 0) {
        setLastWeekNr(newCourse.events.at(-1)?.weeknr ?? 0);
      }
    } catch (err) {
      showToast("Ukjent feil (se log)");
      console.log(err);
    } finally {
      setLoading(false);
      setCourseInput("");
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
    const disabledAmount = allEvents.filter((e) => e.disabled).length;
    setAmountDisabled(disabledAmount);

    setCollidingWeeks((prev) => {
      const isSame =
        prev.length === weeks.length &&
        prev.every((week, i) => week === weeks[i]);
      return isSame ? prev : weeks;
    });
  }, [filteredEvents, weekEventsChanged]);

  function handleCourseRemoval(id: string) {
    const updated = coursesAdded.filter((c) => c.id !== id);
    setCoursesAdded(updated);
    if (updated.length === 0) {
      setFirstWeekNr(0);
      setLastWeekNr(0);
      setChosenSemester("");
    }

    showToast("Emne fjernet!");
  }

  function handleParties() {
    fitParties(
      allEvents,
      coursesAdded.map((c) => c.id)
    );
    setWeekEventsChanged((n) => n + 1);
  }

  function handleSelectCourse(course: string) {
    addCourse(course);
    setCourseInput("");
  }

  return (
    <>
      <div className="card">
        <div className="dashboard">
          <div className="header">
            <div className="seachfield">
              <input
                className="seachbox"
                type="text"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                placeholder="Kurskode"
              />
              <div className="suggestionbox">
                {suggestions.map((s) => (
                  <div
                    key={s}
                    className="suggestion"
                    onClick={() => handleSelectCourse(s)}
                  >
                    <CiSearch className="searchicon" />
                    <p className="suggestiontext">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => addCourse(courseInput)}>+</button>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={checkShowDisabled}
                onChange={() => setShowDisabled(!checkShowDisabled)}
              />
              Vis umarkerte ({amountDisabled})
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
            <button onClick={() => handleParties()}>
              <div className="grouppickerbutton">
                <FaDice size={20} />
                Auto velg grupper
              </div>
            </button>
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
        {toastMessage && (
          <Toast
            message={toastMessage}
            duration={2000}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
      <a href="https://github.com/haakonRefsvik" className="read-the-docs">
        GitHub
      </a>
    </>
  );
}

export default App;

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
import { fitParties, getKey } from "./utils/fitParties";
import { CiSearch } from "react-icons/ci";
import { FaDice } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { Toast } from "./components/Toast";
import { SemesterSelector } from "./components/SemesterSelector";
import { useCourseParties } from "./utils/useCoursesParties";
import { IsSelectedWeekValid, getWeeksFromTo } from "./utils/getWeeksFromTo";

function MainPage() {
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const DEBOUNCE_DELAY = 300; // milliseconds
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [disableSemesterSelector, setDisableSemesterSelector] = useState(false);
  const { semester, courses, setCourses, upsertCourse, setSemester } =
    useCourseParties();

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    const initialCourses = courses; // from URL once
    async function loadCourses() {
      const fetched: Course[] = [];
      for (const c of initialCourses) {
        try {
          const newCourse = await fetchCourse(c.course, semester);
          if (c.party !== undefined) {
            newCourse.events.forEach((e) => {
              if (e.party && e.party !== c.party) {
                e.disabled = true;
              }
            });
          }
          fetched.push(newCourse);
          setCheckedAnn(true);
          setCheckedFor(true);
          setDisableSemesterSelector(true);
          const color = getNextColor(newCourse.id);
          newCourse.events.forEach((e) => (e.color = color));
        } catch (err) {
          console.error("Failed to load course", c.course, err);
        }
      }
      setCoursesAdded(fetched);
    }
    loadCourses();
  }, []); // only on mount

  useEffect(() => {
    const weeks = getWeeksFromTo(coursesAdded);
    if (!IsSelectedWeekValid(weeks, weekSelected)) {
      setWeekSelected(weeks[0]);
    }
    setFirstWeekNr(weeks[0]);
    setLastWeekNr(weeks[1]);
  }, [coursesAdded]);

  useEffect(() => {
    if (courseInput.length <= 1) {
      setSuggestions([]);
      return;
    }

    const handler = setTimeout(async () => {
      const results = await fetchSuggestions(courseInput);
      setSuggestions(results);
      setHighlightedIndex(null);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [courseInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === null || prev === suggestions.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev === null || prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex !== null) {
        handleSelectCourse(suggestions[highlightedIndex]);
      } else {
        handleSelectCourse(courseInput);
      }
    }
  };

  const addCourse = async (id: string) => {
    try {
      if (id === "") {
        showToast("Skriv inn en emnekode");
        return;
      }
      if (coursesAdded.map((course) => course.id).includes(id)) {
        showToast("Du kan ikke legge til det samme emne flere ganger");
        return;
      }

      setLoading(true);
      var newCourse = await fetchCourse(id, semester);

      if (semester !== newCourse.semester && coursesAdded.length != 0) {
        showToast("Du kan ikke velge kurs fra forskjellige semestre");
        return;
      }

      setCoursesAdded((prevCourses) => {
        const updated = [...prevCourses, newCourse];
        return updated;
      });
      upsertCourse(newCourse.id, newCourse.semester);
      setCheckedAnn(true);
      setCheckedFor(true);
      setDisableSemesterSelector(true);
      const color = getNextColor(id);
      newCourse.events.forEach((e) => (e.color = color));
    } catch (err) {
      showToast("Det skjedde en feil");
      console.log(err);
    } finally {
      setLoading(false);
      setCourseInput("");
    }
  };

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
    setCoursesAdded(() => {
      const updated = coursesAdded.filter((c) => c.id !== id);
      if (updated.length === 0) {
        setDisableSemesterSelector(false);
      }
      return updated;
    });

    setCourses(
      courses.filter((c) => c.course !== id),
      semester
    );

    showToast("Emne fjernet!");
  }

  useEffect(() => {
    const parties: string[] = [];
    outer: for (const course of coursesAdded) {
      for (const event of course.events) {
        if (event.party && !event.disabled) {
          parties.push(course.id + ":" + event.party);
          continue outer;
        }
      }
    }

    const updated = courses.map((c) => {
      const match = parties.find((cp) => cp.split(":")[0] === c.course);
      return match
        ? { course: match.split(":")[0], party: match.split(":")[1] }
        : { course: c.course };
    });

    setCourses(updated, semester); // one update instead of overwriting per iteration
  }, [weekEventsChanged]);

  function handleParties() {
    const chosenParties = fitParties(allEvents);

    coursesAdded.forEach((c) =>
      c.events.forEach((e) => {
        if (e.party != null) {
          if (chosenParties.includes(getKey(e.courseid, e.party))) {
            e.disabled = false;
          } else {
            e.disabled = true;
          }
        }
      })
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
                placeholder="Emnekode"
                onKeyDown={handleKeyDown}
              />
              <ul className="suggestionbox">
                {suggestions.map((suggestion, i) => (
                  <li
                    key={suggestion}
                    className={`suggestion ${i === highlightedIndex ? "highlighted" : ""}`}
                    onClick={() => handleSelectCourse(suggestion)}
                  >
                    <CiSearch className="searchicon" />
                    <p className="suggestiontext">{suggestion}</p>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="searchbutton"
              onClick={() => addCourse(courseInput)}
            >
              <IoMdAdd size={15} />
            </button>
          </div>
          <SemesterSelector
            disabled={disableSemesterSelector}
            year={25}
            value={semester}
            onChange={setSemester}
          />
          <div className="checkbox-group">
            <button onClick={() => handleParties()}>
              <div className="grouppickerbutton">
                <FaDice size={20} />
                Auto velg grupper
              </div>
            </button>
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

export default MainPage;

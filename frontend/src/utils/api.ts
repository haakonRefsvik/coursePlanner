import type { Course, Room, Staff, Event } from "../types/Course";

export async function fetchCourse(
  id: string,
  semester: string
): Promise<Course> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/course/${id}/${semester}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.status}`);
  }

  const data = await res.json();

  const course: Course = {
    id: data.id,
    name: data.name,
    semester: data.semester,
    events: data.events.map(
      (e: any): Event => ({
        id: e.id,
        disabled: false,
        widthPercent: 100,
        leftOffset: 0,
        crashesWithEvents: [],
        party: e.party,
        color: "",
        courseid: e.courseid,
        weeknr: e.weeknr,
        eventid: e.eventid,
        title: e.title,
        summary: e.summary,
        dtstart: e.dtstart,
        dtend: e.dtend,
        teachingMethod: e["teaching-method-name"] || e["teaching-method"],
        staffs: (e.staffs || []).map(
          (s: any): Staff => ({
            id: s.id,
            firstname: s.firstname,
            lastname: s.lastname,
            shortname: s.shortname,
            url: s.url,
          })
        ),
        room: (e.room || []).map(
          (r: any): Room => ({
            id: r.id,
            roomid: r.roomid,
            roomname: r.roomname,
            buildingname: r.buildingname,
            roomurl: r.roomurl,
          })
        ),
      })
    ),
  };

  return course;
}

export async function fetchSuggestions(input: string): Promise<string[]> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/courses/suggestions?query=${input}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch course: ${res.status}`);
  }

  const data = await res.json();

  return data;
}

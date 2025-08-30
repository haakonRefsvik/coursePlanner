export interface Staff {
  id: string;
  firstname: string;
  lastname: string;
  shortname: string;
  url: string;
}

export interface Room {
  id: string;
  roomid: string;
  roomname: string;
  buildingname: string;
  roomurl: string;
}

export interface Event {
  id: string;
  crashesWithEvents: Event[];
  eventid: string;
  courseid: string;
  title: string;
  summary: string;
  dtstart: string;
  dtend: string;
  teachingMethod: string;
  staffs: Staff[];
  room: Room[];
  weeknr: number;
  color: string;
  party: string;
  widthPercent: number;
  leftOffset: number;
  disabled: boolean;
}

export interface Course {
  id: string;
  name: string;
  semester: string;
  events: Event[];
}

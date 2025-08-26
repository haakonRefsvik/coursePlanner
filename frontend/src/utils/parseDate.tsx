export function parseDate(isoString: string): string {
  // Use the built-in Date parser
  const date = new Date(isoString);

  // Format to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getHoursOnlyLiteral(isoString: string): string {
  return isoString.split("T")[1].slice(0, 5); // "14:15"
}

export function getDatesForWeek(year: number, week: number): string[] {
  const simpleDate = new Date(year, 0, 1 + (week - 1) * 7); // Approximate date
  const dayOfWeek = simpleDate.getDay(); // 0=Sun, 1=Mon, ...

  // ISO week starts on Monday → adjust back to Monday
  const isoMonday = new Date(simpleDate);
  isoMonday.setDate(simpleDate.getDate() - ((dayOfWeek + 6) % 7));

  const dates: string[] = [];

  for (let i = 0; i < 5; i++) {
    const d = new Date(isoMonday);
    d.setDate(isoMonday.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
  }

  return dates;
}

export function formatDateToDayMonth(dateString: string): string {
  const date = new Date(dateString);

  // Format as "25. august" in Norwegian
  return date.toLocaleDateString("no-NO", {
    day: "numeric",
    month: "long",
  });
}

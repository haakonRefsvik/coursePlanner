export function parseDate(isoString: string): string {
  // Normalize timezone offsets:
  // - "+01"   -> "+01:00"
  // - "+0100" -> "+01:00"
  const safe = isoString
    .replace(/([+-]\d{2})(\d{2})$/, "$1:$2") // +0100 → +01:00
    .replace(/([+-]\d{2})$/, "$1:00"); // +01   → +01:00

  const date = new Date(safe);

  if (isNaN(date.getTime())) {
    console.error("Invalid date:", isoString, "->", safe);
    return "Invalid Date";
  }

  // Always return YYYY-MM-DD in UTC
  return date.toISOString().split("T")[0];
}

// Fix timezone offsets:
// +01 -> +01:00, +0100 -> +01:00
export function safeDate(dateStr: string): Date {
  const safeStr = dateStr
    .replace(/([+-]\d{2})(\d{2})$/, "$1:$2") // +0100 → +01:00
    .replace(/([+-]\d{2})$/, "$1:00"); // +01   → +01:00

  return new Date(safeStr);
}

export function getHoursOnlyLiteral(isoString: string): string {
  return isoString.split("T")[1].slice(0, 5); // "14:15"
}

export function isDifferentDay(
  dateA: string | Date,
  dateB: string | Date
): boolean {
  const dA = new Date(dateA);
  const dB = new Date(dateB);

  return (
    dA.getFullYear() !== dB.getFullYear() ||
    dA.getMonth() !== dB.getMonth() ||
    dA.getDate() !== dB.getDate()
  );
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

export function hasNoEvents(data: unknown): boolean {
  return (
    data !== null &&
    typeof data === "object" &&
    "events" in data &&
    Array.isArray((data as any).events) &&
    (data as any).events.length === 0
  );
}

export function invalidCourse(data: unknown): boolean {
  return (
    data !== null &&
    typeof data === "object" &&
    ((data as any).events === null || (data as any).events === undefined)
  );
}

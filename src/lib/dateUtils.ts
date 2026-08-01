/**
 * Formats a Date object as YYYY-MM-DD using Bulgarian local time (Europe/Sofia).
 * Prevents UTC rollback where new Date().toISOString().split("T")[0] returns
 * yesterday's date between 00:00 and 03:00 AM in UTC+3 / UTC+2.
 */
export function getLocalDateISO(d: Date = new Date(), timeZone: string = "Europe/Sofia"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(d); // Returns "YYYY-MM-DD"
  } catch {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}

/** Returns YYYY-MM for the current local month in Europe/Sofia timezone */
export function getLocalMonthISO(d: Date = new Date(), timeZone: string = "Europe/Sofia"): string {
  return getLocalDateISO(d, timeZone).slice(0, 7);
}

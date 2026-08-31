// Nepal / Kathmandu Timezone Utilities (GMT+05:45 / Asia/Kathmandu)

const KATHMANDU_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // +5 hours 45 minutes in ms

/**
 * Parses any date format (ISO, Date instance, or local YYYY-MM-DDTHH:mm string)
 * into a millisecond timestamp representing the target time in GMT+5:45.
 */
export function parseTargetTimestamp(dateInput) {
  if (!dateInput) return 0;
  if (typeof dateInput === "number") return dateInput;
  if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? 0 : dateInput.getTime();

  const str = String(dateInput).trim();
  if (!str) return 0;

  // 1. If string has explicit timezone offset or UTC "Z"
  if (str.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(str)) {
    const d = new Date(str);
    return isNaN(d.getTime()) ? 0 : d.getTime();
  }

  // 2. If datetime string without timezone (e.g. from HTML datetime-local input "YYYY-MM-DDTHH:mm")
  // Treat it explicitly as GMT+5:45 (Nepal Standard Time)
  const withSeconds = str.length === 16 ? `${str}:00` : str;
  const nptString = withSeconds.includes("+") ? withSeconds : `${withSeconds}+05:45`;
  const d = new Date(nptString);
  if (!isNaN(d.getTime())) return d.getTime();

  // Fallback
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? 0 : fallback.getTime();
}

/**
 * Calculates remaining days, hours, minutes, and seconds from right now to the target in GMT+5:45.
 */
export function calculateTimeRemaining(targetInput) {
  const targetTime = parseTargetTimestamp(targetInput);
  if (!targetTime) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const now = Date.now();
  const difference = targetTime - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    totalSeconds,
  };
}

/**
 * Converts any Date or ISO string into a "YYYY-MM-DDTHH:mm" string
 * formatted for HTML datetime-local inputs in Kathmandu Time (GMT+5:45).
 */
export function formatToKathmanduInput(dateInput) {
  if (!dateInput) return "";
  const ts = parseTargetTimestamp(dateInput);
  if (!ts) return "";
  const d = new Date(ts);

  // Shift UTC time by Kathmandu offset (+5h45m)
  const nptDate = new Date(d.getTime() + KATHMANDU_OFFSET_MS);
  const year = nptDate.getUTCFullYear();
  const month = String(nptDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(nptDate.getUTCDate()).padStart(2, "0");
  const hours = String(nptDate.getUTCHours()).padStart(2, "0");
  const minutes = String(nptDate.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parses a "YYYY-MM-DDTHH:mm" datetime-local string (entered by user in GMT+5:45)
 * into a standard UTC ISO 8601 string.
 */
export function parseKathmanduInputToISO(inputValue) {
  if (!inputValue) return null;
  const trimmed = String(inputValue).trim();
  if (!trimmed) return null;

  if (trimmed.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const kathmanduDateString = `${withSeconds}+05:45`;
  const d = new Date(kathmanduDateString);

  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Formats a Date/ISO string for human-readable display in Nepal Standard Time (GMT+5:45).
 */
export function formatKathmanduDisplay(dateInput, options = {}) {
  if (!dateInput) return "";
  const ts = parseTargetTimestamp(dateInput);
  if (!ts) return "";
  const d = new Date(ts);

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kathmandu",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      ...options,
    });
    return `${formatter.format(d)} (GMT+5:45)`;
  } catch (e) {
    return d.toLocaleString();
  }
}

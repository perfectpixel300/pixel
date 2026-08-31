// Kathmandu (Nepal Standard Time - NPT) Timezone Utilities (UTC+05:45)

const KATHMANDU_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // +5 hours 45 minutes in ms

/**
 * Converts any Date or ISO string into a "YYYY-MM-DDTHH:mm" string
 * formatted specifically for HTML datetime-local inputs in Kathmandu Time (NPT).
 */
export function formatToKathmanduInput(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

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
 * Parses a "YYYY-MM-DDTHH:mm" datetime-local string (entered by user in Kathmandu time)
 * into a standard UTC ISO 8601 string.
 */
export function parseKathmanduInputToISO(inputValue) {
  if (!inputValue) return null;
  const trimmed = String(inputValue).trim();
  if (!trimmed) return null;

  // If already contains timezone offset or Z
  if (trimmed.includes("+") || trimmed.includes("Z")) {
    const d = new Date(trimmed);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }

  // Format YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss with explicit Kathmandu offset (+05:45)
  const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const kathmanduDateString = `${withSeconds}+05:45`;
  const d = new Date(kathmanduDateString);

  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Formats a Date/ISO string for human-readable display in Nepal Standard Time (NPT).
 */
export function formatKathmanduDisplay(dateInput, options = {}) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

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
    return `${formatter.format(d)} (NPT)`;
  } catch (e) {
    return d.toLocaleString();
  }
}

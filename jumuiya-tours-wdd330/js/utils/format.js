// js/utils/format.js

/**
 * Turning a distance in meters into a friendly string.
 * 850  → "850 m"
 * 2200 → "2.2 km"
 */
export function formatDistance(meters) {
  const value = Number(meters);
  if (!isFinite(value) || value <= 0) return "";

  if (value < 1000) {
    return `${Math.round(value)} m`;
  }

  const km = value / 1000;
  return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}

/**
 * Convert OpenTripMap "kinds" string into 2–3 readable tags.
 * "cultural,museums,architecture" → "cultural • museums • architecture"
 */
export function formatKinds(kinds) {
  if (!kinds) return "";
  return kinds
    .split(",")
    .map((k) => k.trim().replace(/_/g, " "))
    .filter(Boolean)
    .slice(0, 3)
    .join(" • ");
}

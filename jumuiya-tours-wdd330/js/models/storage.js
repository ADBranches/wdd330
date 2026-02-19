// js/models/storage.js

const STORAGE_KEY = "jumuiya-trip-v1";

/**
 * Save the current trip into localStorage.
 * Expects:
 *  - destination: Destination instance or plain object
 *  - itinerary: Itinerary instance (with toJSON) or plain object
 *  - budget: any serializable object (we'll treat as plain data)
 */
export function saveTrip({ destination, itinerary, budget }) {
  if (typeof window === "undefined" || !window.localStorage) return;

  const payload = {
    destination: destination
      ? {
          name: destination.name,
          country: destination.country,
          lat: destination.lat,
          lon: destination.lon,
          displayName: destination.displayName,
        }
      : null,
    itinerary:
      itinerary && typeof itinerary.toJSON === "function"
        ? itinerary.toJSON()
        : itinerary || null,
    budget: budget || null,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Load saved trip data from localStorage.
 * Returns { destination, itinerary, budget } or null.
 */
export function loadTrip() {
  if (typeof window === "undefined" || !window.localStorage) return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("[storage] Failed to parse saved trip:", err);
    return null;
  }
}

/**
 * Clear any saved trip.
 */
export function clearTrip() {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

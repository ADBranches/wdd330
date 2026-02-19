// js/ui/destinationView.js
import { qs } from "../utils/dom.js";

/**
 * Render a Destination instance into the Destination view.
 * @param {import("../models/destination.js").Destination} destination
 */
export function showDestination(destination) {
  if (!destination) {
    console.warn("[destinationView] showDestination called with null destination");
    return;
  }

  const titleEl = qs("#destination-title");
  const subtitleEl = qs("#destination-subtitle");
  const metaEl = qs("#destination-meta");
  const placeholderList = qs("#destination-attractions-placeholder");

  if (titleEl) {
    titleEl.textContent = destination.displayName || destination.name;
  }

  if (subtitleEl) {
    subtitleEl.textContent = destination.country
      ? `Planning a trip to ${destination.name}, ${destination.country}.`
      : `Planning a trip to ${destination.name}.`;
  }

  if (metaEl) {
    const lat = isFinite(destination.lat) ? destination.lat.toFixed(4) : "?";
    const lon = isFinite(destination.lon) ? destination.lon.toFixed(4) : "?";
    metaEl.textContent = `Approx. coordinates: ${lat}, ${lon}`;
  }

  if (placeholderList) {
    placeholderList.innerHTML =
      '<li class="text-muted">Nearby attractions will appear here after we connect the Places API in a later phase.</li>';
  }
}
// js/ui/destinationView.js
import { qs, qsa } from "../utils/dom.js";
import { getAttractionsByCoords } from "../api/opentripmap.js";
import { formatDistance, formatKinds } from "../utils/format.js";
import { itinerary } from "../models/itinerary.js";
import { getCurrentDayId, notifyItineraryUpdated } from "./plannerView.js";

// -----------------------------
// Module-level state
// -----------------------------
let currentDestination = null;
let allAttractions = [];
let currentFilter = "all";
let filterChipsInitialized = false;

// -----------------------------
// Destination getters/setters
// -----------------------------
export function getCurrentDestination() {
  return currentDestination;
}

export function setCurrentDestination(dest) {
  currentDestination = dest || null;
}

// -----------------------------
// Filter predicates
// -----------------------------
/**
 * Simple mapping from filter key → predicate.
 * You can tweak these later.
 */
const FILTER_PREDICATES = {
  all: () => true,
  nature: (a) =>
    (a.kinds || "").includes("natural") ||
    (a.kinds || "").includes("parks") ||
    (a.kinds || "").includes("forests"),
  culture: (a) =>
    (a.kinds || "").includes("cultural") ||
    (a.kinds || "").includes("museums") ||
    (a.kinds || "").includes("architecture"),
  fun: (a) =>
    (a.kinds || "").includes("amusements") ||
    (a.kinds || "").includes("tourist_facilities"),
};

// -----------------------------
// Public: showDestination
// -----------------------------
/**
 * Render a Destination instance into the Destination view.
 * @param {import("../models/destination.js").Destination} destination
 */
export async function showDestination(destination) {
  if (!destination) {
    console.warn("[destinationView] showDestination called with null destination");
    return;
  }

  // Track current destination for saving/restoring later
  currentDestination = destination;
  allAttractions = [];
  currentFilter = "all";

  const titleEl = qs("#destination-title");
  const subtitleEl = qs("#destination-subtitle");
  const metaEl = qs("#destination-meta");
  const listContainer = qs("#destination-attractions");

  if (titleEl) {
    titleEl.textContent = destination.displayName || destination.name;
  }

  if (subtitleEl) {
    subtitleEl.textContent = destination.country
      ? `Planning a trip to ${destination.name}, ${destination.country}.`
      : `Planning a trip to ${destination.name}.`;
  }

  if (metaEl) {
    const lat = Number.isFinite(destination.lat) ? destination.lat.toFixed(4) : "?";
    const lon = Number.isFinite(destination.lon) ? destination.lon.toFixed(4) : "?";
    metaEl.textContent = `Approx. coordinates: ${lat}, ${lon}`;
  }

  if (listContainer) {
    listContainer.innerHTML =
      '<div class="card card--placeholder"><p class="card__body">Loading nearby attractions…</p></div>';
  }

  initFilterChipsIfNeeded();
  syncFilterChips();

  try {
    allAttractions = await getAttractionsByCoords(
      destination.lat,
      destination.lon,
      5000, // radius (m)
      40    // limit
    );
    renderAttractions();
  } catch (err) {
    console.error("[destinationView] Failed to load attractions:", err);
    if (listContainer) {
      listContainer.innerHTML =
        '<div class="card card--placeholder"><p class="card__body">We could not load attractions right now. Please try again in a moment.</p></div>';
    }
  }
}

// -----------------------------
// Filters
// -----------------------------
function initFilterChipsIfNeeded() {
  if (filterChipsInitialized) return;

  const chips = qsa("#view-destination .chip--filter[data-filter]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const nextFilter = chip.dataset.filter || "all";
      currentFilter = nextFilter;
      syncFilterChips();
      renderAttractions();
    });
  });

  filterChipsInitialized = true;
}

function syncFilterChips() {
  const chips = qsa("#view-destination .chip--filter[data-filter]");
  chips.forEach((chip) => {
    const value = chip.dataset.filter || "all";
    chip.classList.toggle("is-active", value === currentFilter);
  });
}

// -----------------------------
// Rendering attractions
// -----------------------------
function renderAttractions() {
  const container = qs("#destination-attractions");
  if (!container) return;

  if (!allAttractions || allAttractions.length === 0) {
    container.innerHTML =
      '<div class="card card--placeholder"><p class="card__body">No attractions found near this destination. Try searching another nearby city.</p></div>';
    return;
  }

  const predicate = FILTER_PREDICATES[currentFilter] || FILTER_PREDICATES.all;
  const filtered = allAttractions.filter(predicate);

  if (filtered.length === 0) {
    container.innerHTML =
      '<div class="card card--placeholder"><p class="card__body">No attractions match this category. Try “All”.</p></div>';
    return;
  }

  container.innerHTML = filtered.map(makeAttractionCardHtml).join("");

  // Delegate click for "Add to Day" buttons
  container.onclick = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("btn--add-to-day")) return;

    const xid = target.dataset.xid;
    if (!xid) return;

    const attraction = allAttractions.find((a) => a.xid === xid);
    if (!attraction) return;

    const dayId = getCurrentDayId();
    // Pass destination so the itinerary can store context
    itinerary.addStop(dayId, attraction, currentDestination);
    notifyItineraryUpdated();

    // Optional UX feedback
    target.textContent = "Added!";
    setTimeout(() => {
      target.textContent = "Add to Day";
    }, 1200);
  };
}

function makeAttractionCardHtml(attraction) {
  const distance = formatDistance(attraction.dist);
  const kindsLabel = formatKinds(attraction.kinds);
  const title = attraction.name || "Unnamed place";

  return `
    <article class="card attraction-card">
      <h3 class="card__title">${title}</h3>
      <p class="card__body">
        ${
          kindsLabel
            ? `<span class="meta-text">${kindsLabel}</span><br>`
            : ""
        }
        ${
          distance
            ? `<span class="meta-text">About ${distance} from city center</span>`
            : ""
        }
      </p>
      <button
        type="button"
        class="btn btn--primary btn--add-to-day"
        data-xid="${attraction.xid}"
      >
        Add to Day
      </button>
    </article>
  `;
}

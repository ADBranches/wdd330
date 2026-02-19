// js/ui/savedTripsView.js
import { qs } from "../utils/dom.js";
import { loadTrip, clearTrip } from "../models/storage.js";
import { Itinerary, itinerary } from "../models/itinerary.js";
import { Destination } from "../models/destination.js";
import { setCurrentDestination, showDestination } from "./destinationView.js";
import { applyBudget } from "./plannerView.js";
import { navigateTo } from "../router.js";

let initialized = false;

export function initSavedTripsView() {
  if (initialized) return;
  initialized = true;

  const loadBtn = qs("#saved-trip-load");
  const clearBtn = qs("#saved-trip-clear");

  if (loadBtn) {
    loadBtn.addEventListener("click", () => {
      const data = loadTrip();
      if (!data) {
        alert("No saved trip found yet.");
        return;
      }
      hydrateFromData(data);
      navigateTo("planner");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearTrip();
      renderSummary();
    });
  }

  // When planner saves a trip, refresh summary
  window.addEventListener("trip:saved", renderSummary);

  renderSummary();
}

export function showSavedTripsView() {
  renderSummary();
}

function renderSummary() {
  const summaryEl = qs("#saved-trip-summary");
  if (!summaryEl) return;

  const data = loadTrip();
  if (!data) {
    summaryEl.classList.add("card--placeholder");
    summaryEl.innerHTML =
      '<p class="card__body">No saved trip yet. Build a trip in the planner and click “Save Trip”.</p>';
    return;
  }

  const { destination, itinerary: itJSON, budget } = data;
  const days = itJSON?.days || [];
  const dayCount = days.length;
  const stopCount = days.reduce(
    (sum, d) => sum + (d.stops?.length || 0),
    0
  );

  const destName =
    destination?.displayName ||
    (destination?.name
      ? `${destination.name}${
          destination.country ? ", " + destination.country : ""
        }`
      : "Unknown destination");

  summaryEl.classList.remove("card--placeholder");
  summaryEl.innerHTML = `
    <h3 class="card__title">${destName}</h3>
    <p class="card__body">
      ${dayCount} day(s), ${stopCount} stop(s) planned.<br>
      ${
        budget
          ? `<span class="meta-text">Budget saved (${budget.currency || "local"}).</span>`
          : `<span class="meta-text">No budget saved yet.</span>`
      }
    </p>
  `;
}

function hydrateFromData(data) {
  const { destination, itinerary: itJSON, budget } = data;

  // Rebuild itinerary
  const restored = Itinerary.fromJSON(itJSON);
  itinerary.days = restored.days || [];

  // Rebuild destination
  if (destination) {
    const dest = new Destination(destination);
    setCurrentDestination(dest);
    showDestination(dest);
  }

  // Re-apply budget
  if (budget) {
    applyBudget(budget);
  }
}

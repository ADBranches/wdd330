// js/main.js
import { initRouter } from "./router.js";
import { initHomeView } from "./ui/homeView.js";
import {
  initPlannerView,
  getCurrentBudget,
} from "./ui/plannerView.js";
import { initSavedTripsView } from "./ui/savedTripsView.js";
import { itinerary } from "./models/itinerary.js";
import { saveTrip } from "./models/storage.js";
import { getCurrentDestination } from "./ui/destinationView.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize views first (wire listeners etc.)
  initHomeView();
  initPlannerView();
  initSavedTripsView();

  // Wire Save Trip button
  const saveBtn = document.getElementById("planner-save-trip");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const destination = getCurrentDestination();
      const budget = getCurrentBudget();
      const data = { destination, itinerary, budget };

      try {
        saveTrip(data);
        // Notify Saved Trips view that something changed
        window.dispatchEvent(new CustomEvent("trip:saved"));
        alert("Trip saved!");
      } catch (err) {
        console.error("[main] Failed to save trip:", err);
        alert(
          "We could not save the trip. Please check your browser settings."
        );
      }
    });
  }

  // Then initialize router (this will also navigate to initial view)
  initRouter();
});

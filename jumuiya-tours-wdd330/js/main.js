// js/main.js
import { initRouter } from "./router.js";
import { initHomeView } from "./ui/homeView.js";
import { initPlannerView } from "./ui/plannerView.js";
import { initSavedTripsView } from "./ui/savedTripsView.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize views first (wire listeners etc.)
  initHomeView();
  initPlannerView();
  initSavedTripsView();

  // Then initialize router (this will also navigate to initial view)
  initRouter();
});

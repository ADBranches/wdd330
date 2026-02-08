// js/ui/homeView.js
import { qs, qsa } from "../utils/dom.js";
import { navigateTo } from "../router.js";
import { geocodeCity } from "../api/mapbox.js";
import { getAttractionsByCoords } from "../api/opentripmap.js";

export function initHomeView() {
  const form = qs(".destination-search");
  const input = qs("#destination-input");
  const quickButtons = qsa(".chip[data-city]");
  const yearSpan = qs("#footer-year");

  // Footer year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Quick destination chips: populate input
  quickButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.dataset.city;
      if (city && input) {
        input.value = city;
        input.focus();
      }
    });
  });

  // Real API call on submit
  if (form && input) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city = input.value.trim();
      if (!city) {
        input.focus();
        return;
      }

      console.log(`[homeView] Searching for "${city}"...`);

      try {
        // 1) Geocode city → coords
        const geo = await geocodeCity(city);
        if (!geo) {
          console.warn("[homeView] No geocode result for", city);
          alert("We could not find that city. Try a nearby major city.");
          return;
        }

        console.log("[homeView] Geocoded:", geo);

        // 2) Sample attractions around the geocoded point
        const pois = await getAttractionsByCoords(geo.lat, geo.lon, 5000, 10);
        console.log("[homeView] Sample attractions:", pois);

        // Later we will pass this data into destination view.
        navigateTo("destination");
      } catch (err) {
        console.error("[homeView] Error while fetching destination data:", err);
        alert(
          "Something went wrong while talking to the travel APIs. " +
            "Check your API keys and try again."
        );
      }
    });
  }
}

export function showHomeView() {
  // Hook for future behavior when we reopen the Home view
}

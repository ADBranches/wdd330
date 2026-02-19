// js/ui/homeView.js
import { qs, qsa } from "../utils/dom.js";
import { navigateTo } from "../router.js";
import { geocodeCity } from "../api/locationiq.js";
import { Destination } from "../models/destination.js";
import { showDestination } from "./destinationView.js";

export function initHomeView() {
  const form = qs(".destination-search");
  const input = qs("#destination-input");
  const quickButtons = qsa(".chip[data-city]");
  const yearSpan = qs("#footer-year");

  // Footer year
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Quick destination chips: fill the input and optionally auto-submit later
  quickButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const city = btn.dataset.city;
      if (city && input) {
        input.value = city;
        input.focus();
      }
    });
  });

  if (form && input) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const city = input.value.trim();
      if (!city) {
        input.focus();
        return;
      }

      console.log(`[homeView] Searching for "${city}" via LocationIQ...`);

      try {
        const geo = await geocodeCity(city);

        if (!geo) {
          console.warn("[homeView] No geocode result for", city);
          alert("We could not find that city. Try a nearby major city.");
          return;
        }

        console.log("[homeView] Geocode result:", geo);

        const destination = new Destination({
          name: geo.name,
          country: geo.country,
          lat: geo.lat,
          lon: geo.lon,
        });

        // Render destination view
        showDestination(destination);

        // Navigate to the destination screen
        navigateTo("destination");
      } catch (err) {
        console.error("[homeView] Error while geocoding:", err);
        alert(
          "Something went wrong while contacting the location service. " +
            "Check your LocationIQ token in js/config.js and try again."
        );
      }
    });
  }
}

// Optional hook for future if needed
export function showHomeView() {
  // e.g. could reset search form when returning to Home
}

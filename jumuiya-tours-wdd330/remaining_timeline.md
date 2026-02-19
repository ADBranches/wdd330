### Phase 4 – Destination search really working

**Goal:** Type “Kampala” → geocode → show destination screen with basic info.

**Files to touch**

* `js/api/locationiq.js` *or* `js/api/mapbox.js` (pick one for geocoding)
* `js/models/destination.js`
* `js/ui/homeView.js`
* `js/ui/destinationView.js`
* `js/router.js` (if you need a `navigateTo("destination")` helper)

**Concrete tasks**

1. Implement `geocodeCity(cityName)` in your chosen API file.
2. In `homeView.js`, wire the search form:

   * Validate non-empty city.
   * Call `geocodeCity`.
   * Create `new Destination({ name, country, lat, lon })`.
   * Store it (module-level variable or pass to `destinationView`).
   * `navigateTo("destination")`.
3. In `destinationView.js`, show:

   * City name + country.
   * Simple text like “Start building your trip for Kampala, Uganda”.

**What you can report this week**

* Task: *“Implement working destination search and destination view”*

  * Source: GitHub commit / file links.
  * Site: your Render URL (e.g. `https://jumuiya-tours-wdd330.onrender.com`).
  * Trello: updated card “Destination search”.

---

### Phase 5 – Attractions list + filters

**Goal:** On destination page, show real attractions from OpenTripMap with category chips.

**Files**

* `js/api/opentripmap.js`
* `js/ui/destinationView.js`
* `js/utils/format.js` (optional for distance text)
* `css/components.css` (card styles, filter chips)

**Concrete tasks**

1. Implement function like `getAttractionsByCoords(lat, lon, options)` in `opentripmap.js`.
2. In `destinationView.js`:

   * When showing a destination, fetch attractions.
   * Render them into cards with “Add to Day” button (even if it doesn’t do much yet).
   * Add category filter buttons (All / Nature / Culture / etc.).
3. Handle loading + error states (simple text is enough).

---

### Phase 6 – Itinerary model + Planner view

**Goal:** User can add attractions into Day 1 / Day 2 and see them in planner.

**Files**

* `js/models/itinerary.js` (new)
* `js/ui/plannerView.js`
* `js/ui/destinationView.js`

**Concrete tasks**

1. Build `Itinerary` class (`addDay`, `addStop`, `removeStop`, `toJSON`, `fromJSON`).
2. Planner view shows days + list of stops.
3. “Add to Day” button in `destinationView.js` calls `itinerary.addStop()` and updates planner.

---

### Phase 7 – Save trips (localStorage) + Saved Trips screen

**Goal:** Trip survives reload and shows in “Saved Trips”.

**Files**

* `js/models/storage.js` (new)
* `js/main.js`
* `js/ui/plannerView.js`
* `js/ui/savedTripsView.js`

**Concrete tasks**

1. Implement `saveTrip` / `loadTrip` / `clearTrip` in `storage.js`.
2. On load, try to rebuild destination + itinerary from storage.
3. “Save Trip” button in planner saves to storage.
4. `savedTripsView.js` shows a summary and “Load into planner” button.

---

### Phase 8 – Map + simple budget + final polish

**Goal:** One “wow” feature plus nice UX.

**Files**

* `js/api/mapbox.js`
* `js/ui/plannerView.js`
* `js/api/exchange.js` (for a simple budget in at least 2 currencies)
* `css/layout.css`, `css/components.css` (responsiveness + polish)
* `README.md` (final description, tech stack, live URL, Trello link)
* `timeline.md` (mark all phases done)

You don’t have to do *every* fancy idea from the big original list. To still look “A-level”:

* Minimal Map:

  * Show Mapbox (or static map) with markers for stops of current day.
* Minimal Budget:

  * Inputs: Transport, Accommodation, Activities.
  * Shows total in USD + 1 other currency using your exchange API.
* Finish:

  * Clean up layout for mobile and desktop.
  * Check for obvious errors in console.
  * Make sure Render deployment is in sync with main branch.

---

## 4. So… restructure or not?

* **No major restructure needed.**
  Your original 0–10 phases are fine; just mark 0–3 as done and compress 4–10 into the 4 big phases above (4–8).

* **You already match the WDD 330 “pattern”**:

  * Modular JS files (`js/api`, `js/ui`, `js/models`, `js/utils`).
  * Clean index.html and CSS separations.

* **For each “Report on Tasks” week**, make sure you can truthfully list at least **1–3 tasks** from the phases above, each with:

  * GitHub link (to specific file/commit or repo).
  * Live Render link.
  * Trello board link.

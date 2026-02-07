Below is a **phase-by-phase timeline** with **exact file names + paths** for each stage.

---

## Phase 0 – Project & Repo Setup

**Goal:** Empty repo → clean skeleton.

**Files / paths**

* `index.html`
* `css/base.css`
* `css/layout.css`
* `css/components.css`
* `css/theme.css`
* `js/main.js`
* `js/router.js`
* `js/config.example.js`
* `docs/dev_timeline.md`
* `README.md`
* `.gitignore`

**Steps**

1. Create repo `jumuiya-tours-wdd330` on GitHub and clone it.
2. Create folders: `css/`, `js/`, `js/api/`, `js/models/`, `js/ui/`, `js/utils/`, `assets/`, `docs/`.
3. Add empty files listed above.
4. In `README.md`, put a short project description + TODO sections.
5. Commit: `chore: initial project structure`.

---

## Phase 1 – Static HTML Shell & View Containers

**Goal:** One HTML file with all view sections (no JS yet).

**Files**

* `index.html`
* `css/base.css`
* `css/layout.css`
* `css/theme.css`

**Steps**

1. In `index.html`:

   * Add `<header>` with logo placeholder + nav buttons:

     * Home
     * Trip Planner
     * Saved Trips
   * Inside `<main>`, create **view containers**:

     * `<section id="view-home">…</section>`
     * `<section id="view-destination">…</section>`
     * `<section id="view-planner">…</section>`
     * `<section id="view-saved">…</section>`
   * Add `<footer>` with “Jumuiya Tours” + API attributions.
   * Include CSS + JS:

     ```html
     <link rel="stylesheet" href="css/base.css">
     <link rel="stylesheet" href="css/layout.css">
     <link rel="stylesheet" href="css/components.css">
     <link rel="stylesheet" href="css/theme.css">
     <script type="module" src="js/main.js"></script>
     ```

2. In `css/base.css`:

   * Reset: `box-sizing`, minimal normalize.
   * Body font, default link styles.

3. In `css/layout.css`:

   * Layout for header/main/footer.
   * Mobile-first column layout.

4. In `css/theme.css`:

   * Define CSS variables for colors, radius, spacing.

5. Commit: `feat: add HTML shell and base styles`.

---

## Phase 2 – Basic Views & Navigation (Router Skeleton)

**Goal:** Switching between views without data.

**Files**

* `js/main.js`
* `js/router.js`
* `js/ui/homeView.js`
* `js/ui/plannerView.js`
* `js/ui/savedTripsView.js`
* `js/utils/dom.js`
* `css/components.css`

**Steps**

1. Create `js/utils/dom.js` with helpers:

   ```js
   export const qs = (sel, parent = document) => parent.querySelector(sel);
   export const qsa = (sel, parent = document) => [...parent.querySelectorAll(sel)];
   ```

2. In `js/router.js`:

   * Export `initRouter()` and `navigateTo(viewName)`.
   * Logic:

     * Hide all `section[id^="view-"]`.
     * Remove `.is-active` from nav buttons.
     * Show the requested view & mark its nav button active.

3. Create view modules:

   * `js/ui/homeView.js`

     * `export function initHomeView() { ... }`
     * `export function showHomeView() { ... }` (for future).

   * `js/ui/plannerView.js` & `js/ui/savedTripsView.js` with simple placeholder text.

4. In `js/main.js`:

   * Import router + views.
   * On DOMReady, call:

     ```js
     initRouter();
     navigateTo("home");
     ```
   * Wire nav buttons to call `navigateTo("home" | "planner" | "saved")`.

5. In `css/components.css`:

   * Add `.nav-link` + `.nav-link.is-active`.

6. Commit: `feat: add router and basic view switching`.

---

## Phase 3 – Config & API Layer Scaffolding

**Goal:** Clean separation for external calls, one test request working.

**Files**

* `js/config.example.js`
* `js/api/opentripmap.js`
* `js/api/mapbox.js`
* `js/api/exchange.js`
* `docs/api_notes.md`

**Steps**

1. In `js/config.example.js`:

   ```js
   export const OPENTRIPMAP_API_KEY = "YOUR_KEY_HERE";
   export const MAPBOX_ACCESS_TOKEN = "YOUR_TOKEN_HERE";
   export const EXCHANGE_API_KEY = "YOUR_KEY_HERE";
   ```

   * Add `config.js` to `.gitignore`.
   * Locally, copy `config.example.js` → `config.js` and fill real keys.

2. `js/api/opentripmap.js`:

   * Export:

     ```js
     import { OPENTRIPMAP_API_KEY } from "../config.js";

     const BASE_URL = "https://api.opentripmap.com/0.1/en";

     export async function getAttractionsByCoords(lat, lon, radius = 5000) { ... }
     ```

3. `js/api/mapbox.js`:

   * Export:

     ```js
     import { MAPBOX_ACCESS_TOKEN } from "../config.js";

     export async function geocodeCity(city) { ... }
     export async function getRouteForDay(stops) { ... }
     ```

4. `js/api/exchange.js`:

   * Basic:

     ```js
     import { EXCHANGE_API_KEY } from "../config.js";

     export async function fetchRates(base) { ... }
     export function convertAmount(amount, from, to, rates) { ... }
     ```

5. From `homeView.js` or `main.js`, call one function (e.g. `getAttractionsByCoords`) and `console.log` the result.

6. In `docs/api_notes.md`, paste sample JSON responses + key fields.

7. Commit: `feat: add API layer and config template`.

---

## Phase 4 – Destination Search & Model

**Goal:** Search city → get coordinates + basic destination object.

**Files**

* `js/models/destination.js`
* `js/ui/homeView.js`
* `js/ui/destinationView.js`
* `js/api/mapbox.js`
* `css/components.css`

**Steps**

1. In `js/models/destination.js`:

   ```js
   export class Destination {
     constructor({ name, country, lat, lon }) {
       this.name = name;
       this.country = country;
       this.lat = lat;
       this.lon = lon;
     }
   }
   ```

2. Add new view module: `js/ui/destinationView.js`

   * Responsible for `#view-destination`.
   * Render destination name, summary, and a placeholder list for attractions.

3. In `homeView.js`:

   * Add search form listener.
   * On submit:

     * Call `geocodeCity(cityName)` (Mapbox).
     * Build `Destination` instance.
     * Pass destination to `destinationView.showDestination(destination)`.
     * `navigateTo("destination")`.

4. Basic styles for search field & button in `components.css`.

5. Commit: `feat: destination search and basic destination view`.

---

## Phase 5 – Attractions List (OpenTripMap) & Filters

**Goal:** Destination view shows real attractions & can filter them.

**Files**

* `js/api/opentripmap.js`
* `js/ui/destinationView.js`
* `js/utils/format.js`
* `css/components.css`

**Steps**

1. In `opentripmap.js`, implement:

   * `getAttractionsByCoords(lat, lon, options)` returning array of POIs.

2. Create `js/utils/format.js` for helpers (e.g. distance formatting).

3. In `destinationView.js`:

   * When `showDestination(destination)` is called:

     * Call `getAttractionsByCoords(destination.lat, destination.lon, …)`.
     * Store attractions array.
     * Render as cards:

       * name, category, distance, maybe rating.
       * “Add to Day” button.

4. Add filter buttons (chips) for categories.

   * Clicking a filter re-renders the list.

5. Commit: `feat: show attractions list with filters`.

---

## Phase 6 – Itinerary Model & UI

**Goal:** Add attractions into days; see them as a planned trip.

**Files**

* `js/models/itinerary.js`
* `js/ui/plannerView.js`
* `js/ui/destinationView.js`
* `css/components.css`

**Steps**

1. `js/models/itinerary.js`:

   * Structure:

     ```js
     export class Itinerary {
       constructor() { this.days = []; }
       addDay(label) { ... }
       addStop(dayId, attraction) { ... }
       removeStop(dayId, stopId) { ... }
       moveStop(dayId, fromIndex, toIndex) { ... }
       toJSON() { ... }
       static fromJSON(obj) { ... }
     }
     ```

2. In `plannerView.js`:

   * Render days and their stops in cards (`.day-card`).
   * Provide simple up/down move buttons, and remove button per stop.

3. In `destinationView.js`:

   * Wire “Add to Day” button:

     * Choose current day (default Day 1).
     * Call `itinerary.addStop(dayId, attraction)`.
     * Notify `plannerView` to re-render.

4. Commit: `feat: itinerary model and planner UI`.

---

## Phase 7 – Storage (localStorage)

**Goal:** Trip persists across reloads.

**Files**

* `js/models/storage.js`
* `js/main.js`
* `js/models/itinerary.js`
* `js/models/destination.js`

**Steps**

1. `js/models/storage.js`:

   ```js
   const KEY = "jumuiya-trip-v1";

   export function saveTrip({ destination, itinerary, budget }) { ... }
   export function loadTrip() { ... }
   export function clearTrip() { ... }
   ```

2. In `main.js`:

   * On startup, call `loadTrip()` and, if present, rebuild:

     * `Destination.fromJSON`,
     * `Itinerary.fromJSON`,
     * budget object.
   * Pass them into views.

3. Add “Save Trip” button in Planner view:

   * Calls `saveTrip`.

4. Commit: `feat: persist trips to localStorage`.

---

## Phase 8 – Map Integration & Routes

**Goal:** Show markers & route for selected day.

**Files**

* `js/api/mapbox.js`
* `js/ui/plannerView.js`
* `js/ui/destinationView.js`
* `css/layout.css`

**Steps**

1. In `plannerView.js`:

   * Initialize Mapbox map in a `<div id="planner-map">`.
   * Render markers for all stops of selected day.
   * On change of day or stops, update markers.

2. Implement `getRouteForDay(stops)` in `mapbox.js`:

   * Return distance (km) + duration (minutes) + geometry (optional).

3. Show distance & duration summary strip at top of Planner view.

4. Optionally highlight currently selected attraction when clicked.

5. Commit: `feat: map markers and daily route summary`.

---

## Phase 9 – Budget & Currency Conversion

**Goal:** Budget panel with multi-currency totals.

**Files**

* `js/api/exchange.js`
* `js/ui/plannerView.js`
* `js/utils/format.js`
* `css/components.css`

**Steps**

1. Add budget state object (can live inside `Itinerary` or separate).

2. In Planner view:

   * Add form fields:

     * Transport, Accommodation, Activities, Other.
   * Add currency selector.

3. On change:

   * Fetch rates (if not yet cached).
   * Convert totals using `convertAmount`.
   * Display totals using `formatCurrency`.

4. Wire “Save Trip” to save budget too.

5. Commit: `feat: budget panel with currency conversion`.

---

## Phase 10 – Saved Trips + Polish, Error Handling & Final Deploy

**Goal:** Nice UX, resilient app, ready for grading.

**Files**

* `js/ui/savedTripsView.js`
* `js/utils/validation.js`
* All CSS files for polish
* `README.md`

**Steps**

1. **Saved Trips (minimal)**

   * Even if you only support one active trip:

     * Show last-saved trip summary in `view-saved`.
     * Button “Load into planner” → loads and navigates.

2. **Error & loading states**

   * Add loading spinners for API calls.
   * Catch errors in `api/*` modules and show user-friendly messages.

3. **Validation**

   * In `validation.js`, simple helpers:

     * non-empty city name for search,
     * numeric inputs for budget.
   * Use them in views before making calls.

4. **Responsive & accessibility polish**

   * Test on mobile/tablet/desktop; adjust `layout.css`.
   * Add ARIA labels to icon-only buttons.

5. **Final deployment & README**

   * Ensure final build is deployed (GitHub Pages / Netlify / Render static).
   * Update `README.md` with:

     * project description,
     * features list,
     * tech stack,
     * how to run locally,
     * API references,
     * live URL & Trello link.

6. Commit: `chore: final polish and docs`.

---


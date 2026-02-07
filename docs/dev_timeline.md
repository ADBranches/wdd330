# Jumuiya Tours – Development Timeline
Student: Edwin Kambale  
Course: WDD 330 – Web Frontend Development  

This document tracks the planned work and weekly progress for the **Jumuiya Tours – East Africa Trip Planner** final project.

---

## Week 4 – Planning & Proposal (W04)

**Goals**

- Choose final project idea and APIs.
- Write and submit the W04 Proposal document.
- Create initial Trello board and wireframes.

**Planned / Completed Tasks**

- Selected **Jumuiya Tours – East Africa Trip Planner** as the final project.
- Identified core APIs:
  - OpenTripMap Places API (attractions).
  - Mapbox Geocoding & Directions (maps + routes).
  - Currency API (exchange rates for UGX, KES, TZS, USD).
- Wrote proposal sections:
  - Overview, Target Audience, Major Functions (8+), External Data Sources.
  - Module List, Graphic Identity, Timeline, Trello planning, Challenges.
- Created preliminary wireframes for:
  - 4.1 Mobile – Home / Destination Search
  - 4.2 Mobile – Destination Detail / Attractions List
  - 4.3 Desktop – Wide Layout with Map and List
  - 4.4 Desktop – Itinerary & Budget View
- Set up Trello board:  
  `https://trello.com/b/h8Zcy3Hj/jumuiya-tours-wdd-330-final-project`

---

## Week 5 – Project Setup & Core Data Flows (W05)

**Goal:** Have a working repo, a basic deployed site, and at least one real API call in place.

**Planned Tasks**

1. **Project & Repo Setup**
   - Create GitHub repo: `jumuiya-tours-wdd330`.
   - Clone locally into:  
     `~/byupw/wdd330/final_project/jumuiya-tours`.
   - Create base structure:
     - `index.html`
     - `css/styles.css`
     - `js/main.js`
     - `js/router.js`
     - folders: `js/api/`, `js/models/`, `js/ui/`, `assets/`, `docs/`
   - Initial commit & push to GitHub.

2. **Basic Layout & Navigation**
   - Implement **Home / Destination Search** layout (4.1) in HTML+CSS.
   - Add simple nav for **Home**, **Planner**, **Saved Trips**.
   - Implement minimal router to show/hide view containers.

3. **API “Hello World”**
   - `js/api/opentripmap.js`: hardcode Kampala coordinates, fetch nearby places, log results.
   - `js/api/mapbox.js`: test geocoding request for “Kampala”.
   - `js/api/exchange.js`: test converting between UGX and USD.

4. **Early Deployment**
   - Deploy the basic app using GitHub Pages / Netlify / Render static.
   - Verify the public URL works.
   - Add links (GitHub, live site, Trello) to the W05 task report.

**End-of-Week Deliverables**

- GitHub repo with base structure.
- Live URL accessible from browser.
- At least one working API call (even if only logging data).
- Updated Trello board with Week 5 cards moved into **Done**.

---

## Week 6 – Planner Features, Map & Budget (W06)

**Goal:** Turn the app into a real planner: attractions → itinerary → distance/time → budget.

**Planned Tasks**

1. **Destination & Attractions Flow**
   - Wire Home search input to OpenTripMap (via `opentripmap.js`).
   - Show list of attractions in the **Destination Detail** view (4.2):
     - name, category, distance from center, basic rating.
   - Add filters (Nature, Culture, History, etc.).

2. **Map Integration**
   - Initialize Mapbox map in **Planner** view (4.3).
   - Plot markers for attractions returned by OpenTripMap.
   - When a user clicks a list item, focus or highlight the marker.

3. **Itinerary Model & UI**
   - Implement `js/models/itinerary.js`:
     - Add/remove stops to days (Day 1, Day 2, …).
     - Reorder stops inside a day (simple up/down controls).
   - Build itinerary panel:
     - Mobile: “Itinerary” tab (4.2).
     - Desktop: left “Itinerary” column in Planner view (4.4).

4. **Directions & Time/Distance**
   - Use Mapbox Directions API to calculate route for a selected day.
   - Display total distance and travel time in the summary strip.

5. **Budget Panel & Currency Conversion**
   - Implement Budget panel (4.4):
     - Inputs for Transport, Accommodation, Activities, Other.
   - Use currency API in `js/api/exchange.js` to convert totals between:
     - UGX, KES, TZS, USD.
   - Display nicely formatted totals.

6. **Saving & Loading Trips**
   - Implement `js/storage.js` (or inside `itinerary.js`) to:
     - Save itinerary + budget to `localStorage`.
     - Load the last trip when the app starts.
     - Handle the “no saved trip yet” case gracefully.

**End-of-Week Deliverables**

- User can search a destination, see attractions, add them to daily itinerary.
- Map shows markers for attractions and route for the current day.
- Budget panel calculates totals and converts between currencies.
- Trip is saved and restored via `localStorage`.

---

## Week 7 – Polish, Testing & Final Presentation (W07)

**Goal:** Polish UX, ensure accessibility & responsiveness, and finalize deliverables (deployment + video).

**Planned Tasks**

1. **Trip Summary & Print/Export**
   - Finish **Itinerary & Budget View** (4.4) with:
     - clean sections for each day’s stops,
     - total distance/time summary,
     - budget summary.
   - Add print styles so the summary page prints cleanly (hide nav etc.).

2. **Error Handling & UX States**
   - Add loading indicators while APIs are fetching.
   - Friendly error messages if any API call fails.
   - “No attractions found” / “No saved trip yet” empty states.

3. **Filters & UX Polish**
   - Refine filters and sorting options.
   - Improve spacing, color contrast, hover/focus styles.

4. **Accessibility & Responsive Checks**
   - Use semantic HTML where possible.
   - Add `aria-label` attributes for icons/buttons.
   - Test layouts on:
     - small mobile width,
     - tablet,
     - desktop.

5. **Final Deployment, README & Video**
   - Confirm final deployment URL and update anywhere it’s referenced.
   - Update `README.md` with:
     - project overview,
     - features,
     - how to run locally,
     - list of APIs used,
     - Trello link,
     - live site link.
   - Record the required short video:
     - demonstrate main flows (search, attractions, itinerary, budget),
     - briefly explain key code pieces as they execute.

**End-of-Week Deliverables**

- Stable, deployed web app that meets WDD 330 final project requirements.
- Updated Trello board with majority of cards in **Done**.
- Final README and demonstration video ready for submission.

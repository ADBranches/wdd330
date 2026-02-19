// js/router.js
import { qs, qsa } from "./utils/dom.js";

const VIEW_PREFIX = "view-";

/**
 * Show the given view by name ("home", "planner", "saved", "destination").
 * Also updates nav button active state and URL hash.
 */
export function navigateTo(viewName) {
  const viewId = `${VIEW_PREFIX}${viewName}`;
  const targetView = qs(`#${viewId}`);

  if (!targetView) {
    console.warn(`[router] View "${viewName}" not found (id="${viewId}")`);
    return;
  }

  // 1. Hide all views
  qsa('section[id^="view-"]').forEach((section) => {
    section.classList.remove("view--active");
  });

  // 2. Show the target view
  targetView.classList.add("view--active");

  // 3. Update nav active state
  const navButtons = qsa(".nav-link");
  navButtons.forEach((btn) => {
    btn.classList.remove("nav-link--active", "is-active");
  });

  const activeNavButton = qs(`.nav-link[data-view-target="${viewName}"]`);
  if (activeNavButton) {
    activeNavButton.classList.add("nav-link--active", "is-active");
  }

  // 4. Update URL hash (for back/forward support)
  if (window.location.hash !== `#${viewName}`) {
    window.location.hash = `#${viewName}`;
  }
}

/**
 * Initialize router: set up nav listeners + hashchange listener.
 */
export function initRouter() {
  // Attach click handlers for nav buttons
  const navButtons = qsa(".nav-link");
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.viewTarget;
      if (target) {
        navigateTo(target);
      }
    });
  });

  // Support opening a specific view via hash (e.g. #planner)
  const initialHash = window.location.hash.replace("#", "");
  const initialView = initialHash || "home";

  navigateTo(initialView);

  // React to back/forward
  window.addEventListener("hashchange", () => {
    const next = window.location.hash.replace("#", "") || "home";
    navigateTo(next);
  });
}

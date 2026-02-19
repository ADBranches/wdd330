// js/ui/plannerView.js
import { qs } from "../utils/dom.js";
import { itinerary } from "../models/itinerary.js";

let initialized = false;
// Will hold a reference to the budget total updater
let budgetUpdateFn = null;

export function initPlannerView() {
  if (initialized) return;
  initialized = true;

  // Ensure we always have at least Day 1
  if (itinerary.days.length === 0) {
    itinerary.addDay("Day 1");
  }

  const addDayBtn = qs("#planner-add-day");
  const daySelect = qs("#planner-day-select");

  if (addDayBtn) {
    addDayBtn.addEventListener("click", () => {
      const nextIndex = itinerary.days.length + 1;
      itinerary.addDay(`Day ${nextIndex}`);
      renderPlanner();
    });
  }

  if (daySelect) {
    daySelect.addEventListener("change", () => {
      renderPlanner();
    });
  }

  renderPlanner();
  setupBudgetForm();
}

/**
 * Used by Destination view when "Add to Day" is clicked.
 * Returns the numeric id of the currently selected day.
 */
export function getCurrentDayId() {
  const select = qs("#planner-day-select");
  if (select && select.value) {
    return Number(select.value);
  }
  // fallback to first day
  return itinerary.days[0]?.id ?? 1;
}

/**
 * Called by other modules (like destinationView) to refresh UI
 * after itinerary changes.
 */
export function notifyItineraryUpdated() {
  renderPlanner();
}

function renderPlanner() {
  const dayListEl = qs("#planner-day-list");
  const daySelect = qs("#planner-day-select");
  if (!dayListEl || !daySelect) return;

  // 1) Rebuild <select> options
  daySelect.innerHTML = "";
  itinerary.days.forEach((day) => {
    const opt = document.createElement("option");
    opt.value = String(day.id);
    opt.textContent = day.label;
    daySelect.appendChild(opt);
  });

  const activeDayId = getCurrentDayId();
  daySelect.value = String(activeDayId);

  // 2) Render days + stops
  dayListEl.innerHTML = itinerary.days
    .map((day) => {
      const stops = day.stops || [];

      const stopsHtml =
        stops.length > 0
          ? `<ol class="day-stops">
              ${stops
                .map(
                  (stop) => `
                <li class="day-stop" data-day-id="${day.id}" data-stop-id="${stop.id}">
                  <div>
                    <strong>${stop.name}</strong><br>
                    ${
                      stop.destinationName
                        ? `<span class="meta-text">${stop.destinationName}</span><br>`
                        : ""
                    }
                    ${
                      stop.kinds
                        ? `<span class="meta-text">${stop.kinds}</span>`
                        : ""
                    }
                  </div>
                  <button type="button" class="btn btn--small btn--ghost day-stop-remove">
                    Remove
                  </button>
                </li>`
                )
                .join("")}
            </ol>`
          : `<p class="meta-text">No stops in this day yet.</p>`;

      return `
        <section class="card day-card" data-day-id="${day.id}">
          <header class="day-card__header">
            <h3>${day.label}</h3>
          </header>
          ${stopsHtml}
        </section>
      `;
    })
    .join("");

  // 3) Wire up remove buttons
  dayListEl.querySelectorAll(".day-stop-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest(".day-stop");
      if (!li) return;
      const dayId = Number(li.dataset.dayId);
      const stopId = li.dataset.stopId;
      itinerary.removeStop(dayId, stopId);
      renderPlanner();
    });
  });
}

// --------------------------
// Budget form
// --------------------------
function setupBudgetForm() {
  const budgetForm = qs(".budget-form");
  const totalEl = qs("#budget-total");

  if (!budgetForm || !totalEl) return;

  const inputs = budgetForm.querySelectorAll('input[type="number"]');

  const updateTotal = () => {
    let sum = 0;
    inputs.forEach((input) => {
      const value = Number(input.value || 0);
      if (!Number.isNaN(value)) {
        sum += value;
      }
    });

    if (sum === 0) {
      totalEl.textContent = "—";
    } else {
      totalEl.textContent = `${sum.toLocaleString()} (local estimate)`;
    }
  };

  // Store updater so saved trips can trigger recompute
  budgetUpdateFn = updateTotal;

  inputs.forEach((input) => {
    input.addEventListener("input", updateTotal);
  });

  // Compute once on load
  updateTotal();
}

// Optional: if your router calls this on navigation
export function showPlannerView() {
  renderPlanner();
}

/**
 * Read current budget inputs into a plain object.
 * We treat them generically as an array of values + optional currency.
 */
export function getCurrentBudget() {
  const budgetForm = document.querySelector(".budget-form");
  if (!budgetForm) return null;

  const inputs = budgetForm.querySelectorAll('input[type="number"]');
  // Try #budget-currency first, fall back to the select inside the form
  const currencySelect =
    document.querySelector("#budget-currency") ||
    budgetForm.querySelector("select");

  const values = Array.from(inputs).map((input) => {
    const v = Number(input.value || 0);
    return Number.isNaN(v) ? 0 : v;
  });

  return {
    values,
    currency: currencySelect ? currencySelect.value : "local",
  };
}

/**
 * Apply a saved budget object back into the form and recompute total.
 */
export function applyBudget(budget) {
  if (!budget || !Array.isArray(budget.values)) return;

  const budgetForm = document.querySelector(".budget-form");
  if (!budgetForm) return;

  const inputs = budgetForm.querySelectorAll('input[type="number"]');
  inputs.forEach((input, idx) => {
    const value = budget.values[idx];
    input.value = typeof value === "number" ? String(value) : "";
  });

  // Try #budget-currency first, fall back to the select inside the form
  const currencySelect =
    document.querySelector("#budget-currency") ||
    budgetForm.querySelector("select");

  if (currencySelect && budget.currency) {
    currencySelect.value = budget.currency;
  }

  if (typeof budgetUpdateFn === "function") {
    budgetUpdateFn();
  }
}

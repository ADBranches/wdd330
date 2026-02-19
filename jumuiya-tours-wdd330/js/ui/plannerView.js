// js/ui/plannerView.js
import { qs } from "../utils/dom.js";

export function initPlannerView() {
  // Example: Wire budget form to update a simple total UI (still static for now)
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

  inputs.forEach((input) => {
    input.addEventListener("input", updateTotal);
  });
}

export function showPlannerView() {
  // Hook for later if we need to refresh data each time we open the planner
}

// js/api/exchange.js
import {
  EXCHANGE_API_KEY,
  EXCHANGE_API_BASE_URL,
} from "../config.js";

const LATEST_PATH = "/rates/latest";

/**
 * Fetch latest FX rates for a base currency.
 * @param {string} base
 * @returns {Promise<{ base: string; rates: Record<string, number> }>}
 */
export async function fetchRates(base = "USD") {
  if (!EXCHANGE_API_KEY) {
    throw new Error("[exchange] Missing EXCHANGE_API_KEY");
  }

  const params = new URLSearchParams({
    apikey: EXCHANGE_API_KEY,
    base: base,
  });

  const url = `${EXCHANGE_API_BASE_URL}${LATEST_PATH}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[exchange] ${response.status} ${response.statusText}: ${text}`);
  }

  const data = await response.json();

  // Most FX APIs return a rates object keyed by currency code.
  // Make sure numbers are actually numbers.
  const numericRates = {};
  for (const [code, value] of Object.entries(data.rates || {})) {
    numericRates[code.toUpperCase()] = Number(value);
  }

  return {
    base: data.base?.toUpperCase?.() || base.toUpperCase(),
    rates: numericRates,
  };
}

/**
 * Convert an amount using a rates table.
 *
 * @param {number} amount
 * @param {string} from
 * @param {string} to
 * @param {{ base: string; rates: Record<string, number> }} rateData
 */
export function convertAmount(amount, from, to, rateData) {
  const base = rateData.base.toUpperCase();
  const rates = rateData.rates;
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  if (fromCode === toCode) return amount;

  // Convert from -> base -> to
  let amountInBase;
  if (fromCode === base) {
    amountInBase = amount;
  } else {
    const rFrom = rates[fromCode];
    if (!rFrom) throw new Error(`[exchange] No rate for ${fromCode}`);
    amountInBase = amount / rFrom;
  }

  if (toCode === base) return amountInBase;

  const rTo = rates[toCode];
  if (!rTo) throw new Error(`[exchange] No rate for ${toCode}`);

  return amountInBase * rTo;
}

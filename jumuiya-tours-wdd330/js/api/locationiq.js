// js/api/locationiq.js
import { LOCATIONIQ_TOKEN } from "../config.js";

const BASE_URL = "https://us1.locationiq.com/v1";

/**
 * Forward-geocode a city name → { name, country, lat, lon }.
 * Uses LocationIQ Search API. :contentReference[oaicite:0]{index=0}
 *
 * @param {string} query
 * @returns {Promise<{ name: string; country: string; lat: number; lon: number } | null>}
 */
export async function geocodeCity(query) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (!LOCATIONIQ_TOKEN) {
    throw new Error("[locationiq] LOCATIONIQ_TOKEN is missing. Check js/config.js.");
  }

  const params = new URLSearchParams({
    key: LOCATIONIQ_TOKEN,
    q: trimmed,
    format: "json",
    limit: "1",
  });

  const url = `${BASE_URL}/search?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `[locationiq] ${response.status} ${response.statusText}: ${text}`
    );
  }

  const data = await response.json();
  const hit = data && data[0];
  if (!hit) return null;

  const nameFromDisplay =
    typeof hit.display_name === "string"
      ? hit.display_name.split(",")[0]
      : trimmed;

  const country =
    hit.address?.country ||
    (hit.address?.country_code
      ? hit.address.country_code.toUpperCase()
      : "");

  return {
    name: nameFromDisplay,
    country: country || "",
    lat: Number(hit.lat),
    lon: Number(hit.lon),
  };
}

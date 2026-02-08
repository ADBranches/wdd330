// js/api/mapbox.js
import { MAPBOX_ACCESS_TOKEN } from "../config.js";

const GEOCODING_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";

/**
 * Forward-geocode a city name → { name, lat, lon, country }.
 * Geocoding API uses GET requests with the access_token query param. :contentReference[oaicite:1]{index=1}
 *
 * @param {string} city
 * @returns {Promise<{ name: string; lat: number; lon: number; country: string | null } | null>}
 */
export async function geocodeCity(city) {
  if (!MAPBOX_ACCESS_TOKEN) {
    throw new Error("[mapbox] Missing MAPBOX_ACCESS_TOKEN");
  }

  const searchText = encodeURIComponent(city.trim());
  const params = new URLSearchParams({
    access_token: MAPBOX_ACCESS_TOKEN,
    limit: "1",
    types: "place,locality,region",
  });

  const url = `${GEOCODING_BASE}/${searchText}.json?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`[mapbox] ${response.status} ${response.statusText}: ${text}`);
  }

  const data = await response.json();

  const feature = data.features?.[0];
  if (!feature) return null;

  const [lon, lat] = feature.center || [];
  const name = feature.text;
  const country = feature.context?.find((c) => c.id?.startsWith("country"))
    ?.short_code?.toUpperCase() ?? null;

  return { name, lat, lon, country };
}

/**
 * Placeholder for Mapbox Directions (routes between stops).
 * Directions API returns route distance/duration between coordinates. :contentReference[oaicite:2]{index=2}
 *
 * For now we just return null – we’ll wire this up in the
 * “Map Integration & Routes” phase.
 */
export async function getRouteForDay(stops) {
  console.log("[mapbox] getRouteForDay is not implemented yet.", stops);
  return null;
}

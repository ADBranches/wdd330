// js/api/opentripmap.js
import { OPENTRIPMAP_API_KEY } from "../config.js";

const BASE_URL = "https://api.opentripmap.com/0.1/en";

/**
 * Fetch points of interest around given coordinates.
 * Docs: dev.opentripmap.org (places radius endpoint). :contentReference[oaicite:0]{index=0}
 *
 * @param {number} lat
 * @param {number} lon
 * @param {number} radius  meters
 * @param {number} limit   max number of results
 */
export async function getAttractionsByCoords(lat, lon, radius = 5000, limit = 30) {
  if (!OPENTRIPMAP_API_KEY) {
    throw new Error("[opentripmap] Missing OPENTRIPMAP_API_KEY");
  }

  const params = new URLSearchParams({
    radius: String(radius),
    lon: String(lon),
    lat: String(lat),
    limit: String(limit),
    rate: "2", // higher-rated places
    format: "json",
    apikey: OPENTRIPMAP_API_KEY,
  });

  const url = `${BASE_URL}/places/radius?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `[opentripmap] ${response.status} ${response.statusText}: ${text}`
    );
  }

  /** @type {Array<any>} */
  const data = await response.json();

  // Normalize into a lighter structure for our app
  return data.map((item) => ({
    xid: item.xid,
    name: item.name,
    kinds: item.kinds,
    dist: item.dist, // meters
    lat: item.point?.lat,
    lon: item.point?.lon,
  }));
}

// js/models/destination.js

export class Destination {
  /**
   * @param {{ name: string; country?: string; lat: number|string; lon: number|string; displayName?: string }} params
   */
  constructor({ name, country = "", lat, lon, displayName }) {
    this.name = name;
    this.country = country;
    this.lat = Number(lat);
    this.lon = Number(lon);
    this.displayName = displayName || buildDisplayName(name, country);
  }
}

function buildDisplayName(name, country) {
  if (!name && !country) return "";
  if (!country) return name;
  return `${name}, ${country}`;
}
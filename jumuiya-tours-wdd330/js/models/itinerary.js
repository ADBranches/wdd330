// js/models/itinerary.js

export class Itinerary {
  constructor(days = []) {
    this.days = days;
  }

  addDay(label) {
    const id = this.days.length > 0
      ? Math.max(...this.days.map((d) => d.id)) + 1
      : 1;

    const day = { id, label, stops: [] };
    this.days.push(day);
    return day;
  }

  addStop(dayId, attraction, destination) {
    const day = this.days.find((d) => d.id === dayId);
    if (!day) return null;

    const stopId = `${dayId}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    const stop = {
      id: stopId,
      name: attraction.name || "Unnamed place",
      kinds: attraction.kinds || "",
      dist: attraction.dist ?? null,
      lat: attraction.lat,
      lon: attraction.lon,
      xid: attraction.xid,
      destinationName:
        destination?.displayName || destination?.name || null,
    };

    day.stops.push(stop);
    return stop;
  }

  removeStop(dayId, stopId) {
    const day = this.days.find((d) => d.id === dayId);
    if (!day) return;

    day.stops = day.stops.filter((s) => s.id !== stopId);
  }

  toJSON() {
    return { days: this.days };
  }

  static fromJSON(obj) {
    if (!obj || !Array.isArray(obj.days)) {
      return new Itinerary();
    }
    return new Itinerary(obj.days);
  }
}

// Shared singleton itinerary for the whole app
export const itinerary = new Itinerary();

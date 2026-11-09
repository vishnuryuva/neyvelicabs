const geocodeCache = new Map();
const suggestionCache = new Map();
let geocodeQueue = Promise.resolve();
let lastGeocodeTime = 0;

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

function scheduleLocationRequest(task, signal) {
  const queuedRequest = geocodeQueue.then(async () => {
    const delay = Math.max(0, 1100 - (Date.now() - lastGeocodeTime));
    if (delay) await wait(delay);
    if (signal?.aborted) throw new DOMException("Location search cancelled.", "AbortError");
    lastGeocodeTime = Date.now();
    return task();
  });

  geocodeQueue = queuedRequest.catch(() => {});
  return queuedRequest;
}

function getSearchUrl(query, limit) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({
    q: query.trim(),
    format: "jsonv2",
    limit: String(limit),
    addressdetails: "0",
    countrycodes: "in"
  });
  return url;
}

function getSuggestionUrl(query) {
  const url = new URL("https://photon.komoot.io/api/");
  url.search = new URLSearchParams({
    q: query.trim(),
    limit: "50",
    lat: "11.6",
    lon: "79.5",
    lang: "en"
  });
  return url;
}

export async function searchLocations(query, {signal} = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length < 3) return [];
  if (suggestionCache.has(normalizedQuery)) return suggestionCache.get(normalizedQuery);

  return scheduleLocationRequest(async () => {
    const response = await fetch(getSuggestionUrl(query), {signal});
    if (!response.ok) throw new Error("Location suggestions are temporarily unavailable.");
    const data = await response.json();
    const suggestions = [];
    const seen = new Set();
    for (const feature of data.features || []) {
      const properties = feature.properties;
      const [lon, lat] = feature.geometry?.coordinates || [];
      if (properties?.countrycode?.toUpperCase() !== "IN" || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      if (!["city", "town", "village", "district", "county", "locality", "municipality", "suburb"].includes(properties.type)) continue;

      const labelParts = [properties.name, properties.city, properties.district, properties.state, properties.country]
        .filter((part, index, parts) => part && parts.findIndex(value => value?.toLowerCase() === part.toLowerCase()) === index);
      if (!labelParts.length) continue;
      const label = labelParts.join(", ");
      const normalizedLabel = label.toLowerCase();
      if (seen.has(normalizedLabel)) continue;
      seen.add(normalizedLabel);

      const location = {lat, lon};
      geocodeCache.set(normalizedLabel, location);
      suggestions.push({label, location});
      if (suggestions.length === 5) break;
    }
    if (suggestions.length) suggestionCache.set(normalizedQuery, suggestions);
    return suggestions;
  }, signal);
}

function geocode(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (geocodeCache.has(normalizedQuery)) return Promise.resolve(geocodeCache.get(normalizedQuery));

  return scheduleLocationRequest(async () => {
    const response = await fetch(getSearchUrl(query, 1), {headers: {"Accept-Language": "en"}});
    if (!response.ok) throw new Error("Location lookup failed. Please try again.");
    const results = await response.json();
    const result = results[0];
    if (!result) throw new Error(`Could not find "${query.trim()}". Try adding the city or state.`);

    const location = {lat: result.lat, lon: result.lon};
    geocodeCache.set(normalizedQuery, location);
    return location;
  });
}

export async function getDrivingDistanceKm(from, to) {
  const origin = await geocode(from);
  const destination = await geocode(to);
  const coordinates = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false&alternatives=false&steps=false`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not calculate the driving route. Please try again.");
  const data = await response.json();
  const route = data.routes?.[0];
  if (data.code !== "Ok" || !route || !Number.isFinite(route.distance)) {
    throw new Error("No driving route was found for these locations.");
  }
  return route.distance / 1000;
}

export function calculateFareQuote({distanceKm, tripType, car}) {
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new Error("The route distance must be greater than zero.");
  }
  const roundTrip = tripType === "round-trip";
  const totalDistanceKm = distanceKm * (roundTrip ? 2 : 1);
  const minimumKm = roundTrip ? 300 : 150;
  const chargeableKm = Math.max(totalDistanceKm, minimumKm);
  const rate = roundTrip ? car.round : car.one;
  if (!Number.isFinite(rate) || !Number.isFinite(car.driverBata)) {
    throw new Error("Fare details are unavailable for this vehicle.");
  }
  const fare = Math.round(chargeableKm * rate + car.driverBata);

  return {
    distanceKm,
    totalDistanceKm,
    chargeableKm,
    minimumKm,
    rate,
    driverBata: car.driverBata,
    fare
  };
}

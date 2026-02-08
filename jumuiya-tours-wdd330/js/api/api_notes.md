# Jumuiya Tours – API Notes

## 1. OpenTripMap Places API

- Base URL: `https://api.opentripmap.com/0.1/en`
- Endpoint used: `/places/radius`
- Important query params:
  - `lat`, `lon`
  - `radius` (meters)
  - `limit`
  - `rate`
  - `format=json`
  - `apikey=OPENTRIPMAP_API_KEY`

### Key fields used

- `xid` – unique id
- `name`
- `kinds` – categories string
- `dist` – distance in meters from center
- `point.lat`, `point.lon`

---

## 2. Mapbox Geocoding API

- Base URL: `https://api.mapbox.com/geocoding/v5/mapbox.places/{search_text}.json`
- Query params:
  - `access_token=MAPBOX_ACCESS_TOKEN`
  - `limit=1`
  - `types=place,locality,region`

### Key fields used

- `features[0].center` → `[lon, lat]`
- `features[0].text` → city name
- `features[0].context` → country code, region, etc.

---

## 3. Currency API

- Provider: (write which one you chose, e.g., CurrencyFreaks)
- Base URL: `https://api.currencyfreaks.com/v2.0`
- Endpoint: `/rates/latest?apikey=API_KEY&base=USD` (or provider equivalent)

### Key fields used

- `base` – base currency
- `rates` – object of `"CODE": "rate"` pairs

---

## Sample responses

Paste a small snippet (3-5 lines) of real JSON for each API here once you’ve tested them.

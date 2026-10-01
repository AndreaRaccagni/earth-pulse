# EarthPulse

A live map of natural events around the world — storms, wildfires, volcanoes, icebergs — from [NASA EONET](https://eonet.gsfc.nasa.gov/docs/v3).

**Live demo:** https://andrearaccagni.github.io/earth-pulse/

## What it does

- Plots every open EONET event of the last 30 days on an OpenLayers map, as points, lines, or polygons.
- Lists the same events next to the map, with the date of each position, so the many entries of one storm can be told apart.
- Click a dot or a row: the map flies to it, highlights it, and the details card shows category, longitude, and latitude.
- Filter by category. The list and the map always show the same events.
- Click empty map or **Clear** to go back to the world view.
- The list works with the keyboard (Tab, Enter, Space).

## Stack

Vue 3 (`<script setup>`, TypeScript) · OpenLayers 10 · Vite · axios · pnpm. No backend: the browser calls the EONET API directly.

## How it is wired

`App` owns the state. The map only draws. Both the list and the map report a click as a feature id, and nothing else.

```
EventList  ──emit id──┐
                      ├─→ App.currentEventId ─→ computed NaturalEvent ─→ EventDetails
EventMap   ──emit id──┘         │
                                └─ selectedEventId prop → style + flyTo
```

- **One fetch, in `App`.** The response stays GeoJSON. Each feature gets a unique id (`properties.id + ':' + index`), because NASA repeats the same id for every position of a storm.
- **One selected id.** The details object is a `computed`, never a second copy of the event.
- **One filtered collection.** `filteredEvents` is passed to both the list and the map.
- **OpenLayers stays inside `EventMap.vue`.** The map instance is a `shallowRef`. No OpenLayers object is ever passed to Vue state.

```
src/
├── api/eonet.ts            # HTTP only
├── components/
│   ├── EventMap.vue        # OpenLayers map, style, fly-to
│   ├── EventList.vue       # list of events, emits an id
│   └── EventDetails.vue    # details card
├── types/event.ts          # NaturalEvent, the shape the details card reads
├── utils.ts                # camelCase → name, lon/lat from any geometry, date format
└── App.vue                 # fetch, status, selection, filter
```

## Run it locally

Needs Node 20.19+ and pnpm 9.

```bash
pnpm install
pnpm dev        # http://localhost:5173/earth-pulse/
pnpm build      # type-check with vue-tsc, then build to dist/
pnpm preview    # serve dist/ like production
```

## Deploy

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): install, type-check, build, then publish `dist/` to GitHub Pages. Pull requests build but do not deploy. The site lives under `/earth-pulse/`, which is why `vite.config.ts` sets `base`.

## Known limits

- The category filter only reads each event's first category.
- For multi-part shapes, longitude and latitude are the average of the first part only.
- The map itself is mouse-only. The list and the controls work with the keyboard.
- No tests yet.

## Data

Event data: [NASA Earth Observatory Natural Event Tracker (EONET) v3](https://eonet.gsfc.nasa.gov/docs/v3). Map tiles: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.

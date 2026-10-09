# v2 model integrations (planned, not built)

v1 of Canada Wildfire Watch is an operational dashboard: live CWFIS layers, NBAC history, and explainable station-based watch scores. It contains no trained models and makes no predictions. This document plans the two model integrations for v2, with exact datasets and API surfaces, so the work is specified before it is claimed.

## 1. AlphaEarth satellite embeddings for change detection

**What it would do:** detect new burn scars and vegetation change between satellite passes without per-fire labeled training data, by comparing AlphaEarth embedding vectors over time.

**Dataset:** AlphaEarth Satellite Embedding V1 (Google, April 2026). Global annual 10m embeddings, 64-dim vector per pixel, 2017-2025, served in Google Earth Engine under CC-BY 4.0. Registry of Open Data on AWS also hosts 2018-2024.

**API surface:**
- Google Earth Engine Python API: `ee.ImageCollection("GOOGLE/SATELLITE_EMBEDDING/V1/ANNUAL")`
- Change signal: cosine distance between the current-year and prior-year embedding at each pixel, thresholded and clustered into candidate burn polygons.
- Validation: intersect candidate polygons with CWFIS Fire M3 hotspots and NBAC perimeters; report precision/recall against the mapped record before publishing any v2 "detected change" layer.

**Why it fits:** the v1 pipeline already normalizes NBAC and Fire M3 geometries, which become the validation set. Embeddings run on commodity hardware; the Epoch Blue demonstration scored 75M embeddings in 174 seconds on a consumer laptop.

**Honesty constraint:** embedding distance detects *change*, not *fire*. Agricultural clearing, harvest, and flooding also change the surface. v2 must label the layer "surface change candidates" until validated against fire records.

## 2. WeatherNext open weights for forecast integration

**What it would do:** extend the fire-weather watch from observed conditions (v1) to 1-3 day forecast conditions, using open-weights weather prediction.

**Model:** WeatherNext (Google DeepMind, open-sourced 2026). Code, pretrained weights, and demo notebooks at https://github.com/google-deepmind/weathernext. Reported: cyclone forecasts to 15 days with about a day of extra lead time; WeatherNext 3 runs on laptop-class hardware.

**API surface:**
- Run inference locally or on a small GPU host against MSC Datamart / ECCC model analysis fields as input; extract forecast 2m temperature, relative humidity, and 10m wind for the fire-weather station network (the 1,961 stations in `data/live/stations.json` become the forecast points).
- Feed forecast temp/RH/wind into the *same documented watch-index formula* as v1, producing a "forecast watch" layer clearly labeled as model output.

**Honesty constraints:**
- Never present forecast watch values with the same visual weight as observed values; use a distinct style and the label "forecast".
- Publish skill scores (hit rate / false alarm rate of high-watch days vs subsequent hotspot detections) before calling it intelligence.
- Keep the v1 observed-conditions layer as the default view.

## Out of scope for v2

- Burned-area prediction (where the next fire starts). Neither AlphaEarth nor WeatherNext does ignition prediction; claiming it would be dishonest.
- Real-time evacuation routing. That requires live road closures and emergency management feeds this project does not hold.

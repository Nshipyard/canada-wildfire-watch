#!/usr/bin/env python3
"""Refresh the live wildfire snapshot from CWFIS public web services.

Sources (all public, no key):
  WFS  https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wfs
       layers: hotspots_24h (satellite hotspots, last 24h, North America),
               m3_polygons_current (Fire M3 active fire perimeters),
               fdr_current_shp (current Fire Danger Rating classes),
               firewx_stns_current (fire weather station observations + FWI)
  API  https://api.cwfif.nrcan.gc.ca/situationreports/situationreport
       (national situation reports; weekly in season)

Output: data/live/*.json (committed). Run daily during fire season
(May-Sep); the CWFIS season typically ends mid-September, after which
hotspot/perimeter layers go quiet. Every file carries its own timestamp;
the UI must display it and never claim real-time data.
"""
import json
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

WFS = "https://cwfis.cfs.nrcan.gc.ca/geoserver/public/wfs"
SITREP = "https://api.cwfif.nrcan.gc.ca/situationreports/situationreport"
OUT = Path(__file__).resolve().parent.parent / "data" / "live"

# Canada bounding box (lon/lat)
CA = (-141.0, 41.0, -52.0, 84.0)

CANADA_AGENCIES = {"AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU",
                   "ON", "PE", "QC", "SK", "YT", "PC", "NWT"}

FDR_LABELS = {0: "No rating", 1: "Low", 2: "Moderate", 3: "High",
              4: "Very high", 5: "Extreme"}


def wfs(layer, **kw):
    q = {"service": "WFS", "version": "2.0.0", "request": "GetFeature",
         "typeName": f"public:{layer}", "srsName": "EPSG:4326",
         "outputFormat": "application/json", **kw}
    url = WFS + "?" + urllib.parse.urlencode(q)
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")

    # 1. Hotspots, last 24h, Canada only (by reporting agency), slimmed.
    # The 24h layer covers North America; Canadian fires are those with a
    # Canadian agency code. A bbox alone would sweep in the northern US.
    hs = wfs("hotspots_24h")
    pts = []
    for f in hs["features"]:
        p, g = f["properties"], f["geometry"]
        if p.get("agency") not in CANADA_AGENCIES:
            continue
        lon, lat = g["coordinates"][0], g["coordinates"][1]
        pts.append({
            "lon": round(lon, 4), "lat": round(lat, 4),
            "frp": p.get("frp"), "date": p.get("rep_date"),
            "agency": p.get("agency"), "sat": p.get("satellite"),
            "fwi": p.get("fwi"),
        })
    (OUT / "hotspots.json").write_text(json.dumps(
        {"updated": now, "count": len(pts), "points": pts}))
    print("hotspots (Canada):", len(pts), "of", hs["totalFeatures"])

    # 2. Active fire perimeters, simplified for the web (shapely, ~800 m
    # tolerance keeps shapes true at national zoom), 4-decimal coords.
    from shapely.geometry import shape, mapping
    poly = wfs("m3_polygons_current")
    fires = []
    for f in poly["features"]:
        p = f["properties"]
        g = shape(f["geometry"])
        g = g.simplify(0.008, preserve_topology=True)
        def rnd(c):
            if isinstance(c[0], (int, float)):
                return [round(c[0], 4), round(c[1], 4)]
            return [rnd(x) for x in c]
        mg = mapping(g)
        fires.append({
            "hcount": p.get("hcount"), "first": p.get("firstdate"),
            "last": p.get("lastdate"), "area_ha": p.get("area"),
            "geom": {"type": mg["type"], "coordinates": rnd(mg["coordinates"])},
        })
    fires.sort(key=lambda x: x["area_ha"] or 0, reverse=True)
    total_area = sum(f["area_ha"] or 0 for f in fires)
    (OUT / "fires.json").write_text(json.dumps(
        {"updated": now, "count": len(fires),
         "total_area_ha": round(total_area, 1), "fires": fires}))
    print("perimeters:", len(fires), "total ha:", round(total_area),
          "size KB:", (OUT / "fires.json").stat().st_size // 1024)

    # 3. Fire Danger Rating distribution
    fdr = wfs("fdr_current_shp", propertyName="GRIDCODE")
    dist = {}
    for f in fdr["features"]:
        c = f["properties"]["GRIDCODE"]
        dist[c] = dist.get(c, 0) + 1
    (OUT / "fdr.json").write_text(json.dumps({
        "updated": now,
        "classes": [{"code": k, "label": FDR_LABELS.get(k, str(k)), "cells": v}
                    for k, v in sorted(dist.items())],
        "note": "CWFIS Fire Danger Rating classes as published; 0 = no rating "
                "(water, urban, or no fuel data). October: fire season winding down.",
    }))
    print("fdr cells:", fdr["totalFeatures"], dist)

    # 4. Fire weather stations: top by FWI + summary (intelligence layer input).
    # The layer covers Canada + northern US; keep Canadian provinces only.
    CA_PROV = {"AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE",
               "QC", "SK", "YT"}
    st = wfs("firewx_stns_current")
    stations = []
    for f in st["features"]:
        p = f["properties"]
        if p.get("fwi") is None or p.get("prov") not in CA_PROV:
            continue
        stations.append({
            "name": p.get("name"), "prov": p.get("prov"),
            "lat": round(f["geometry"]["coordinates"][1], 3),
            "lon": round(f["geometry"]["coordinates"][0], 3),
            "temp": p.get("temp"), "rh": p.get("rh"), "ws": p.get("ws"),
            "precip": p.get("precip"), "fwi": round(p["fwi"], 1),
            "date": p.get("rep_date"),
        })
    stations.sort(key=lambda x: x["fwi"], reverse=True)
    # Explainable watch index: hot + dry + windy, 0-100, documented in methodology
    for s in stations:
        t = min(max((s["temp"] or 0), 0), 40) / 40
        d = min(max(100 - (s["rh"] if s["rh"] is not None else 100), 0), 100) / 100
        w = min(max((s["ws"] or 0), 0), 60) / 60
        s["watch"] = round(100 * (0.4 * t + 0.35 * d + 0.25 * w), 1)
    (OUT / "stations.json").write_text(json.dumps(
        {"updated": now, "count": len(stations),
         "method": "watch index = 100 * (0.4 * temp/40C + 0.35 * (100-RH)/100 + "
                   "0.25 * wind/60kph). Explanatory composite of observed "
                   "conditions, NOT a calibrated prediction model.",
         "top": stations[:60]}))
    print("stations with FWI:", len(stations))

    # 5. Latest situation report headline
    with urllib.request.urlopen(SITREP, timeout=60) as r:
        rep = json.load(r)
    items = sorted(rep["items"], key=lambda x: x["date"], reverse=True)
    latest = items[0]
    (OUT / "situation.json").write_text(json.dumps({
        "updated": now,
        "report_date": latest["date"],
        "synopsis_en": latest.get("synopsis_e"),
        "synopsis_fr": latest.get("synopsis_f"),
        "preparedness_en": latest.get("interagency_mobilization_e"),
    }, ensure_ascii=False))
    print("situation report date:", latest["date"])

    (OUT / "meta.json").write_text(json.dumps(
        {"refreshed_utc": now, "season_note": "CWFIS national reporting is weekly "
         "in season (spring to mid-September) and pauses over winter."}))


if __name__ == "__main__":
    main()

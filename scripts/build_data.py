#!/usr/bin/env python3
"""Build historical wildfire dataset from the National Burned Area Composite (NBAC).

Source: Natural Resources Canada, Canadian Wildland Fire Information System (CWFIS),
NBAC summary statistics workbook:
  https://cwfis.cfs.nrcan.gc.ca/downloads/nbac/NBAC_summary_stats.xlsx
Retrieved 2026-10-08. The workbook ships three useful sheets:
  sumstats_admin_name   annual burned area (adjusted hectares) by province/territory,
                        plus Parks Canada (PC) and National Defence (DND), 1972-2025
  NBAC_merged_1972_to_2025  one row per mapped fire: year, area, cause, admin
Output: data/historical.json (committed to git). Raw workbook is NOT committed.
"""
import json
import urllib.request
from pathlib import Path

SRC_URL = "https://cwfis.cfs.nrcan.gc.ca/downloads/nbac/NBAC_summary_stats.xlsx"
OUT = Path(__file__).resolve().parent.parent / "data" / "historical.json"

PROV_NAMES = {
    "AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick",
    "NL": "Newfoundland and Labrador", "NS": "Nova Scotia", "NT": "Northwest Territories",
    "NU": "Nunavut", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec",
    "SK": "Saskatchewan", "YT": "Yukon", "PC": "Parks Canada", "DND": "National Defence",
}


def main():
    import openpyxl

    raw = Path("/tmp/nbac_stats.xlsx")
    if not raw.exists():
        print("downloading NBAC summary workbook (4.4 MB)...")
        urllib.request.urlretrieve(SRC_URL, raw)

    wb = openpyxl.load_workbook(raw, data_only=True, read_only=True)

    # Annual totals by province/territory
    ws = wb["sumstats_admin_name"]
    rows = list(ws.iter_rows(min_row=4, values_only=True))
    header = ["YEAR", "AB", "BC", "DND", "MB", "NB", "NL", "NS", "NT", "NU",
              "ON", "PC", "PE", "QC", "SK", "YT", "CANADA"]
    annual = []
    for r in rows:
        if r[0] is None:
            continue
        rec = {"year": int(r[0])}
        for i, k in enumerate(header[1:], start=1):
            rec[k] = round(r[i], 1) if r[i] else 0.0
        annual.append(rec)
    annual.sort(key=lambda x: x["year"])

    canada = [(a["year"], a["CANADA"]) for a in annual]
    worst = sorted(canada, key=lambda x: x[1], reverse=True)[:5]
    avg_10yr = sum(v for _, v in canada[-10:]) / 10

    # Per-fire table: causes, counts, largest fires
    ws2 = wb["NBAC_merged_1972_to_2025"]
    causes_ha = {}
    causes_n = {}
    largest = []
    per_year_n = {}
    for r in ws2.iter_rows(min_row=4, values_only=True):
        year, cause, ha, admin = r[0], r[5], r[12], r[14]
        if year is None:
            continue
        causes_ha[cause] = causes_ha.get(cause, 0.0) + (ha or 0.0)
        causes_n[cause] = causes_n.get(cause, 0) + 1
        per_year_n[year] = per_year_n.get(year, 0) + 1
        largest.append((ha or 0.0, int(year), str(admin), str(cause)))
    largest.sort(reverse=True)

    total_ha = sum(v for _, v in canada)
    out = {
        "meta": {
            "source": "Natural Resources Canada, CWFIS National Burned Area Composite summary statistics",
            "source_url": "https://cwfis.cfs.nrcan.gc.ca/downloads/nbac",
            "retrieved": "2026-10-08",
            "unit": "adjusted hectares",
            "coverage": "1972-2025",
            "note": "Adjusted hectares account for unburned islands within fire perimeters.",
        },
        "canada_annual_ha": [{"year": y, "ha": round(h, 1)} for y, h in canada],
        "by_province_annual_ha": [
            {"year": a["year"],
             **{k: a[k] for k in PROV_NAMES}}
            for a in annual
        ],
        "province_names": PROV_NAMES,
        "worst_years": [{"year": y, "ha": round(h, 1)} for y, h in worst],
        "total_1972_2025_ha": round(total_ha, 1),
        "avg_annual_2016_2025_ha": round(avg_10yr, 1),
        "fire_counts_by_cause": causes_n,
        "area_by_cause_ha": {k: round(v, 1) for k, v in causes_ha.items()},
        "largest_fires": [
            {"ha": round(h, 1), "year": y, "admin": a, "cause": c}
            for h, y, a, c in largest[:10]
        ],
        "fires_per_year": {str(y): n for y, n in sorted(per_year_n.items())},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, indent=1))
    print("wrote", OUT, "(%.1f KB)" % (OUT.stat().st_size / 1024))
    print("worst years:", [(y, round(h)) for y, h in worst[:3]])
    print("2023 share of total:", round(dict(canada)[2023] / total_ha * 100, 1), "%")


if __name__ == "__main__":
    main()

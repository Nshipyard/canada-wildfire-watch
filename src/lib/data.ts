import { readFileSync } from "fs";
import { join } from "path";

const DATA = join(process.cwd(), "data");

function read<T>(name: string): T {
  return JSON.parse(readFileSync(join(DATA, name), "utf8")) as T;
}

export interface Hotspot { lon: number; lat: number; frp: number | null; date: string; agency: string; sat: string; fwi: number | null }
export interface Fire { hcount: number | null; first: string | null; last: string | null; area_ha: number | null; geom: { type: string; coordinates: unknown } }
export interface Station { name: string; prov: string; lat: number; lon: number; temp: number | null; rh: number | null; ws: number | null; precip: number | null; fwi: number; watch: number; date: string }

export function getHotspots() { return read<{ updated: string; count: number; points: Hotspot[] }>("live/hotspots.json"); }
export function getFires() { return read<{ updated: string; count: number; total_area_ha: number; fires: Fire[] }>("live/fires.json"); }
export function getFdr() { return read<{ updated: string; classes: { code: number; label: string; cells: number }[]; note: string }>("live/fdr.json"); }
export function getStations() { return read<{ updated: string; count: number; method: string; top: Station[] }>("live/stations.json"); }
export function getSituation() { return read<{ updated: string; report_date: string; synopsis_en: string; synopsis_fr: string; preparedness_en: string }>("live/situation.json"); }
export function getHistory() { return read<Record<string, unknown>>("historical.json"); }

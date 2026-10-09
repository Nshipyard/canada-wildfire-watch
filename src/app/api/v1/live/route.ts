import { NextResponse } from "next/server";
import { getHotspots, getFires, getFdr, getSituation } from "@/lib/data";

export async function GET() {
  const hs = getHotspots();
  const fires = getFires();
  const fdr = getFdr();
  const sit = getSituation();
  return NextResponse.json({
    hotspots: { updated: hs.updated, count: hs.count, points: hs.points },
    perimeters: { updated: fires.updated, count: fires.count, total_area_ha: fires.total_area_ha },
    fire_danger: { updated: fdr.updated, classes: fdr.classes },
    situation: { report_date: sit.report_date, synopsis_en: sit.synopsis_en },
  });
}

import { NextResponse } from "next/server";
import { getStations } from "@/lib/data";

export async function GET() {
  const s = getStations();
  return NextResponse.json({ updated: s.updated, count: s.count, method: s.method, top: s.top.slice(0, 25) });
}

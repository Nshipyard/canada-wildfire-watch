import { NextResponse } from "next/server";
import { getHistory } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHistory());
}

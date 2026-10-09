"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "@/i18n";
import type { Fire, Hotspot } from "@/lib/data";

const FireMap = dynamic(() => import("./FireMap"), {
  ssr: false,
  loading: () => <div className="h-[420px] md:h-[560px] w-full rounded-xl border border-line bg-muted" />,
});

export default function LiveSection({ fires, hotspots, updated }: { fires: Fire[]; hotspots: Hotspot[]; updated: string }) {
  const { t, lang } = useLang();
  const [showFires, setShowFires] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  const byAgency = useMemo(() => {
    const m = new Map<string, number>();
    hotspots.forEach((h) => m.set(h.agency, (m.get(h.agency) || 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [hotspots]);

  const largest = useMemo(() => [...fires].sort((a, b) => (b.area_ha || 0) - (a.area_ha || 0)).slice(0, 8), [fires]);

  const [stamp, setStamp] = useState("");
  useEffect(() => {
    setStamp(new Date(updated).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }));
  }, [updated, lang]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="inline-flex items-center gap-2 text-sm border border-line rounded-full px-3 py-1.5 cursor-pointer">
          <input type="checkbox" checked={showFires} onChange={(e) => setShowFires(e.target.checked)} className="accent-[#d80621]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-canada/70 inline-block" /> {t.live.perimeters} ({fires.length})
        </label>
        <label className="inline-flex items-center gap-2 text-sm border border-line rounded-full px-3 py-1.5 cursor-pointer">
          <input type="checkbox" checked={showHotspots} onChange={(e) => setShowHotspots(e.target.checked)} className="accent-[#d80621]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a] inline-block" /> {t.live.hotspots} ({hotspots.length})
        </label>
        <span className="text-xs text-ink/50 ml-auto">{t.live.updated}: {stamp} {t.live.utc}</span>
      </div>
      <FireMap fires={fires} hotspots={hotspots} showFires={showFires} showHotspots={showHotspots} />
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="border border-line rounded-xl p-5">
          <h3 className="font-semibold mb-3">{t.live.byAgency}</h3>
          <div className="space-y-1.5 text-sm">
            {byAgency.map(([a, n]) => (
              <div key={a} className="flex justify-between">
                <span className="font-mono">{a}</span>
                <span className="tabular-nums text-ink/70">{n} {n === 1 ? t.live.hotspotOne : t.live.hotspotCount}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-line rounded-xl p-5">
          <h3 className="font-semibold mb-3">{t.live.largest}</h3>
          <div className="space-y-1.5 text-sm">
            {largest.map((f, i) => (
              <div key={i} className="flex justify-between gap-2">
                <span className="text-ink/60 truncate">{t.live.firstSeen} {f.first || "?"} → {t.live.lastSeen} {f.last || "?"}</span>
                <span className="tabular-nums font-medium shrink-0">{f.area_ha ? Math.round(f.area_ha).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA") : "?"} {t.live.ha}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

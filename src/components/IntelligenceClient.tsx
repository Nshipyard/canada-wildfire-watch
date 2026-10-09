"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { HBar } from "./Charts";

const FDR_FR: Record<string, string> = {
  "No rating": "Non coté", Low: "Faible", Moderate: "Modéré", High: "Élevé", "Very high": "Très élevé", Extreme: "Extrême",
};
const FDR_COLORS = ["rgba(10,15,30,0.15)", "#fbbf24", "#f59e0b", "#ef4444", "#d80621", "#7f1d1d"];

export default function IntelligenceClient({ fdr, stations }: {
  fdr: { updated: string; classes: { code: number; label: string; cells: number }[]; note: string };
  stations: { updated: string; count: number; top: any[] };
}) {
  const { t, lang } = useLang();
  const loc = lang === "fr" ? "fr-CA" : "en-CA";
  const [stamps, setStamps] = useState<Record<string, string>>({});
  useEffect(() => {
    setStamps({ fdr: new Date(fdr.updated).toLocaleString(loc, { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }),
                st: new Date(stations.updated).toLocaleString(loc, { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) });
  }, [fdr.updated, stations.updated, loc]);
  const stamp = (u: string) => stamps[u === fdr.updated ? "fdr" : "st"] || "";

  return (
    <div>
      <div className="max-w-3xl mb-10">
        <p className="text-sm font-medium text-canada mb-3">{t.intel.kicker}</p>
        <h2 className="display text-4xl md:text-5xl mb-4">{t.intel.title}</h2>
        <p className="text-ink/70 leading-relaxed">{t.intel.body}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold">{t.intel.fdrTitle}</h3>
          <p className="text-sm text-ink/50 mb-1">{t.intel.fdrSub}</p>
          <p className="text-xs text-ink/50 mb-4">{t.live.updated}: {stamp(fdr.updated)} UTC</p>
          <div className="space-y-2">
            {fdr.classes.map((c) => (
              <div key={c.code} className="flex items-center gap-3 text-sm">
                <span className="w-4 h-4 rounded-sm shrink-0" style={{ background: FDR_COLORS[c.code] || "#999" }} />
                <span className="font-medium w-28">{lang === "fr" ? FDR_FR[c.label] || c.label : c.label}</span>
                <span className="tabular-nums text-ink/60">{c.cells.toLocaleString(loc)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-ink/50 mt-4">{t.intel.fdrNote}</p>
        </div>
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold">{t.intel.dangerTitle}</h3>
          <p className="text-sm text-ink/70 leading-relaxed mt-2">{t.intel.dangerBody}</p>
        </div>
      </div>

      <div className="border border-line rounded-xl p-5 bg-paper">
        <h3 className="font-semibold">{t.intel.watchTitle}</h3>
        <p className="text-sm text-ink/50 mb-1">{t.intel.watchSub}</p>
        <p className="text-xs text-ink/50 mb-4">{t.live.updated}: {stamp(stations.updated)} UTC · {stations.count.toLocaleString(loc)} stations</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-ink/50 border-b border-line">
                <th className="py-2 pr-3 font-medium">{t.intel.station}</th>
                <th className="py-2 pr-3 font-medium text-right">{t.intel.temp} °C</th>
                <th className="py-2 pr-3 font-medium text-right">{t.intel.rh} %</th>
                <th className="py-2 pr-3 font-medium text-right">{t.intel.wind} km/h</th>
                <th className="py-2 pr-3 font-medium text-right">{t.intel.fwi}</th>
                <th className="py-2 font-medium text-right">{t.intel.watch}</th>
              </tr>
            </thead>
            <tbody>
              {stations.top.slice(0, 20).map((s: any, i: number) => (
                <tr key={i} className="border-b border-line/60 last:border-0">
                  <td className="py-2 pr-3 font-medium truncate max-w-[220px]">{s.name} <span className="font-mono text-ink/40 text-xs">{s.prov}</span></td>
                  <td className="py-2 pr-3 text-right tabular-nums">{s.temp ?? "–"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{s.rh ?? "–"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{s.ws ?? "–"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{s.fwi}</td>
                  <td className="py-2 text-right">
                    <span className="inline-block min-w-12 text-center tabular-nums font-semibold rounded-full px-2 py-0.5 text-white text-xs"
                      style={{ background: s.watch >= 60 ? "#d80621" : s.watch >= 35 ? "#f59e0b" : "#9ca3af" }}>
                      {s.watch}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

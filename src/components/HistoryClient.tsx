"use client";

import { useLang } from "@/i18n";
import { AnnualChart, HBar, Donut } from "./Charts";

interface Hist {
  canada_annual_ha: { year: number; ha: number }[];
  worst_years: { year: number; ha: number }[];
  by_province_annual_ha: Record<string, number>[];
  province_names: Record<string, string>;
  fire_counts_by_cause: Record<string, number>;
  area_by_cause_ha: Record<string, number>;
  largest_fires: { ha: number; year: number; admin: string; cause: string }[];
}

const PROV_FR: Record<string, string> = {
  Alberta: "Alberta", "British Columbia": "Colombie-Britannique", Manitoba: "Manitoba",
  "New Brunswick": "Nouveau-Brunswick", "Newfoundland and Labrador": "Terre-Neuve-et-Labrador",
  "Nova Scotia": "Nouvelle-Écosse", "Northwest Territories": "Territoires du Nord-Ouest",
  Nunavut: "Nunavut", Ontario: "Ontario", "Prince Edward Island": "Île-du-Prince-Édouard",
  Quebec: "Québec", Saskatchewan: "Saskatchewan", Yukon: "Yukon",
  "Parks Canada": "Parcs Canada", "National Defence": "Défense nationale",
};

export default function HistoryClient({ hist }: { hist: Hist }) {
  const { t, lang } = useLang();
  const loc = lang === "fr" ? "fr-CA" : "en-CA";
  const fmtHa = (h: number) =>
    h >= 1e6 ? (h / 1e6).toFixed(1) + (lang === "fr" ? " M ha" : "M ha") : Math.round(h / 1e3) + (lang === "fr" ? " k ha" : "k ha");

  const y2025 = hist.by_province_annual_ha.find((r) => r.year === 2025) || {};
  const provItems = Object.entries(hist.province_names)
    .map(([code, name]) => ({
      label: lang === "fr" ? PROV_FR[name] || name : name,
      value: (y2025[code] as number) || 0,
      display: fmtHa((y2025[code] as number) || 0),
    }))
    .filter((i) => i.value > 0)
    .sort((a, b) => b.value - a.value);

  const causeArea = [
    { label: t.history.natural, value: hist.area_by_cause_ha["Natural"] || 0, color: "#d80621" },
    { label: t.history.human, value: hist.area_by_cause_ha["Human"] || 0, color: "#f59e0b" },
    { label: t.history.undetermined, value: hist.area_by_cause_ha["Undetermined"] || 0, color: "rgba(10,15,30,0.25)" },
  ];
  const causeCount = [
    { label: t.history.natural, value: hist.fire_counts_by_cause["Natural"] || 0, color: "#d80621" },
    { label: t.history.human, value: hist.fire_counts_by_cause["Human"] || 0, color: "#f59e0b" },
    { label: t.history.undetermined, value: hist.fire_counts_by_cause["Undetermined"] || 0, color: "rgba(10,15,30,0.25)" },
  ];

  return (
    <div>
      <div className="max-w-3xl mb-10">
        <p className="text-sm font-medium text-canada mb-3">{t.history.kicker}</p>
        <h2 className="display text-4xl md:text-5xl mb-4">{t.history.title}</h2>
        <p className="text-ink/70 leading-relaxed">{t.history.body}</p>
      </div>

      <div className="border border-line rounded-xl p-5 md:p-6 bg-paper mb-6">
        <h3 className="font-semibold">{t.history.annualTitle}</h3>
        <p className="text-sm text-ink/50 mb-4">{t.history.annualSub}</p>
        <AnnualChart data={hist.canada_annual_ha} lang={lang} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold">{t.history.worstTitle}</h3>
          <p className="text-sm text-ink/50 mb-4">{t.history.worstSub}</p>
          <HBar
            lang={lang}
            items={hist.worst_years.map((w) => ({ label: String(w.year), value: w.ha, display: fmtHa(w.ha) }))}
          />
        </div>
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold">{t.history.provTitle}</h3>
          <p className="text-sm text-ink/50 mb-4">{t.history.provSub}</p>
          <HBar lang={lang} items={provItems.slice(0, 10)} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold mb-1">{t.history.causeTitle}</h3>
          <p className="text-sm text-ink/50 mb-4">{t.history.causeSub}</p>
          <p className="text-xs font-medium text-ink/50 mb-2">{t.history.causeByArea}</p>
          <Donut parts={causeArea} lang={lang} />
          <p className="text-xs font-medium text-ink/50 mt-4 mb-2">{t.history.causeByCount}</p>
          <Donut parts={causeCount} lang={lang} />
        </div>
        <div className="border border-line rounded-xl p-5 bg-paper">
          <h3 className="font-semibold">{t.history.largestTitle}</h3>
          <p className="text-sm text-ink/50 mb-4">{t.history.largestSub}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-ink/50 border-b border-line">
                  <th className="py-2 pr-3 font-medium">{t.history.year}</th>
                  <th className="py-2 pr-3 font-medium">{t.history.area}</th>
                  <th className="py-2 pr-3 font-medium">Admin</th>
                  <th className="py-2 font-medium">{t.history.causeTitle.split(" ")[0]}</th>
                </tr>
              </thead>
              <tbody>
                {hist.largest_fires.map((f, i) => (
                  <tr key={i} className="border-b border-line/60 last:border-0">
                    <td className="py-2 pr-3 tabular-nums">{f.year}</td>
                    <td className="py-2 pr-3 tabular-nums font-medium">{fmtHa(f.ha)}</td>
                    <td className="py-2 pr-3 font-mono">{f.admin}</td>
                    <td className="py-2 text-ink/60">{f.cause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

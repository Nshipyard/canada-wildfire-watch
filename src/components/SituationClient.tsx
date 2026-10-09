"use client";

import { useLang } from "@/i18n";

export default function SituationClient({ sit }: { sit: { report_date: string; synopsis_en: string; synopsis_fr: string } }) {
  const { t, lang } = useLang();
  return (
    <div className="mt-8 border border-line rounded-xl p-5 bg-paper-warm">
      <h3 className="font-semibold mb-1">{t.live.situation}</h3>
      <p className="text-xs text-ink/50 mb-3">{t.live.reportDate}: {sit.report_date}</p>
      <p className="text-sm text-ink/70 leading-relaxed">{lang === "fr" ? sit.synopsis_fr : sit.synopsis_en}</p>
    </div>
  );
}

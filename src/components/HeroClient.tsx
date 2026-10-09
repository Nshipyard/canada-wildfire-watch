"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

export default function HeroClient({ updated }: { updated: string }) {
  const { t, lang } = useLang();
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    setStamp(new Date(updated).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA", {
      timeZone: "UTC", dateStyle: "medium", timeStyle: "short",
    }));
  }, [updated, lang]);
  return (
    <div>
      <p className="text-sm font-medium text-canada mb-3">{t.hero.kicker}</p>
      <h1 className="display text-5xl md:text-7xl mb-5">{t.hero.title}</h1>
      <p className="text-lg text-ink/70 max-w-3xl leading-relaxed mb-8">{t.hero.sub}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-xl overflow-hidden mb-6">
        {t.stats.map((s) => (
          <div key={s.label} className="bg-paper p-5">
            <p className="display text-3xl md:text-4xl text-canada mb-1.5">{s.value}</p>
            <p className="text-sm text-ink/60 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-ink/50">
        {t.hero.updatedLabel}: {stamp} UTC · {t.hero.seasonNote}
      </p>
    </div>
  );
}

"use client";

import { useLang } from "@/i18n";

export default function DataClient() {
  const { t } = useLang();
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium text-canada mb-3">{t.data.kicker}</p>
      <h2 className="display text-4xl md:text-5xl mb-4">{t.data.title}</h2>
      <p className="text-ink/70 leading-relaxed mb-8">{t.data.body}</p>

      <div className="space-y-3 mb-10">
        {t.data.files.map((f) => (
          <a key={f.name} href={`/data/${f.name}`} download
            className="flex items-start justify-between gap-4 border border-line rounded-xl p-4 bg-paper hover:border-ink/30 transition-colors">
            <div>
              <p className="font-mono text-sm font-medium">{f.name}</p>
              <p className="text-sm text-ink/60 mt-0.5">{f.desc}</p>
            </div>
            <span className="text-sm font-medium text-canada shrink-0">↓</span>
          </a>
        ))}
      </div>

      <h3 className="display text-2xl mb-2">{t.data.apiTitle}</h3>
      <p className="text-ink/70 mb-4">{t.data.apiBody}</p>
      <div className="space-y-2 mb-10">
        {t.data.endpoints.map((e) => (
          <div key={e.path} className="border border-line rounded-xl p-4 bg-paper">
            <p className="font-mono text-sm font-medium text-canada">{e.path}</p>
            <p className="text-sm text-ink/60 mt-0.5">{e.desc}</p>
          </div>
        ))}
      </div>

      <div className="border border-line rounded-xl p-5 bg-paper">
        <h3 className="display text-2xl mb-2">{t.data.v2Title}</h3>
        <p className="text-ink/70 leading-relaxed">{t.data.v2Body}</p>
      </div>
    </div>
  );
}

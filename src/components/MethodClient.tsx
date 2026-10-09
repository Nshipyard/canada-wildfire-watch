"use client";

import { useLang } from "@/i18n";

export default function MethodClient() {
  const { t } = useLang();
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium text-canada mb-3">{t.method.kicker}</p>
      <h2 className="display text-4xl md:text-5xl mb-6">{t.method.title}</h2>
      <ol className="space-y-4">
        {t.method.items.map((item, i) => (
          <li key={i} className="flex gap-4">
            <span className="display text-2xl text-canada shrink-0 w-8">{i + 1}</span>
            <p className="text-ink/70 leading-relaxed pt-1">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

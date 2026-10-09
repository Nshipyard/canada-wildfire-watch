"use client";

import { useLang } from "@/i18n";

export default function LiveTextClient() {
  const { t } = useLang();
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-medium text-canada mb-3">{t.live.kicker}</p>
      <h2 className="display text-4xl md:text-5xl mb-4">{t.live.title}</h2>
      <p className="text-ink/70 leading-relaxed">{t.live.body}</p>
    </div>
  );
}

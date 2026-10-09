"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

export function Banner() {
  const { t } = useLang();
  return (
    <div className="bg-ink text-paper text-xs">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-3">
        <span className="shrink-0 inline-flex items-center gap-1.5 border border-paper/30 rounded-full px-2 py-0.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-canada inline-block" />
          {t.banner.badge}
        </span>
        <p className="text-paper/80 leading-snug">{t.banner.line}</p>
      </div>
    </div>
  );
}

export function Header() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [
    [t.nav.live, "#live"],
    [t.nav.history, "#history"],
    [t.nav.intelligence, "#intelligence"],
    [t.nav.data, "#data"],
    [t.nav.method, "#method"],
  ] as const;
  return (
    <header className={`sticky top-0 z-40 bg-paper/95 backdrop-blur border-b transition-shadow ${scrolled ? "border-line shadow-[0_1px_12px_rgba(10,15,30,0.06)]" : "border-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 min-w-0">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden className="shrink-0">
            <path d="M13 1l2.6 5.6 6.1.7-4.5 4.1 1.2 6-5.4-3-5.4 3 1.2-6L4.3 7.3l6.1-.7z" fill="#d80621" />
            <path d="M13 8c-3 2.5-4.5 5-4.5 7.5A4.5 4.5 0 0013 20a4.5 4.5 0 004.5-4.5C17.5 13 16 10.5 13 8z" fill="#d80621" opacity="0.55" />
          </svg>
          <span className="display text-lg leading-none truncate">Canada Wildfire Watch</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-ink/70 hover:text-ink transition-colors">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="text-sm font-semibold border border-line rounded-full px-3 py-1.5 hover:border-ink/40 transition-colors"
            aria-label="Switch language"
          >
            {t.nav.lang}
          </button>
        </div>
      </div>
      <nav className="md:hidden border-t border-line overflow-x-auto">
        <div className="flex gap-5 px-4 py-2.5 text-sm whitespace-nowrap">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-ink/70">{label}</a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-semibold mb-2">{t.footer.sources}</p>
          <p className="text-ink/60 leading-relaxed">{t.footer.sourceList}</p>
        </div>
        <div>
          <p className="font-semibold mb-2">{t.footer.built}</p>
          <p className="text-ink/60">
            Richardson Dackam ·{" "}
            <a href="https://x.com/richardsondx" className="underline hover:text-ink">X</a> ·{" "}
            <a href="https://github.com/richardsondx" className="underline hover:text-ink">GitHub</a>
          </p>
          <p className="text-ink/60 mt-2">
            <a href="https://github.com/Nshipyard/canada-wildfire-watch" className="underline hover:text-ink">{t.footer.open}</a>
          </p>
        </div>
        <div>
          <p className="text-ink/60 leading-relaxed">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}

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
          <svg width="24" height="26" viewBox="-1860 -2000 3720 4030" aria-hidden="true" fill="currentColor" className="shrink-0 text-canada">
            <path d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z" />
          </svg>
          <span className="min-w-0 leading-none">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/55">Open Nshipyard</span>
            <span className="display block text-lg leading-tight truncate">Canada Wildfire Watch</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-ink/70 hover:text-ink transition-colors">{label}</a>
          ))}
          <a href="https://canada.nshipyard.com" className="text-ink/70 hover:text-ink transition-colors">&larr; {t.nav.back}</a>
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
          <a href="https://canada.nshipyard.com" className="text-ink/70">&larr; {t.nav.back}</a>
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


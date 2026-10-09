"use client";

export function AnnualChart({ data, lang }: { data: { year: number; ha: number }[]; lang: "en" | "fr" }) {
  const W = 900, H = 300, P = { l: 56, r: 12, t: 16, b: 34 };
  const max = Math.max(...data.map((d) => d.ha));
  const bw = (W - P.l - P.r) / data.length;
  const fmt = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : Math.round(n / 1e3) + "k");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Annual burned area">
      {[0.25, 0.5, 0.75, 1].map((f) => {
        const y = P.t + (H - P.t - P.b) * (1 - f);
        return (
          <g key={f}>
            <line x1={P.l} x2={W - P.r} y1={y} y2={y} stroke="rgba(10,15,30,0.08)" />
            <text x={P.l - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#6b7280">{fmt(max * f)}</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const h = (H - P.t - P.b) * (d.ha / max);
        const x = P.l + i * bw + 1;
        const worst = d.year === 2023;
        return (
          <g key={d.year}>
            <desc>{d.year}: {Math.round(d.ha).toLocaleString(lang === "fr" ? "fr-CA" : "en-CA")} ha</desc>
            <rect x={x} y={H - P.b - h} width={Math.max(bw - 2, 1)} height={h}
              fill={worst ? "#d80621" : "rgba(216,6,33,0.55)"} rx="1" />
            {d.year % 5 === 0 && (
              <text x={x + bw / 2} y={H - P.b + 16} textAnchor="middle" fontSize="11" fill="#6b7280">{d.year}</text>
            )}
          </g>
        );
      })}
      <text x={P.l} y={H - 6} fontSize="11" fill="#6b7280">ha</text>
    </svg>
  );
}

export function HBar({ items, lang }: { items: { label: string; value: number; display: string }[]; lang: "en" | "fr" }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium truncate pr-2">{it.label}</span>
            <span className="tabular-nums text-ink/70 shrink-0">{it.display}</span>
          </div>
          <div className="h-2.5 rounded bg-ink/5 overflow-hidden">
            <div className="h-full rounded bg-canada" style={{ width: `${(it.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Donut({ parts, lang }: { parts: { label: string; value: number; color: string }[]; lang: "en" | "fr" }) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  let acc = 0;
  const R = 70, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 180 180" className="w-36 h-36 shrink-0" role="img">
        {parts.map((p) => {
          const frac = p.value / total;
          const el = (
            <circle key={p.label} cx="90" cy="90" r={R} fill="none" stroke={p.color} strokeWidth="26"
              strokeDasharray={`${frac * C} ${C}`} strokeDashoffset={-acc * C} transform="rotate(-90 90 90)" />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <div className="space-y-2 text-sm">
        {parts.map((p) => (
          <div key={p.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: p.color }} />
            <span className="font-medium">{p.label}</span>
            <span className="tabular-nums text-ink/60">{((p.value / total) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

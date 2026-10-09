"use client";

import { useEffect, useRef } from "react";
import type { Fire, Hotspot } from "@/lib/data";

interface Props {
  fires: Fire[];
  hotspots: Hotspot[];
  showFires: boolean;
  showHotspots: boolean;
}

export default function FireMap({ fires, hotspots, showFires, showHotspots }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<{ fires?: any; hotspots?: any }>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !divRef.current) return;
      if (!mapRef.current) {
        const map = L.map(divRef.current, { zoomControl: true }).setView([57, -106], 4);
        L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          attribution: "&copy; OpenStreetMap &copy; CARTO",
          maxZoom: 12,
        }).addTo(map);
        mapRef.current = map;
      }
      const map = mapRef.current;
      if (cancelled || !map) return;
      const layers = layersRef.current;
      if (layers.fires) { map.removeLayer(layers.fires); layers.fires = undefined; }
      if (layers.hotspots) { map.removeLayer(layers.hotspots); layers.hotspots = undefined; }
      if (showFires) {
        const gj = L.geoJSON(
          { type: "FeatureCollection", features: fires.map((f) => ({ type: "Feature", properties: f, geometry: f.geom })) } as any,
          {
            style: () => ({ color: "#d80621", weight: 1, fillColor: "#d80621", fillOpacity: 0.28 }),
            onEachFeature: (feat: any, layer: any) => {
              const p = feat.properties;
              const ha = p.area_ha ? Math.round(p.area_ha).toLocaleString("en-CA") : "?";
              layer.bindPopup(`<b>${ha} ha</b><br/>First seen: ${p.first || "?"}<br/>Last seen: ${p.last || "?"}<br/>Hotspot count: ${p.hcount ?? "?"}`);
            },
          }
        );
        gj.addTo(map);
        layers.fires = gj;
      }
      if (showHotspots) {
        const pts = L.layerGroup(
          hotspots.map((h) => {
            const r = h.frp ? Math.min(3 + Math.sqrt(h.frp) / 4, 10) : 4;
            return L.circleMarker([h.lat, h.lon], {
              radius: r, color: "#b34700", weight: 1, fillColor: "#ff7a1a", fillOpacity: 0.85,
            }).bindPopup(`<b>Hotspot</b> (${h.agency})<br/>${h.date || ""}<br/>Satellite: ${h.sat || "?"}${h.frp ? `<br/>FRP: ${h.frp.toFixed(1)} MW` : ""}`);
          })
        );
        pts.addTo(map);
        layers.hotspots = pts;
      }
    })();
    return () => { cancelled = true; };
  }, [fires, hotspots, showFires, showHotspots]);

  return <div ref={divRef} className="h-[420px] md:h-[560px] w-full rounded-xl border border-line z-0" />;
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "fr";

const en = {
  banner: {
    line: "An open-source project. Not affiliated with the Government of Canada or Natural Resources Canada. For official alerts, follow your provincial fire agency.",
    badge: "Open source",
  },
  nav: {
    live: "Live",
    history: "History",
    intelligence: "Fire weather",
    data: "Data",
    method: "Method",
    lang: "FR",
    back: "All projects",
  },
  hero: {
    kicker: "Nshipyard Canada · Wildfire intelligence",
    title: "Canada's fires, on one map.",
    sub: "Live satellite hotspots and mapped fire perimeters from Natural Resources Canada's Canadian Wildland Fire Information System, 54 years of burned-area history from the National Burned Area Composite, and fire-weather watch scores computed from 1,189 weather stations. Updated daily in fire season; every number traces to a processed file in the repo.",
    updatedLabel: "Live data updated",
    seasonNote:
      "The 2026 fire season wound down in mid-September. National situation reporting resumes in spring 2027. Off-season layers are quiet, which is normal.",
  },
  stats: [
    { value: "73", label: "satellite hotspots detected in Canada in the last 24 hours" },
    { value: "736", label: "mapped fire perimeters currently tracked, totalling 4.1M hectares" },
    { value: "14.8M ha", label: "burned in 2023, the worst year on record: 11.2% of all area burned since 1972" },
    { value: "78%", label: "of all burned area since 1972 started from natural causes, mostly lightning" },
  ],
  live: {
    kicker: "Live",
    title: "What is burning now.",
    body: "Hotspots are satellite thermal detections from the last 24 hours. Perimeters are Fire M3 mapped polygons. Both come from the Canadian Wildland Fire Information System public web services. October is off-season: expect few detections.",
    hotspots: "Hotspots (24h)",
    perimeters: "Fire perimeters",
    legendHot: "hotspot",
    legendFire: "mapped fire",
    updated: "Updated",
    utc: "UTC",
    byAgency: "Hotspots by agency",
    largest: "Largest current perimeters",
    ha: "ha",
    firstSeen: "first seen",
    lastSeen: "last seen",
    hotspotCount: "detections",
    hotspotOne: "detection",
    situation: "National situation",
    reportDate: "Report date",
  },
  history: {
    kicker: "History",
    title: "54 years of burned area.",
    body: "The National Burned Area Composite maps every large fire in Canada since 1972 from Landsat and other satellites: 52,610 fires, 132.6M hectares. 2023 burned more than the previous record by a factor of two.",
    annualTitle: "Area burned per year, Canada, 1972-2025",
    annualSub: "Adjusted hectares. 2023: 14.8M ha. The 2016-2025 average is 4.0M ha per year.",
    worstTitle: "Worst fire years",
    worstSub: "2023 alone accounts for 11.2% of everything burned since 1972.",
    provTitle: "2025 burned area by province and territory",
    provSub: "Saskatchewan and Manitoba led a 7.3M ha year.",
    causeTitle: "What starts the fires",
    causeSub: "By area, natural causes (mostly lightning) dominate. By count, humans start one fire in four.",
    causeByArea: "Share of burned area",
    causeByCount: "Share of fire count",
    natural: "Natural",
    human: "Human",
    undetermined: "Undetermined",
    fires: "fires",
    largestTitle: "Largest single fires mapped",
    largestSub: "The 2023 Quebec fire burned nearly one million hectares.",
    year: "Year",
    area: "Area",
  },
  intel: {
    kicker: "Fire weather",
    title: "Where conditions favour fire.",
    body: "Two honest layers. First, the official Fire Danger Rating as published by the Canadian Wildland Fire Information System. Second, a watch index computed from 1,189 fire-weather stations: hot, dry, and windy scores 0 to 100. It is an explanatory composite of observed conditions, not a prediction model. The formula is published in the methodology.",
    fdrTitle: "Current Fire Danger Rating",
    fdrSub: "Official CWFIS classes. October: most of the country rates Low or unrated as the season ends.",
    fdrNote: "0 = no rating (water, urban, or no fuel data).",
    watchTitle: "Station watch index: highest right now",
    watchSub: "Top stations by the 0-100 composite. Temp, humidity, and wind as observed.",
    station: "Station",
    temp: "Temp",
    rh: "Humidity",
    wind: "Wind",
    fwi: "FWI",
    watch: "Watch",
    dangerTitle: "What the official rating means",
    dangerBody:
      "The Fire Weather Index system combines fuel moisture and weather into fire behaviour potential. Low means fire starts are unlikely; Extreme means fast-spreading, high-intensity fire is likely. Ratings come from over 2,100 weather stations across Canada and the northern US.",
  },
  method: {
    kicker: "Method",
    title: "How this is built, and where it is weak.",
    items: [
      "Live data: CWFIS public GeoServer web services (hotspots_24h, m3_polygons_current, fdr_current_shp, firewx_stns_current), refreshed by scripts/refresh_live.py. The snapshot in the repo was taken 2026-10-08; the UI shows the snapshot timestamp and never claims real-time data.",
      "Hotspot filtering: the 24h layer covers North America (2,743 detections). Only detections with a Canadian agency code are shown (73 at snapshot time). A bounding box alone would sweep in the northern United States.",
      "Perimeters: 736 Fire M3 polygons simplified to ~800 m tolerance for the web (321 KB). Areas are as published by CWFIS; the 4.1M ha total includes fires still being mapped.",
      "History: NBAC summary statistics workbook retrieved 2026-10-08 (adjusted hectares, 1972-2025). Annual totals, provincial splits, and the 52,610-fire merged table with cause and area are processed into data/historical.json (20 KB).",
      "Watch index: 100 * (0.4 * temp/40C + 0.35 * (100 - relative humidity)/100 + 0.25 * wind/60 kph), from station observations. It describes current conditions; it does not predict ignition or spread. Official FWI values from the stations are shown alongside for comparison.",
      "Seasonality: CWFIS national reporting runs spring to mid-September. Off-season, hotspot and perimeter layers go quiet. The site says so explicitly instead of showing an empty map without explanation.",
      "What v1 is not: no satellite-embedding change detection and no AI weather forecasts. Those are documented as v2 in docs/v2-models.md with the exact datasets and APIs.",
    ],
  },
  data: {
    kicker: "Data",
    title: "Take the data.",
    body: "Every file below is generated by the scripts in this repo from public sources. Download them, or query the API.",
    files: [
      { name: "historical.json", desc: "NBAC 1972-2025: annual totals, provincial splits, causes, largest fires (20 KB)" },
      { name: "live/hotspots.json", desc: "Canadian satellite hotspots, last 24h, slimmed (9 KB)" },
      { name: "live/fires.json", desc: "736 simplified fire perimeters with first/last seen dates (321 KB)" },
      { name: "live/stations.json", desc: "1,189 fire-weather stations with FWI and watch index (13 KB)" },
      { name: "live/fdr.json", desc: "Fire Danger Rating class distribution (1 KB)" },
    ],
    apiTitle: "API",
    apiBody: "JSON endpoints served from the same processed files. No key required.",
    endpoints: [
      { path: "/api/v1/live", desc: "Hotspots, perimeters summary, FDR distribution, snapshot timestamps" },
      { path: "/api/v1/history", desc: "Annual burned area, provincial splits, causes, largest fires" },
      { path: "/api/v1/stations", desc: "Top fire-weather stations by watch index" },
    ],
    v2Title: "On the roadmap",
    v2Body:
      "v2 adds satellite-embedding change detection with AlphaEarth via Google Earth Engine and forecast integration with WeatherNext open weights. The integration plan, with exact datasets and API surfaces, is documented in docs/v2-models.md. v1 deliberately does not claim these capabilities.",
  },
  footer: {
    sources: "Sources",
    sourceList:
      "Natural Resources Canada, Canadian Wildland Fire Information System (live hotspots, perimeters, fire danger, weather stations, situation reports); National Burned Area Composite (1972-2025 history).",
    built: "Built by Richardson Dackam",
    open: "Open source on GitHub",
    note: "Not affiliated with the Government of Canada. For evacuation orders and official alerts, follow your provincial or territorial fire agency.",
  },
};

const fr: typeof en = {
  banner: {
    line: "Un projet open source. Sans affiliation avec le gouvernement du Canada ni Ressources naturelles Canada. Pour les alertes officielles, suivez l'agence des feux de votre province.",
    badge: "Open source",
  },
  nav: {
    live: "En direct",
    history: "Historique",
    intelligence: "Météo des feux",
    data: "Données",
    method: "Méthode",
    lang: "EN",
    back: "Tous les projets",
  },
  hero: {
    kicker: "Nshipyard Canada · Renseignement sur les feux",
    title: "Les feux du Canada, sur une carte.",
    sub: "Points chauds satellitaires et périmètres cartographiés en direct du Système canadien d'information sur les feux de végétation de Ressources naturelles Canada, 54 ans d'historique des superficies brûlées du Composite national des superficies brûlées, et des indices de guet calculés à partir de 1 189 stations météo. Actualisé quotidiennement en saison des feux; chaque chiffre provient d'un fichier traité du dépôt.",
    updatedLabel: "Données actualisées",
    seasonNote:
      "La saison des feux 2026 s'est terminée à la mi-septembre. Les rapports nationaux reprendront au printemps 2027. Hors saison, les couches sont calmes, ce qui est normal.",
  },
  stats: [
    { value: "73", label: "points chauds satellitaires détectés au Canada dans les dernières 24 heures" },
    { value: "736", label: "périmètres de feu cartographiés suivis, totalisant 4,1 M d'hectares" },
    { value: "14,8 M ha", label: "brûlés en 2023, pire année jamais enregistrée : 11,2 % de toute la superficie brûlée depuis 1972" },
    { value: "78 %", label: "de toute la superficie brûlée depuis 1972 provient de causes naturelles, surtout la foudre" },
  ],
  live: {
    kicker: "En direct",
    title: "Ce qui brûle maintenant.",
    body: "Les points chauds sont des détections thermiques satellitaires des dernières 24 heures. Les périmètres sont les polygones cartographiés Fire M3. Les deux proviennent des services web publics du Système canadien d'information sur les feux de végétation. Octobre est hors saison : attendez-vous à peu de détections.",
    hotspots: "Points chauds (24 h)",
    perimeters: "Périmètres de feu",
    legendHot: "point chaud",
    legendFire: "feu cartographié",
    updated: "Actualisé",
    utc: "UTC",
    byAgency: "Points chauds par agence",
    largest: "Plus grands périmètres actuels",
    ha: "ha",
    firstSeen: "première détection",
    lastSeen: "dernière détection",
    hotspotCount: "détections",
    hotspotOne: "détection",
    situation: "Situation nationale",
    reportDate: "Date du rapport",
  },
  history: {
    kicker: "Historique",
    title: "54 ans de superficies brûlées.",
    body: "Le Composite national des superficies brûlées cartographie chaque grand feu au Canada depuis 1972 à partir de Landsat et d'autres satellites : 52 610 feux, 132,6 M d'hectares. L'année 2023 a brûlé deux fois plus que l'ancien record.",
    annualTitle: "Superficie brûlée par année, Canada, 1972-2025",
    annualSub: "Hectares ajustés. 2023 : 14,8 M ha. La moyenne 2016-2025 est de 4,0 M ha par année.",
    worstTitle: "Les pires années de feu",
    worstSub: "L'année 2023 représente à elle seule 11,2 % de tout ce qui a brûlé depuis 1972.",
    provTitle: "Superficie brûlée en 2025 par province et territoire",
    provSub: "La Saskatchewan et le Manitoba ont mené une année de 7,3 M ha.",
    causeTitle: "Ce qui déclenche les feux",
    causeSub: "En superficie, les causes naturelles (surtout la foudre) dominent. En nombre, l'humain déclenche un feu sur quatre.",
    causeByArea: "Part de la superficie brûlée",
    causeByCount: "Part du nombre de feux",
    natural: "Naturelle",
    human: "Humaine",
    undetermined: "Indéterminée",
    fires: "feux",
    largestTitle: "Les plus grands feux cartographiés",
    largestSub: "Le feu de 2023 au Québec a brûlé près d'un million d'hectares.",
    year: "Année",
    area: "Superficie",
  },
  intel: {
    kicker: "Météo des feux",
    title: "Où les conditions favorisent le feu.",
    body: "Deux couches honnêtes. D'abord, la cote de danger officielle publiée par le Système canadien d'information sur les feux de végétation. Ensuite, un indice de guet calculé à partir de 1 189 stations météo : chaud, sec et venteux donne un score de 0 à 100. C'est un composite explicatif des conditions observées, pas un modèle de prédiction. La formule est publiée dans la méthodologie.",
    fdrTitle: "Cote de danger actuelle",
    fdrSub: "Classes officielles du SCIFV. Octobre : la majeure partie du pays est en danger faible ou non cotée, la saison se terminant.",
    fdrNote: "0 = non coté (eau, urbain, ou pas de données de combustible).",
    watchTitle: "Indice de guet : les plus élevés maintenant",
    watchSub: "Stations en tête du composite 0-100. Température, humidité et vent observés.",
    station: "Station",
    temp: "Temp.",
    rh: "Humidité",
    wind: "Vent",
    fwi: "IFM",
    watch: "Guet",
    dangerTitle: "Ce que la cote officielle signifie",
    dangerBody:
      "Le système de l'indice forêt-météo combine l'humidité des combustibles et la météo en potentiel de comportement du feu. Faible signifie que les départs de feu sont improbables; Extrême signifie qu'un feu rapide et intense est probable. Les cotes proviennent de plus de 2 100 stations météo au Canada et dans le nord des États-Unis.",
  },
  method: {
    kicker: "Méthode",
    title: "Comment c'est construit, et ses limites.",
    items: [
      "Données en direct : services web GeoServer publics du SCIFV (hotspots_24h, m3_polygons_current, fdr_current_shp, firewx_stns_current), actualisés par scripts/refresh_live.py. L'instantané du dépôt date du 2026-10-08; l'interface affiche l'horodatage et ne prétend jamais au temps réel.",
      "Filtrage des points chauds : la couche 24 h couvre l'Amérique du Nord (2 743 détections). Seules les détections avec un code d'agence canadien sont montrées (73 au moment de l'instantané). Un simple cadre géographique aurait inclus le nord des États-Unis.",
      "Périmètres : 736 polygones Fire M3 simplifiés à environ 800 m pour le web (321 Ko). Les superficies sont celles publiées par le SCIFV; le total de 4,1 M ha inclut des feux encore en cartographie.",
      "Historique : cahier de statistiques sommaires du CN SB, récupéré le 2026-10-08 (hectares ajustés, 1972-2025). Totaux annuels, répartitions provinciales et la table fusionnée de 52 610 feux avec cause et superficie sont traités dans data/historical.json (20 Ko).",
      "Indice de guet : 100 * (0,4 * temp/40C + 0,35 * (100 - humidité relative)/100 + 0,25 * vent/60 km/h), à partir des observations des stations. Il décrit les conditions actuelles; il ne prédit ni l'éclosion ni la propagation. Les valeurs IFM officielles des stations sont montrées à côté pour comparaison.",
      "Saisonnalité : les rapports nationaux du SCIFV vont du printemps à la mi-septembre. Hors saison, les couches de points chauds et de périmètres se calment. Le site le dit explicitement au lieu d'afficher une carte vide sans explication.",
      "Ce que la v1 n'est pas : pas de détection de changement par plongements satellitaires ni de prévisions météo par IA. Ces capacités sont documentées comme v2 dans docs/v2-models.md avec les jeux de données et les API exacts.",
    ],
  },
  data: {
    kicker: "Données",
    title: "Prenez les données.",
    body: "Chaque fichier ci-dessous est généré par les scripts de ce dépôt à partir de sources publiques. Téléchargez-les ou interrogez l'API.",
    files: [
      { name: "historical.json", desc: "CN SB 1972-2025 : totaux annuels, répartitions provinciales, causes, plus grands feux (20 Ko)" },
      { name: "live/hotspots.json", desc: "Points chauds satellitaires canadiens, dernières 24 h, allégé (9 Ko)" },
      { name: "live/fires.json", desc: "736 périmètres de feu simplifiés avec dates de première/dernière détection (321 Ko)" },
      { name: "live/stations.json", desc: "1 189 stations météo des feux avec IFM et indice de guet (13 Ko)" },
      { name: "live/fdr.json", desc: "Distribution des classes de cote de danger (1 Ko)" },
    ],
    apiTitle: "API",
    apiBody: "Points d'accès JSON servis à partir des mêmes fichiers traités. Aucune clé requise.",
    endpoints: [
      { path: "/api/v1/live", desc: "Points chauds, sommaire des périmètres, distribution des cotes, horodatages" },
      { path: "/api/v1/history", desc: "Superficie brûlée annuelle, répartitions provinciales, causes, plus grands feux" },
      { path: "/api/v1/stations", desc: "Stations météo des feux en tête de l'indice de guet" },
    ],
    v2Title: "Feuille de route",
    v2Body:
      "La v2 ajoutera la détection de changement par plongements satellitaires avec AlphaEarth via Google Earth Engine et l'intégration de prévisions avec les poids ouverts de WeatherNext. Le plan d'intégration, avec les jeux de données et les API exacts, est documenté dans docs/v2-models.md. La v1 ne prétend délibérément pas à ces capacités.",
  },
  footer: {
    sources: "Sources",
    sourceList:
      "Ressources naturelles Canada, Système canadien d'information sur les feux de végétation (points chauds, périmètres, cote de danger, stations météo, rapports de situation); Composite national des superficies brûlées (historique 1972-2025).",
    built: "Construit par Richardson Dackam",
    open: "Open source sur GitHub",
    note: "Sans affiliation avec le gouvernement du Canada. Pour les ordres d'évacuation et les alertes officielles, suivez l'agence des feux de votre province ou territoire.",
  },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: typeof en }>({
  lang: "en",
  setLang: () => {},
  t: en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <LangContext.Provider value={{ lang, setLang, t: lang === "en" ? en : fr }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

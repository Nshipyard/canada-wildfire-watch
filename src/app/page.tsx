import { Banner, Header, Footer } from "@/components/SiteChrome";
import HeroClient from "@/components/HeroClient";
import LiveTextClient from "@/components/LiveTextClient";
import SituationClient from "@/components/SituationClient";
import HistoryClient from "@/components/HistoryClient";
import IntelligenceClient from "@/components/IntelligenceClient";
import DataClient from "@/components/DataClient";
import MethodClient from "@/components/MethodClient";
import LiveSection from "@/components/LiveSection";
import { getHotspots, getFires, getFdr, getStations, getSituation, getHistory } from "@/lib/data";

export default function Page() {
  const hs = getHotspots();
  const fires = getFires();
  const fdr = getFdr();
  const stations = getStations();
  const sit = getSituation();
  const hist = getHistory();

  return (
    <div id="top">
      <Banner />
      <Header />
      <main>
        <section className="border-b border-line">
          <div className="max-w-6xl mx-auto px-4 pt-14 pb-10">
            <HeroClient updated={hs.updated} />
          </div>
        </section>

        <section id="live" className="border-b border-line">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <LiveTextClient />
            <div className="mt-8">
              <LiveSection fires={fires.fires} hotspots={hs.points} updated={hs.updated} />
            </div>
            <SituationClient sit={sit} />
          </div>
        </section>

        <section id="history" className="border-b border-line bg-paper-warm">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <HistoryClient hist={hist as unknown as React.ComponentProps<typeof HistoryClient>["hist"]} />
          </div>
        </section>

        <section id="intelligence" className="border-b border-line">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <IntelligenceClient fdr={fdr} stations={stations} />
          </div>
        </section>

        <section id="data" className="border-b border-line bg-paper-warm">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <DataClient />
          </div>
        </section>

        <section id="method" className="border-b border-line">
          <div className="max-w-6xl mx-auto px-4 py-14">
            <MethodClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

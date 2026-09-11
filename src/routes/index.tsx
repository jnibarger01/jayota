import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InventoryStrip } from "@/components/home/InventoryStrip";
import { CompareTray } from "@/components/home/CompareTray";
import { LineupTabs } from "@/components/vehicles/LineupTabs";
import { ModelScroller } from "@/components/vehicles/ModelScroller";
import { QuickView } from "@/components/vehicles/QuickView";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEALER } from "@/lib/dealer";
import { filterLineup, type LineupModel, type LineupTab } from "@/lib/lineup";
import { useCompareSlugs } from "@/lib/compare-tray";
import { getInventoryState } from "@/lib/server/catalog";
import { autoDealerJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      DEALER.name,
      "Move a Better Tomorrow. Explore the Toyota lineup at Hendrick Toyota Merriam.",
    ),
  loader: () => getInventoryState(),
  component: Home,
});

function Home() {
  const inventory = Route.useLoaderData();
  const [tab, setTab] = useState<LineupTab>("all");
  const [quick, setQuick] = useState<LineupModel | null>(null);
  const compare = useCompareSlugs();
  const models = filterLineup(tab);

  return (
    <SiteShell>
      <JsonLd data={autoDealerJsonLd()} />
      <HeroCarousel onQuickView={setQuick} />

      <section className="bg-bg px-5 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-semibold tracking-tight">Vehicles</h2>
          <p className="mt-2 text-muted">Find the Toyota that fits your life.</p>
          <div className="mt-8">
            <LineupTabs value={tab} onChange={setTab} />
          </div>
          <ModelScroller models={models} selected={compare} onOpen={setQuick} />
        </div>
      </section>

      <InventoryStrip status={inventory.status} provider={inventory.provider} count={inventory.vehicles.length} />
      {quick ? (
        <QuickView
          model={quick}
          comparing={compare.includes(quick.slug)}
          compareCount={compare.length}
          onClose={() => setQuick(null)}
        />
      ) : null}
      <CompareTray slugs={compare} />
    </SiteShell>
  );
}

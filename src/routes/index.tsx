import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InventoryStrip } from "@/components/home/InventoryStrip";
import { CompareTray } from "@/components/home/CompareTray";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { ModelExplorer } from "@/components/vehicles/ModelExplorer";
import { QuickView } from "@/components/vehicles/QuickView";
import { JsonLd } from "@/components/seo/JsonLd";
import { DEALER } from "@/lib/dealer";
import { type LineupModel, type LineupTab } from "@/lib/lineup";
import { toggleCompareSlug, useCompareSlugs } from "@/lib/compare-tray";
import { clearRecent, rememberView, removeRecent, toggleLocalFavorite, useShopper } from "@/lib/shopper";
import { loadInventoryState } from "@/lib/loaders";
import { autoDealerJsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      DEALER.name,
      "Move a Better Tomorrow. Explore the Toyota lineup at Hendrick Toyota Merriam.",
    ),
  loader: () => loadInventoryState(),
  component: Home,
});

function Home() {
  const inventory = Route.useLoaderData();
  const [tab, setTab] = useState<LineupTab>("all");
  const [quick, setQuick] = useState<LineupModel | null>(null);
  const compare = useCompareSlugs();
  const shopper = useShopper();

  return (
    <SiteShell>
      <JsonLd data={autoDealerJsonLd()} />
      <HeroCarousel onQuickView={setQuick} />
      <ModelExplorer
        tab={tab}
        onTab={setTab}
        selected={compare}
        favorites={shopper.favorites}
        onQuick={(model) => {
          rememberView(model.slug);
          setQuick(model);
        }}
        onCompare={toggleCompareSlug}
        onFavorite={toggleLocalFavorite}
        locale={shopper.locale}
      />
      <RecentlyViewed items={shopper.recent} locale={shopper.locale} onClear={clearRecent} onRemove={removeRecent} />
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

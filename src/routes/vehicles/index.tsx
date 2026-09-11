import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { LineupCard } from "@/components/vehicles/LineupCard";
import { LineupTabs } from "@/components/vehicles/LineupTabs";
import { QuickView } from "@/components/vehicles/QuickView";
import { CompareTray } from "@/components/home/CompareTray";
import { CATALOG_DISCLAIMER } from "@/lib/dealer";
import { filterLineup, type LineupModel, type LineupTab } from "@/lib/lineup";
import { useCompareSlugs } from "@/lib/compare-tray";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/vehicles/")({
  head: () =>
    pageHead("Vehicles", "Find the Toyota that fits your life — SUVs, cars, trucks, hybrids, and electric."),
  component: VehiclesPage,
});

function VehiclesPage() {
  const [tab, setTab] = useState<LineupTab>("all");
  const [quick, setQuick] = useState<LineupModel | null>(null);
  const compare = useCompareSlugs();
  const featured = filterLineup(tab);

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-4 md:max-w-7xl md:px-6 md:pb-24 md:pt-12">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Vehicles</h1>
        <p className="mt-2 text-muted">Find the Toyota that fits your life.</p>

        <div className="mt-6 md:mt-8">
          <LineupTabs value={tab} onChange={setTab} />
        </div>

        {featured.length === 0 ? (
          <p className="mt-10 text-sm text-muted">No vehicles in this category yet.</p>
        ) : (
          <>
            <div className="mt-5 grid gap-3 md:hidden">
              {featured.map((model) => (
                <LineupCard
                  key={model.slug}
                  model={model}
                  variant="overlay"
                  selected={compare.includes(model.slug)}
                  onOpen={setQuick}
                />
              ))}
            </div>
            <div className="mt-8 hidden gap-6 sm:grid-cols-2 md:grid lg:grid-cols-4 xl:grid-cols-5">
              {featured.map((model) => (
                <LineupCard
                  key={model.slug}
                  model={model}
                  variant="caption"
                  selected={compare.includes(model.slug)}
                  onOpen={setQuick}
                />
              ))}
            </div>
          </>
        )}
        <p className="price-note mt-8 hidden md:block">{CATALOG_DISCLAIMER}</p>
      </section>
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

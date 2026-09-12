import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, RectangleHorizontal } from "lucide-react";
import { LineupTabs } from "@/components/vehicles/LineupTabs";
import { ModelScroller } from "@/components/vehicles/ModelScroller";
import { ExplorerCard } from "@/components/vehicles/ExplorerCard";
import { filterLineup, type LineupModel, type LineupTab } from "@/lib/lineup";
import { COPY, type Locale } from "@/lib/i18n";

export function ModelExplorer({
  tab,
  onTab,
  selected,
  favorites,
  onQuick,
  onCompare,
  onFavorite,
  locale,
}: {
  tab: LineupTab;
  onTab: (tab: LineupTab) => void;
  selected: string[];
  favorites: string[];
  onQuick: (model: LineupModel) => void;
  onCompare: (slug: string) => void;
  onFavorite: (slug: string) => void;
  locale: Locale;
}) {
  const [mode, setMode] = useState<"grid" | "showroom">("grid");
  const models = filterLineup(tab);
  const t = COPY[locale];

  return (
    <section className="bg-bg px-5 py-12 md:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight">{t.explore}</h2>
            <p className="mt-2 text-muted">Start with any Toyota in the current U.S. lineup.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/quiz"
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-4 text-sm text-accent-fg"
            >
              {t.findMine}
            </Link>
            <div className="flex rounded-full border border-border p-1">
              <button
                type="button"
                className={`grid h-11 w-11 place-items-center rounded-full ${mode === "grid" ? "bg-surface-2" : ""}`}
                aria-pressed={mode === "grid"}
                aria-label="Grid view"
                onClick={() => setMode("grid")}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                className={`grid h-11 w-11 place-items-center rounded-full ${mode === "showroom" ? "bg-surface-2" : ""}`}
                aria-pressed={mode === "showroom"}
                aria-label="Showroom scroller"
                onClick={() => setMode("showroom")}
              >
                <RectangleHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <LineupTabs value={tab} onChange={onTab} />
        </div>
        {models.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            No nameplates in this category are listed in this showroom catalog. We will not invent a plug-in hybrid
            lineup that is not recorded here.
          </p>
        ) : mode === "showroom" ? (
          <ModelScroller models={models} selected={selected} onOpen={onQuick} />
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {models.map((model) => (
              <ExplorerCard
                key={model.slug}
                model={model}
                selected={selected.includes(model.slug)}
                favorited={favorites.includes(model.slug)}
                onQuick={onQuick}
                onCompare={onCompare}
                onFavorite={onFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

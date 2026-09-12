import { Link } from "@tanstack/react-router";
import { Box, Heart } from "lucide-react";
import type { LineupModel } from "@/lib/lineup";
import { electrifiedLabel, lineupConfigure } from "@/lib/lineup";
import { formatUsd } from "@/lib/utils";
import { PaymentChip } from "@/components/vehicles/PaymentChip";
import { cn } from "@/lib/utils";

export function ExplorerCard({
  model,
  selected,
  favorited,
  onQuick,
  onCompare,
  onFavorite,
}: {
  model: LineupModel;
  selected?: boolean;
  favorited?: boolean;
  onQuick: (model: LineupModel) => void;
  onCompare: (slug: string) => void;
  onFavorite: (slug: string) => void;
}) {
  const configure = lineupConfigure(model);
  const eLabel = electrifiedLabel(model.electrified);

  return (
    <article className={cn("flex flex-col overflow-hidden rounded-2xl bg-surface", selected && "ring-2 ring-accent")}>
      <button type="button" onClick={() => onQuick(model)} className="relative text-left">
        <img src={model.image.src} alt={model.image.alt} className="aspect-video w-full object-cover" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {model.has3d ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-ink/55 px-2 py-1 text-xs text-fg">
              <Box size={12} /> 3D
            </span>
          ) : null}
          {eLabel ? <span className="rounded-full bg-ink/55 px-2 py-1 text-xs text-fg">{eLabel}</span> : null}
        </div>
      </button>
      <div className="flex flex-1 flex-col px-4 py-3">
        <h3 className="text-lg font-semibold tracking-tight">{model.name}</h3>
        <p className="mt-0.5 text-sm text-muted">{model.tagline}</p>
        {model.startingMsrp ? (
          <>
            <p className="mt-2 text-sm">{formatUsd(model.startingMsrp)}* starting MSRP</p>
            <PaymentChip msrp={model.startingMsrp} />
          </>
        ) : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to="/vehicles/$slug"
            params={{ slug: model.slug }}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-pill px-3 text-xs font-medium text-pill-fg"
          >
            View model
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-3 text-xs"
            onClick={() => onQuick(model)}
          >
            Quick view
          </button>
          {configure.kind !== "none" ? (
            <Link
              to="/vehicles/$slug/configure"
              params={{ slug: model.slug }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-3 text-xs"
            >
              {configure.label}
            </Link>
          ) : (
            <Link
              to="/shop/test-drive"
              search={{ vehicle: model.slug }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-3 text-xs"
            >
              Test drive
            </Link>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-1 rounded-full border border-border px-3 text-xs"
            onClick={() => onCompare(model.slug)}
          >
            {selected ? "In compare" : "Compare"}
          </button>
        </div>
        <button
          type="button"
          className={cn("mt-2 inline-flex min-h-11 items-center gap-2 text-xs", favorited ? "text-accent" : "text-muted")}
          onClick={() => onFavorite(model.slug)}
        >
          <Heart size={14} fill={favorited ? "currentColor" : "none"} />
          {favorited ? "Saved" : "Favorite"}
        </button>
      </div>
    </article>
  );
}

import { useRef } from "react";
import { useFocusTrap } from "@/lib/a11y/focus-trap";
import { Link } from "@tanstack/react-router";
import { Box, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/vehicles/FavoriteButton";
import { electrifiedLabel, lineupConfigure, type LineupModel } from "@/lib/lineup";
import { MAX_COMPARE, toggleCompareSlug } from "@/lib/compare-tray";
import { formatUsd } from "@/lib/utils";

export function QuickView({
  model,
  comparing,
  compareCount,
  onClose,
}: {
  model: LineupModel;
  comparing: boolean;
  compareCount: number;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, true);
  const configure = lineupConfigure(model);
  const eLabel = electrifiedLabel(model.electrified);
  const compareFull = !comparing && compareCount >= MAX_COMPARE;

  return (
    <div className="mobile-dialog-layer md:inset-0 md:z-[var(--z-sheet)]">
      <button type="button" className="absolute inset-0 bg-ink/70" aria-label="Close" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        className="absolute inset-x-0 bottom-0 max-h-full overflow-auto rounded-t-3xl border-t border-border bg-surface px-5 pb-6 pt-4 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border md:hidden" />
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              {model.year} · {model.body}
            </p>
            <h2 id="quickview-title" className="mt-1 text-2xl font-semibold tracking-tight">
              {model.name}
            </h2>
          </div>
          <div className="flex items-center">
            <FavoriteButton slug={model.slug} />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center"
              aria-label="Close"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <img src={model.image.src} alt={model.image.alt} className="aspect-video w-full rounded-2xl object-cover" />
        <p className="mt-4 text-muted">{model.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {eLabel ? <span className="rounded-full bg-surface-2 px-3 py-1 text-xs">{eLabel}</span> : null}
          {model.has3d ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-3 py-1 text-xs">
              <Box size={12} /> 3D showroom
            </span>
          ) : null}
          {model.hasCatalog && !model.has3d ? (
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs">Build & Price</span>
          ) : null}
        </div>
        {model.startingMsrp ? (
          <p className="mt-4">
            Starting at {formatUsd(model.startingMsrp)}*
            {model.msrpSource ? <span className="mt-1 block text-xs text-muted">{model.msrpSource}</span> : null}
          </p>
        ) : null}

        <div className="mt-6 grid gap-2">
          <Link to="/vehicles/$slug" params={{ slug: model.slug }} onClick={onClose}>
            <Button className="w-full">View details</Button>
          </Link>
          {configure.kind !== "none" ? (
            <Link to="/vehicles/$slug/configure" params={{ slug: model.slug }} onClick={onClose}>
              <Button variant="secondary" className="w-full">
                {configure.label}
              </Button>
            </Link>
          ) : (
            <Link to="/shop/test-drive" search={{ vehicle: model.slug }} onClick={onClose}>
              <Button variant="secondary" className="w-full">
                Request a test drive
              </Button>
            </Link>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-border text-sm disabled:opacity-40"
            disabled={compareFull}
            onClick={() => toggleCompareSlug(model.slug)}
          >
            {comparing ? "Remove from compare" : compareFull ? "Compare list is full" : "Add to compare"}
          </button>
        </div>
        <p className="price-note mt-4">
          Starting figures are published Toyota.com MSRP, not live inventory or a dealer quote.
        </p>
      </div>
    </div>
  );
}
